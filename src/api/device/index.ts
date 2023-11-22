import { request } from "@/utils/service"
import type * as EquipmentList from "./types/deviceList"
import type * as EquCraftList from "./types/deviceCraft"
import { AddOrderRequest, Order, OrderVO, UpdateOrderRequest } from "@/api/device/types/order"
import { getUserById } from "@/api/user"
import { Equipment } from "./types/deviceList"
import { Project } from "@/api/project/types/project"
import { getProjectById } from "@/api/project"
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

/**
 * 根据设备id获取设备信息
 */
export function getEquipmentById(equId: string) {
  return request<ApiResponseData<Equipment>>({
    url: "equipment/" + equId,
    method: "get"
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

/** 查 */
export function getEquCraftListByEquId(equId: string) {
  return request<EquCraftList.GetEquCraftList>({
    url: "equipment/attr/list/" + equId,
    method: "get"
  })
}
//#endregion

/**
 * 添加预约
 * todo 后端还没写
 */
export function addOrder(addOrderRequest: AddOrderRequest) {
  return request({
    url: "equipment/order/add",
    method: "post",
    data: addOrderRequest
  })
}

/**
 * 删除预约
 * @param equipmentOrderId
 */
export function deleteOrderById(equipmentOrderId: string) {
  return request({
    url: "equipment/order/remove/" + equipmentOrderId,
    method: "delete"
  })
}

/**
 * 根据设备id获取设备预约列表
 */
export async function getOrdersByEquId(equId: string) {
  const orders: OrderVO[] = []
  const res = await request<ApiResponseData<Order[]>>({
    url: "equipment/order/list/" + equId,
    method: "get"
  })

  for (const item of res.data) {
    const userResponse = await getUserById(item.userId)
    const user = userResponse.data
    const username = user.username
    const project: Project = await getProjectById(item.projectId)
    const projectName = project.projectName
    const equResponse = await getEquipmentById(equId)
    const equipment = equResponse.data
    const equipmentName = equipment.equipmentName

    orders.push({
      ...item,
      username,
      projectName,
      equipmentName
    })
  }

  return orders
}

/**
 * 修改预约
 * @param updateOrderRequest
 */
export function updateOrder(updateOrderRequest: UpdateOrderRequest) {
  return request({
    url: "equipment/updateOrder",
    method: "post",
    data: updateOrderRequest
  })
}
