import { connect, Connection } from 'amqplib'
import { RequestHandler } from 'express'
import { log } from '../utils/logger'

const retryTimeout = 5000
async function getConnection(url: string): Promise<Connection> {
    try {
        return await connect(url)
    } catch (e) {
        log.warning(`connection error, retry in ${retryTimeout}`)
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

