import {
  instanceToPlain,
  plainToClass,
  plainToInstance,
} from 'class-transformer'
import { Knex } from 'knex'

import { Post } from '../../core/entity/post'
import { IPostRepository } from '../../core/repository/post'
import { ErrNotFound } from '../../util/general-errors/general-errors'
import { Pagination } from '../../util/pagination/pagination'
import { PostDto, PostDtos, postIDColumn, postTable, RawResults } from './dto'

const allColumns = '*'

export class PostRepository implements IPostRepository {
  constructor(private readonly db: Knex) {}

  async listPosts(pg: Pagination): Promise<[Post[]?, Error?]> {
    const db = this.db.table(postTable)

    const limit = pg.pageSize
    const offset = (pg.page - 1) * pg.pageSize

    let dtos: PostDtos, totalCount: number
    try {
      const count = await db.clone().count('*', { as: 'count' }).first()
      const raw = await db
        .clone()
        .select(allColumns)
        .limit(limit)
        .offset(offset)
        .orderBy('id', 'desc')

      totalCount = count.count
      dtos = plainToInstance<PostDto, RawResults>(PostDto, raw, {
        exposeDefaultValues: true,
        excludeExtraneousValues: true,
      })
    } catch (err) {
      return [undefined, err]
    }

    pg.total = totalCount
    pg.totalPages = Math.ceil(totalCount / pg.pageSize)

    return [dtos.map((dto) => dto.toEntity()), undefined]
  }

  async getPost(id: number): Promise<[Post?, Error?]> {
    const db = this.db.table(postTable)

    let dto: PostDto
    try {
      const q = `${postIDColumn} = ?`
      const raw = await db.select(allColumns).whereRaw(q, id).first()
      if (!raw) {
        throw new ErrNotFound('Post not found')
      }

      dto = plainToClass(PostDto, raw, {
        exposeDefaultValues: true,
        excludeExtraneousValues: true,
      })
    } catch (err) {
      return [undefined, err]
    }

    return [dto.toEntity(), undefined]
  }

  async createPost(post: Post): Promise<[Error?]> {
    const db = this.db.table(postTable)

    const dto = PostDto.fromEntity(post)
    try {
      const raw = instanceToPlain(dto)
      await db.insert(raw)
    } catch (err) {
      return [err]
    }

    return [undefined]
  }

  async updatePostByID(id: number, post: Post): Promise<[Error?]> {
    const [_, err] = await this.getPost(id)
    if (err) {
      return [err]
    }

    const db = this.db.table(postTable)

    const dto = PostDto.fromEntity(post)
    try {
      const q = `${postIDColumn} = ?`
      const raw = instanceToPlain(dto)
      await db.whereRaw(q, id).update(raw)
    } catch (err) {
      return [err]
    }

    return [undefined]
  }

  async deletePostByID(id: number): Promise<[Error?]> {
    const [_, err] = await this.getPost(id)
    if (err) {
      return [err]
    }

    const db = this.db.table(postTable)

    try {
      const q = `${postIDColumn} = ?`
      await db.whereRaw(q, id).del()
    } catch (err) {
      return [err]
    }

    return [undefined]
  }
}
