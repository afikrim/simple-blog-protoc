import {
  CreatePostRequest,
  Post,
  UpdatePostRequest,
} from '../../core/entity/post'
import { Order, Pagination } from '../../util/pagination/pagination'
import {
  CreatePostRequest as CreatePostRequestPb,
  ListPostsRequest as ListPostsRequestPb,
  ListPostsResponse as ListPostsResponsePb,
  OrderMap as OrderMapPb,
  Post as PostPb,
  UpdatePostRequest as UpdatePostRequestPb,
} from './pb/post/post_pb'

export function parseListPostRequestToPg(req: ListPostsRequestPb): Pagination {
  const pg = new Pagination()
  pg.page = req.getPage()
  pg.pageSize = req.getPagesize()
  pg.sort = req.getSort()
  pg.order = parseOrderPbToPgOrder(req.getOrder())

  return pg
}

export function parseOrderPbToPgOrder(
  orderMap: OrderMapPb[keyof OrderMapPb]
): Order {
  var OrderMapASC: OrderMapPb['ORDER_ASC']
  var OrderMapDESC: OrderMapPb['ORDER_DESC']

  switch (orderMap) {
    case OrderMapASC:
      return Order.ASC
    case OrderMapDESC:
      return Order.DESC
    default:
      return Order.ASC
  }
}

export function parsePostToPb(post: Post): PostPb {
  const pb = new PostPb()
  pb.setId(post.id)
  pb.setTitle(post.title)
  pb.setContent(post.content)

  return pb
}

export function parsePostsWithPgToPb(
  posts: Post[],
  pg: Pagination
): ListPostsResponsePb {
  const res = new ListPostsResponsePb()
  res.setTotalpages(pg.totalPages)

  const postsPb = posts.map((post) => parsePostToPb(post))
  res.setPostsList(postsPb)

  return res
}

export function parseCreatePostReqPb(
  reqPb: CreatePostRequestPb
): CreatePostRequest {
  const req = new CreatePostRequest()
  req.title = reqPb.getTitle()
  req.content = reqPb.getContent()

  return req
}

export function parseUpdatePostReqPb(
  reqPb: UpdatePostRequestPb
): [number, UpdatePostRequest] {
  const req = new UpdatePostRequest()
  req.title = reqPb.getTitle()
  req.content = reqPb.getContent()

  return [reqPb.getId(), req]
}
