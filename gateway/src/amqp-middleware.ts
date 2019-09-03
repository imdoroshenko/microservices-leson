import { connect, Connection } from 'amqplib'
import { RequestHandler } from 'express';

const retryTimeout = 5000
async function getConnection(url: string): Promise<Connection> {
    try {
        return await connect(url)
    } catch (e) {
        console.log('warning', `connection error, retry in ${retryTimeout}`)
        await new Promise(resolve => setTimeout(resolve, retryTimeout))
        return getConnection(url)
    }
}

export async function getAmpqMiddleware(url: string): Promise<RequestHandler> {
    const connection = await getConnection(url)
    return async (req, res, next) => {
        res.locals.ampqConnection = connection
        next()
    }
}

export async function createTestConsumer(name: string) {
    const channel = await (await getConnection('amqp://ampq:5672')).createChannel()
    const queue = 'fetch'
    await channel.assertQueue(queue, { durable: false });
    channel.consume(queue, (msg) => {
        if (msg) {
            channel.sendToQueue(
                msg.properties.replyTo,
                Buffer.from('Hello from ' + name + '!'),
                { correlationId: msg.properties.clusterId}
            )
            console.log(name + ': ' + msg.content.toString());
        } 
    }, {
        noAck: true
    })
}
