import { Request, Response } from 'express'
import { Connection } from 'amqplib';

interface IGrpcClient {
    [key: string]: (data: any, callback: (error: Error|null, data: any) => any) => any
}

export interface IApplicationContext {
    grpcClient: IGrpcClient
    ampqConnection: Connection
}
export interface IResponse extends Response {
    locals: IApplicationContext
}