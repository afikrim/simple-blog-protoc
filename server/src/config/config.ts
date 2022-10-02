import { Expose, plainToClass } from 'class-transformer'

export class Config {
  @Expose({ name: 'GRPC_PORT' })
  grpcPort: number

  @Expose({ name: 'BLOG_MYSQL_HOST' })
  blogMysqlHost: string

  @Expose({ name: 'BLOG_MYSQL_PORT' })
  blogMysqlPort: number

  @Expose({ name: 'BLOG_MYSQL_USER' })
  blogMysqlUser: string

  @Expose({ name: 'BLOG_MYSQL_PASSWORD' })
  blogMysqlPassword: string

  @Expose({ name: 'BLOG_MYSQL_DATABASE' })
  blogMysqlDatabase: string

  @Expose({ name: 'DEBUG_MODE' })
  debugMode: boolean

  getGrpcServerAddress(): string {
    return `127.0.0.1:${this.grpcPort}`
  }

  static getConfig(env: NodeJS.ProcessEnv): Config {
    const config = plainToClass(Config, env)
    return config
  }
}
