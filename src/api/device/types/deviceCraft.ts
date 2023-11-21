export interface AddEquCraftRequest {
  equipmentId: string
  attrName: string
  attrValue: string
}

//   export interface UpdateEquCraftRequest {
//     equipmentId?: string
//     params: string
//   }

export interface EquCraft {
  equipmentId?: string
  equipmentAttrId: string
  attrName: string
  attrValue: string
}

export type GetEquCraftList = ApiResponseData<EquCraft[]>
