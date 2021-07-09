export default class PaginatorLib {
  public static paginate({ data, total, page }: { data: any[]; total: number; page: number }) {
    return {
      data,
      total,
      page,
    };
  }
}
