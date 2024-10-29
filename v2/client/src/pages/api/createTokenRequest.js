import { Rest } from 'ably'

export default async function handler(req, res) {
    const client = new Rest({ key: process.env.NEXT_PUBLIC_ABLY_API_KEY })

    try {
        const tokenRequest = await client.auth.createTokenRequest({
            clientId: 'biddar',
        })
        res.status(200).json(tokenRequest)
    } catch (error) {
        console.error('Error creating token request:', error)
        res.status(500).json({ error: 'Failed to create token request' })
    }
}
