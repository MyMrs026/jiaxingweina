<script setup lang="ts">
import { RefreshRight } from "@element-plus/icons-vue"
import { useRoute } from "vue-router"
import { reactive, ref } from "vue"
import { OrderVO, UpdateOrderRequest } from "@/api/device/types/order"
import { deleteOrderById, getOrdersByEquId, updateOrder } from "@/api/device"
import { ElMessage, FormInstance } from "element-plus"
import { formatDateTime } from "@/utils"

const route = useRoute()
const equipmentId = route.params.id + ""

const loading = ref(true)
const dialogVisible = ref(false)
const tableData = ref<OrderVO[]>([])
const getTableData = () => {
  getOrdersByEquId(equipmentId).then((res) => {
    tableData.value = res
    loading.value = false
  })
}

getTableData()

const handleDelete = (row: OrderVO) => {
  const equipmentOrderId = row.equipmentOrderId
  deleteOrderById(equipmentOrderId)
    .then(() => {
      getTableData()
      ElMessage.success("删除成功")
    })
    .catch(() => {
      ElMessage.error("删除失败")
    })
}

const selection = ref<OrderVO[]>([])

const handleSelectionChange = (rows: OrderVO[]) => {
  selection.value = rows
}

const handleUpdate = (row: OrderVO) => {
  formData.equipmentOrderId = row.equipmentOrderId
  formData.equipmentName = row.equipmentName
  formData.userId = row.userId
  formData.username = row.username
  formData.projectId = row.projectId
  formData.projectName = row.projectName
  formData.startTime = row.startTime
  formData.endTime = row.endTime
  formData.createTime = row.createTime
  formData.updateTime = row.updateTime
  showUpdateDialog.value = true
}

const showUpdateDialog = ref(false)
const formRef = ref<FormInstance | null>(null)
const formData = reactive({
  equipmentOrderId: "",
  equipmentName: "",
  userId: "",
  username: "",
  projectId: "",
  projectName: "",
  startTime: "",
  endTime: "",
  createTime: "",
  updateTime: ""
})
const resetForm = () => {
  formData.equipmentOrderId = ""
  formData.equipmentName = ""
  formData.userId = ""
  formData.username = ""
  formData.projectId = ""
  formData.projectName = ""
  formData.startTime = ""
  formData.endTime = ""
  formData.createTime = ""
  formData.updateTime = ""
}

const handleUpdateForm = () => {
  const data: UpdateOrderRequest = {
    equipmentOrderId: formData.equipmentOrderId,
    userId: formData.userId,
    projectId: formData.projectId,
    startTime: formatDateTime(formData.startTime),
    endTime: formatDateTime(formData.endTime),
    equipmentId: equipmentId
  }
  updateOrder(data)
    .then(() => {
      getTableData()
      ElMessage.success("修改成功")
      showUpdateDialog.value = false
      resetForm()
    })
    .catch(() => {
      // ElMessage.error("修改失败")
    })
}
</script>

<template>
  <div class="app-container">
    <el-card v-loading="loading" shadow="never">
      <div class="table-header">
        <el-tooltip content="刷新当前页">
          <el-button type="primary" :icon="RefreshRight" circle @click="getTableData" />
        </el-tooltip>
      </div>
      <div class="table-wrapper">
        <el-table
          :data="tableData"
          @selection-change="handleSelectionChange"
          show-overflow-tooltip
          :cell-style="
            () => {
              return { 'background-color': '#ffffff' }
            }
          "
          :default-sort="{ prop: 'createTime', order: 'descending' }"
        >
          <el-table-column fixed="left" type="selection" width="50" align="center" />
          <el-table-column prop="equipmentName" width="200" label="设备名" align="center" />
          <el-table-column prop="username" width="100" label="用户名" align="center" />
          <el-table-column prop="projectName" width="200" label="项目名" align="center" />
          <el-table-column prop="startTime" width="200" label="开始时间" align="center" />
          <el-table-column prop="endTime" width="200" label="结束时间" align="center" />
          <el-table-column prop="createTime" sortable width="200" label="申请时间" align="center" />
          <el-table-column prop="updateTime" width="200" label="更新时间" align="center" />
          <el-table-column fixed="right" width="150" label="操作" align="center">
            <template #default="scope">
              <el-button type="primary" text bg size="small" @click="handleUpdate(scope.row)">修改</el-button>
              <el-button type="danger" text bg size="small" @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
    <el-dialog v-model="showUpdateDialog" title="修改预约" @close="resetForm" width="30%">
      <el-form ref="formRef" :model="formData" label-width="100px" label-position="left">
        <el-form-item prop="username" label="用户名">
          <el-input disabled v-model="formData.username" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="projectName" label="项目名">
          <el-input disabled v-model="formData.projectName" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="equipmentName" label="设备名">
          <el-input disabled v-model="formData.equipmentName" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="startTime" label="开始时间">
          <el-date-picker v-model="formData.startTime" type="datetime" placeholder="选择开始时间" />
        </el-form-item>
        <el-form-item prop="endTime" label="结束时间">
          <el-date-picker v-model="formData.endTime" type="datetime" placeholder="选择开始时间" />
        </el-form-item>
        <el-form-item prop="createTime" label="申请时间">
          <el-date-picker disabled v-model="formData.createTime" type="datetime" placeholder="申请时间" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleUpdateForm">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
.search-wrapper {
  margin-bottom: 20px;

  :deep(.el-card__body) {
    padding-bottom: 2px;
  }
}

.table-header {
  float: right;
  margin-bottom: 10px;
}

.table-wrapper {
  margin-bottom: 20px;
}

.pager-wrapper {
  display: flex;
  justify-content: flex-end;
}
</style>
