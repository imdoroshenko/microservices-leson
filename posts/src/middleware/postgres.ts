import { Pool } from 'pg'
import { log } from '../utils/logger'

export function getPgMiddleware(connectionString: string) {
    const pool = new Pool({ connectionString })
    pool.on('error', err => log.error(`pool error: ${err.message}`))
    return (req, res, next) => {
        res.locals.pgPool = pool
        next()
    }
}
