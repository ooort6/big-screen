<template>
  <div class="app-wrapper">
    <!-- 侧边栏 -->
    <div class="sidebar-container" :class="{ 'is-collapse': isCollapse }">
      <div class="logo">
        <img src="@/assets/vue.svg" alt="logo" />
        <span v-show="!isCollapse">后台管理系统</span>
      </div>
      <el-menu
        :default-active="activeMenu"
        class="el-menu-vertical"
        :collapse="isCollapse"
        background-color="#304156"
        text-color="#bfcbd9"
        active-text-color="#409EFF"
        router
      >
        <el-menu-item index="/dashboard">
          <el-icon><DataLine /></el-icon>
          <template #title>数据看板</template>
        </el-menu-item>
        <el-menu-item index="/users">
          <el-icon><User /></el-icon>
          <template #title>用户管理</template>
        </el-menu-item>
        <el-menu-item index="/settings">
          <el-icon><Setting /></el-icon>
          <template #title>系统设置</template>
        </el-menu-item>
      </el-menu>
    </div>

    <div class="main-container">
      <!-- 顶部导航栏 -->
      <div class="navbar">
        <div class="left">
          <el-icon class="fold-btn" @click="toggleSidebar">
            <Fold v-if="!isCollapse" />
            <Expand v-else />
          </el-icon>
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>{{ route.meta.title }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="right">
          <el-dropdown trigger="click">
            <div class="avatar-wrapper">
              <el-avatar :size="32" :src="userStore.userInfo.avatar" />
              <span class="username">{{ userStore.userInfo.username }}</span>
              <el-icon class="el-icon--right">
                <arrow-down />
              </el-icon>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="handleLogout"
                  >退出登录</el-dropdown-item
                >
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>

      <!-- 主要内容区 -->
      <div class="app-main">
        <router-view v-slot="{ Component }">
          <transition name="fade-transform" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ElMessageBox } from "element-plus";
import {
  DataLine,
  Setting,
  User,
  Fold,
  Expand,
  ArrowDown,
} from "@element-plus/icons-vue";
import { useUserStore } from "@/stores/user";

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

const isCollapse = ref(false);
const activeMenu = computed(() => route.path);

const toggleSidebar = () => {
  isCollapse.value = !isCollapse.value;
};

const handleLogout = () => {
  ElMessageBox.confirm("确认退出登录吗？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    userStore.logout();
    router.push("/login");
  });
};
</script>

<style lang="scss" scoped>
.app-wrapper {
  height: 100vh;
  width: 100%;
  display: flex;

  .sidebar-container {
    width: 210px;
    height: 100%;
    background: #304156;
    transition: width 0.3s;
    overflow-x: hidden;

    &.is-collapse {
      width: 64px;
    }

    .logo {
      height: 50px;
      display: flex;
      align-items: center;
      padding: 0 16px;
      background: #2b2f3a;
      overflow: hidden;

      img {
        width: 32px;
        height: 32px;
      }

      span {
        margin-left: 12px;
        color: #fff;
        font-size: 16px;
        font-weight: 600;
        white-space: nowrap;
      }
    }

    .el-menu {
      border: none;
    }
  }

  .main-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;

    .navbar {
      height: 50px;
      background: #fff;
      box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 16px;

      .left {
        display: flex;
        align-items: center;

        .fold-btn {
          font-size: 20px;
          cursor: pointer;
          margin-right: 16px;
        }
      }

      .right {
        .avatar-wrapper {
          display: flex;
          align-items: center;
          cursor: pointer;

          .el-avatar {
            margin-right: 8px;
          }

          .username {
            font-size: 14px;
            color: #333;
          }
        }
      }
    }

    .app-main {
      flex: 1;
      padding: 16px;
      overflow-y: auto;
      background: #f0f2f5;
    }
  }
}

// 路由切换动画
.fade-transform-enter-active,
.fade-transform-leave-active {
  transition: all 0.3s;
}

.fade-transform-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
