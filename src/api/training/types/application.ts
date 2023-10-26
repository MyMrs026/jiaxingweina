export interface AddTrainingApplicationRequest {
  userId: string
  trainingId: string
  applicationStatus: number
  createTime: string
}

export interface UpdateTrainingApplicationRequest {
  trainingApplicationId: string
  userId: string
  trainingId: string
  applicationStatus: number
  createTime: string
}

export interface TrainingApplication {
  trainingApplicationId: string
  userId: string
  trainingId: string
  applicationStatus: number
  createTime: string
}

export type GetTrainingApplicationList = ApiResponseData<TrainingApplication[]>
