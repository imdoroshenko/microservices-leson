import { Channel } from "amqplib"
import { v4 as uuid } from 'uuid'

interface IsendMessageOptions {
    closeChannel?: boolean
}

export async function sendMessage(channel: Channel, queue: string, content: any, options: IsendMessageOptions = {}): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            const correlationId = uuid()
            const requestQ = queue
            const responseQ = queue + '-response-' + correlationId
            await channel.assertQueue(requestQ, { durable: false });
            await channel.assertQueue(responseQ, { exclusive: true });
            await channel.consume(responseQ, async (msg) => {
                if (msg) { 
                    await channel.deleteQueue(responseQ)
                    options.closeChannel && await channel.close()
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
            options.closeChannel && await channel.close()
            reject(e)
        }
    })      
}