import * as cluster from 'cluster'
import * as os from 'os'
import { expressServer } from './express-server'

const numCPUs = os.cpus().length
  if (cluster.isMaster) {
    console.log('info', `Master ${process.pid} is running`, 'index')
    for (let i = 0; i < numCPUs; i++) {
      cluster.fork()
    }
    cluster.on('exit', (worker: cluster.Worker, code: string, signal: string) =>
      console.log('crit', `worker ${worker.process.pid} died. ${code} - ${signal}`, 'index'),
    )
  } else {
    expressServer()
    console.log('info', `Worker ${process.pid} started`, 'index')
  }