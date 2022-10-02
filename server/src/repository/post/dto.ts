import { Expose } from 'class-transformer'
import { Post } from '../../core/entity/post'

export const postTable = 'post'
export const postIDColumn = 'id'
export const postTitleColumn = 'title'
export const postContentColumn = 'content'
export const postCreatedAtColumn = 'created_at'
export const postUpdatedAtColumn = 'updated_at'

export type RawResult = Record<string, any>
export type RawResults = Array<RawResult>

export class PostDto {
  @Expose({ name: postIDColumn })
  id: number

  @Expose({ name: postTitleColumn })
  title: string

  @Expose({ name: postContentColumn })
  content: string

  @Expose({ name: postCreatedAtColumn })
  createdAt: Date

  @Expose({ name: postUpdatedAtColumn })
  updatedAt: Date

  toEntity(): Post {
    const post = new Post()
    post.id = this.id
    post.title = this.title
    post.content = this.content

    return post
  }

  static fromEntity(post: Post): PostDto {
    const dto = new PostDto()
    dto.title = post.title
    dto.content = post.content

    return dto
  }
}

export type PostDtos = Array<PostDto>
