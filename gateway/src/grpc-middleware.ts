import * as grpc from 'grpc'
import * as protoLoader from '@grpc/proto-loader'
import { RequestHandler } from 'express';

function getClient(address: string): any {
    const packageDefinition = protoLoader.loadSync(
        './protos/comments.proto', {
            keepCase: true,
            longs: String,
            enums: String,
            defaults: true,
            oneofs: true,
        });
    const protoDescriptor = grpc.loadPackageDefinition(packageDefinition) as any
    return new protoDescriptor.comments.Manager(address, grpc.credentials.createInsecure())
}

export async function getGrqpcMiddleware(address: string): Promise<RequestHandler> {
    const client = getClient(address)
    return (req, res, next) => {
        res.locals.grpcClient = client
        next()
    }
}
