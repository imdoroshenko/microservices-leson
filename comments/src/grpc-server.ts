import * as grpc from 'grpc'
import * as protoLoader from '@grpc/proto-loader'
import { getDB } from './mongo-client'

async function sayHello(call: grpc.ServerUnaryCall<any>, callback: grpc.sendUnaryData<any>) {
    const db = await getDB()
    callback(null, {message: 'Hello ' + call.request.name});
}

export function grpcServer(location: string = '127.0.0.1:50051') {
    const packageDefinition = protoLoader.loadSync(
        './protos/comments.proto', {
            keepCase: true,
            longs: String,
            enums: String,
            defaults: true,
            oneofs: true,
        });
    const protoDescriptor = grpc.loadPackageDefinition(packageDefinition) as any
    const server = new grpc.Server()
    server.addService(protoDescriptor.comments.Manager.service,
        {
            create: (call, callback) => callback(null, {}),
            read: (call, callback) => {
                console.log('!me!')
                callback(null, {comments: [
                {
                    uuid: '123',
                    post_uuid: '321',
                    email: 'test@email.com',
                    content: 'Hello World!',
                }
            ]})},
            count: (call, callback) => callback(null, {}),
            update: (call, callback) => callback(null, {}),
            delete: (call, callback) => callback(null, {}),
            deleteFromPost: (call, callback) => callback(null, {}),
        })
    server.bind(location, grpc.ServerCredentials.createInsecure())
    console.log('Server running at ' + location)
    server.start()
}
