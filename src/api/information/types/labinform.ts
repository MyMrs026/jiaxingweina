export interface AddLabinformRequest {
  labId?: string
  labAddress: string
  labLayoutUrl: string
  labLinkman: string
  labName: string
  labTel: string
}

export interface UpdateLabinformRequest {
  labId?: string
  labAddress: string
  labLayoutUrl: string
  labLinkman: string
  labName: string
  labTel: string
}

export interface LabinformResult {
  labId?: string
  labAddress: string
  labLayoutUrl: string
  labLinkman: string
  labName: string
  labTel: string
}

export type GetLabResultList = ApiResponseData<LabinformResult[]>
