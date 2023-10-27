<script setup lang="ts">
import { reactive, ref, watch } from "vue"
import { addNotice, deleteNotice, updateNotice, getNoticeListPage } from "@/api/information/index"
import { type FormInstance, type FormRules, ElMessage, ElMessageBox } from "element-plus"
import { CirclePlus, Delete, RefreshRight } from "@element-plus/icons-vue"
import { usePagination } from "@/hooks/usePagination"
import { NoticeResult } from "@/api/information/types/notice"

defineOptions({
  // 命名当前组件
  name: "notice"
})

const loading = ref<boolean>(false)
const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()

//#region 增
const dialogVisible = ref<boolean>(false)
const formRef = ref<FormInstance | null>(null)
const formData = reactive({
  noticeId: "0",
  createTime: "",
  content: "",
  title: ""
})

const shortcuts = [
  {
    text: "今天",
    value: new Date()
  },
  {
    text: "昨天",
    value: () => {
      const date = new Date()
      date.setTime(date.getTime() - 3600 * 1000 * 24)
      return date
    }
  },
  {
    text: "一周前",
    value: () => {
      const date = new Date()
      date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
      return date
    }
  }
]

const disabledDate = (time: Date) => {
  datePickerValue.value = time.toString()
}

const formRules: FormRules = reactive({
  title: [{ required: true, trigger: "blur", message: "通知的标题不能为空" }],
  content: [{ required: true, trigger: "blur", message: "通知的内容不能为空" }],
  createTime: [{ required: true, trigger: "blur", message: "通知的创建时间不能为空" }]
})
const handleCreate = () => {
  formRef.value?.validate((valid: boolean, fields) => {
    if (valid) {
      if (currentUpdateId.value === undefined) {
        addNotice(formData)
          .then(() => {
            ElMessage.success("新增成功")
            getTableData()
          })
          .finally(() => {
            dialogVisible.value = false
          })
      } else {
        updateNotice({
          noticeId: formData.noticeId,
          createTime: formData.createTime,
          content: formData.content,
          title: formData.title
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
const handleDelete = (row: NoticeResult) => {
  ElMessageBox.confirm(`正在删除实验室${row.noticeId}的相关信息，确认删除？`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    deleteNotice(row.noticeId).then(() => {
      ElMessage.success("删除成功")
      getTableData()
    })
  })
}
//#endregion

//#region 批量删除
const selection = ref<NoticeResult[]>([])
const handleSelectionChange = (rows: NoticeResult[]) => {
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
    await Promise.all(selection.value.map((item) => deleteNotice(item.noticeId)))
    ElMessage.success("删除成功")
    getTableData()
  } catch (error) {
    console.error(error)
  }
}
//#endregion

//#region 改
const currentUpdateId = ref<undefined | string>(undefined)
const handleUpdate = (row: NoticeResult) => {
  currentUpdateId.value = row.noticeId

  formData.noticeId = row.noticeId
  formData.createTime = row.createTime
  formData.content = row.content
  formData.title = row.title
  dialogVisible.value = true
}
//#endregion

//#region 查
const tableData = ref<NoticeResult[]>([])
const getTableData = () => {
  loading.value = true
  getNoticeListPage({
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

  // formData.noticeId = ""
  formData.createTime = ""
  formData.content = ""
  formData.title = ""
}

const datePickerValue = ref("")
/** 监听分页参数的变化 */
watch([() => paginationData.currentPage, () => paginationData.pageSize], getTableData, { immediate: true })
watch(datePickerValue, (newDate) => {
  formData.createTime = newDate
})
</script>

<template>
  <div class="app-container">
    <el-card v-loading="loading" shadow="never">
      <div class="toolbar-wrapper">
        <div>
          <el-button type="primary" :icon="CirclePlus" @click="dialogVisible = true">新增公告</el-button>
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
          <!--          <el-table-column prop="noticeId" label="公告id" align="center" />-->
          <el-table-column prop="createTime" label="创建时间" align="center" />
          <el-table-column prop="content" label="公告内容" align="center" />
          <el-table-column prop="title" label="公告标题" align="center" />
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
      :title="currentUpdateId === undefined ? '新增公告' : '修改公告'"
      @close="resetForm"
      width="30%"
    >
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px" label-position="left">
        <!--        <el-form-item prop="noticeId" label="公告id">-->
        <!--          <el-input v-model="formData.noticeId" placeholder="请输入" />-->
        <!--        </el-form-item>-->
        <el-form-item prop="createTime" label="创建时间">
          <el-date-picker
            v-model="datePickerValue"
            type="date"
            placeholder="选择一天"
            :disabled-date="disabledDate"
            :shortcuts="shortcuts"
          />
        </el-form-item>
        <el-form-item prop="content" label="公告内容">
          <el-input v-model="formData.content" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="title" label="公告标题">
          <el-input v-model="formData.title" placeholder="请输入" />
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
