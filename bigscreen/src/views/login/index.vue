<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-title">后台管理系统</div>
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginRules"
        class="login-form"
      >
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="用户名"
            :prefix-icon="User"
          />
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            placeholder="密码"
            :prefix-icon="Lock"
            type="password"
            show-password
          />
        </el-form-item>

        <el-form-item>
          <el-button
            :loading="loading"
            type="primary"
            class="login-button"
            @click="handleLogin"
          >
            登录
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { User, Lock } from "@element-plus/icons-vue";
import { useUserStore } from "@/stores/user";

const router = useRouter();
const userStore = useUserStore();
const loginFormRef = ref();
const loading = ref(false);

const loginForm = reactive({
  username: "",
  password: "",
});

const loginRules = {
  username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }],
};

const handleLogin = async () => {
  if (!loginFormRef.value) return;

  try {
    loading.value = true;
    await loginFormRef.value.validate();

    if (loginForm.username === "admin" && loginForm.password === "123456") {
      userStore.setToken("admin-token");
      userStore.setUserInfo({
        username: "admin",
        avatar:
          "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",
      });
      ElMessage.success("登录成功");
      router.push("/dashboard");
    } else {
      ElMessage.error("用户名或密码错误");
    }
  } catch (error) {
    console.error("Login error:", error);
  } finally {
    loading.value = false;
  }
};
</script>

<style lang="scss" scoped>
.login-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

  .login-box {
    width: 400px;
    padding: 40px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

    .login-title {
      margin-bottom: 30px;
      text-align: center;
      font-size: 24px;
      color: #409eff;
      font-weight: bold;
    }

    .login-form {
      .login-button {
        width: 100%;
      }
    }
  }
}
</style>
