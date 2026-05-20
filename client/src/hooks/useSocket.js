import { useEffect, useState } from 'react'
import { Realtime } from 'ably'

export const useSocket = (channelName) => {
    const [channel, setChannel] = useState(null)

    useEffect(() => {
        const client = new Realtime({ authUrl: '/api/createTokenRequest' })
        let channelInstance = null

        const onConnected = () => {
            channelInstance = client.channels.get(channelName)
            setChannel(channelInstance)
        }

        client.connection.on('connected', onConnected)

        return () => {
            client.connection.off('connected', onConnected)
            if (channelInstance) {
                channelInstance.detach()
            }
            client.close()
        }
    }, [channelName])

    return channel
}
