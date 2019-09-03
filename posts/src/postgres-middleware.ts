import { Pool } from 'pg'

export function getPgMiddleware(connectionString: string) {
    console.log(connectionString)
    const pool = new Pool({ connectionString })
    pool.on('error', err => console.log('error', `pool error: ${err.message}`, 'bootstrap/postgres'))
    return (req, res, next) => {
        res.locals.pgPool = pool
        next()
    }
}
