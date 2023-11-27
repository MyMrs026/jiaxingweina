export interface OrderVO {
  equipmentOrderId: string
  equipmentName: string
  userId: string
  username: string
  projectId: string
  projectName: string
  startTime: string
  endTime: string
  createTime: string
  updateTime: string
}

export interface Order {
  equipmentOrderId: string
  userId: string
  projectId: string
  startTime: string
  endTime: string
  createTime: string
  updateTime: string
}

export interface AddOrderRequest {
  userId: string
  projectId: string
  startTime: string
  endTime: string
  equipmentId: string
}

export interface UpdateOrderRequest {
  equipmentOrderId: string
  equipmentId: string
  projectId: string
  startTime: string
  endTime: string
}

export interface UpdateOrderRequest {
  equipmentOrderId: string
  equipmentId: string
  projectId: string
  startTime: string
  endTime: string
  userId: string
}
