import * as express from 'express'
import { getGrqpcMiddleware } from './middleware/grpc'
import { getAmpqMiddleware } from './middleware/amqp'
import { getGraphqlMiddleware } from './middleware/graphql'
import { v4 as uuid } from 'uuid'
import { IResponse } from './types'
import { log } from './utils/logger'

export async function expressServer() {
    const app = express()
    const port = 80
    const grpcAddress = process.env.COMMENTS_SERVICE || 'localhost:50051'
    const ampqAddress = process.env.AMPQ_SERVICE || 'amqp://localhost:5672'
    app.use((req, res: IResponse, next) => {
        res.locals.correlationId = uuid()
        next()
    })
    app.use(await getGrqpcMiddleware(grpcAddress))
    app.use(await getAmpqMiddleware(ampqAddress))
    app.use('/graphql', getGraphqlMiddleware())
    app.listen(port, () => log.info(`Example app listening on port ${port}!`))
}