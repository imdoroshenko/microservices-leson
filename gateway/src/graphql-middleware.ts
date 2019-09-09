import { Request } from 'express'
import * as graphqlHTTP from 'express-graphql'
import { GraphQLSchema, GraphQLObjectType  } from 'graphql'
import { IResponse } from './types'
import { 
    posts,
    addPost,
    editPost,
    deletePost,
 } from './graphql/posts'
 import { 
    comments,
    addComment,
    editComment,
    deleteComment,
    deleteComments,
 } from './graphql/comments'

 import { 
    fetchMetadataByURL
 } from './graphql/fetch'

const schema = new GraphQLSchema({
    query: new GraphQLObjectType({ name: 'Query', fields: {
        posts,
        comments,
        fetchMetadataByURL
    } }),
    mutation: new GraphQLObjectType({ name: 'Mutation', fields: {
        addPost,
        editPost,
        deletePost,
        addComment,
        editComment,
        deleteComment,
        deleteComments
    } }),
})

export function getGraphqlMiddleware() {
    return graphqlHTTP((req: Request, res: IResponse) => {
        return {
            schema,
            context: res.locals,
            graphiql: true,
            customFormatErrorFn: err => {
                console.log('error', err.message, 'bootstrap/graphql.formatError')
                return {
                    message: err.message,
                    locations: err.locations,
                    stack: err.stack ? err.stack.split('\n') : [],
                    path: err.path,
                }
            },
        }
    })
}
