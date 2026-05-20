import { Rest } from 'ably'

export default async function handler(req, res) {
    const apiKey = process.env.ABLY_API_KEY

    if (!apiKey) {
        res.status(500).json({ error: 'ABLY_API_KEY is not configured on the server' })
        return
    }

    const client = new Rest({ key: apiKey })

    try {
        const tokenRequest = await client.auth.createTokenRequest({
            clientId: 'bidder-client',
        })
        res.status(200).json(tokenRequest)
    } catch (error) {
        console.error('Error creating token request:', error)
        res.status(500).json({ error: 'Failed to create token request' })
    }
}
