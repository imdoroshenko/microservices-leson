import { GraphQLObjectType, GraphQLInputObjectType, GraphQLString, GraphQLList } from 'graphql'
import { IGraphQLFieldConfig } from '../types'
import fetch from 'node-fetch'
import { v4 as uuid } from 'uuid'


const Post = new GraphQLObjectType({
    name: 'Post',
    fields: {
        post_uuid: { type: GraphQLString },
        title: { type: GraphQLString },
        url: { type: GraphQLString },
        content: { type: GraphQLString },
        author: { type: GraphQLString },
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
    resolve: async (_, args, context) => {
        const response = await fetch('http://posts/posts')
        return response.json()
    }
}

export const addPost: IGraphQLFieldConfig = {
    description: 'Add new post',
    type: GraphQLString,
    args: {
        post: {
            type: PostInput
        }
    },
    resolve: async (_, args, context) => {
        const response = await fetch('http://posts/posts', {
            method: 'post',
            body: JSON.stringify(args.post),
            headers: {
                'Content-Type': 'application/json',
                'X-Correlation-ID': uuid()
            },
        })
        const json = await response.json()
        return json.post_uuid
    }
}

export const editPost: IGraphQLFieldConfig = {
    description: 'Edit post',
    type: GraphQLString,
    args: {
        post_uuid: {
            type: GraphQLString
        },
        post: {
            type: PostInput
        }
    },
    resolve: async (_, args, context) => {
        const response = await fetch('http://posts/posts/' + args.post_uuid, {
            method: 'patch',
            body: JSON.stringify(args.post),
            headers: {
                'Content-Type': 'application/json',
                'X-Correlation-ID': uuid()
            },
        })
        const json = await response.json()
        return json.post_uuid
    }
}

export const deletePost: IGraphQLFieldConfig = {
    description: 'Delete post',
    type: GraphQLString,
    args: {
        post_uuid: {
            type: GraphQLString
        }
    },
    resolve: async (_, args, context) => {
        const response = await fetch('http://posts/posts/' + args.post_uuid, {
            method: 'delete',
            body: JSON.stringify(args.post),
            headers: {
                'Content-Type': 'application/json',
                'X-Correlation-ID': uuid()
            },
        })
        const json = await response.json()
        return json.post_uuid
    }
}