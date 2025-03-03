<template>
  <div class="detail-container">
    <div class="header">
      <div class="left">
        <el-button type="text" class="back-btn" @click="router.back()">
          <el-icon><ArrowLeft /></el-icon>
          返回
        </el-button>
        <div class="title">{{ title }}</div>
      </div>
      <div class="time">{{ currentTime }}</div>
    </div>

    <div class="content">
      <!-- 基础信息卡片 -->
      <div class="chart-card">
        <div class="card-header">基础信息</div>
        <div class="info-grid">
          <div class="info-item" v-for="(value, key) in baseInfo" :key="key">
            <span class="label">{{ key }}：</span>
            <span class="value">{{ value }}</span>
          </div>
        </div>
      </div>

      <!-- 趋势图表 -->
      <div class="chart-card">
        <div class="card-header">{{ chartTitle }}</div>
        <div class="chart-container">
          <div ref="mainChart" class="chart"></div>
        </div>
      </div>

      <!-- 数据列表 -->
      <div class="chart-card">
        <div class="card-header">历史数据</div>
        <div class="history-data">
          <div
            class="history-item"
            v-for="(item, index) in historyData"
            :key="index"
          >
            <div class="history-info">
              <div class="time">{{ item.time }}</div>
              <div class="value-box">
                <span class="value">{{ item.value }}</span>
                <span class="unit">{{
                  type === "water" ? "m" : type === "env" ? "°C" : "mg/L"
                }}</span>
              </div>
            </div>
            <div class="status-box">
              <div class="status-line" :class="item.status"></div>
              <el-tag
                :type="
                  item.status === '正常'
                    ? 'success'
                    : item.status === '警告'
                    ? 'warning'
                    : 'danger'
                "
                :effect="'dark'"
                class="status-tag"
              >
                {{ item.status }}
              </el-tag>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useIntervalFn } from "@vueuse/core";
import * as echarts from "echarts";
import { ArrowLeft } from "@element-plus/icons-vue";

const router = useRouter();
const route = useRoute();

// 根据路由参数设置页面标题和图表标题
const type = route.query.type as string;
const title = ref(
  type === "env"
    ? "环境数据详情"
    : type === "water"
    ? "水位监测详情"
    : "氨氮监测详情"
);
const chartTitle = ref(
  type === "env" ? "24小时趋势" : type === "water" ? "实时水位" : "浓度趋势"
);
const valueLabel = ref(
  type === "env" ? "数值" : type === "water" ? "水位(m)" : "浓度(mg/L)"
);

// 时间显示
const currentTime = ref(new Date().toLocaleString());
const { pause } = useIntervalFn(() => {
  currentTime.value = new Date().toLocaleString();
}, 1000);

// 基础信息
const baseInfo = ref({
  监测点: "1号监测站",
  设备状态: "正常运行",
  更新频率: "实时",
  安装时间: "2024-01-01",
  最后校准: "2024-03-01",
  负责人: "张工",
});

// 图表实例
const mainChart = ref<HTMLElement>();
let chart: echarts.ECharts | null = null;

// 历史数据
const historyData = ref([
  { time: "2024-03-15 10:00:00", value: "25.6", status: "正常" },
  { time: "2024-03-15 09:00:00", value: "26.2", status: "正常" },
  { time: "2024-03-15 08:00:00", value: "28.5", status: "警告" },
  { time: "2024-03-15 07:00:00", value: "24.8", status: "正常" },
  { time: "2024-03-15 06:00:00", value: "23.9", status: "正常" },
]);

// 初始化图表
const initChart = () => {
  if (!mainChart.value) return;

  chart = echarts.init(mainChart.value);
  const option = {
    backgroundColor: "transparent",
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross",
        label: {
          backgroundColor: "#6a7985",
        },
      },
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: Array.from({ length: 24 }, (_, i) => `${i}:00`),
      axisLine: {
        lineStyle: {
          color: "rgba(255,255,255,0.5)",
        },
      },
      axisLabel: {
        color: "rgba(255,255,255,0.8)",
      },
    },
    yAxis: {
      type: "value",
      axisLine: {
        lineStyle: {
          color: "rgba(255,255,255,0.5)",
        },
      },
      splitLine: {
        lineStyle: {
          color: "rgba(255,255,255,0.1)",
        },
      },
      axisLabel: {
        color: "rgba(255,255,255,0.8)",
      },
    },
    series: [
      {
        name: "数值",
        type: "line",
        data: Array.from({ length: 24 }, () =>
          (Math.random() * 30 + 20).toFixed(1)
        ),
        smooth: true,
        symbol: "circle",
        symbolSize: 8,
        lineStyle: {
          color: "#00ffff",
          width: 2,
        },
        itemStyle: {
          color: "#00ffff",
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "rgba(0,255,255,0.3)" },
            { offset: 1, color: "rgba(0,255,255,0)" },
          ]),
        },
      },
    ],
  };

  chart.setOption(option);
};

