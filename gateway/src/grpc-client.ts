import * as grpc from 'grpc'
import * as protoLoader from '@grpc/proto-loader'

export function getClient(address: string): any {
    console.log('address', address)
    const packageDefinition = protoLoader.loadSync(
        './protos/message.proto', {
            keepCase: true,
            longs: String,
            enums: String,
            defaults: true,
            oneofs: true,
        });
    const protoDescriptor = grpc.loadPackageDefinition(packageDefinition) as any
    return new protoDescriptor.helloworld.Greeter(address, grpc.credentials.createInsecure());
}

