<script setup lang="ts">
import { ref } from "vue"
import { getOrders } from "@/api/product"
import { ProductOrderVO } from "@/api/product/types/order"

const tableData = ref<ProductOrderVO[]>([])
const getTableData = () => {
  getOrders().then((res) => {
    tableData.value = res
    console.log(tableData.value)
  })
}
getTableData()
</script>

<template>
  <div class="orders">
    <el-card class="table-card">
      <el-table class="table" :data="tableData" border>
        <el-table-column align="center" prop="productOrderId" label="订单id" />
        <el-table-column align="center" prop="productId" label="商品编号" />
        <el-table-column align="center" prop="productName" label="商品名称" />
        <el-table-column align="center" prop="userId" label="用户id" />
        <el-table-column align="center" prop="username" label="用户名称" />
        <el-table-column align="center" prop="productNum" label="购买数量" />
        <el-table-column align="center" prop="total" label="总金额" />
        <el-table-column align="center" prop="createTime" label="创建时间" width="180" />
      </el-table>
    </el-card>
  </div>
</template>

<style scoped lang="scss">
.orders {
  margin: 20px;
}

.table {
  margin: 10px;
}

.table-card {
  height: 100%;
  margin: 20px;
}
</style>
