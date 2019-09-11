import * as cluster from 'cluster'
import * as os from 'os'
import { expressServer } from './express-server'
import { log } from './utils/logger'

const numCPUs = os.cpus().length
  if (cluster.isMaster) {
    log.info(`Master ${process.pid} is running`)
    for (let i = 0; i < numCPUs; i++) {
      cluster.fork()
    }
    cluster.on('exit', (worker: cluster.Worker, code: string, signal: string) =>
      log.crit(`worker ${worker.process.pid} died. ${code} - ${signal}`),
    )
  } else {
    expressServer()
    log.info(`Worker ${process.pid} started`)
  }