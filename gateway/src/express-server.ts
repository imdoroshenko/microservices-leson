import * as express from 'express'
import { getGrqpcMiddleware } from './grpc-middleware'
import { getAmpqMiddleware } from './amqp-middleware'
import { getGraphqlMiddleware } from './graphql-middleware'

export async function expressServer() {
    const app = express()
    const port = 80
    const grpcAddress = process.env.COMMENTS_SERVICE || 'localhost:50051'
    const ampqAddress = process.env.AMPQ_SERVICE || 'amqp://localhost:5672'
    app.use(await getGrqpcMiddleware(grpcAddress))
    app.use(await getAmpqMiddleware(ampqAddress))
    app.use('/graphql', getGraphqlMiddleware())
    app.listen(port, () => console.log(`Example app listening on port ${port}!`))
}