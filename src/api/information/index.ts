import { request } from "@/utils/service"
import type * as LabinformResult from "./types/labinform"
import type * as NoticeResult from "./types/notice"

interface PageParams {
  /** 当前页码 */
  cur: number
  /** 查询条数 */
  size: number
}

//#region 实验室信息
/** 增 */
export function addLabinform(data: LabinformResult.AddLabinformRequest) {
  return request({
    url: "lab/add",
    method: "post",
    data
  })
}

/** 删 */
export function deleteLabinform(id: string) {
  return request({
    url: `lab/remove/${id}`,
    method: "delete"
  })
}

/** 改 */
export function updateLabinform(data: LabinformResult.UpdateLabinformRequest) {
  return request({
    url: "lab/update",
    method: "put",
    data
  })
}

/** 查 */
export function getLabinformListPage(params: PageParams) {
  return request<LabinformResult.GetLabResultList>({
    url: "lab/page",
    method: "get",
    params
  })
}
//#endregion

//#region 公告信息
/** 增 */
export function addNotice(data: NoticeResult.AddNoticeRequest) {
  return request({
    url: "message/notice/add",
    method: "post",
    data
  })
}

/** 删 */
export function deleteNotice(id: string) {
  return request({
    url: `message/notice/remove/${id}`,
    method: "delete"
  })
}

/** 改 */
export function updateNotice(data: NoticeResult.UpdateNoticeRequest) {
  return request({
    url: "message/notice/update",
    method: "put",
    data
  })
}

/** 查询 */

export function getNoticeListPage(params: PageParams) {
  return request<NoticeResult.GetNoticeResultList>({
    url: "message/notice/page",
    method: "get",
    params
  })
}
//#endregion
