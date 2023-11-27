<script lang="ts" setup>
import { reactive, ref, watch } from "vue"
import { addUser, deleteUser, updateUser, getUserListPage } from "@/api/user"
import { type FormInstance, type FormRules, ElMessage, ElMessageBox } from "element-plus"
import { CirclePlus, Delete, RefreshRight } from "@element-plus/icons-vue"
import { usePagination } from "@/hooks/usePagination"
import { User } from "@/api/user/types/user"

defineOptions({
  // 命名当前组件
  name: "user"
})

const loading = ref<boolean>(false)
const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()

//#region 增
const dialogVisible = ref<boolean>(false)
const formRef = ref<FormInstance | null>(null)
const formData = reactive({
  userId: "",
  username: "",
  password: "",
  gender: "",
  tel: "",
  email: "",
  company: "",
  userRole: "",
  mentor: "",
  labName: ""
})
const formRules: FormRules = reactive({
  username: [{ required: true, trigger: "blur", message: "用户名不能为空" }],
  password: [{ required: true, trigger: "blur", message: "密码不能为空" }],
  gender: [{ required: true, trigger: "blur", message: "性别不能为空" }],
  tel: [{ required: true, trigger: "blur", message: "电话不能为空" }],
  email: [{ required: true, trigger: "blur", message: "邮箱不能为空" }],
  userRole: [{ required: true, trigger: "blur", message: "权限不能为空" }]
})
const handleCreate = () => {
  formRef.value?.validate((valid: boolean, fields) => {
    if (valid) {
      if (currentUpdateId.value === undefined) {
        addUser(formData)
          .then(() => {
            ElMessage.success("新增成功")
            getTableData()
          })
          .finally(() => {
            dialogVisible.value = false
          })
      } else {
        updateUser({
          userId: formData.userId,
          username: formData.username,
          password: formData.password,
          gender: formData.gender,
          userRole: formData.userRole,
          tel: formData.tel,
          email: formData.email,
          company: formData.company,
          labName: formData.labName,
          mentor: formData.mentor
        })
          .then(() => {
            ElMessage.success("修改成功")
            getTableData()
          })
          .finally(() => {
            dialogVisible.value = false
          })
      }
    } else {
      console.error("表单校验不通过", fields)
    }
  })
}
//#endregion

//#region 删
const handleDelete = (row: User) => {
  ElMessageBox.confirm(`正在删除用户 ${row.username}，确认删除？`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    deleteUser(row.userId).then(() => {
      ElMessage.success("删除成功")
      getTableData()
    })
  })
}
//#endregion

//#region 批量删除
const selection = ref<User[]>([])
const handleSelectionChange = (rows: User[]) => {
  selection.value = rows
}

