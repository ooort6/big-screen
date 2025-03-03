import { createRouter, createWebHistory } from "vue-router";
import { useUserStore } from "@/stores/user";
import Layout from "@/layout/index.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      redirect: "/login",
    },
    {
      path: "/login",
      name: "Login",
      component: () => import("@/views/login/index.vue"),
      meta: { title: "登录" },
    },
    {
      path: "/dashboard",
      component: Layout,
      children: [
        {
          path: "",
          name: "Dashboard",
          component: () => import("@/views/dashboard/index.vue"),
          meta: { title: "数据看板", requiresAuth: true },
        },
      ],
    },
    {
      path: "/users",
      component: Layout,
      children: [
        {
          path: "",
          name: "Users",
          component: () => import("@/views/users/index.vue"),
          meta: { title: "用户管理", requiresAuth: true },
        },
      ],
    },
    {
      path: "/settings",
      component: Layout,
      children: [
        {
          path: "",
          name: "Settings",
          component: () => import("@/views/settings/index.vue"),
          meta: { title: "系统设置", requiresAuth: true },
        },
      ],
    },
    {
      path: "/detail",
      component: Layout,
      children: [
        {
          path: "",
          name: "Detail",
          component: () => import("@/views/detail/index.vue"),
          meta: { title: "详情", requiresAuth: true },
        },
      ],
    },
    // 404页面
    {
      path: "/:pathMatch(.*)*",
      redirect: "/login",
    },
  ],
});

// 路由守卫
router.beforeEach((to, from, next) => {
  const userStore = useUserStore();
  const isLoggedIn = userStore.isLoggedIn;

  // 如果是访问登录页
  if (to.path === "/login") {
    if (isLoggedIn) {
      next("/dashboard");
    } else {
      next();
    }
    return;
  }

  // 如果访问其他页面，检查是否登录
  if (!isLoggedIn) {
    next("/login");
    return;
  }

  next();
});

export default router;
