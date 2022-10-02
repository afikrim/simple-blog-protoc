import { plainToClass } from 'class-transformer'

import { ErrBadRequest } from '../../util/general-errors/general-errors'
import { Pagination } from '../../util/pagination/pagination'
import { CreatePostRequest, Post, UpdatePostRequest } from '../entity/post'
import { IPostRepository } from '../repository/post'

export interface IPostUseCase {
  listPosts(pg: Pagination): Promise<[Post[]?, Error?]>
  getPost(id: number): Promise<[Post?, Error?]>
  createPost(req: CreatePostRequest): Promise<[Error?]>
  updatePostByID(id: number, req: UpdatePostRequest): Promise<[Error?]>
  deletePostByID(id: number): Promise<[Error?]>
}

export class PostUseCase implements IPostUseCase {
  constructor(private readonly postRepository: IPostRepository) {}

  async listPosts(pg: Pagination): Promise<[Post[]?, Error?]> {
    pg.validate()

    var [posts, err] = await this.postRepository.listPosts(pg)
    if (err) {
      return [undefined, err]
    }

    return [posts, undefined]
  }

  async getPost(id: number): Promise<[Post?, Error?]> {
    var [post, err] = await this.postRepository.getPost(id)
    if (err) {
      return [undefined, err]
    }

    return [post, undefined]
  }

  async createPost(req: CreatePostRequest): Promise<[Error?]> {
    var [err] = req.validate()
    if (err) {
      return [new ErrBadRequest(err.message)]
    }

    const post = plainToClass(Post, req)
    var [err] = await this.postRepository.createPost(post)
    if (err) {
      return [err]
    }

    return [undefined]
  }

  async updatePostByID(id: number, req: UpdatePostRequest): Promise<[Error?]> {
    const post = plainToClass(Post, req)
    var [err] = await this.postRepository.updatePostByID(id, post)
    if (err) {
      return [err]
    }

    return [undefined]
  }

  async deletePostByID(id: number): Promise<[Error?]> {
    var [err] = await this.postRepository.deletePostByID(id)
    if (err) {
      return [err]
    }

    return [undefined]
  }
}
