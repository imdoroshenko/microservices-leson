import * as grpc from 'grpc'
import * as protoLoader from '@grpc/proto-loader'
import { RequestHandler } from 'express'
import { IGrpcClientAsync } from '../types'
import { promisify } from 'util'

function getClient(address: string): grpc.Client {
    const packageDefinition = protoLoader.loadSync(
        './protos/comments.proto', {
            keepCase: true,
            defaults: false,
        });
    const protoDescriptor = grpc.loadPackageDefinition(packageDefinition) as any
    const Manager: typeof grpc.Client = protoDescriptor.comments.Manager
    return new Manager(address, grpc.credentials.createInsecure())
}

function promisifyClient(client: any): IGrpcClientAsync {
    return Object
        .values<string>(client.$method_names)
        .reduce((acc, name) => {
            acc[name] = promisify(client[name].bind(client))
            return acc
        }, {})
}

export async function getGrqpcMiddleware(address: string): Promise<RequestHandler> {
    const client = promisifyClient(getClient(address))
    return (req, res, next) => {
        res.locals.grpcClient = client
        next()
    }
}
