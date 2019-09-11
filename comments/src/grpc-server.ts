import * as grpc from 'grpc'
import * as protoLoader from '@grpc/proto-loader'
import { getDB } from './mongo-client'
import { v4 as uuid } from 'uuid'
import { log } from './utils/logger'

async function sayHello(call: grpc.ServerUnaryCall<any>, callback: grpc.sendUnaryData<any>) {
    const db = await getDB()
    callback(null, {message: 'Hello ' + call.request.name});
}

export async function grpcServer(location: string = '127.0.0.1:50051') {
    const db = await getDB()
    const collection = db.collection('comments')
    const packageDefinition = protoLoader.loadSync(
        './protos/comments.proto', {
            keepCase: true,
            defaults: false,
        });
    const protoDescriptor = grpc.loadPackageDefinition(packageDefinition) as any
    const server = new grpc.Server()
    server.addService(protoDescriptor.comments.Manager.service,
        {
            Create: async (call, callback) => {
                try {
                    log.info('Create comment', { correlationId: call.metadata.get('correlationId') })
                    const comment_uuid = uuid()
                    await collection.insertOne({
                        comment_uuid,
                        ...call.request
                    })
                    callback(null, { comment_uuid })
                } catch (e) {
                    log.error(e.message, { correlationId: call.metadata.get('correlationId') })
                    callback(e)
                }
            },
            Read: async (call, callback) => {
                try {
                    log.info('Read comments', { correlationId: call.metadata.get('correlationId') })
                    const { post_uuid } = call.request
                    callback(null, { comments: await collection.find({ post_uuid }).toArray() })
                } catch (e) {
                    log.error(e.message, { correlationId: call.metadata.get('correlationId') })
                    callback(e)
                }
            },
            Count: async (call, callback) => {
                try {
                    log.info('Count comments', { correlationId: call.metadata.get('correlationId') })
                    callback(null, { count: await collection.countDocuments(call.request) })
                } catch (e) {
                    log.error(e.message, { correlationId: call.metadata.get('correlationId') })
                    callback(e)
                }
            },
            Update: async (call, callback) => {
                try {
                    log.info('Update comment', { correlationId: call.metadata.get('correlationId') })
                    const { comment_uuid, ...comment } = call.request
                    await collection.updateOne({ comment_uuid }, { $set: comment })
                    callback(null, { comment_uuid })
                } catch (e) {
                    log.error(e.message, { correlationId: call.metadata.get('correlationId') })
                    callback(e)
                }
            },
            Delete: async (call, callback) => {
                try {
                    log.info('Delete comment', { correlationId: call.metadata.get('correlationId') })
                    const { comment_uuid } = call.request
                    await collection.deleteOne({ comment_uuid })
                    callback(null, { comment_uuid })
                } catch (e) {
                    log.error(e.message, { correlationId: call.metadata.get('correlationId') })
                    callback(e)
                }
            },
            DeleteFromPost: async (call, callback) => {
                try {
                    log.info('Delete from post', { correlationId: call.metadata.get('correlationId') })
                    const { post_uuid } = call.request
                    await collection.deleteMany({ post_uuid })
                    callback(null, { post_uuid })
                } catch (e) {
                    log.error(e.message, { correlationId: call.metadata.get('correlationId') })
                    callback(e)
                }
            },
        })
    server.bind(location, grpc.ServerCredentials.createInsecure())
    log.info('Server running at ' + location)
    server.start()
}