// 自动更新数据
const updateData = () => {
  if (!chart) return;

  const newData = Array.from({ length: 24 }, () =>
    (Math.random() * 30 + 20).toFixed(1)
  );
  chart.setOption({
    series: [
      {
        data: newData,
      },
    ],
  });
};

// 页面挂载
onMounted(() => {
  initChart();
  window.addEventListener("resize", handleResize);
  // 每30秒更新一次数据
  const timer = setInterval(updateData, 30000);

  onUnmounted(() => {
    window.removeEventListener("resize", handleResize);
    clearInterval(timer);
    pause();
    chart?.dispose();
  });
});

// 窗口大小变化
const handleResize = () => {
  chart?.resize();
};
</script>

<style lang="scss" scoped>
.detail-container {
  width: 100%;
  height: 100vh;
  background: #000;
  color: #fff;
  padding: 20px;
  box-sizing: border-box;
  background-image: radial-gradient(circle at center, #1a2b3c 0%, #000 100%);
  display: flex;
  flex-direction: column;
  gap: 20px;
  overflow: hidden;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    height: 60px;

    .left {
      display: flex;
      align-items: center;
      gap: 20px;

      .back-btn {
        color: #00ffff;
        font-size: 16px;
        display: flex;
        align-items: center;
        gap: 5px;

        &:hover {
          color: #fff;
        }

        .el-icon {
          font-size: 20px;
        }
      }

      .title {
        font-size: 24px;
        font-weight: bold;
        background: linear-gradient(45deg, #00ffff, #0066ff);
        -webkit-background-clip: text;
        color: transparent;
        text-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
      }
    }

    .time {
      font-size: 18px;
      color: #00ffff;
    }
  }

  .content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 20px;
    overflow-y: auto;
    padding-right: 10px;

    &::-webkit-scrollbar {
      width: 6px;
    }

    &::-webkit-scrollbar-thumb {
      background: rgba(0, 255, 255, 0.2);
      border-radius: 3px;
    }
  }

  .chart-card {
    background: rgba(0, 30, 60, 0.5);
    border: 1px solid rgba(0, 255, 255, 0.1);
    border-radius: 8px;
    padding: 20px;
    backdrop-filter: blur(10px);
    box-shadow: 0 0 20px rgba(0, 255, 255, 0.1);
    transition: all 0.3s ease;

    &:hover {
      border-color: rgba(0, 255, 255, 0.3);
      box-shadow: 0 0 30px rgba(0, 255, 255, 0.2);
    }

    .card-header {
      font-size: 18px;
      color: #00ffff;
      margin-bottom: 20px;
      padding-bottom: 10px;
      border-bottom: 1px solid rgba(0, 255, 255, 0.1);
      position: relative;

      &::after {
        content: "";
        position: absolute;
        bottom: -1px;
        left: 0;
        width: 100px;
        height: 1px;
        background: linear-gradient(90deg, #00ffff, transparent);
      }
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;

      .info-item {
        padding: 15px;
        background: rgba(0, 30, 60, 0.3);
        border-radius: 8px;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .label {
          color: #999;
        }

        .value {
          color: #00ffff;
        }
      }
    }

    .chart-container {
      height: 400px;

      .chart {
        width: 100%;
        height: 100%;
      }
    }

    .history-data {
      padding: 10px;
      display: flex;
      flex-direction: column;
      gap: 15px;
      max-height: 400px;
      overflow-y: auto;

      &::-webkit-scrollbar {
        width: 6px;
      }

      &::-webkit-scrollbar-thumb {
        background: rgba(0, 255, 255, 0.2);
        border-radius: 3px;
      }

      .history-item {
        background: rgba(0, 30, 60, 0.3);
        border-radius: 10px;
        padding: 15px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        transition: all 0.3s ease;
        border: 1px solid rgba(0, 255, 255, 0.1);

        &:hover {
          transform: translateX(5px);
          background: rgba(0, 30, 60, 0.5);
          border-color: rgba(0, 255, 255, 0.3);
        }

        .history-info {
          display: flex;
          flex-direction: column;
          gap: 8px;

          .time {
            color: #999;
            font-size: 14px;
          }

          .value-box {
            display: flex;
            align-items: baseline;
            gap: 5px;

            .value {
              font-size: 24px;
              color: #00ffff;
              font-weight: bold;
            }

            .unit {
              color: #666;
              font-size: 14px;
            }
          }
        }

        .status-box {
          display: flex;
          align-items: center;
          gap: 15px;

          .status-line {
            width: 3px;
            height: 30px;
            border-radius: 3px;

            &.正常 {
              background: #67c23a;
              box-shadow: 0 0 10px rgba(103, 194, 58, 0.3);
            }

            &.警告 {
              background: #e6a23c;
              box-shadow: 0 0 10px rgba(230, 162, 60, 0.3);
            }

            &.异常 {
              background: #f56c6c;
              box-shadow: 0 0 10px rgba(245, 108, 108, 0.3);
            }
          }

          .status-tag {
            min-width: 60px;
            text-align: center;
          }
        }
      }
    }
  }
}
</style>
