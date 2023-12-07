<script setup lang="ts">
import { Search } from "@element-plus/icons-vue"
import { deleteProduct, getProducts } from "@/api/product"
import { ref } from "vue"
import { ProductVO } from "@/api/product/types/product"
import { ElMessage, ElMessageBox } from "element-plus"

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
  console.log(row)
}
</script>

<template>
  <el-card class="orders">
    <div class="head">
      <el-button type="primary" @click="handleAdd">添加</el-button>
      <el-input v-model="input3" placeholder="根据商品名搜索" class="searcher">
        <template #append>
          <el-button :icon="Search" />
        </template>
      </el-input>
    </div>
    <el-table :data="tableData" border style="width: 100%">
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
      :page-size="20"
      :pager-count="11"
      layout="prev, pager, next"
      :hide-on-single-page="false"
      :total="1"
      class="pagination"
    />
  </el-card>
</template>

<style scoped lang="scss">
.orders {
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
</style>
