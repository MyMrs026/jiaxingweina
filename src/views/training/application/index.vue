<script lang="ts" setup>
import { reactive, ref, watch } from "vue"
import {
  addTrainingApplication,
  deleteTrainingApplication,
  updateTrainingApplication,
  getTrainingApplicationListPage
} from "@/api/training/index"
import { type FormInstance, type FormRules, ElMessage, ElMessageBox } from "element-plus"
import { CirclePlus, Delete, RefreshRight } from "@element-plus/icons-vue"
import { usePagination } from "@/hooks/usePagination"
import { TrainingApplication } from "@/api/training/types/application"

defineOptions({
  // 命名当前组件
  name: "application"
})

const loading = ref<boolean>(false)
const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()

//#region 增
const dialogVisible = ref<boolean>(false)
const formRef = ref<FormInstance | null>(null)
const formData = reactive({
  trainingApplicationId: "",
  userId: "",
  trainingId: "",
  applicationStatus: 0,
  createTime: ""
})
const formRules: FormRules = reactive({
  // equipmentId: [{ required: true, trigger: "blur", message: "设备id不能为空" }],
  trainingName: [{ required: true, trigger: "blur", message: "培训名不能为空" }],
  trainingPrice: [{ required: true, trigger: "blur", message: "价格不能为空" }],
  trainingType: [{ required: true, trigger: "blur", message: "培训类型不能为空" }]
})
const handleCreate = () => {
  formRef.value?.validate((valid: boolean, fields) => {
    if (valid) {
      if (currentUpdateId.value === undefined) {
        addTrainingApplication(formData)
          .then(() => {
            ElMessage.success("新增成功")
            getTableData()
          })
          .finally(() => {
            dialogVisible.value = false
          })
      } else {
        updateTrainingApplication({
          trainingApplicationId: formData.trainingId,
          userId: formData.userId,
          trainingId: formData.trainingId,
          applicationStatus: formData.applicationStatus,
          createTime: formData.createTime
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
const handleDelete = (row: TrainingApplication) => {
  ElMessageBox.confirm(`正在删除用户${row.userId}的申请，确认删除？`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    deleteTrainingApplication(row.trainingApplicationId).then(() => {
      ElMessage.success("删除成功")
      getTableData()
    })
  })
}
//#endregion

//#region 批量删除
const selection = ref<TrainingApplication[]>([])
const handleSelectionChange = (rows: TrainingApplication[]) => {
  selection.value = rows
}

const deleteBatch = async () => {
  if (selection.value.length === 0) {
    ElMessage.error("未选中删除目标")
    return
  }

  try {
    await ElMessageBox.confirm(`正在批量删除培训申请，确认删除？`, "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })

    // 使用 Promise.all 等待所有删除操作完成
    await Promise.all(selection.value.map((item) => deleteTrainingApplication(item.trainingApplicationId)))

    ElMessage.success("删除成功")
    getTableData()
  } catch (error) {
    console.error(error)
  }
}
//#endregion

//#region 改
const currentUpdateId = ref<undefined | string>(undefined)
const handleUpdate = (row: TrainingApplication) => {
  currentUpdateId.value = row.trainingApplicationId

  formData.trainingApplicationId = row.trainingApplicationId
  formData.userId = row.userId
  formData.trainingId = row.trainingId
  formData.applicationStatus = row.applicationStatus
  formData.createTime = row.createTime
  dialogVisible.value = true
}
//#endregion

//#region 查
const tableData = ref<TrainingApplication[]>([])
const getTableData = () => {
  loading.value = true
  getTrainingApplicationListPage({
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

  formData.trainingApplicationId = ""
  formData.userId = ""
  formData.trainingId = ""
  formData.applicationStatus = 0
  formData.createTime = ""
}

/** 监听分页参数的变化 */
watch([() => paginationData.currentPage, () => paginationData.pageSize], getTableData, { immediate: true })
</script>

<template>
  <div class="app-container">
    <el-card v-loading="loading" shadow="never">
      <div class="toolbar-wrapper">
        <div>
          <el-button type="primary" :icon="CirclePlus" @click="dialogVisible = true">新增培训项目</el-button>
          <el-button type="danger" :icon="Delete" @click="deleteBatch">批量删除</el-button>
        </div>
        <div>
          <el-tooltip content="刷新当前页">
            <el-button type="primary" :icon="RefreshRight" circle @click="getTableData" />
          </el-tooltip>
        </div>
      </div>
      <div class="table-wrapper">
        <el-table :data="tableData" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column prop="userId" label="用户id" align="center" />
          <el-table-column prop="trainingId" label="培训项目id" align="center" />
          <el-table-column prop="applicationStatus" label="申请状态" align="center" />
          <el-table-column prop="createTime" label="创建时间" align="center" />
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
        <el-form-item prop="userId" label="用户id">
          <el-input v-model="formData.userId" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="trainingId" label="培训id">
          <el-input v-model="formData.trainingId" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="applicationStatus" label="状态">
          <el-input v-model="formData.applicationStatus" placeholder="请输入" />
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
  margin-bottom: 20px;
}

.pager-wrapper {
  display: flex;
  justify-content: flex-end;
}
</style>
