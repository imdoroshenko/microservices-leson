import { Pool } from "pg"
import { Request, Response } from 'express'

export interface IApplicationContext {
    pgPool: Pool
}
export interface IResponse extends Response {
    locals: IApplicationContext
}