<template>
  <div class="device-detail-container">
    <div class="header">
      <div class="back" @click="router.back()">
        <el-icon><ArrowLeft /></el-icon>
        返回
      </div>
      <div class="title">{{ deviceTitle }}</div>
    </div>

    <div class="content">
      <!-- 设备基本信息卡片 -->
      <div class="info-card">
        <div class="card-header">基本信息</div>
        <div class="info-grid">
          <div class="info-item">
            <span class="label">设备名称</span>
            <span class="value">{{ route.query.name }}</span>
          </div>
          <div class="info-item">
            <span class="label">运行状态</span>
            <span class="value" :class="route.query.status">{{
              getStatusText(route.query.status as string)
            }}</span>
          </div>
          <div class="info-item">
            <span class="label">运行时间</span>
            <span class="value">{{ route.query.runtime }}</span>
          </div>
          <div class="info-item">
            <span class="label">负载情况</span>
            <span class="value">{{ route.query.load }}</span>
          </div>
          <div class="info-item">
            <span class="label">维护状态</span>
            <span class="value">{{ route.query.maintenance }}</span>
          </div>
          <div class="info-item">
            <span class="label">运行效率</span>
            <span class="value">{{ route.query.efficiency }}</span>
          </div>
        </div>
      </div>

      <!-- 实时监控数据 -->
      <div class="monitor-card">
        <div class="card-header">实时监控</div>
        <div class="monitor-content">
          <!-- 水泵特有的监控数据 -->
          <template v-if="route.query.type === 'pump'">
            <div class="data-grid">
              <div class="data-item">
                <span class="label">流量</span>
                <span class="value">{{ pumpData.flow }} m³/h</span>
              </div>
              <div class="data-item">
                <span class="label">压力</span>
                <span class="value">{{ pumpData.pressure }} MPa</span>
              </div>
              <div class="data-item">
                <span class="label">功率</span>
                <span class="value">{{ pumpData.power }} kW</span>
              </div>
              <div class="data-item">
                <span class="label">转速</span>
                <span class="value">{{ pumpData.speed }} rpm</span>
              </div>
            </div>
          </template>

          <!-- 阀门特有的监控数据 -->
          <template v-if="route.query.type === 'valve'">
            <div class="data-grid">
              <div class="data-item">
                <span class="label">开度</span>
                <span class="value">{{ valveData.openness }}%</span>
              </div>
              <div class="data-item">
                <span class="label">流量</span>
                <span class="value">{{ valveData.flow }} m³/h</span>
              </div>
              <div class="data-item">
                <span class="label">压差</span>
                <span class="value">{{ valveData.pressure }} MPa</span>
              </div>
              <div class="data-item">
                <span class="label">温度</span>
                <span class="value">{{ valveData.temperature }}°C</span>
              </div>
            </div>
          </template>

          <!-- 传感器特有的监控数据 -->
          <template v-if="route.query.type === 'sensor'">
            <div class="data-grid">
              <div class="data-item">
                <span class="label">测量值</span>
                <span class="value"
                  >{{ sensorData.value }} {{ sensorData.unit }}</span
                >
              </div>
              <div class="data-item">
                <span class="label">信号强度</span>
                <span class="value">{{ sensorData.signal }}%</span>
              </div>
              <div class="data-item">
                <span class="label">精度</span>
                <span class="value">±{{ sensorData.accuracy }}%</span>
              </div>
              <div class="data-item">
                <span class="label">采样率</span>
                <span class="value">{{ sensorData.sampleRate }} Hz</span>
              </div>
            </div>
          </template>

          <!-- 控制器特有的监控数据 -->
          <template v-if="route.query.type === 'controller'">
            <div class="data-grid">
              <div class="data-item">
                <span class="label">CPU使用率</span>
                <span class="value">{{ controllerData.cpu }}%</span>
              </div>
              <div class="data-item">
                <span class="label">内存使用率</span>
                <span class="value">{{ controllerData.memory }}%</span>
              </div>
              <div class="data-item">
                <span class="label">响应时间</span>
                <span class="value">{{ controllerData.responseTime }} ms</span>
              </div>
              <div class="data-item">
                <span class="label">连接数</span>
                <span class="value">{{ controllerData.connections }}</span>
              </div>
            </div>
          </template>
        </div>
      </div>

      <!-- 历史数据图表 -->
      <div class="chart-card">
        <div class="card-header">历史数据</div>
        <div class="chart-content">
          <div ref="historyChart" class="chart"></div>
        </div>
      </div>

      <!-- 告警记录 -->
      <div class="alarm-card">
        <div class="card-header">告警记录</div>
        <div class="alarm-list">
          <div
            v-for="(alarm, index) in alarmList"
            :key="index"
            class="alarm-item"
            :class="alarm.level"
          >
            <div class="alarm-time">{{ alarm.time }}</div>
            <div class="alarm-info">{{ alarm.info }}</div>
            <div class="alarm-level">{{ alarm.levelText }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import * as echarts from "echarts";
import { ArrowLeft } from "@element-plus/icons-vue";

const route = useRoute();
const router = useRouter();

// 设备标题
const deviceTitle = computed(() => {
  const type = route.query.type;
  const name = route.query.name;
  const typeText =
    {
      pump: "水泵",
      valve: "阀门",
      sensor: "传感器",
      controller: "控制器",
    }[type as string] || "设备";
  return `${typeText}详情 - ${name}`;
});

// 状态文本
const getStatusText = (status: string) => {
  return (
    {
      normal: "正常",
      warning: "警告",
      error: "故障",
    }[status] || "未知"
  );
};

// 模拟数据
const pumpData = ref({
  flow: (Math.random() * 100 + 200).toFixed(1),
  pressure: (Math.random() * 2 + 1).toFixed(2),
  power: (Math.random() * 50 + 100).toFixed(1),
  speed: Math.round(Math.random() * 500 + 2500),
});

const valveData = ref({
  openness: Math.round(Math.random() * 100),
  flow: (Math.random() * 100 + 150).toFixed(1),
  pressure: (Math.random() * 1 + 0.5).toFixed(2),
  temperature: (Math.random() * 30 + 20).toFixed(1),
});

const sensorData = ref({
  value: (Math.random() * 100).toFixed(2),
  unit: "mg/L",
  signal: Math.round(Math.random() * 20 + 80),
  accuracy: (Math.random() * 0.5 + 0.1).toFixed(2),
  sampleRate: Math.round(Math.random() * 50 + 50),
});

const controllerData = ref({
  cpu: Math.round(Math.random() * 30 + 20),
  memory: Math.round(Math.random() * 40 + 30),
  responseTime: Math.round(Math.random() * 50 + 10),
  connections: Math.round(Math.random() * 100 + 100),
});

// 告警记录
const alarmList = ref([
  {
    time: "2024-03-14 10:25:33",
    info: "设备温度超过警戒值",
    level: "warning",
    levelText: "警告",
  },
  {
    time: "2024-03-14 08:15:22",
    info: "通信中断",
    level: "error",
    levelText: "严重",
  },
  {
    time: "2024-03-14 06:30:45",
    info: "设备需要维护",
    level: "info",
    levelText: "提示",
  },
]);

// 图表实例
let historyChart: echarts.ECharts | null = null;

// 初始化图表
const initChart = () => {
  const chartDom = document.querySelector(".chart") as HTMLElement;
  if (!chartDom) return;

  historyChart = echarts.init(chartDom);
  const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`);
  const data = Array.from({ length: 24 }, () =>
    (Math.random() * 100).toFixed(1)
  );

  const option = {
    backgroundColor: "transparent",
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "line",
        lineStyle: {
          color: "rgba(0, 255, 255, 0.3)",
          width: 1,
        },
      },
    },
    grid: {
      top: 40,
      left: 50,
      right: 20,
      bottom: 40,
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: hours,
      axisLine: {
        lineStyle: {
          color: "rgba(255, 255, 255, 0.5)",
        },
      },
      axisLabel: {
        color: "rgba(255, 255, 255, 0.7)",
      },
    },
    yAxis: {
      type: "value",
      axisLine: {
        lineStyle: {
          color: "rgba(255, 255, 255, 0.5)",
        },
      },
      splitLine: {
        lineStyle: {
          color: "rgba(255, 255, 255, 0.1)",
        },
      },
      axisLabel: {
        color: "rgba(255, 255, 255, 0.7)",
      },
    },
    series: [
      {
        type: "line",
        data: data,
        smooth: true,
        symbol: "none",
        lineStyle: {
          color: "#00ffff",
          width: 2,
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: "rgba(0, 255, 255, 0.3)",
            },
            {
              offset: 1,
              color: "rgba(0, 255, 255, 0.1)",
            },
          ]),
        },
      },
    ],
  };

  historyChart.setOption(option);
};

// 自动更新数据
let updateTimer: NodeJS.Timer;
const startAutoUpdate = () => {
  updateTimer = setInterval(() => {
    pumpData.value = {
      flow: (Math.random() * 100 + 200).toFixed(1),
      pressure: (Math.random() * 2 + 1).toFixed(2),
      power: (Math.random() * 50 + 100).toFixed(1),
      speed: Math.round(Math.random() * 500 + 2500),
    };

    valveData.value = {
      openness: Math.round(Math.random() * 100),
      flow: (Math.random() * 100 + 150).toFixed(1),
      pressure: (Math.random() * 1 + 0.5).toFixed(2),
      temperature: (Math.random() * 30 + 20).toFixed(1),
    };

    sensorData.value = {
      value: (Math.random() * 100).toFixed(2),
      unit: "mg/L",
      signal: Math.round(Math.random() * 20 + 80),
      accuracy: (Math.random() * 0.5 + 0.1).toFixed(2),
      sampleRate: Math.round(Math.random() * 50 + 50),
    };

    controllerData.value = {
      cpu: Math.round(Math.random() * 30 + 20),
      memory: Math.round(Math.random() * 40 + 30),
      responseTime: Math.round(Math.random() * 50 + 10),
      connections: Math.round(Math.random() * 100 + 100),
    };

    // 更新图表数据
    if (historyChart) {
      const data = Array.from({ length: 24 }, () =>
        (Math.random() * 100).toFixed(1)
      );
      historyChart.setOption({
        series: [
          {
            data: data,
          },
        ],
      });
    }
  }, 3000);
};

onMounted(() => {
  initChart();
  startAutoUpdate();
  window.addEventListener("resize", () => historyChart?.resize());
});

onUnmounted(() => {
  clearInterval(updateTimer);
  historyChart?.dispose();
  window.removeEventListener("resize", () => historyChart?.resize());
});
</script>

<style lang="scss" scoped>
.device-detail-container {
  min-height: 100vh;
  background: #000;
  color: #fff;
  padding: 20px;
  background-image: radial-gradient(circle at center, #1a2b3c 0%, #000 100%);

  .header {
    display: flex;
    align-items: center;
    margin-bottom: 30px;

    .back {
      display: flex;
      align-items: center;
      cursor: pointer;
      color: #00ffff;
      font-size: 16px;

      &:hover {
        opacity: 0.8;
      }

      .el-icon {
        margin-right: 5px;
      }
    }

    .title {
      margin-left: 20px;
      font-size: 24px;
      font-weight: bold;
      background: linear-gradient(45deg, #00ffff, #0066ff);
      -webkit-background-clip: text;
      color: transparent;
    }
  }

  .content {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;

    > div {
      background: rgba(0, 30, 60, 0.5);
      border: 1px solid rgba(0, 255, 255, 0.1);
      border-radius: 8px;
      padding: 20px;
      backdrop-filter: blur(10px);

      &:hover {
        border-color: rgba(0, 255, 255, 0.3);
      }

      .card-header {
        font-size: 18px;
        color: #00ffff;
        margin-bottom: 20px;
        padding-bottom: 10px;
        border-bottom: 1px solid rgba(0, 255, 255, 0.1);
      }
    }
  }

  .info-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;

    .info-item {
      display: flex;
      flex-direction: column;
      gap: 5px;

      .label {
        color: #999;
        font-size: 14px;
      }

      .value {
        color: #00ffff;
        font-size: 16px;

        &.normal {
          color: #00ff00;
        }
        &.warning {
          color: #ffff00;
        }
        &.error {
          color: #ff0000;
        }
      }
    }
  }

  .data-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;

    .data-item {
      background: rgba(0, 30, 60, 0.3);
      padding: 15px;
      border-radius: 8px;
      display: flex;
      flex-direction: column;
      gap: 5px;

      .label {
        color: #999;
        font-size: 14px;
      }

      .value {
        color: #00ffff;
        font-size: 20px;
        font-weight: bold;
      }
    }
  }

  .chart-content {
    height: 300px;

    .chart {
      width: 100%;
      height: 100%;
    }
  }

  .alarm-list {
    .alarm-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px;
      border-radius: 4px;
      margin-bottom: 10px;
      background: rgba(0, 30, 60, 0.3);

      .alarm-time {
        color: #999;
        font-size: 14px;
      }

      .alarm-info {
        color: #fff;
        flex: 1;
        margin: 0 20px;
      }

      .alarm-level {
        padding: 2px 8px;
        border-radius: 4px;
        font-size: 12px;
      }

      &.warning {
        border-left: 3px solid #ffff00;
        .alarm-level {
          background: rgba(255, 255, 0, 0.2);
          color: #ffff00;
        }
      }

      &.error {
        border-left: 3px solid #ff0000;
        .alarm-level {
          background: rgba(255, 0, 0, 0.2);
          color: #ff0000;
        }
      }

      &.info {
        border-left: 3px solid #00ffff;
        .alarm-level {
          background: rgba(0, 255, 255, 0.2);
          color: #00ffff;
        }
      }
    }
  }
}

@media screen and (max-width: 1200px) {
  .device-detail-container {
    .content {
      grid-template-columns: 1fr;
    }
  }
}
</style>
