import * as express from 'express'
import { getPgMiddleware } from './middleware/postgres'
import { IResponse } from './types'
import * as bodyParser from 'body-parser'
import { asyncAction } from './utils/async-action'
import { log } from './utils/logger'

const fields = ['title', 'url', 'content', 'author']
const isEmpty = (item: any) => typeof item === 'undefined' || item === null

export async function expressServer() {
    const app = express()
    const port = 80
    const pgConnectionString = process.env.PSQL_URL || ''
    app.use(bodyParser.json())
    app.use(getPgMiddleware(pgConnectionString))
    app.get('/posts', asyncAction(async (req: express.Request, res: IResponse) => {
        log.info('GET:/posts', { correlationId: req.header('X-Correlation-Id') })
        const db = res.locals.pgPool
        const result = await db.query('SELECT * FROM posts')
        res.json(result.rows)
    }))
    app.post('/posts', asyncAction(async (req: express.Request, res: IResponse) => {
        log.info('POST:/posts', { correlationId: req.header('X-Correlation-Id') })
        const db = res.locals.pgPool
        const post = req.body
        const insertFields = fields.filter(field => !isEmpty(post[field]))
        const insertStatement = insertFields
            .reduce<Record<string, string>>((acc, field, i) => {
                acc[`$${i+1}::varchar`] = post[field]
                return acc
            }, {})
        const result = await db.query(`
            INSERT INTO posts(${insertFields.join(', ')})
            VALUES(${Object.keys(insertStatement).join(', ')}) RETURNING post_uuid`,
            Object.values(insertStatement))
        res.json(result.rows[0])
    }))
    app.patch('/posts/:post_uuid', asyncAction(async (req: express.Request, res: IResponse) => {
        log.info('PATCH:/posts', { correlationId: req.header('X-Correlation-Id') })
        const db = res.locals.pgPool
        const post = req.body
        const setFields = fields.filter(field => !isEmpty(post[field]))
        const setStatement = setFields
            .reduce<Record<string, string>>((acc, field, i) => {
                acc[`${field}=$${i+1}::varchar`] = post[field]
                return acc
            }, {})
        const values = [...Object.values(setStatement), req.params.post_uuid]
        const result = await db.query(`
            UPDATE posts SET ${Object.keys(setStatement).join(', ')} WHERE post_uuid=$${values.length}::uuid RETURNING post_uuid`,
            values)
        res.json(result.rows[0])
    }))
    app.delete('/posts/:post_uuid', asyncAction(async (req: express.Request, res: IResponse) => {
        log.info('DELETE:/posts', { correlationId: req.header('X-Correlation-Id') })
        const db = res.locals.pgPool
        await db.query('DELETE FROM posts WHERE post_uuid=$1::uuid', [req.params.post_uuid])
        res.json({ post_uuid: req.params.post_uuid })
    }))
    app.use((err: Error, req: express.Request, res: IResponse, next: express.NextFunction) => {
        log.info('error', err.message)
        res.status(500).json(err.message)
    })

    app.listen(port, () => log.info(`Example app listening on port ${port}!`))
}