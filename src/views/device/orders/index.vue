<script setup lang="ts">
import { CirclePlus, Delete, RefreshRight } from "@element-plus/icons-vue"
import { useRoute } from "vue-router"
import { ref } from "vue"
import { OrderVO } from "@/api/device/types/order"
import { getOrdersByEquId } from "@/api/device"

const route = useRoute()
const equipmentId = route.params.id + ""

const loading = ref(true)
const tableData = ref<OrderVO[]>([])
const getTableData = () => {
  getOrdersByEquId(equipmentId).then((res) => {
    tableData.value = res
    loading.value = false
  })
}

getTableData()
</script>

<template>
  <div class="app-container">
    <el-card v-loading="loading" shadow="never">
      <div class="toolbar-wrapper">
        <div>
          <el-button type="primary" :icon="CirclePlus" @click="dialogVisible = true">新增预约</el-button>
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
