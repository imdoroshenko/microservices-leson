import { sendMessage } from '../utils/mq'
import { GraphQLObjectType, GraphQLString, GraphQLNonNull } from 'graphql'
import { IGraphQLFieldConfig } from '../types'
import { log } from '../utils/logger'

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
        log.info(`AMQP Message to fetch service`, { correlationId })
        return await sendMessage(channel, 'fetch', args, { closeChannel: true, correlationId })
    }
}
