import { Channel } from 'amqplib'

interface IsendMessageOptions {
    closeChannel?: boolean,
    correlationId: string
}

export async function sendMessage(
    channel: Channel,
    queue: string,
    content: any,
    { closeChannel, correlationId }: IsendMessageOptions): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const requestQ = queue
            const responseQ = `${queue}-response-${correlationId}`
            await channel.assertQueue(requestQ, { durable: false });
            await channel.assertQueue(responseQ, { exclusive: true });
            await channel.consume(responseQ, async (msg) => {
                if (msg) { 
                    await channel.deleteQueue(responseQ)
                    closeChannel && await channel.close()
                    if (msg.properties.type === 'error') {
                        return reject(new Error(msg.content.toString()))
                    }
                    try {
                        resolve(JSON.parse(msg.content.toString()))
                    } catch (e) {
                        resolve(msg.content.toString())
                    }
                }
            }, {
                exclusive: true
            })
            channel.sendToQueue(requestQ, Buffer.from(JSON.stringify(content)), {
                correlationId,
                replyTo: responseQ
            });
        } catch (e) {
            closeChannel && await channel.close()
            reject(e)
        }
    })      
}