<script lang="ts" setup>
import { reactive, ref, watch } from "vue"
import {
  addEquipment,
  deleteEquipment,
  updateEquipment,
  getEquipmentListPage,
  getEquCraftListByEquId,
  addEquCraft,
  deleteEquCraft
} from "@/api/device"
import { type FormInstance, type FormRules, ElMessage, ElMessageBox } from "element-plus"
import { CirclePlus, Delete, RefreshRight } from "@element-plus/icons-vue"
import { usePagination } from "@/hooks/usePagination"
import { Equipment } from "@/api/device/types/deviceList"
import { EquCraft } from "@/api/device/types/deviceCraft"

defineOptions({
  // 命名当前组件
  name: "EquipmentList"
})
const loading = ref<boolean>(false)
const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()

//#region 增
const dialogVisible = ref<boolean>(false)
const formRef = ref<FormInstance | null>(null)
const formData = reactive({
  advanceTime: 0,
  area: "",
  createTime: "",
  documentUrl: "",
  equipmentCategory: "",
  equipmentFunction: "",
  equipmentId: 0,
  equipmentImageUrl: "",
  equipmentName: "",
  equipmentStatus: 0,
  labName: "",
  linkman: "",
  linkmanTel: "",
  machineLabel: "",
  manufacturer: "",
  payment: 0,
  placementLocation: "",
  remark: "",
  specificationModel: "",
  updateTime: ""
})
const formRules: FormRules = reactive({
  // equipmentId: [{ required: true, trigger: "blur", message: "设备id不能为空" }],
  equipmentName: [{ required: true, trigger: "blur", message: "设备名称不能为空" }],
  equipmentFunction: [{ required: true, trigger: "blur", message: "设备功能不能为空" }],
  equipmentCategory: [{ required: true, trigger: "blur", message: "设备类型不能为空" }],
  equipmentImageUrl: [{ required: true, trigger: "blur", message: "设备图片不能为空" }],
  linkman: [{ required: true, trigger: "blur", message: "联系人不能为空" }],
  linkmanTel: [{ required: true, trigger: "blur", message: "联系方式不能为空" }],
  payment: [{ required: true, trigger: "blur", message: "机时价格不能为空" }],
  placementLocation: [{ required: true, trigger: "blur", message: "放置地点不能为空" }]
})
const handleCreate = () => {
  formRef.value?.validate((valid: boolean, fields) => {
    if (valid) {
      if (currentUpdateId.value === undefined) {
        addEquipment(formData)
          .then(() => {
            ElMessage.success("新增成功")
            getTableData()
          })
          .finally(() => {
            dialogVisible.value = false
          })
      } else {
        updateEquipment({
          advanceTime: formData.advanceTime || "",
          area: formData.area,
          createTime: formData.createTime || "",
          documentUrl: formData.documentUrl,
          equipmentCategory: formData.equipmentCategory,
          equipmentFunction: formData.equipmentFunction,
          equipmentId: formData.equipmentId || "",
          equipmentImageUrl: formData.equipmentImageUrl,
          equipmentName: formData.equipmentName,
          equipmentStatus: formData.equipmentStatus,
          labName: formData.labName,
          linkman: formData.linkman,
          linkmanTel: formData.linkmanTel,
          machineLabel: formData.machineLabel,
          manufacturer: formData.manufacturer,
          payment: formData.payment,
          placementLocation: formData.placementLocation,
          remark: formData.remark,
          specificationModel: formData.specificationModel,
          updateTime: formData.updateTime || ""
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
const handleDelete = (row: Equipment) => {
  ElMessageBox.confirm(`正在删除设备信息${row.equipmentName}，确认删除？`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    deleteEquipment(row.equipmentId).then(() => {
      ElMessage.success("删除成功")
      getTableData()
    })
  })
}
//#endregion

//#region 批量删除
const selection = ref<Equipment[]>([])
const handleSelectionChange = (rows: Equipment[]) => {
  selection.value = rows
}

const deleteBatch = () => {
  if (selection.value.length === 0) {
    ElMessage.error("未选中删除目标")
    return
  } else {
    ElMessageBox.confirm(`正在批量删除设备信息，确认删除？`, "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        // Create an array of promises for delete operations
        const deletePromises = selection.value.map((item) => deleteEquipment(item.equipmentId))

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
const handleUpdate = (row: Equipment) => {
  currentUpdateId.value = row.equipmentId

  formData.advanceTime = row.advanceTime || ""
  formData.area = row.area
  formData.createTime = row.createTime || ""
  formData.documentUrl = row.documentUrl
  formData.equipmentCategory = row.equipmentCategory
  formData.equipmentFunction = row.equipmentFunction
  formData.equipmentId = row.equipmentId || ""
  formData.equipmentImageUrl = row.equipmentImageUrl
  formData.equipmentName = row.equipmentName
  formData.equipmentStatus = row.equipmentStatus
  formData.labName = row.labName
  formData.linkman = row.linkman
  formData.linkmanTel = row.linkmanTel
  formData.machineLabel = row.machineLabel
  formData.manufacturer = row.manufacturer
  formData.payment = row.payment
  formData.placementLocation = row.placementLocation
  formData.remark = row.remark
  formData.specificationModel = row.specificationModel
  formData.updateTime = row.updateTime || ""
  dialogVisible.value = true
}
//#endregion

//#region 查
const tableData = ref<Equipment[]>([])
const getTableData = () => {
  loading.value = true
  getEquipmentListPage({
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

  formData.advanceTime = 0
  formData.area = ""
  formData.createTime = ""
  formData.documentUrl = ""
  formData.equipmentCategory = ""
  formData.equipmentFunction = ""
  formData.equipmentId = 0
  formData.equipmentImageUrl = ""
  formData.equipmentName = ""
  formData.equipmentStatus = 0
  formData.labName = ""
  formData.linkman = ""
  formData.linkmanTel = ""
  formData.machineLabel = ""
  formData.manufacturer = ""
  formData.payment = 0
  formData.placementLocation = ""
  formData.remark = ""
  formData.specificationModel = ""
  formData.updateTime = ""
}

// 工艺参数
const showParams = ref<boolean>(false)
const params = ref<EquCraft[]>([])
const newParamForm = reactive({
  attrName: "",
  attrValue: "",
  equipmentId: ""
})
const handleShowParams = (raw: Equipment) => {
  const equId = raw.equipmentId + ""
  getParamsData(equId)
  newParamForm.equipmentId = equId
  showParams.value = true
}

const getParamsData = (equId: string) => {
  getEquCraftListByEquId(equId).then((res) => {
    console.log(res.data)
    params.value = res.data
  })
}

const newParamRules: FormRules = reactive({
  attrName: [{ required: true, trigger: "blur", message: "设备名称不能为空" }],
  attrValue: [{ required: true, trigger: "blur", message: "设备功能不能为空" }]
})

const newParamFormRef = ref<FormInstance | null>(null)

const handleCreateParam = () => {
  newParamFormRef.value?.validate((valid: boolean) => {
    if (valid) {
      addEquCraft(newParamForm).then(() => {
        ElMessage.success("新增成功")
        getParamsData(newParamForm.equipmentId)
        resetAddParam()
      })
    }
  })
}

const handleDeleteParam = (raw: EquCraft) => {
  console.log(raw)
  deleteEquCraft(raw.equipmentAttrId).then(() => {
    ElMessage.success("删除成功")
    getParamsData(newParamForm.equipmentId)
  })
}
const resetAddParam = () => {
  newParamForm.attrName = ""
  newParamForm.attrValue = ""
}

const cellStyle = () => {
  return { "background-color": "#ffffff" }
}
// function cellStyle({columnIndex}: { columnIndex: number }): { [key: string]: string } {
// 这里可以根据需要设置不同列的背景颜色
// if (columnIndex === 0) {
//   return { 'background-color': 'lightblue' };
// } else {
//   return { 'background-color': 'lightgreen' };
// }

/** 监听分页参数的变化 */
watch([() => paginationData.currentPage, () => paginationData.pageSize], getTableData, { immediate: true })
</script>

<template>
  <div class="app-container">
    <el-card v-loading="loading" shadow="never">
      <div class="toolbar-wrapper">
        <div>
          <el-button type="primary" :icon="CirclePlus" @click="dialogVisible = true">新增设备信息</el-button>
          <el-button type="danger" :icon="Delete" @click="deleteBatch">批量删除</el-button>
        </div>
        <div>
          <el-tooltip content="刷新当前页">
            <el-button type="primary" :icon="RefreshRight" circle @click="getTableData" />
          </el-tooltip>
        </div>
      </div>
      <div class="table-wrapper">
        <el-table
          :data="tableData"
          @selection-change="handleSelectionChange"
          show-overflow-tooltip
          :cell-style="cellStyle"
        >
          <el-table-column fixed="left" type="selection" width="50" align="center" />
          <el-table-column prop="equipmentName" width="200" label="设备名称" align="center" />
          <el-table-column prop="advanceTime" label="提前时间" align="center" />
          <el-table-column prop="area" width="100" label="地区" align="center" />
          <!--          <el-table-column prop="documentUrl" label="说明书" align="center" />-->
          <el-table-column prop="equipmentCategory" label="设备类别" align="center" />
          <el-table-column prop="equipmentFunction" label="设备功能" align="center" />
          <el-table-column prop="equipmentImageUrl" label="设备图片" align="center" />
          <el-table-column prop="equipmentStatus" label="设备状态" align="center" />
          <el-table-column prop="linkman" label="联系人" align="center" />
          <el-table-column prop="linkmanTel" label="联系方式" align="center" />
          <el-table-column prop="payment" label="机时价格" align="center" />
          <el-table-column prop="labName" width="100" label="实验室名称" align="center" />
          <el-table-column prop="placementLocation" label="放置地点" align="center" />
          <el-table-column prop="remark" label="描述" align="center" />
          <el-table-column prop="specificationModel" label="规格型号" align="center" />
          <el-table-column prop="machineLabel" label="设备标签" align="center" />
          <el-table-column prop="manufacturer" label="制造商" align="center" />
          <el-table-column prop="createTime" label="创建时间" align="center" />
          <el-table-column prop="updateTime" label="更新时间" align="center" />
          <el-table-column fixed="right" label="操作" width="230" align="center">
            <template #default="scope">
              <el-button type="primary" text bg size="small" @click="handleUpdate(scope.row)">修改</el-button>
              <el-button type="danger" text bg size="small" @click="handleDelete(scope.row)">删除</el-button>
              <el-button type="info" text bg size="small" @click="handleShowParams(scope.row)">工艺参数</el-button>
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
        <el-form-item prop="advanceTime" label="提前时间">
          <el-input v-model="formData.advanceTime" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="area" label="地区">
          <el-input v-model="formData.area" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="createTime" label="开始时间">
          <el-input v-model="formData.createTime" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="documentUrl" label="说明">
          <el-input v-model="formData.documentUrl" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="equipmentCategory" label="设备类别">
          <el-input v-model="formData.equipmentCategory" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="equipmentFunction" label="设备功能">
          <el-input v-model="formData.equipmentFunction" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="equipmentId" label="设备id">
          <el-input v-model="formData.equipmentId" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="equipmentImageUrl" label="设备图片">
          <el-input v-model="formData.equipmentImageUrl" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="equipmentName" label="设备名称">
          <el-input v-model="formData.equipmentName" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="equipmentStatus" label="设备状态">
          <el-input v-model="formData.equipmentStatus" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="labName" label="实验室名称">
          <el-input v-model="formData.labName" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="linkman" label="联系人">
          <el-input v-model="formData.linkman" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="linkmanTel" label="联系方式">
          <el-input v-model="formData.linkmanTel" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="machineLabel" label="设备标签">
          <el-input v-model="formData.machineLabel" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="manufacturer" label="制造商">
          <el-input v-model="formData.manufacturer" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="payment" label="机时价格">
          <el-input v-model="formData.payment" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="placementLocation" label="放置地点">
          <el-input v-model="formData.placementLocation" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="remark" label="描述">
          <el-input v-model="formData.remark" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="specificationModel" label="规格型号">
          <el-input v-model="formData.specificationModel" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="updateTime" label="更新时间">
          <el-input v-model="formData.updateTime" placeholder="请输入" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleCreate">确认</el-button>
      </template>
    </el-dialog>
    <!-- 设备工艺参数 -->
    <el-dialog v-model="showParams" title="工艺参数">
      <el-form inline :model="newParamForm" :rules="newParamRules" ref="newParamFormRef">
        <el-form-item label="参数" prop="attrName">
          <el-input v-model="newParamForm.attrName" placeholder="请输入参数名" />
        </el-form-item>
        <el-form-item label="默认" prop="attrValue">
          <el-input v-model="newParamForm.attrValue" placeholder="请输入默认值" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleCreateParam">新增</el-button>
          <el-button type="primary" @click="resetAddParam">重置</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="params">
        <el-table-column property="attrName" label="参数名" />
        <el-table-column property="attrValue" label="默认值" />
        <el-table-column label="操作">
          <template #default="scope">
            <el-button type="danger" @click="handleDeleteParam(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
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
