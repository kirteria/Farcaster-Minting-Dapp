import { type NextRequest, NextResponse } from "next/server"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const cid = process.env.NEXT_PUBLIC_NFT_CID!
  const url = `https://dweb.link/ipfs/${cid}/${id}.png`

  const res = await fetch(url)

  if (!res.ok) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  return new NextResponse(await res.arrayBuffer(), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  })
}
