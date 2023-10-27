export interface AddTrainingResultRequest {
  trainingApplicationId: string
  result: string
  trainingMan: string
  createTime: string
}

export interface UpdateTrainingResultRequest {
  trainingResultId: string
  trainingApplicationId: string
  result: string
  trainingMan: string
  createTime: string
}

export interface TrainingResult {
  trainingResultId: string
  trainingApplicationId: string
  result: string
  trainingMan: string
  createTime: string
}

export type GetTrainingResultList = ApiResponseData<TrainingResult[]>
