export enum Order {
  ASC = 'ASC',
  DESC = 'DESC',
}

const defaultPage = 1
const defaultPageSize = 10
const defaultOrder = Order.ASC
const defaultSort = 'created_at'

export class Pagination {
  page: number
  pageSize: number
  total: number
  totalPages: number

  order: Order
  sort: string

  validate(): void {
    if (!this.page) {
      this.page = defaultPage
    }

    if (!this.pageSize) {
      this.pageSize = defaultPageSize
    }

    if (!this.order) {
      this.order = defaultOrder
    }

    if (!this.sort) {
      this.sort = defaultSort
    }
  }
}
