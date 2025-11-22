import { type NextRequest, NextResponse } from 'next/server'
import { createClient, Errors } from '@farcaster/quick-auth'

const client = createClient()

type UserData = {
  fid: number
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const authorization = request.headers.get('Authorization')

    if (!authorization || !authorization.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Missing or invalid authorization header' },
        { status: 401 }
      )
    }

    const token = authorization.split(' ')[1]
    if (!token) {
      return NextResponse.json(
        { error: 'Missing token' },
        { status: 401 }
      )
    }

    const url = new URL(request.url)
    const domain = url.hostname

    const payload = await client.verifyJwt({
      token,
      domain,
    })

    return NextResponse.json({
      fid: payload.sub,
    })
  } catch (error) {
    if (error instanceof Errors.InvalidTokenError) {
      console.info('Invalid token:', error.message)
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    console.error('Error in /api/me:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
