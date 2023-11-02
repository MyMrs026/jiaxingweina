import { request } from "@/utils/service"
import type * as EquipmentList from "./types/deviceList"
import type * as EquCraftList from "./types/deviceCraft"
interface PageParams {
  /** 当前页码 */
  cur: number
  /** 查询条数 */
  size: number
}
//#region 单个设备信息
/** 增 */
export function addEquipment(data: EquipmentList.AddEquipmentRequest) {
  return request({
    url: "equipment/add",
    method: "post",
    data
  })
}

/** 删 */
export function deleteEquipment(id: string) {
  return request({
    url: `equipment/remove/${id}`,
    method: "delete"
  })
}

/** 改 */
export function updateEquipment(data: EquipmentList.UpdateEquipmentRequest) {
  return request({
    url: "equipment/update",
    method: "put",
    data
  })
}

/** 查 */
export function getEquipmentListPage(params: PageParams) {
  return request<EquipmentList.GetEquipmentList>({
    url: "equipment/page",
    method: "get",
    params
  })
}
//#endregion

//#region 工艺参数
/** 增 */
export function addEquCraft(data: EquCraftList.AddEquCraftRequest) {
  return request({
    url: "equipment/attr/add",
    method: "post",
    data
  })
}

/** 删 */
export function deleteEquCraft(id: string) {
  return request({
    url: `equipment/attr/remove/${id}`,
    method: "delete"
  })
}

/** 改 */
//   export function updateEquCraft(data: EquCraftList.UpdateEquCraftRequest) {
//     return request({
//       url: "equipment/update",
//       method: "put",
//       data
//     })
//   }

/** 查 */
export function getEquCraftListPage(params: PageParams) {
  return request<EquCraftList.GetEquCraftList>({
    url: "equipment/page",
    method: "get",
    params
  })
}
//#endregion
