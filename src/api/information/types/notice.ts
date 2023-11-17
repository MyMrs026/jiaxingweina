export interface AddNoticeRequest {
  noticeId?: string
  createTime: string
  content: string
  title: string
}

export interface UpdateNoticeRequest {
  noticeId: string
  createTime: string
  content: string
  title: string
}

export interface NoticeResult {
  noticeId: string
  createTime: string
  content: string
  title: string
}

export type GetNoticeResultList = ApiResponseData<NoticeResult[]>
