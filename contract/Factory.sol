// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./NFT.sol";

contract BaseFactory {
    event CollectionCreated(
        address indexed owner,
        address indexed collection,
        string name,
        string symbol
    );

    function createCollection(
        string memory name,
        string memory symbol,
        string memory baseUri,
        uint256 mintPrice,
        uint256 maxMintPerAddress
    ) external returns (address) {
        Base collection = new Base(
            name,
            symbol,
            msg.sender,
            baseUri,
            mintPrice,
            maxMintPerAddress
        );

        emit CollectionCreated(
            msg.sender,
            address(collection),
            name,
            symbol
        );

        return address(collection);
    }
}
