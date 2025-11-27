// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";

contract Base is ERC721, Ownable, ReentrancyGuard {
    uint256 private constant MAX_SUPPLY = 10000;

    uint256 public immutable maxMintPerAddress;

    string private _baseTokenUri;
    uint256 private _nextTokenId;
    uint256 public mintPrice;
    bool public mintingEnabled;

    event Minted(address indexed to, uint256 indexed tokenId);
    event MintingEnabled();
    event MintingPaused();

    constructor(
        string memory _name,
        string memory _symbol,
        address _initialOwner,
        string memory _baseUri,
        uint256 _mintPrice,
        uint256 _maxMintPerAddress
    ) ERC721(_name, _symbol) Ownable(_initialOwner) {
        _baseTokenUri = _baseUri;
        mintPrice = _mintPrice;
        maxMintPerAddress = _maxMintPerAddress;
        _nextTokenId = 1;
        mintingEnabled = false;
    }

    function mint(uint256 quantity) public payable nonReentrant returns (uint256) {
        require(mintingEnabled, "Minting is disabled");
        require(quantity > 0 && quantity <= 10, "Quantity must be between 1 and 10");
        require(msg.value == mintPrice * quantity, "Must send exact mint price for quantity");
        require(balanceOf(msg.sender) + quantity <= maxMintPerAddress, "Would exceed max mint per address");
        require(_nextTokenId + quantity - 1 <= MAX_SUPPLY, "Max supply reached");

        uint256 firstTokenId = _nextTokenId;

        for (uint256 i = 0; i < quantity; i++) {
            uint256 tokenId = _nextTokenId++;
            _safeMint(msg.sender, tokenId);
            emit Minted(msg.sender, tokenId);
        }

        return firstTokenId;
    }

    function enableMinting() public onlyOwner {
        mintingEnabled = true;
        emit MintingEnabled();
    }

    function pauseMinting() public onlyOwner {
        mintingEnabled = false;
        emit MintingPaused();
    }

    function withdraw() public onlyOwner nonReentrant {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");

        (bool success,) = owner().call{value: balance}("");
        require(success, "Withdrawal failed");
    }

    function maxSupply() public pure returns (uint256) {
        return MAX_SUPPLY;
    }

    function totalSupply() public view returns (uint256) {
        return _nextTokenId - 1;
    }

    function _baseURI() internal view override returns (string memory) {
        return _baseTokenUri;
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        _requireOwned(tokenId);

        return string(
            abi.encodePacked(
                _baseTokenUri,
                Strings.toString(tokenId),
                ".json"
            )
        );
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
