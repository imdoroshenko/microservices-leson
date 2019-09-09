import { GraphQLObjectType, GraphQLInputObjectType, GraphQLString, GraphQLList, graphqlSync } from 'graphql'
import { IGraphQLFieldConfig } from '../types'
import fetch from 'node-fetch'
import { v4 as uuid } from 'uuid'
import { promisify } from 'util'
import * as grpc from 'grpc'

const Comment = new GraphQLObjectType({
    name: 'Comment',
    fields: {
        post_uuid: { type: GraphQLString },
        comment_uuid: { type: GraphQLString },
        email: { type: GraphQLString },
        content: { type: GraphQLString }
    },
})

const CommentInput = new GraphQLInputObjectType({
    name: 'CommentInput',
    fields: {
        post_uuid: { type: GraphQLString },
        email: { type: GraphQLString },
        content: { type: GraphQLString }
    },
})

export const comments: IGraphQLFieldConfig = {
    description: 'Get comments for specific post',
    type: new GraphQLList(Comment),
    args: {
        post_uuid: { type: GraphQLString }
    },
    resolve: async (_, { post_uuid }, context) => { 
        var meta = new grpc.Metadata()
        meta.add('key', 'value')
        const response = await context.grpcClient.Read({ post_uuid }, meta)
        return response.comments
    }
}

export const addComment: IGraphQLFieldConfig = {
    description: 'Add comment',
    type: GraphQLString,
    args: {
        comment: { type: CommentInput }
    },
    resolve: async (_, { comment }, context) => {
        var meta = new grpc.Metadata()
        meta.add('key', 'value')
        const response = await context.grpcClient.Create(comment, meta)
        return response.comment_uuid
    }
}

export const editComment: IGraphQLFieldConfig = {
    description: 'Edit comment',
    type: GraphQLString,
    args: {
        comment_uuid: { type: GraphQLString },
        comment: { type: CommentInput }
    },
    resolve: async (_, {comment_uuid, comment}, context) => {
        var meta = new grpc.Metadata()
        meta.add('key', 'value')
        const response = await context.grpcClient.Update({...comment, comment_uuid}, meta)
        return response.comment_uuid
    }
}

export const deleteComment: IGraphQLFieldConfig = {
    description: 'Delete comment',
    type: GraphQLString,
    args: {
        comment_uuid: { type: GraphQLString }
    },
    resolve: async (_, { comment_uuid }, context) => {
        var meta = new grpc.Metadata()
        meta.add('key', 'value')
        const response = await context.grpcClient.Delete({ comment_uuid }, meta)
        return response.comment_uuid
    }
}