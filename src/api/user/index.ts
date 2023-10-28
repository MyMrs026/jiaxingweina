import type * as User from "./types/user"
import { request } from "@/utils/service"

/** 增 */
export function addUser(data: User.AddUserRequest) {
  return request({
    url: "user/add",
    method: "post",
    data
  })
}

/** 删 */
export function deleteUser(id: string) {
  return request({
    url: `user/remove/${id}`,
    method: "delete"
  })
}

/** 改 */
export function updateUser(data: User.UpdateUserRequest) {
  return request({
    url: "user/update",
    method: "put",
    data
  })
}

/** 查 */
export function getUserListPage(params: PageParams) {
  return request<User.GetUserList>({
    url: "user/page",
    method: "get",
    params
  })
}

/** 查 */
export function getUserById(id: string) {
  return request<ApiResponseData<User.User>>({
    url: `user/${id}`,
    method: "get"
  })
}

export function getUserList() {
  return request<User.GetUserList>({
    url: "user/list",
    method: "get"
  })
}
