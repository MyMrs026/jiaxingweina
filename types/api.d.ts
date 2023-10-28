/** 所有 api 接口的响应数据都应该准守该格式 */
interface ApiResponseData<T> {
  code: number
  data: T
  message: string
}

/**
 * 分页参数
 */
interface PageParams {
  /** 当前页码 */
  cur: number
  /** 查询条数 */
  size: number
}
