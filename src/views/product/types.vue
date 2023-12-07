<script setup lang="ts">
import { addProductType, deleteProductType, getProductTypeList, updateProductType } from "@/api/product"
import { reactive, ref } from "vue"
import { ProductType } from "@/api/product/types/product"
import { ElMessage, ElMessageBox, FormInstance, FormRules } from "element-plus"

const tableData = ref<ProductType[]>([])

const getTableData = () => {
  getProductTypeList().then((res) => (tableData.value = res.data))
}

const handleDelete = (row: ProductType) => {
  ElMessageBox.confirm("确定要删除吗", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  })
    .then(() => {
      deleteProductType(row.productTypeId).then(() => {
        getTableData()
        ElMessage({
          type: "success",
          message: "删除成功"
        })
      })
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "删除失败"
      })
    })
}

const formVisible = ref(false)
const formRef = ref<FormInstance | null>(null)
const form = reactive<ProductType>({
  productTypeId: "",
  productTypename: "",
  parentId: ""
})
const handleAdd = () => {
  form.productTypeId = null
  form.productTypename = ""
  form.parentId = ""
  formVisible.value = true
}

const handleEdit = (row: ProductType) => {
  form.productTypeId = row.productTypeId
  form.productTypename = row.productTypename
  form.parentId = row.parentId
  formVisible.value = true
}

const rules: FormRules = reactive({
  productTypename: [{ required: true, message: "请输入分类名", trigger: "blur" }]
})

const handleSubmit = () => {
  formRef.value?.validate((valid: boolean, fields) => {
    if (valid) {
      if (form.productTypeId) {
        updateProductType(form).then(() => {
          getTableData()
          ElMessage({
            type: "success",
            message: "修改成功"
          })
          formVisible.value = false
        })
      } else {
        addProductType(form).then(() => {
          getTableData()
          ElMessage({
            type: "success",
            message: "添加成功"
          })
          formVisible.value = false
        })
      }
    } else {
      console.error("表单校验不通过", fields)
    }
  })
}

getTableData()
</script>

<template>
  <div class="product-type">
    <el-card>
      <el-button type="primary" @click="handleAdd">添加</el-button>
      <el-table class="table" :data="tableData" border>
        <el-table-column align="center" prop="productTypeId" label="分类id" />
        <el-table-column align="center" prop="productTypename" label="分类名" />
        <el-table-column align="center" prop="parentId" label="父分类id" />
        <el-table-column align="center" label="操作">
          <template #default="{ row }">
            <el-button type="primary" @click="handleEdit(row)">编辑</el-button>
            <el-button type="danger" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog v-model="formVisible" :title="form.productTypeId ? '编辑' : '添加'" width="30%">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="80px" label-position="right">
        <el-form-item v-if="form.productTypeId" label="分类id：">
          <el-input v-model="form.productTypeId" placeholder="请输入分类id" />
        </el-form-item>
        <el-form-item label="分类名：">
          <el-input v-model="form.productTypename" placeholder="请输入分类名" />
        </el-form-item>
        <el-form-item label="父分类id：">
          <el-input v-model="form.parentId" placeholder="请输入父分类id" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="formVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
.product-type {
  margin: 20px;
}

.table {
  width: 50%;
}
</style>
