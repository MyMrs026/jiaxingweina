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

export interface TrainingApplicationEntity {
  trainingApplicationId: string
  userId: string
  username: string
  trainingId: string
  trainingName: string
  applicationStatus: number
  createTime: string
}

export type GetTrainingApplicationList = ApiResponseData<TrainingApplicationEntity[]>
