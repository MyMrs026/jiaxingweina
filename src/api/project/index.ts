import { request } from "@/utils/service"
import { Project } from "@/api/project/types/project"

export async function getProjectById(id: string): Promise<Project> {
  const res = await request<ApiResponseData<any>>({
    url: "project/" + id,
    method: "get"
  })
  return res.data.project
}
