import { Request, Response } from 'express'
import { Connection } from 'amqplib';
import { GraphQLResolveInfo, GraphQLFieldConfig } from 'graphql';

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

export type Resolver<TResult = any, TSource = any, TArgs = Record<any, any>> = (
    source: TSource,
    data: TArgs,
    context: IApplicationContext,
    info?: GraphQLResolveInfo,
  ) => Promise<TResult | undefined | never>

export type IGraphQLFieldConfig = GraphQLFieldConfig<any, IApplicationContext, Record<any, any>>