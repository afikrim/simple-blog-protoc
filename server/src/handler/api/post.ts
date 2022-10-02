import { Metadata, StatusBuilder } from '@grpc/grpc-js'
import { Status } from '@grpc/grpc-js/build/src/constants'
import {
  sendUnaryData,
  ServerUnaryCall,
} from '@grpc/grpc-js/build/src/server-call'
import { Empty } from 'google-protobuf/google/protobuf/empty_pb'

import { IPostUseCase } from '../../core/module/post'
import {
  ErrNotFound,
  ErrNotFoundName,
} from '../../util/general-errors/general-errors'
import {
  parseCreatePostReqPb,
  parseListPostRequestToPg,
  parsePostsWithPgToPb,
  parsePostToPb,
  parseUpdatePostReqPb,
} from './mapper'
import { IPostServiceServer } from './pb/post/post_grpc_pb'
import {
  CreatePostRequest,
  DeletePostRequest,
  GetPostRequest,
  ListPostsRequest,
  ListPostsResponse,
  Post,
  UpdatePostRequest,
} from './pb/post/post_pb'

export class PostHandler {
  constructor(private readonly postSvc: IPostUseCase) {}

  async listPosts(
    call: ServerUnaryCall<ListPostsRequest, ListPostsResponse>,
    callback: sendUnaryData<ListPostsResponse>
  ): Promise<IPostServiceServer['listPosts']> {
    const pg = parseListPostRequestToPg(call.request)
    const [posts, err] = await this.postSvc.listPosts(pg)
    if (err) {
      errListPosts(err, callback)
      return
    }

    callback(null, parsePostsWithPgToPb(posts, pg))
  }

  async getPost(
    call: ServerUnaryCall<GetPostRequest, Post>,
    callback: sendUnaryData<Post>
  ): Promise<IPostServiceServer['getPost']> {
    const [post, err] = await this.postSvc.getPost(call.request.getId())
    if (err) {
      errGetPost(err, callback)
      return
    }

    callback(null, parsePostToPb(post))
  }

  async createPost(
    call: ServerUnaryCall<CreatePostRequest, any>,
    callback: sendUnaryData<any>
  ): Promise<IPostServiceServer['createPost']> {
    const [err] = await this.postSvc.createPost(
      parseCreatePostReqPb(call.request)
    )
    if (err) {
      errCreatePost(err, callback)
      return
    }

    callback(null, new Empty())
  }

  async updatePost(
    call: ServerUnaryCall<UpdatePostRequest, any>,
    callback: sendUnaryData<any>
  ): Promise<IPostServiceServer['updatePost']> {
    const [id, newReq] = parseUpdatePostReqPb(call.request)
    const [err] = await this.postSvc.updatePostByID(id, newReq)
    if (err) {
      errUpdatePost(err, callback)
      return
    }

    callback(null, new Empty())
  }

  async deletePost(
    call: ServerUnaryCall<DeletePostRequest, any>,
    callback: sendUnaryData<any>
  ): Promise<IPostServiceServer['deletePost']> {
    const [err] = await this.postSvc.deletePostByID(call.request.getId())
    if (err) {
      errDeletePost(err, callback)
      return
    }

    callback(null, new Empty())
  }

  toGrpcHandler(): IPostServiceServer {
    return {
      listPosts: this.listPosts.bind(this),
      getPost: this.getPost.bind(this),
      createPost: this.createPost.bind(this),
      updatePost: this.updatePost.bind(this),
      deletePost: this.deletePost.bind(this),
    }
  }
}

function errListPosts(
  err: any,
  callback: sendUnaryData<ListPostsResponse>
): void {
  // TODO: Log the error
  console.log(err)
  callback(err, undefined)
}

function errGetPost(err: any, callback: sendUnaryData<Post>): void {
  if (err instanceof ErrNotFound) {
    const metadata = new Metadata()
    metadata.add('error-name', ErrNotFoundName)
    metadata.add('error-message', err.message)

    const status = new StatusBuilder()
    status.withCode(Status.NOT_FOUND)
    status.withDetails((err as ErrNotFound).message)
    status.withMetadata(metadata)

    callback(status.build())
    return
  }

  // TODO: Log the error
  console.log(err)
  callback(err, undefined)
}

function errCreatePost(err: any, callback: sendUnaryData<any>): void {
  // TODO: Log the error
  console.log(err)
  callback(err, undefined)
}

function errUpdatePost(err: any, callback: sendUnaryData<any>): void {
  if (err instanceof ErrNotFound) {
    const metadata = new Metadata()
    metadata.add('error-name', ErrNotFoundName)
    metadata.add('error-message', err.message)

    const status = new StatusBuilder()
    status.withCode(Status.NOT_FOUND)
    status.withDetails((err as ErrNotFound).message)
    status.withMetadata(metadata)

    callback(status.build())
    return
  }

  // TODO: Log the error
  console.log(err)
  callback(err, undefined)
}

function errDeletePost(err: any, callback: sendUnaryData<any>): void {
  if (err instanceof ErrNotFound) {
    const metadata = new Metadata()
    metadata.add('error-name', ErrNotFoundName)
    metadata.add('error-message', err.message)

    const status = new StatusBuilder()
    status.withCode(Status.NOT_FOUND)
    status.withDetails((err as ErrNotFound).message)
    status.withMetadata(metadata)

    callback(status.build())
    return
  }

  // TODO: Log the error
  console.log(err)
  callback(err, undefined)
}
