<script setup lang="ts">
import { Plus, Search } from "@element-plus/icons-vue"
import { addProduct, deleteProduct, getProducts, getProductTypeList, updateProduct } from "@/api/product"
import { computed, reactive, ref } from "vue"
import { ProductType, ProductVO } from "@/api/product/types/product"
import { ElMessage, ElMessageBox, FormInstance, FormRules } from "element-plus"

const tableData = ref<ProductVO[]>([])

const getTableData = () => {
  getProducts().then((res) => {
    tableData.value = res
  })
}

getTableData()
const handleDelete = (row: ProductVO) => {
  ElMessageBox.confirm("确定要删除吗", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  })
    .then(() => {
      deleteProduct(row.product.productId).then(() => {
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

const handleAdd = () => {
  form.productId = ""
  form.productName = ""
  form.productTypeId = ""
  form.price = 0
  form.stock = 0
  form.imgUrl = ""
  form.unit = ""
  form.func = ""
  form.description = ""
  form.remark = ""
  dialogVisible.value = true
}

// 分页
const currentPage = ref(1)
const pageSize = ref(8)
const currentPageData = computed(() => {
  return tableData.value.slice((currentPage.value - 1) * pageSize.value, currentPage.value * pageSize.value)
})

const handleCurrentChange = (val: number) => {
  currentPage.value = val
}

const dialogVisible = ref(false)

const formRef = ref<FormInstance | null>(null)
const form = reactive({
  productId: "",
  productName: "",
  productTypeId: "",
  price: 0,
  stock: 0,
  imgUrl: "",
  unit: "",
  func: "",
  description: "",
  remark: ""
})

const rules: FormRules = reactive({
  productName: [{ required: true, message: "请输入商品名", trigger: "blur" }],
  productTypeId: [{ required: true, message: "请选择分类", trigger: "blur" }],
  price: [{ required: true, message: "请输入价格", trigger: "blur" }],
  stock: [{ required: true, message: "请输入库存", trigger: "blur" }],
  imgUrl: [{ required: true, message: "请输入商品图", trigger: "blur" }]
})

const handleSubmit = () => {
  formRef.value?.validate((valid: boolean, fields) => {
    if (valid) {
      if (form.productId !== "") {
        updateProduct(form).then(() => {
          getTableData()
          ElMessage({
            type: "success",
            message: "修改成功"
          })
          dialogVisible.value = false
        })
      } else {
        addProduct(form).then(() => {
          ElMessage({
            type: "success",
            message: "添加成功"
          })
          getTableData()
        })
      }
    } else {
      console.error("表单校验不通过", fields)
    }
  })
}

const handleEdit = (row: ProductVO) => {
  form.productId = row.product.productId
  form.productName = row.product.productName
  form.productTypeId = row.product.productTypeId
  form.price = row.product.price
  form.stock = row.product.stock
  form.imgUrl = row.product.imgUrl
  form.unit = row.product.unit
  form.func = row.product.func
  form.description = row.product.description
  form.remark = row.product.remark
  dialogVisible.value = true
}

const productTypes = ref<ProductType[]>([])
const getProductTypes = () => {
  getProductTypeList().then((res) => {
    productTypes.value = res.data
  })
}
getProductTypes()

const handleImgSuccess = (res: ApiResponseData<string>) => {
  form.imgUrl = res.data
}

const search = ref("")
</script>

<template>
  <div class="products">
    <el-card class="table-card">
      <div class="head">
        <el-button type="primary" @click="handleAdd">添加</el-button>
        <el-input v-model="search" placeholder="根据商品名搜索" class="searcher">
          <template #append>
            <el-button :icon="Search" />
          </template>
        </el-input>
      </div>
      <el-table :data="currentPageData" border style="width: 100%">
        <el-table-column align="center" prop="product.productName" label="商品名称" width="180" />
        <el-table-column align="center" label="商品图">
          <template #default="{ row }">
            <img alt="商品图" :src="row.product.imgUrl" width="100" height="100" />
          </template>
        </el-table-column>
        <el-table-column align="center" prop="productType.productTypename" label="分类" />
        <el-table-column align="center" prop="product.price" label="价格" />
        <el-table-column align="center" prop="product.stock" label="库存" />
        <el-table-column align="center" prop="product.unit" label="单位" />
        <el-table-column align="center" prop="product.func" label="功能" />
        <el-table-column align="center" prop="product.description" label="描述" />
        <el-table-column align="center" prop="product.remark" label="备注" />
        <el-table-column align="center" label="操作" width="200">
          <template #default="{ row }">
            <el-button type="primary" @click="handleEdit(row)">编辑</el-button>
            <el-button type="danger" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="pagination"
        hide-on-single-page
        layout="prev, pager, next"
        :total="tableData.length"
        :page-size="pageSize"
        :current-page="currentPage"
        @current-change="handleCurrentChange"
      />
    </el-card>
    <el-dialog v-model="dialogVisible" :title="form.productId === '' ? '新建' : '编辑'" width="600px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="商品名称" prop="productName">
          <el-input v-model="form.productName" placeholder="请输入商品名称" />
        </el-form-item>
        <el-form-item label="价格" placeholder="请输入价格" prop="price">
          <el-input v-model="form.price" placeholder="请输入价格" />
        </el-form-item>
        <el-form-item label="库存" placeholder="请输入库存" prop="stock">
          <el-input v-model="form.stock" placeholder="请输入库存" />
        </el-form-item>
        <el-form-item label="单位" placeholder="请输入单位" prop="unit">
          <el-input v-model="form.unit" placeholder="请输入单位" />
        </el-form-item>
        <el-form-item label="功能" placeholder="请输入功能" prop="func">
          <el-input v-model="form.func" placeholder="请输入功能" />
        </el-form-item>
        <el-form-item label="描述" placeholder="请输入描述" prop="description">
          <el-input v-model="form.description" placeholder="请输入描述" />
        </el-form-item>
        <el-form-item label="备注" placeholder="请输入备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注" />
        </el-form-item>
        <el-form-item label="分类" placeholder="请输入分类" prop="productTypeId">
          <el-select popper-class="popper" v-model="form.productTypeId" placeholder="请选择分类" class="type-select">
            <el-option
              v-for="type in productTypes"
              :label="type.productTypename"
              :value="type.productTypeId"
              :key="type.productTypeId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="图片上传">
          <el-upload
            class="avatar-uploader"
            action="http://47.98.160.222:8080/api/file/uploadImage"
            :on-success="handleImgSuccess"
          >
            <img v-if="form.imgUrl" :src="form.imgUrl" class="img" :alt="form.imgUrl" />
            <i v-else class="avatar-uploader-icon">
              <Plus class="plus" />
            </i>
          </el-upload>
        </el-form-item>
        <el-form-item label="商品图" placeholder="请输入商品图" prop="imgUrl">
          <el-input v-model="form.imgUrl" placeholder="请输入商品图" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
.table-card {
  margin: 20px;
}

.head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.searcher {
  width: 300px;
}

.pagination {
  float: right;
  margin-top: 20px;
}

.avatar-uploader-icon {
  font-size: 15px;
  border: 1px dashed #3c3a3a;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
}

.img {
  width: 178px;
  height: 178px;
  border-radius: 6px;
}

.plus {
  width: 15px;
  height: 15px;
}
</style>
