export default class PaginatorLib {
  public static paginate({ data, total, page, limit = 10 }: { data: any[]; total: number; page: number; limit?: number }) {
    const totalPage = total > 0 ? Math.ceil(total / limit) : 0;
    return {
      data,
      total,
      from: 1,
      to: totalPage,
      current_page: page,
      per_page: limit,
    };
  }
}
