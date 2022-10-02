// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { ChannelCredentials } from '@grpc/grpc-js'
import type { NextApiRequest, NextApiResponse } from 'next'
import { PostServiceClient } from '../../../client/pb/blog/post/post_grpc_pb'
import {
  GetPostRequest,
  ListPostsRequest,
  ListPostsResponse,
  Post as PostPb,
} from '../../../client/pb/blog/post/post_pb'

type Post = {
  id: number
  title: string
  content: string
}

type Data<T = any> = {
  status: 'success' | 'error'
  data?: T
  message: string
}

function getPost(req: GetPostRequest): Promise<PostPb> {
  const postClient = new PostServiceClient(
    'localhost:9090',
    ChannelCredentials.createInsecure()
  )

  return new Promise((resolve, reject) => {
    postClient.getPost(req, (err, response) => {
      if (err) {
        reject(err)
      }
      if (response === null || response === undefined) {
        reject(new Error('response is null or undefined'))
      }

      resolve(response as PostPb)
    })
  })
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data<Post | undefined>>
) {
  const paramId = req.query['id'] as string
  if (!paramId) {
    return res.status(400).json({
      status: 'error',
      message: 'id is required',
    })
  }

  const getPostRequest = new GetPostRequest()
  getPostRequest.setId(parseInt(paramId))

  let response: PostPb
  try {
    response = await getPost(getPostRequest)
  } catch (err) {
    return res
      .status(500)
      .json({ status: 'error', message: (err as any as Error).message })
  }

  const post = {
    id: response.getId(),
    title: response.getTitle(),
    content: response.getContent(),
  }

  return res.status(200).json({
    status: 'success',
    data: post,
    message: 'Successfully fetched post',
  })
}
