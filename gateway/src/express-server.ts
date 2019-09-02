import * as express from 'express'
import { getClient } from './grpc-client'

export function expressServer() {
    const app = express()
    const port = 80
    const location = process.env.COMMENTS_SERVICE || 'localhost:50051'
    const commentsClient = getClient(location)
    app.use((_, res, next) => {
      res.locals.commentsClient = commentsClient
      next()
    })
    app.get('/', async (req: express.Request, res: express.Response) => {
        res.locals.commentsClient.read({ post_uuid: "test123"}, (err, response) => {
            if (err) {
                console.error(err)
            }
            res.send(response)
        })
    })
    
    app.listen(port, () => console.log(`Example app listening on port ${port}!`))
}