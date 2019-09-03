import * as express from 'express'
import { getPgMiddleware } from './postgres-middleware'
import { Pool } from 'pg';
import { IResponse } from './types'
import * as bodyParser from 'body-parser'

export async function expressServer() {
    const app = express()
    const port = 80
    const pgConnectionString = process.env.PSQL_URL || ''
    app.use(bodyParser.json())
    app.use(getPgMiddleware(pgConnectionString))
    app.get('/posts', async (req: express.Request, res: IResponse) => {
        const result = await (res.locals.pgPool as Pool).query('SELECT * FROM posts')
        res.json(result.rows)
    })
    app.post('/posts', async (req: express.Request, res: IResponse) => {
        const post = req.body
        const result = await res.locals.pgPool.query(`
        INSERT INTO posts(title, url, content, author)
        VALUES($1::text, $2::text, $3::text, $4::text) RETURNING post_uuid
        `, [post.title, post.url, post.content, post.author])
        res.json(result.rows[0])
    })
    app.patch('/posts/:post_uuid', async (req: express.Request, res: IResponse) => {
        const post = req.body
        const result = await res.locals.pgPool.query(`
        UPDATE posts SET title=$1::text, url=$2::text, content=$3::text, author=$4::text
        VALUES($1, $2, $3, $4) RETURNING post_uuid
        `, [post.title, post.url, post.content, post.author])
        res.json(result.rows[0])
    })
    app.delete('/posts/:post_uuid', async (req: express.Request, res: IResponse) => {
        const result = await res.locals.pgPool.query('DELETE FROM posts WHERE uuid=$1', [req.params.post_uuid])
        res.json({ post_uuid: req.params.post_uuid })
    })
    
    app.listen(port, () => console.log(`Example app listening on port ${port}!`))
}