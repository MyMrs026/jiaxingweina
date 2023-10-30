<script lang="ts" setup>
import { reactive, ref, watch } from "vue"
import { addEquCraft, deleteEquCraft, getEquCraftListPage } from "@/api/device/index"
import { type FormInstance, type FormRules, ElMessage, ElMessageBox } from "element-plus"
import { CirclePlus, Delete, RefreshRight } from "@element-plus/icons-vue"
import { usePagination } from "@/hooks/usePagination"
import { EquCraft } from "@/api/device/types/deviceCraft"

defineOptions({
  // 命名当前组件
  name: "project"
})

const loading = ref<boolean>(false)
const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()

//#region 增
const dialogVisible = ref<boolean>(false)
const formRef = ref<FormInstance | null>(null)
const formData = reactive({
  equipmentId: "",
  equipmentAttrId: "",
  attrName: "",
  attrValue: ""
})
const formRules: FormRules = reactive({
  equipmentId: [{ required: true, trigger: "blur", message: "设备id不能为空" }],
  equipmentAttrId: [{ required: true, trigger: "blur", message: "设备工艺id不能为空" }],
  attrName: [{ required: true, trigger: "blur", message: "工艺名称不能为空" }],
  attrValue: [{ required: true, trigger: "blur", message: "工艺参数不能为空" }]
})
const handleCreate = () => {
  formRef.value?.validate((valid: boolean, fields) => {
    if (valid) {
      if (currentUpdateId.value === undefined) {
        addEquCraft(formData)
          .then(() => {
            ElMessage.success("新增成功")
            getTableData()
          })
          .finally(() => {
            dialogVisible.value = false
          })
      } else {
        // updateTraining({
        //   trainingId: formData.trainingId,
        //   equipmentId: formData.equipmentId || "",
        //   trainingName: formData.trainingName,
        //   trainingPrice: formData.trainingPrice,
        //   trainingType: formData.trainingType
        // })
        //   .then(() => {
        //     ElMessage.success("修改成功")
        //     getTableData()
        //   })
        //   .finally(() => {
        //     dialogVisible.value = false
        //   })
        console.error("表单校验不通过", fields)
      }
    }
  })
}
//#endregion

//#region 删
const handleDelete = (row: EquCraft) => {
  ElMessageBox.confirm(`正在删除工艺参数：${row.attrName}，确认删除？`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    deleteEquCraft(row.equipmentId).then(() => {
      ElMessage.success("删除成功")
      getTableData()
    })
  })
}
//#endregion

//#region 批量删除
const selection = ref<EquCraft[]>([])
const handleSelectionChange = (rows: EquCraft[]) => {
  selection.value = rows
}

const deleteBatch = () => {
  if (selection.value.length === 0) {
    ElMessage.error("未选中删除目标")
    return
  } else {
    ElMessageBox.confirm(`正在批量删除工艺参数，确认删除？`, "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        // Create an array of promises for delete operations
        const deletePromises = selection.value.map((item) => deleteEquCraft(item.equipmentId))

        // Use Promise.all to wait for all delete operations to complete
        return Promise.all(deletePromises)
      })
      .then(() => {
        ElMessage.success("删除成功")
        return getTableData()
      })
      .catch((error) => {
        console.error(error)
      })
  }
}

//#endregion

//#region 改
const currentUpdateId = ref<undefined | string>(undefined)
// const handleUpdate = (row: EquCraft) => {
//   currentUpdateId.value = row.trainingId

//   formData.equipmentId = row.equipmentId || ""
//   formData.trainingId = row.trainingId
//   formData.trainingName = row.trainingName
//   formData.trainingPrice = row.trainingPrice
//   formData.trainingType = row.trainingType
//   dialogVisible.value = true
// }
//#endregion

//#region 查
const tableData = ref<EquCraft[]>([])
const getTableData = () => {
  loading.value = true
  getEquCraftListPage({
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

// const resetForm = () => {
//   currentUpdateId.value = undefined

//   formData.equipmentId = ""
//   formData.trainingId = ""
//   formData.trainingName = ""
//   formData.trainingPrice = 0
//   formData.trainingType = ""
// }

/** 监听分页参数的变化 */
watch([() => paginationData.currentPage, () => paginationData.pageSize], getTableData, { immediate: true })
</script>

<template>
  <div class="app-container">
    <el-card v-loading="loading" shadow="never">
      <div class="toolbar-wrapper">
        <div>
          <el-button type="primary" :icon="CirclePlus" @click="dialogVisible = true">新增工艺参数</el-button>
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

          <el-table-column prop="equipmentId" label="设备id" align="center" />
          <el-table-column prop="equipmentAttrId" label="设备工艺id" align="center" />
          <el-table-column prop="attrName" label="工艺名称" align="center" />
          <el-table-column prop="attrValue" label="工艺参数" align="center" />

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
        <el-form-item prop="equipmentId" label="设备id">
          <el-input v-model="formData.equipmentId" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="equipmentAttrId" label="设备工艺id">
          <el-input v-model="formData.equipmentAttrId" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="attrName" label="工艺名称">
          <el-input v-model="formData.attrName" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="attrValue" label="工艺参数">
          <el-input v-model="formData.attrValue" placeholder="请输入" />
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
