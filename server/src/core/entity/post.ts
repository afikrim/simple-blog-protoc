import { Pagination } from '../../util/pagination/pagination'

export class Post {
  id: number
  title: string
  content: string
}

export class ListPostsResponse {
  posts: Post[]
  pagination: Pagination
}

export class CreatePostRequest {
  title: string
  content: string

  validate(): [Error?] {
    if (!this.title) {
      return [new Error('Title is required')]
    }

    if (!this.content) {
      return [new Error('Content is required')]
    }

    return [undefined]
  }
}

export class UpdatePostRequest {
  title: string
  content: string
}
