import * as express from 'express'
import { getGrqpcMiddleware } from './grpc-middleware'
import { getAmpqMiddleware } from './amqp-middleware'
import { getGraphqlMiddleware } from './graphql-middleware'
import { sendMessage } from './utils/mq'
import fetch from 'node-fetch';
import { IResponse } from './types';

export async function expressServer() {
    const app = express()
    const port = 80
    const grpcAddress = process.env.COMMENTS_SERVICE || 'localhost:50051'
    const ampqAddress = process.env.AMPQ_SERVICE || 'amqp://localhost:5672'
    app.use(await getGrqpcMiddleware(grpcAddress))
    app.use(await getAmpqMiddleware(ampqAddress))
    app.use('/graphql', getGraphqlMiddleware())
    // app.get('/', async (req: express.Request, res: IResponse) => {
    //     res.locals.grpcClient.read({ post_uuid: "test123"}, (err, response) => {
    //         if (err) {
    //             console.error(err)
    //         }
    //         console.log('!me', process.pid)
    //         res.send(response)
    //     })
    // })
    
    app.get('/ampq', async (req: express.Request, res: IResponse) => {
        const channel = await res.locals.ampqConnection.createChannel()
        try {
            const content = await sendMessage(channel, 'fetch', {url: 'https://medium.com/@pasql/transitional-interfaces-926eb80d64e3'}, { closeChannel: true })
            res.send(content)
        } catch(e) {
            res.send(e.message)
        }  
    })

    app.get('/posts', async (req: express.Request, res: IResponse) => {
        const response = await fetch('http://posts/posts')
        const text = await response.text()
        res.send(text)
    })
    
    app.listen(port, () => console.log(`Example app listening on port ${port}!`))
}