<script setup lang="ts"></script>

<template>
  <router-view />
</template>

<style>
html,
body {
  height: 100%;
  margin: 0;
  padding: 0;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
  font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB,
    Microsoft YaHei, Arial, sans-serif;
}

#app {
  height: 100%;
}

*,
*:before,
*:after {
  box-sizing: border-box;
}

/* 清除浮动 */
.clearfix:after {
  content: "";
  display: table;
  clear: both;
}
</style>
