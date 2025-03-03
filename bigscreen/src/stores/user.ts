import { defineStore } from "pinia";

interface UserInfo {
  username: string;
  avatar: string;
}

export const useUserStore = defineStore("user", {
  state: () => ({
    token: "",
    userInfo: {
      username: "",
      avatar: "",
    },
  }),

  actions: {
    setToken(token: string) {
      this.token = token;
      localStorage.setItem("token", token);
    },

    setUserInfo(userInfo: UserInfo) {
      this.userInfo = userInfo;
      localStorage.setItem("userInfo", JSON.stringify(userInfo));
    },

    logout() {
      this.token = "";
      this.userInfo = { username: "", avatar: "" };
      localStorage.removeItem("token");
      localStorage.removeItem("userInfo");
    },

    // 从localStorage恢复状态
    initFromStorage() {
      const token = localStorage.getItem("token");
      const userInfo = localStorage.getItem("userInfo");

      if (token) {
        this.token = token;
      }

      if (userInfo) {
        this.userInfo = JSON.parse(userInfo);
      }
    },
  },

  getters: {
    isLoggedIn: (state) => !!state.token,
  },
});
