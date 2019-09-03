import { connect, Connection } from 'amqplib'

const retryTimeout = 5000
export async function getConnection(url: string): Promise<Connection> {
    try {
        return await connect(url)
    } catch (e) {
        console.log('warning', `connection error, retry in ${retryTimeout}`)
        await new Promise(resolve => setTimeout(resolve, retryTimeout))
        return getConnection(url)
    }
}
