export default class PaginatorLib {
  public static paginate({ data, total, page, limit = 10 }: { data: any[]; total: number; page: number; limit?: number }) {
    return {
      data,
      total,
      page,
      limit,
      totalPage: total > 0 ? Math.ceil(total / limit) : 0,
    };
  }
}
