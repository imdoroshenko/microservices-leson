import * as grpc from 'grpc'
import * as protoLoader from '@grpc/proto-loader'

function sayHello(call: grpc.ServerUnaryCall<any>, callback: grpc.sendUnaryData<any>) {
    callback(null, {message: 'Hello ' + call.request.name});
}

function sayHelloAgain(call: grpc.ServerUnaryCall<any>, callback: grpc.sendUnaryData<any>) {
    callback(null, {message: 'Hello again, ' + call.request.name});
}

export function grpcServer(location: string = '127.0.0.1:50051') {
    const packageDefinition = protoLoader.loadSync(
        './protos/message.proto', {
            keepCase: true,
            longs: String,
            enums: String,
            defaults: true,
            oneofs: true,
        });
    const protoDescriptor = grpc.loadPackageDefinition(packageDefinition) as any
    const server = new grpc.Server()
    server.addService(protoDescriptor.helloworld.Greeter.service,
        {sayHello: sayHello, sayHelloAgain: sayHelloAgain})
    server.bind(location, grpc.ServerCredentials.createInsecure())
    console.log('Server running at ' + location)
    server.start()
}
