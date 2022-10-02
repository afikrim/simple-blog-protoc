// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { ChannelCredentials } from '@grpc/grpc-js'
import type { NextApiRequest, NextApiResponse } from 'next'
import { PostServiceClient } from '../../../client/pb/blog/post/post_grpc_pb'
import {
  ListPostsRequest,
  ListPostsResponse,
} from '../../../client/pb/blog/post/post_pb'

type Post = {
  id: number
  title: string
  content: string
}

type PostsResponse = {
  posts: Post[]
  page: number
  pageSize: number
  totalPages: number
}

type Data<T = any> = {
  status: 'success' | 'error'
  data?: T
  message: string
}

function listPosts(req: ListPostsRequest): Promise<ListPostsResponse> {
  const postClient = new PostServiceClient(
    'localhost:9090',
    ChannelCredentials.createInsecure()
  )

  return new Promise((resolve, reject) => {
    postClient.listPosts(req, (err, response) => {
      if (err) {
        reject(err)
      }
      if (response === null || response === undefined) {
        reject(new Error('response is null or undefined'))
      }

      resolve(response as ListPostsResponse)
    })
  })
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data<PostsResponse | undefined>>
) {
  const queryPage = req.query['page']
  const queryPageSize = req.query['pageSize']

  const listPostsRequest = new ListPostsRequest()
  if (queryPage) {
    listPostsRequest.setPage(parseInt(queryPage as string))
  }
  if (queryPageSize) {
    listPostsRequest.setPagesize(parseInt(queryPageSize as string))
  }

  let response: ListPostsResponse
  try {
    response = await listPosts(listPostsRequest)
  } catch (err) {
    return res
      .status(500)
      .json({ status: 'error', message: (err as any as Error).message })
  }

  const posts = response.getPostsList().map((post) => ({
    id: post.getId(),
    title: post.getTitle(),
    content: post.getContent(),
  }))
  const page = response.getPage()
  const pageSize = response.getPagesize()
  const totalPages = response.getTotalpages()

  return res.status(200).json({
    status: 'success',
    data: {
      posts,
      page,
      pageSize,
      totalPages,
    },
    message: 'Successfully fetched posts',
  })
}
