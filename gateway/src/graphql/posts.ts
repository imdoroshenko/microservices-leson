import { GraphQLObjectType, GraphQLInputObjectType, GraphQLString, GraphQLList, GraphQLInt } from 'graphql'
import { IGraphQLFieldConfig } from '../types'
import fetch from 'node-fetch'
import { v4 as uuid } from 'uuid'
import { Comment, countForPostResolver, getForPostResolver } from './comments'

interface IHttpReqParams {
    post_uuid?: string,
    method?: string
    post?: any
}

const POSTS_URL = process.env.POSTS_SERVICE || 'http://posts-service/posts/:post_uuid'

async function httpReq({post_uuid = '', method = 'get', post}: IHttpReqParams = {}): Promise<any> {
    const response = await fetch(POSTS_URL.replace(':post_uuid', post_uuid), {
        method,
        body: JSON.stringify(post),
        headers: {
            'Content-Type': 'application/json',
            'X-Correlation-ID': uuid()
        },
    })
    const result = await response.json()
    if (!response.ok) {
        throw new Error(result)
    }
    return result
}

const Post = new GraphQLObjectType({
    name: 'Post',
    fields: {
        post_uuid: { type: GraphQLString },
        title: { type: GraphQLString },
        url: { type: GraphQLString },
        content: { type: GraphQLString },
        author: { type: GraphQLString },
        comments: {
            type: new GraphQLList(Comment),
            resolve: getForPostResolver
        },
        commentsCount: {
            type: GraphQLInt,
            resolve: countForPostResolver
        }
    },
})

const PostInput = new GraphQLInputObjectType({
    name: 'PostInput',
    fields: {
        title: { type: GraphQLString },
        url: { type: GraphQLString },
        content: { type: GraphQLString },
        author: { type: GraphQLString },
    },
})

export const posts: IGraphQLFieldConfig = {
    description: 'Get list of all posts',
    type: new GraphQLList(Post),
    resolve: async (_, args, context) => httpReq()
}

export const addPost: IGraphQLFieldConfig = {
    description: 'Add new post',
    type: GraphQLString,
    args: {
        post: { type: PostInput }
    },
    resolve: async (_, { post }, context) => {
        const result = await httpReq({
            method: 'post',
            post
        })
        return result.post_uuid
    }
}

export const editPost: IGraphQLFieldConfig = {
    description: 'Edit post',
    type: GraphQLString,
    args: {
        post_uuid: { type: GraphQLString },
        post: { type: PostInput }
    },
    resolve: async (_, { post_uuid, post }, context) => {
        const result = await httpReq({
            method: 'patch',
            post_uuid,
            post
        })
        return result.post_uuid
    }
}

export const deletePost: IGraphQLFieldConfig = {
    description: 'Delete post',
    type: GraphQLString,
    args: {
        post_uuid: { type: GraphQLString }
    },
    resolve: async (_, { post_uuid }, context) => {
        const result = await httpReq({
            method: 'delete',
            post_uuid
        })
        return result.post_uuid
    }
}
