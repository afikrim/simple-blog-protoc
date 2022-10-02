import { Pagination } from '../../util/pagination/pagination'
import { Post } from '../entity/post'

export interface IPostRepository {
  listPosts(pg: Pagination): Promise<[Post[]?, Error?]>
  getPost(id: number): Promise<[Post?, Error?]>
  createPost(post: Post): Promise<[Error?]>
  updatePostByID(id: number, post: Post): Promise<[Error?]>
  deletePostByID(id: number): Promise<[Error?]>
}
