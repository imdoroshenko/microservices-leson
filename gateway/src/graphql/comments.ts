import { GraphQLObjectType, GraphQLInputObjectType, GraphQLString, GraphQLList, graphqlSync, GraphQLNonNull } from 'graphql'
import { IGraphQLFieldConfig, Resolver } from '../types'
import * as grpc from 'grpc'

export const Comment = new GraphQLObjectType({
    name: 'Comment',
    fields: {
        post_uuid: { type: GraphQLString },
        comment_uuid: { type: GraphQLString },
        email: { type: GraphQLString },
        content: { type: GraphQLString }
    },
})

export const CommentAdd = new GraphQLInputObjectType({
    name: 'CommentAdd',
    fields: {
        post_uuid: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
        content: { type: new GraphQLNonNull(GraphQLString) }
    },
})

export const CommentEdit = new GraphQLInputObjectType({
    name: 'CommentEdit',
    fields: {
        email: { type: GraphQLString },
        content: { type: GraphQLString }
    },
})

export const comments: IGraphQLFieldConfig = {
    description: 'Get comments for specific post',
    type: new GraphQLList(Comment),
    args: {
        post_uuid: { type: new GraphQLNonNull(GraphQLString) }
    },
    resolve: async (_, { post_uuid }, context) => { 
        const meta = new grpc.Metadata()
        meta.add('key', 'value')
        const response = await context.grpcClient.Read({ post_uuid }, meta)
        return response.comments
    }
}

export const addComment: IGraphQLFieldConfig = {
    description: 'Add comment',
    type: GraphQLString,
    args: {
        comment: { type: CommentAdd }
    },
    resolve: async (_, { comment }, context) => {
        const meta = new grpc.Metadata()
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
        comment: { type: CommentEdit }
    },
    resolve: async (_, {comment_uuid, comment}, context) => {
        const meta = new grpc.Metadata()
        meta.add('key', 'value')
        console.log(comment)
        const response = await context.grpcClient.Update({ ...comment, comment_uuid }, meta)
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
        const meta = new grpc.Metadata()
        meta.add('key', 'value')
        const response = await context.grpcClient.Delete({ comment_uuid }, meta)
        return response.comment_uuid
    }
}

export const deleteComments: IGraphQLFieldConfig = {
    description: 'Delete all comment in post',
    type: GraphQLString,
    args: {
        post_uuid: { type: GraphQLString }
    },
    resolve: async (_, { post_uuid }, context) => {
        const meta = new grpc.Metadata()
        meta.add('key', 'value')
        const response = await context.grpcClient.DeleteFromPost({ post_uuid }, meta)
        return response.post_uuid
    }
}

export const getForPostResolver: Resolver = async function({ post_uuid }, _, context) {
    const meta = new grpc.Metadata()
    meta.add('key', 'value')
    const response = await context.grpcClient.Read({ post_uuid }, meta)
    return response.comments
}

export const countForPostResolver: Resolver = async function({ post_uuid }, _, context) {
    const meta = new grpc.Metadata()
    meta.add('key', 'value')
    const response = await context.grpcClient.Count({ post_uuid }, meta)
    console.log('?', response)
    return response.count
}
