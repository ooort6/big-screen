<template>
  <div class="settings-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>系统设置</span>
        </div>
      </template>

      <el-form ref="formRef" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="系统名称" prop="systemName">
          <el-input v-model="form.systemName" />
        </el-form-item>

        <el-form-item label="系统Logo">
          <el-upload
            class="avatar-uploader"
            action="/api/upload"
            :show-file-list="false"
            :on-success="handleLogoSuccess"
          >
            <img v-if="form.logo" :src="form.logo" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>

        <el-form-item label="主题色">
          <el-color-picker v-model="form.theme" />
        </el-form-item>

        <el-form-item label="系统通知">
          <el-switch v-model="form.enableNotification" />
        </el-form-item>

        <el-form-item label="备案信息" prop="icp">
          <el-input v-model="form.icp" />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleSubmit">保存设置</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { ElMessage } from "element-plus";
import { Plus } from "@element-plus/icons-vue";

const formRef = ref();

const form = reactive({
  systemName: "后台管理系统",
  logo: "",
  theme: "#409EFF",
  enableNotification: true,
  icp: "",
});

const rules = {
  systemName: [
    { required: true, message: "请输入系统名称", trigger: "blur" },
    { min: 2, max: 20, message: "长度在 2 到 20 个字符", trigger: "blur" },
  ],
  icp: [
    {
      pattern: /^[\u4e00-\u9fa5A-Za-z0-9-]+$/,
      message: "备案信息格式不正确",
      trigger: "blur",
    },
  ],
};

const handleLogoSuccess = (res: any) => {
  form.logo = res.url;
  ElMessage.success("上传成功");
};

const handleSubmit = async () => {
  if (!formRef.value) return;

  await formRef.value.validate((valid: boolean) => {
    if (valid) {
      ElMessage.success("保存成功");
    }
  });
};

const resetForm = () => {
  if (!formRef.value) return;
  formRef.value.resetFields();
};
</script>

<style lang="scss" scoped>
.settings-container {
  .avatar-uploader {
    :deep(.el-upload) {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: var(--el-transition-duration-fast);

      &:hover {
        border-color: var(--el-color-primary);
      }
    }
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    text-align: center;
    line-height: 178px;
  }

  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
}
</style>
