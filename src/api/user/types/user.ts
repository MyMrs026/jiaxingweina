export interface User {
  userId: string
  username: string
  password: string
  gender: string
  tel: string
  email: string
  company: string
  userRole: string
  createTime: string
  updateTime: string
  labName: string
  mentor: string
}

export interface AddUserRequest {
  username: string
  password: string
  gender?: string
  tel: string
  email: string
  company?: string
  labName?: string
  mentor?: string
}

export interface UpdateUserRequest {
  userId: string
  username: string
  password: string
  gender: string
  tel: string
  email: string
  company?: string
  userRole?: string
  labName?: string
  mentor?: string
}

export type GetUserList = ApiResponseData<User[]>
