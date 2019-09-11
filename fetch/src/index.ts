import { getConnection } from './amqp'
import { fetchUrlMeta } from './fetch-url'

const queue = 'fetch'

async function serve() {
  const ampqAddress = process.env.AMPQ_SERVICE || 'amqp://localhost:5672'
  const connection = await getConnection(ampqAddress)
  console.log('connected to ampq')
  const channel = await connection.createChannel()
  await channel.assertQueue(queue, { durable: false })
  channel.consume(queue, async (msg) => {
      if (msg) {
        const { replyTo, correlationId } = msg.properties.replyTo
        try {
          const content = msg.content.toString()
          const incomingData = JSON.parse(content)
          console.log('incoming message:' + content)
          const meta = await fetchUrlMeta(incomingData.url)
          channel.sendToQueue(replyTo, Buffer.from(JSON.stringify(meta)), { correlationId, type: 'success' })  
        } catch (e) {
          console.error(e)
          channel.sendToQueue(replyTo, Buffer.from(e.message), { correlationId, type: 'error' })
        }
      } 
  }, {
      noAck: true
  })
}

serve()
