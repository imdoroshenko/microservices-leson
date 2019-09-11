import { sendMessage } from '../utils/mq'
import { GraphQLObjectType, GraphQLString, GraphQLNonNull } from 'graphql'
import { IGraphQLFieldConfig } from '../types'

export const Metadata = new GraphQLObjectType({
    name: 'Metadata',
    fields: {
        title: { type: GraphQLString },
        description: { type: GraphQLString }
    },
})

export const fetchMetadataByURL: IGraphQLFieldConfig = {
    description: 'Fetch metadata by URL',
    type: Metadata,
    args: {
        url: { type: new GraphQLNonNull(GraphQLString) }
    },
    resolve: async (_, args, {ampqConnection, correlationId}) => { 
        const channel = await ampqConnection.createChannel()
        return await sendMessage(channel, 'fetch', args, { closeChannel: true, correlationId })
    }
}
