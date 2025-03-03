<template>
  <div class="users-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>用户列表</span>
          <el-button type="primary">添加用户</el-button>
        </div>
      </template>

      <el-table :data="userList" style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="username" label="用户名" width="120" />
        <el-table-column prop="role" label="角色" width="120" />
        <el-table-column prop="email" label="邮箱" />
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column label="操作" width="150">
          <template #default="scope">
            <el-button size="small" @click="handleEdit(scope.row)"
              >编辑</el-button
            >
            <el-button
              size="small"
              type="danger"
              @click="handleDelete(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 30, 50]"
          layout="total, sizes, prev, pager, next"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";

const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(100);

const userList = ref([
  {
    id: 1,
    username: "admin",
    role: "管理员",
    email: "admin@example.com",
    createTime: "2024-01-01 12:00:00",
  },
  {
    id: 2,
    username: "user1",
    role: "普通用户",
    email: "user1@example.com",
    createTime: "2024-01-02 12:00:00",
  },
]);

const handleEdit = (row: any) => {
  console.log("编辑用户:", row);
};

const handleDelete = (row: any) => {
  ElMessageBox.confirm(`确认删除用户 ${row.username} 吗？`, "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    ElMessage.success("删除成功");
  });
};

const handleSizeChange = (val: number) => {
  pageSize.value = val;
  // 重新加载数据
};

const handleCurrentChange = (val: number) => {
  currentPage.value = val;
  // 重新加载数据
};
</script>

<style lang="scss" scoped>
.users-container {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .pagination {
    margin-top: 20px;
    text-align: right;
  }
}
</style>
