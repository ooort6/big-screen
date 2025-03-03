import { createApp } from "vue";
import { createPinia } from "pinia";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import App from "./App.vue";
import router from "./router";
import { useUserStore } from "./stores/user";
import "./styles/index.scss";

const app = createApp(App);

// 注册 Element Plus 图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

// 初始化Pinia
const pinia = createPinia();
app.use(pinia);

// 初始化用户状态
const userStore = useUserStore();
userStore.initFromStorage();

app.use(ElementPlus);
app.use(router);

app.mount("#app");
