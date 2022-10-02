import { Server, ServerCredentials } from '@grpc/grpc-js'
import { Knex, knex } from 'knex'

import { Config } from './config/config'
import { PostUseCase } from './core/module/post'
import { PostServiceService } from './handler/api/pb/post/post_grpc_pb'
import { PostHandler } from './handler/api/post'
import { PostRepository } from './repository/post/post-repository'

const mysqlType = 'mysql2'

function main() {
  // Init config
  const cfg = Config.getConfig(process.env)

  // Init db
  const db = initMysqlConnection(cfg)

  // Init repo
  const postRepo = new PostRepository(db)

  // Init service
  const postSvc = new PostUseCase(postRepo)

  // Init handler
  const postHandler = new PostHandler(postSvc)

  // Init server
  const server = new Server()

  // Register handler
  server.addService(PostServiceService, postHandler.toGrpcHandler())

  // Start server
  server.bindAsync(
    cfg.getGrpcServerAddress(),
    ServerCredentials.createInsecure(),
    (err, _) => {
      if (err) {
        throw err
      }

      server.start()
      console.log(`Server running at http://${cfg.getGrpcServerAddress()}`)
    }
  )
}

function initMysqlConnection(cfg: Config): Knex {
  const db = knex({
    client: mysqlType,
    connection: {
      host: cfg.blogMysqlHost,
      port: cfg.blogMysqlPort,
      user: cfg.blogMysqlUser,
      password: cfg.blogMysqlPassword,
      database: cfg.blogMysqlDatabase,
    },
  })

  return db
}

main()
