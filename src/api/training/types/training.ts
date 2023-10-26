export interface AddTrainingRequest {
  equipmentId?: string
  trainingName: string
  trainingPrice: number
  trainingType: string
}

export interface UpdateTrainingRequest {
  trainingId: string
  equipmentId?: string
  trainingName: string
  trainingPrice: number
  trainingType: string
}

export interface Training {
  trainingId: string
  equipmentId?: string
  trainingName: string
  trainingPrice: number
  trainingType: string
}

export type GetTrainingList = ApiResponseData<Training[]>
