export interface AddEquipmentRequest {
  advanceTime: number
  area: string
  createTime: string
  documentUrl: string
  equipmentCategory: string
  equipmentFunction: string
  equipmentId?: number
  equipmentImageUrl: string
  equipmentName: string
  equipmentStatus: number
  labName: string
  linkman: string
  linkmanTel: string
  machineLabel: string
  manufacturer: string
  payment: number
  placementLocation: string
  remark: string
  specificationModel: string
  updateTime: string
}

export interface UpdateEquipmentRequest {
  advanceTime: number
  area: string
  createTime: string
  documentUrl: string
  equipmentCategory: string
  equipmentFunction: string
  equipmentId?: number
  equipmentImageUrl: string
  equipmentName: string
  equipmentStatus: number
  labName: string
  linkman: string
  linkmanTel: string
  machineLabel: string
  manufacturer: string
  payment: number
  placementLocation: string
  remark: string
  specificationModel: string
  updateTime: string
}

export interface Equipment {
  advanceTime: number
  area: string
  createTime: string
  documentUrl: string
  equipmentCategory: string
  equipmentFunction: string
  equipmentId: number
  equipmentImageUrl: string
  equipmentName: string
  equipmentStatus: number
  labName: string
  linkman: string
  linkmanTel: string
  machineLabel: string
  manufacturer: string
  payment: number
  placementLocation: string
  remark: string
  specificationModel: string
  updateTime: string
}
export type GetEquipmentList = ApiResponseData<Equipment[]>