const deleteBatch = async () => {
  if (selection.value.length === 0) {
    ElMessage.error("未选中删除目标")
    return
  }

  try {
    await ElMessageBox.confirm(`正在批量删除用户，确认删除？`, "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })

    for (const item of selection.value) {
      await deleteUser(item.userId)
    }

    ElMessage.success("删除成功")
    getTableData() // 移除不必要的 await
  } catch (error) {
    // 处理错误，如果有的话
    console.error(error)
  }
}

//#endregion

//#region 改
const currentUpdateId = ref<undefined | string>(undefined)
const handleUpdate = (row: User) => {
  currentUpdateId.value = row.userId

  formData.userId = row.userId
  formData.username = row.username
  formData.password = row.password
  formData.gender = row.gender
  formData.userRole = row.userRole
  formData.tel = row.tel
  formData.email = row.email
  formData.company = row.company
  formData.labName = row.labName
  formData.mentor = row.mentor
  dialogVisible.value = true
}
//#endregion

//#region 查
const tableData = ref<User[]>([])
const getTableData = () => {
  loading.value = true
  getUserListPage({
    cur: paginationData.currentPage,
    size: paginationData.pageSize
  })
    .then((res) => {
      paginationData.total = res.data.length
      tableData.value = res.data
    })
    .catch(() => {
      tableData.value = []
    })
    .finally(() => {
      loading.value = false
    })
}
//#endregion

const resetForm = () => {
  currentUpdateId.value = undefined

  formData.userId = ""
  formData.username = ""
  formData.password = ""
  formData.gender = ""
  formData.tel = ""
  formData.email = ""
  formData.company = ""
  formData.labName = ""
  formData.mentor = ""
}

/** 监听分页参数的变化 */
watch([() => paginationData.currentPage, () => paginationData.pageSize], getTableData, { immediate: true })
</script>

<template>
  <div class="app-container">
    <el-card v-loading="loading" shadow="never">
      <div class="toolbar-wrapper">
        <div>
          <el-button type="primary" :icon="CirclePlus" @click="dialogVisible = true">新增用户</el-button>
          <el-button type="danger" :icon="Delete" @click="deleteBatch">批量删除</el-button>
        </div>
        <div>
          <el-tooltip content="刷新当前页">
            <el-button type="primary" :icon="RefreshRight" circle @click="getTableData" />
          </el-tooltip>
        </div>
      </div>
      <div class="table-wrapper">
        <el-table show-overflow-tooltip :data="tableData" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column prop="username" label="用户名" align="center" />
          <el-table-column prop="password" label="密码" align="center" />
          <el-table-column prop="gender" label="性别" align="center" />
          <el-table-column prop="tel" label="电话" align="center" />
          <el-table-column prop="email" label="邮箱" align="center" />
          <el-table-column prop="company" label="公司" align="center" />
          <el-table-column prop="userRole" label="权限" align="center" />
          <el-table-column prop="labName" label="实验室" align="center" />
          <el-table-column prop="mentor" label="导师" align="center" />
          <el-table-column prop="createTime" label="创建时间" align="center">
            <template #default="scope">
              {{ scope.row.createTime.slice(0, 10) }}
            </template>
          </el-table-column>
          <el-table-column prop="updateTime" label="更新时间" align="center" />
          <el-table-column fixed="right" label="操作" width="150" align="center">
            <template #default="scope">
              <el-button type="primary" text bg size="small" @click="handleUpdate(scope.row)">修改</el-button>
              <el-button type="danger" text bg size="small" @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pager-wrapper">
        <el-pagination
          background
          :layout="paginationData.layout"
          :page-sizes="paginationData.pageSizes"
          :total="paginationData.total"
          :page-size="paginationData.pageSize"
          :currentPage="paginationData.currentPage"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    <!-- 新增/修改 -->
    <el-dialog
      v-model="dialogVisible"
      :title="currentUpdateId === undefined ? '新增用户' : '修改用户'"
      @close="resetForm"
      width="30%"
    >
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px" label-position="left">
        <el-form-item prop="username" label="用户名">
          <el-input v-model="formData.username" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="password" label="密码">
          <el-input v-model="formData.password" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="gender" label="性别">
          <el-input v-model="formData.gender" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="tel" label="电话">
          <el-input v-model="formData.tel" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="email" label="邮箱">
          <el-input v-model="formData.email" placeholder="请输入" />
        </el-form-item>
        <el-form-item v-if="currentUpdateId !== undefined" prop="userRole" label="权限">
          <el-input v-model="formData.userRole" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="company" label="公司">
          <el-input v-model="formData.company" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="labName" label="实验室">
          <el-input v-model="formData.labName" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="mentor" label="导师">
          <el-input v-model="formData.mentor" placeholder="请输入" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleCreate">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.search-wrapper {
  margin-bottom: 20px;
  :deep(.el-card__body) {
    padding-bottom: 2px;
  }
}

.toolbar-wrapper {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.table-wrapper {
  min-height: 28rem;
  margin-bottom: 20px;
}

.pager-wrapper {
  display: flex;
  justify-content: flex-end;
}
</style>
