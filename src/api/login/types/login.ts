export interface LoginRequestData {
  tel: string
  /** 密码 */
  password: string
}

export type UserInfoResponseData = ApiResponseData<{ username: string; roles: string[] }>
