<script setup lang="ts">
import { reactive, ref, watch } from "vue"
import { addLabinform, deleteLabinform, updateLabinform, getLabinformListPage } from "@/api/information/index"
import { type FormInstance, type FormRules, ElMessage, ElMessageBox } from "element-plus"
import { CirclePlus, Delete, RefreshRight } from "@element-plus/icons-vue"
import { usePagination } from "@/hooks/usePagination"
import { LabinformResult } from "@/api/information/types/labinform"

defineOptions({
  // 命名当前组件
  name: "labinform"
})

const loading = ref<boolean>(false)
const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()

//#region 增
const dialogVisible = ref<boolean>(false)
const formRef = ref<FormInstance | null>(null)
const formData = reactive({
  labId: "",
  labAddress: "",
  labLayoutUrl: "",
  labLinkman: "",
  labName: "",
  labTel: ""
})
const formRules: FormRules = reactive({
  labName: [{ required: true, trigger: "blur", message: "实验室名不能为空" }],
  labAddress: [{ required: true, trigger: "blur", message: "实验室地址不能为空" }],
  labLinkman: [{ required: true, trigger: "blur", message: "实验室负责人不能为空" }],
  labTel: [{ required: true, trigger: "blur", message: "实验室联系电话不能为空" }]
})
const handleCreate = () => {
  formRef.value?.validate((valid: boolean, fields) => {
    if (valid) {
      if (currentUpdateId.value === undefined) {
        addLabinform(formData)
          .then(() => {
            ElMessage.success("新增成功")
            getTableData()
          })
          .finally(() => {
            dialogVisible.value = false
          })
      } else {
        updateLabinform({
          labId: formData.labId,
          labAddress: formData.labAddress,
          labLayoutUrl: formData.labLayoutUrl,
          labLinkman: formData.labLinkman,
          labName: formData.labName,
          labTel: formData.labTel
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
const handleDelete = (row: LabinformResult) => {
  ElMessageBox.confirm(`正在删除实验室${row.labId}的相关信息，确认删除？`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    deleteLabinform(row.labId).then(() => {
      ElMessage.success("删除成功")
      getTableData()
    })
  })
}
//#endregion

//#region 批量删除
const selection = ref<LabinformResult[]>([])
const handleSelectionChange = (rows: LabinformResult[]) => {
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
    await Promise.all(selection.value.map((item) => deleteLabinform(item.labId)))

    ElMessage.success("删除成功")
    getTableData()
  } catch (error) {
    console.error(error)
  }
}
//#endregion

//#region 改
const currentUpdateId = ref<undefined | string>(undefined)
const handleUpdate = (row: LabinformResult) => {
  currentUpdateId.value = row.labId

  formData.labId = row.labId
  formData.labAddress = row.labAddress
  formData.labLayoutUrl = row.labLayoutUrl
  formData.labLinkman = row.labLinkman
  formData.labName = row.labName
  formData.labTel = row.labTel
  dialogVisible.value = true
}
//#endregion

//#region 查
const tableData = ref<LabinformResult[]>([])
const getTableData = () => {
  loading.value = true
  getLabinformListPage({
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

  formData.labId = ""
  formData.labAddress = ""
  formData.labLayoutUrl = ""
  formData.labLinkman = ""
  formData.labName = ""
  formData.labTel = ""
}

/** 监听分页参数的变化 */
watch([() => paginationData.currentPage, () => paginationData.pageSize], getTableData, { immediate: true })
</script>

<template>
  <div class="app-container">
    <el-card v-loading="loading" shadow="never">
      <div class="toolbar-wrapper">
        <div>
          <el-button type="primary" :icon="CirclePlus" @click="dialogVisible = true">新增实验室信息</el-button>
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
          <el-table-column prop="labId" label="实验室id" align="center" />
          <el-table-column prop="labAddress" label="实验室地址" align="center" />
          <el-table-column prop="labLayoutUrl" label="实验室布局图" align="center" />
          <el-table-column prop="labLinkman" label="实验室负责人" align="center" />
          <el-table-column prop="labName" label="实验室名" align="center" />
          <el-table-column prop="labTel" label="实验联系电话" align="center" />
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
      :title="currentUpdateId === undefined ? '新增实验室' : '修改实验室'"
      @close="resetForm"
      width="30%"
    >
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px" label-position="left">
        <el-form-item prop="labId" label="实验室id">
          <el-input v-model="formData.labId" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="labAddress" label="实验室地址">
          <el-input v-model="formData.labAddress" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="labLayoutUrl" label="实验室布局图">
          <el-input v-model="formData.labLayoutUrl" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="labLinkman" label="实验室联系人">
          <el-input v-model="formData.labLinkman" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="labName" label="实验室名字">
          <el-input v-model="formData.labName" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="labTel" label="实验室联系电话">
          <el-input v-model="formData.labTel" placeholder="请输入" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleCreate">确认</el-button>
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
