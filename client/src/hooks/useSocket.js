import { useEffect, useState } from 'react'
import { Realtime } from 'ably'

export const useSocket = (channelName) => {
    const [channel, setChannel] = useState(null)

    useEffect(() => {
        const client = new Realtime({ authUrl: '/api/createTokenRequest' })

        client.connection.on('connected', () => {
            console.log('Connected to Ably')
            const channelInstance = client.channels.get(channelName)
            setChannel(channelInstance)
        })

        return () => {
            if (channel) channel.detach()
            client.close()
        }
    }, [channelName])

    return channel
}
