import { request } from "@/utils/service"
import type * as TrainingProject from "./types/training"
import type * as TrainingApplication from "./types/application"
import type * as TrainingResult from "./types/result"

interface PageParams {
  /** 当前页码 */
  cur: number
  /** 查询条数 */
  size: number
}

//#region 培训项目
/** 增 */
export function addTraining(data: TrainingProject.AddTrainingRequest) {
  return request({
    url: "training/add",
    method: "post",
    data
  })
}

/** 删 */
export function deleteTraining(id: string) {
  return request({
    url: `training/remove/${id}`,
    method: "delete"
  })
}

/** 改 */
export function updateTraining(data: TrainingProject.UpdateTrainingRequest) {
  return request({
    url: "training/update",
    method: "put",
    data
  })
}

/** 查 */
export function getTrainingListPage(params: PageParams) {
  return request<TrainingProject.GetTrainingList>({
    url: "training/page",
    method: "get",
    params
  })
}
//#endregion

//#region 培训申请
/** 增 */
export function addTrainingApplication(data: TrainingApplication.AddTrainingApplicationRequest) {
  return request({
    url: "training/application/add",
    method: "post",
    data
  })
}

/** 删 */
export function deleteTrainingApplication(id: string) {
  return request({
    url: `training/application/remove/${id}`,
    method: "delete"
  })
}

/** 改 */
export function updateTrainingApplication(data: TrainingApplication.UpdateTrainingApplicationRequest) {
  return request({
    url: "training/application/update",
    method: "put",
    data
  })
}

/** 查 */
export function getTrainingApplicationListPage(params: PageParams) {
  return request<TrainingApplication.GetTrainingApplicationList>({
    url: "training/application/page",
    method: "get",
    params
  })
}
//#endregion

//#region 培训结果
/** 增 */
export function addTrainingResult(data: TrainingResult.AddTrainingResultRequest) {
  return request({
    url: "training/result/add",
    method: "post",
    data
  })
}

/** 删 */
export function deleteTrainingResult(id: string) {
  return request({
    url: `training/result/remove/${id}`,
    method: "delete"
  })
}

/** 改 */
export function updateTrainingResult(data: TrainingResult.UpdateTrainingResultRequest) {
  return request({
    url: "training/result/update",
    method: "put",
    data
  })
}

/** 查 */
export function getTrainingResultListPage(params: PageParams) {
  return request<TrainingResult.GetTrainingResultList>({
    url: "training/result/page",
    method: "get",
    params
  })
}
//#endregion
