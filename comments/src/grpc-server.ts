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
            Create: (call, callback) => {
                console.log('!!!!!!!!!!!')
                callback(null, {
                    comment_uuid: '!!!!!!!!!!!!!!!!!!'
                })
            },
            Read: (call, callback) => {
                console.log('!me!')
                console.log(call.metadata.get('key'))
                callback(null, {comments: [
                {
                    comment_uuid: '!!!!!!!!!!!!!!!!!!',
                    post_uuid: '!!!!!!!!!!!!!',
                    email: 'test@email.com',
                    content: 'Hello World!',
                }
            ]})},
            Count: (call, callback) => callback(null, {}),
            Update: (call, callback) => callback(null, {}),
            Delete: (call, callback) => callback(null, {}),
            DeleteFromPost: (call, callback) => callback(null, {}),
        })
    server.bind(location, grpc.ServerCredentials.createInsecure())
    console.log('Server running at ' + location)
    server.start()
}
