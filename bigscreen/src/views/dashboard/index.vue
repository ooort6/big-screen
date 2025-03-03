<template>
  <div class="dashboard-container">
    <div class="header">
      <div class="title">环境监测管理平台</div>
      <div class="time">{{ currentTime }}</div>
    </div>

    <div class="content">
      <!-- 左侧面板 -->
      <div class="left-panel panel">
        <!-- 站点列表 -->
        <div class="chart-card">
          <div class="card-header">站点列表</div>
          <div class="station-list">
            <div
              v-for="(station, index) in stationList"
              :key="index"
              class="station-item"
              :class="{ active: currentStation?.name === station.name }"
              @click="handleStationClick(station)"
            >
              <span class="name">{{ station.name }}</span>
              <span class="status" :class="station.status">{{
                station.statusText
              }}</span>
              <div class="station-data">
                <span>流量: {{ station.flow }}</span>
                <span>pH: {{ station.ph }}</span>
                <span>功率: {{ station.power }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 数据统计 -->
        <div class="chart-card">
          <div class="card-header">数据统计</div>
          <div class="chart-container">
            <div ref="statisticsChart" class="chart"></div>
          </div>
        </div>
      </div>

      <!-- 中间面板 -->
      <div class="center-panel panel">
        <!-- 设备状态 -->
        <div class="chart-card">
          <div class="card-header">设备状态</div>
          <div class="device-grid">
            <div
              v-for="(device, index) in deviceList"
              :key="index"
              class="device-item"
              :class="device.status"
              @click="handleDeviceClick(device)"
            >
              <component :is="device.icon" class="icon" />
              <span class="name">{{ device.name }}</span>
              <div class="device-info">
                <span>运行: {{ device.runtime }}</span>
                <span>负载: {{ device.load }}</span>
                <span>维护: {{ device.maintenance }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 环境数据 -->
        <div class="chart-card">
          <div class="card-header">
            <span>实时环境数据</span>
            <el-button type="text" @click="router.push(`/detail?type=env`)"
              >详情</el-button
            >
          </div>
          <div class="env-data-grid">
            <div class="data-item">
              <div class="label">温度</div>
              <div class="value">{{ envData.temperature }}°C</div>
            </div>
            <div class="data-item">
              <div class="label">湿度</div>
              <div class="value">{{ envData.humidity }}%</div>
            </div>
            <div class="data-item">
              <div class="label">水位</div>
              <div class="value">{{ envData.waterLevel }}m</div>
            </div>
            <div class="data-item">
              <div class="label">气压</div>
              <div class="value">{{ envData.pressure }}kPa</div>
            </div>
            <div class="data-item">
              <div class="label">风速</div>
              <div class="value">{{ envData.windSpeed }}m/s</div>
            </div>
            <div class="data-item">
              <div class="label">降雨量</div>
              <div class="value">{{ envData.rainfall }}mm</div>
            </div>
          </div>
        </div>

        <!-- 水位监测 -->
        <div class="chart-card">
          <div class="card-header">
            <span>水位监测</span>
            <el-button type="text" @click="router.push(`/detail?type=water`)"
              >详情</el-button
            >
          </div>
          <div class="water-level-grid">
            <div
              v-for="(level, index) in waterLevels"
              :key="index"
              class="data-item"
            >
              <div class="label">探头 {{ index + 1 }}</div>
              <div class="value" :class="level.status">{{ level.value }}m</div>
              <div class="status-text">{{ level.statusText }}</div>
            </div>
          </div>
        </div>

        <!-- 氨氮检测 -->
        <div class="chart-card">
          <div class="card-header">
            <span>氨氮检测</span>
            <el-button type="text" @click="router.push(`/detail?type=nh3n`)"
              >详情</el-button
            >
          </div>
          <div class="monitor-grid">
            <div class="data-box">
              <div class="current-value">
                <span class="value">{{ monitorData.nh3n }}</span>
                <span class="unit">mg/L</span>
              </div>
              <div class="label">实时浓度</div>
            </div>
            <div class="data-box">
              <div class="current-value">
                <span class="value">{{ monitorData.nh3nMax }}</span>
                <span class="unit">mg/L</span>
              </div>
              <div class="label">今日最高</div>
            </div>
            <div class="data-box">
              <div class="current-value">
                <span class="value">{{ monitorData.nh3nMin }}</span>
                <span class="unit">mg/L</span>
              </div>
              <div class="label">今日最低</div>
            </div>
            <div class="data-box">
              <div class="current-value">
                <span class="value">{{ monitorData.nh3nAvg }}</span>
                <span class="unit">mg/L</span>
              </div>
              <div class="label">平均值</div>
            </div>
          </div>
          <div class="nh3n-chart">
            <div ref="nh3nChart" class="chart"></div>
          </div>
        </div>

        <!-- COD检测 -->
        <div class="chart-card">
          <div class="card-header">
            <span>COD检测</span>
            <el-button type="text" @click="router.push(`/detail?type=cod`)"
              >详情</el-button
            >
          </div>
          <div class="monitor-grid">
            <div class="data-box">
              <div class="current-value">
                <span class="value">{{ monitorData.cod }}</span>
                <span class="unit">mg/L</span>
              </div>
              <div class="label">实时浓度</div>
            </div>
            <div class="data-box">
              <div class="current-value">
                <span class="value">{{ monitorData.codMax }}</span>
                <span class="unit">mg/L</span>
              </div>
              <div class="label">今日最高</div>
            </div>
            <div class="data-box">
              <div class="current-value">
                <span class="value">{{ monitorData.codMin }}</span>
                <span class="unit">mg/L</span>
              </div>
              <div class="label">今日最低</div>
            </div>
            <div class="data-box">
              <div class="current-value">
                <span class="value">{{ monitorData.codAvg }}</span>
                <span class="unit">mg/L</span>
              </div>
              <div class="label">平均值</div>
            </div>
          </div>
          <div class="cod-chart">
            <div ref="codChart" class="chart"></div>
          </div>
        </div>

        <!-- 有毒气体检测 -->
        <div class="chart-card">
          <div class="card-header">
            <span>有毒气体检测</span>
            <el-button type="text" @click="router.push(`/detail?type=gas`)"
              >详情</el-button
            >
          </div>
          <div class="monitor-grid">
            <div class="data-box">
              <div class="current-value">
                <span class="value">{{ gasData.ch4 }}</span>
                <span class="unit">ppm</span>
              </div>
              <div class="label">甲烷</div>
            </div>
            <div class="data-box">
              <div class="current-value">
                <span class="value">{{ gasData.co }}</span>
                <span class="unit">ppm</span>
              </div>
              <div class="label">一氧化碳</div>
            </div>
            <div class="data-box">
              <div class="current-value">
                <span class="value">{{ gasData.h2s }}</span>
                <span class="unit">ppm</span>
              </div>
              <div class="label">硫化氢</div>
            </div>
            <div class="data-box">
              <div class="current-value">
                <span class="value">{{ gasData.o2 }}</span>
                <span class="unit">%</span>
              </div>
              <div class="label">氧气</div>
            </div>
          </div>
          <div class="gas-chart">
            <div ref="gasChart" class="chart"></div>
          </div>
        </div>

        <!-- 累计电量 -->
        <div class="chart-card">
          <div class="card-header">
            <span>累计电量</span>
          </div>
          <div class="power-grid">
            <div class="power-total">
              <div class="value">{{ powerData.total }}kWh</div>
              <div class="label">总用电量</div>
            </div>
            <div class="power-stats">
              <div class="power-item">
                <span class="label">今日用电</span>
                <span class="value">{{ powerData.today }}kWh</span>
              </div>
              <div class="power-item">
                <span class="label">昨日用电</span>
                <span class="value">{{ powerData.yesterday }}kWh</span>
              </div>
              <div class="power-item">
                <span class="label">本月用电</span>
                <span class="value">{{ powerData.month }}kWh</span>
              </div>
            </div>
          </div>
          <div class="power-chart">
            <div ref="powerChart" class="chart"></div>
          </div>
        </div>
      </div>

      <!-- 右侧面板 -->
      <div class="right-panel panel">
        <!-- 监测数据 -->
        <div class="chart-card">
          <div class="card-header">监测数据</div>
          <div class="monitor-data">
            <div class="data-row">
              <span class="label">氨氮：</span>
              <span class="value">{{ monitorData.nh3n }}mg/L</span>
            </div>
            <div class="data-row">
              <span class="label">COD：</span>
              <span class="value">{{ monitorData.cod }}mg/L</span>
            </div>
            <div class="data-row">
              <span class="label">pH值：</span>
              <span class="value">{{ monitorData.ph }}</span>
            </div>
            <div class="data-row">
              <span class="label">浊度：</span>
              <span class="value">{{ monitorData.turbidity }}NTU</span>
            </div>
            <div class="data-row">
              <span class="label">溶解氧：</span>
              <span class="value">{{ monitorData.dissolvedOxygen }}mg/L</span>
            </div>
            <div class="data-row">
              <span class="label">电导率：</span>
              <span class="value">{{ monitorData.conductivity }}μS/cm</span>
            </div>
          </div>
        </div>

        <!-- 告警信息 -->
        <div class="chart-card">
          <div class="card-header">告警信息</div>
          <div class="alarm-list">
            <div
              v-for="(alarm, index) in alarmList"
              :key="index"
              class="alarm-item"
              :class="alarm.level"
            >
              <div class="alarm-header">
                <span class="station">{{ alarm.station }}</span>
                <span class="time">{{ alarm.time }}</span>
              </div>
              <div class="alarm-content">
                <span class="device">{{ alarm.device }}</span>
                <span class="info">{{ alarm.info }}</span>
              </div>
              <div class="alarm-footer">
                <span class="type">{{ alarm.type }}</span>
                <span class="level-tag">{{ alarm.levelText }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from "vue";
import * as echarts from "echarts";
import { useIntervalFn } from "@vueuse/core";
import { useRouter } from "vue-router";
import "echarts-liquidfill";
import {
  Cpu,
  Monitor,
  Connection,
  CircleCheck,
  Setting,
  Stopwatch,
  Switch,
  DataLine,
} from "@element-plus/icons-vue";

const router = useRouter();

// 当前选中的站点
const currentStation = ref<StationData | null>(null);

// 时间显示
const currentTime = ref(new Date().toLocaleString());
const { pause } = useIntervalFn(() => {
  currentTime.value = new Date().toLocaleString();
}, 1000);

// 图表实例
const statisticsChart = ref<HTMLElement>();
const tempHumidityChart = ref<HTMLElement>();
const waterLevelDetailChart = ref<HTMLElement>();
const nh3nDetailChart = ref<HTMLElement>();
const nh3nChart = ref<HTMLElement>();
const codChart = ref<HTMLElement>();
const gasChart = ref<HTMLElement>();
const powerChart = ref<HTMLElement>();
let charts: echarts.ECharts[] = [];

// 弹窗显示状态
const envDialogVisible = ref(false);
const waterLevelDialogVisible = ref(false);
const nh3nDialogVisible = ref(false);

// 水位数据
const waterLevels = ref([
  { value: 3.5, status: "normal", statusText: "正常" },
  { value: 4.2, status: "warning", statusText: "警告" },
  { value: 2.8, status: "normal", statusText: "正常" },
  { value: 1.5, status: "error", statusText: "异常" },
  { value: 3.9, status: "normal", statusText: "正常" },
]);

// 监测数据
const monitorData = ref({
  nh3n: "0.5",
  nh3nMax: "0.8",
  nh3nMin: "0.3",
  nh3nAvg: "0.6",
  cod: "45.6",
  codMax: "52.3",
  codMin: "38.9",
  codAvg: "46.8",
  ph: "7.5",
  turbidity: "1.5",
  dissolvedOxygen: "8.2",
  conductivity: "1400",
});

// 站点列表数据
interface StationData {
  name: string;
  status: string;
  statusText: string;
  flow: string;
  ph: string;
  power: string;
}

const stationList = ref<StationData[]>([
  {
    name: "站点1",
    status: "normal",
    statusText: "正常",
    flow: "125.6",
    ph: "7.2",
    power: "45.2kW",
  },
  {
    name: "站点2",
    status: "warning",
    statusText: "警告",
    flow: "98.3",
    ph: "6.8",
    power: "38.9kW",
  },
  {
    name: "站点3",
    status: "normal",
    statusText: "正常",
    flow: "156.2",
    ph: "7.4",
    power: "52.1kW",
  },
  {
    name: "站点4",
    status: "error",
    statusText: "异常",
    flow: "0",
    ph: "8.9",
    power: "0kW",
  },
  {
    name: "站点5",
    status: "normal",
    statusText: "正常",
    flow: "134.8",
    ph: "7.1",
    power: "48.6kW",
  },
  {
    name: "站点6",
    status: "warning",
    statusText: "警告",
    flow: "78.4",
    ph: "6.5",
    power: "35.2kW",
  },
]);

// 设备列表数据
interface DeviceData {
  name: string;
  status: string;
  icon: any;
  runtime: string;
  load: string;
  maintenance: string;
  efficiency?: string;
}

const deviceList = ref<DeviceData[]>([
  {
    name: "水泵A",
    status: "normal",
    icon: Connection,
    runtime: "1234.5h",
    load: "85%",
    maintenance: "正常",
    efficiency: "85%",
  },
  {
    name: "水泵B",
    status: "warning",
    icon: Connection,
    runtime: "892.3h",
    load: "92%",
    maintenance: "需检查",
    efficiency: "92%",
  },
  {
    name: "阀门1",
    status: "normal",
    icon: Switch,
    runtime: "2156.7h",
    load: "75%",
    maintenance: "正常",
    efficiency: "75%",
  },
  {
    name: "阀门2",
    status: "error",
    icon: Switch,
    runtime: "1678.2h",
    load: "0%",
    maintenance: "故障",
    efficiency: "0%",
  },
  {
    name: "传感器1",
    status: "normal",
    icon: DataLine,
    runtime: "3567.8h",
    load: "88%",
    maintenance: "正常",
    efficiency: "88%",
  },
  {
    name: "传感器2",
    status: "warning",
    icon: DataLine,
    runtime: "2890.4h",
    load: "79%",
    maintenance: "需校准",
    efficiency: "79%",
  },
  {
    name: "控制器1",
    status: "normal",
    icon: Setting,
    runtime: "4521.6h",
    load: "82%",
    maintenance: "正常",
    efficiency: "82%",
  },
  {
    name: "控制器2",
    status: "normal",
    icon: Setting,
    runtime: "3789.2h",
    load: "86%",
    maintenance: "正常",
    efficiency: "86%",
  },
]);

// 环境数据
const envData = ref({
  temperature: "25.6",
  humidity: "65",
  waterLevel: "2.35",
  pressure: "101.3",
  windSpeed: "2.5",
  rainfall: "0.5",
});

// 告警列表
const alarmList = ref([
  {
    station: "站点1",
    time: "10:25:33",
    device: "水泵A",
    info: "压力异常",
    type: "设备告警",
    level: "warning",
    levelText: "警告",
  },
  {
    station: "站点2",
    time: "10:20:15",
    device: "气体传感器",
    info: "甲烷浓度超标",
    type: "环境告警",
    level: "error",
    levelText: "严重",
  },
  {
    station: "站点3",
    time: "10:15:42",
    device: "水位传感器",
    info: "水位过高",
    type: "环境告警",
    level: "warning",
    levelText: "警告",
  },
  {
    station: "站点4",
    time: "10:10:28",
    device: "COD检测器",
    info: "数值异常",
    type: "数据告警",
    level: "info",
    levelText: "提示",
  },
]);

// 有毒气体数据
const gasData = ref({
  ch4: "0.5",
  co: "2.3",
  h2s: "0.2",
  o2: "20.9",
});

// 电量数据
const powerData = ref({
  total: "12345.6",
  today: "123.4",
  yesterday: "118.9",
  month: "3456.7",
});

// 站点点击处理
const handleStationClick = (station: StationData) => {
  currentStation.value = station;
  // 更新相关数据
  updateStationData(station);
};

// 更新站点相关数据
const updateStationData = (station: StationData) => {
  // 更新环境数据
  envData.value = {
    temperature: (20 + Math.random() * 10).toFixed(1),
    humidity: (50 + Math.random() * 30).toFixed(0),
    waterLevel: (2 + Math.random()).toFixed(2),
    pressure: (100 + Math.random() * 2).toFixed(1),
    windSpeed: (1 + Math.random() * 5).toFixed(1),
    rainfall: (Math.random() * 2).toFixed(1),
  };

  // 更新监测数据
  monitorData.value = {
    nh3n: (0.2 + Math.random() * 0.6).toFixed(2),
    nh3nMax: (0.8 + Math.random() * 0.4).toFixed(2),
    nh3nMin: (0.3 + Math.random() * 0.3).toFixed(2),
    nh3nAvg: (0.6 + Math.random() * 0.3).toFixed(2),
    cod: (30 + Math.random() * 30).toFixed(1),
    codMax: (52.3 + Math.random() * 2).toFixed(1),
    codMin: (38.9 + Math.random() * 2).toFixed(1),
    codAvg: (46.8 + Math.random() * 2).toFixed(1),
    ph: (6.5 + Math.random() * 1.5).toFixed(1),
    turbidity: (0.5 + Math.random() * 2).toFixed(1),
    dissolvedOxygen: (6 + Math.random() * 4).toFixed(1),
    conductivity: (1000 + Math.random() * 800).toFixed(0),
  };

  // 更新有毒气体数据
  gasData.value = {
    ch4: (Math.random() * 1).toFixed(2),
    co: (Math.random() * 5).toFixed(2),
    h2s: (Math.random() * 0.5).toFixed(2),
    o2: (20 + Math.random()).toFixed(2),
  };

  // 更新电量数据
  powerData.value = {
    total: (12000 + Math.random() * 1000).toFixed(1),
    today: (100 + Math.random() * 50).toFixed(1),
    yesterday: (100 + Math.random() * 50).toFixed(1),
    month: (3000 + Math.random() * 1000).toFixed(1),
  };

  // 更新图表数据
  updateCharts();
};

// 详情弹窗方法
const showEnvDetail = () => {
  router.push("/detail?type=env");
};

const showWaterLevelDetail = () => {
  router.push("/detail?type=water");
};

const showNh3nDetail = () => {
  router.push("/detail?type=nh3n");
};

// 设备点击处理
const handleDeviceClick = (device: DeviceData) => {
  let type = getDeviceType(device.name);
  let detailType = "";

  // 根据设备类型设置不同的详情类型
  switch (type) {
    case "pump":
      detailType = "pump-detail";
      break;
    case "valve":
      detailType = "valve-detail";
      break;
    case "sensor":
      detailType = "sensor-detail";
      break;
    case "controller":
      detailType = "controller-detail";
      break;
  }

  router.push({
    path: "/device-detail",
    query: {
      type: type,
      detailType: detailType,
      name: device.name,
      status: device.status,
      runtime: device.runtime,
      load: device.load,
      maintenance: device.maintenance,
      efficiency: device.efficiency || "85%",
    },
  });
};

const getDeviceType = (name: string): string => {
  if (name.includes("泵") || name.includes("水泵")) {
    return "pump";
  }
  if (name.includes("阀")) {
    return "valve";
  }
  if (name.includes("传感器") || name.includes("探头")) {
    return "sensor";
  }
  return "controller";
};

// 初始化图表方法
const initTempHumidityChart = () => {
  if (!tempHumidityChart.value) return;
  const chart = echarts.init(tempHumidityChart.value);
  const option = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross",
        label: {
          backgroundColor: "#6a7985",
        },
      },
    },
    legend: {
      data: ["温度", "湿度"],
      textStyle: {
        color: "#fff",
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
          color: "#fff",
        },
      },
      axisLabel: {
        color: "#fff",
        fontSize: 10,
      },
    },
    yAxis: [
      {
        type: "value",
        name: "温度(°C)",
        position: "left",
        axisLine: {
          lineStyle: {
            color: "#ff6b81",
          },
        },
        splitLine: {
          lineStyle: {
            color: "rgba(255,255,255,0.1)",
          },
        },
      },
      {
        type: "value",
        name: "湿度(%)",
        position: "right",
        axisLine: {
          lineStyle: {
            color: "#70a1ff",
          },
        },
        splitLine: {
          show: false,
        },
      },
    ],
    series: [
      {
        name: "温度",
        type: "line",
        data: Array.from({ length: 24 }, () =>
          (Math.random() * 10 + 20).toFixed(1)
        ),
        itemStyle: {
          color: "#ff6b81",
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: "rgba(255,107,129,0.3)",
            },
            {
              offset: 1,
              color: "rgba(255,107,129,0)",
            },
          ]),
        },
        smooth: true,
      },
      {
        name: "湿度",
        type: "line",
        yAxisIndex: 1,
        data: Array.from({ length: 24 }, () =>
          (Math.random() * 20 + 60).toFixed(1)
        ),
        itemStyle: {
          color: "#70a1ff",
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: "rgba(112,161,255,0.3)",
            },
            {
              offset: 1,
              color: "rgba(112,161,255,0)",
            },
          ]),
        },
        smooth: true,
      },
    ],
  };
  chart.setOption(option);
  charts.push(chart);
};

const initWaterLevelDetailChart = () => {
  if (!waterLevelDetailChart.value) return;
  const chart = echarts.init(waterLevelDetailChart.value);
  const option = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
    },
    legend: {
      data: ["实时水位", "警戒水位"],
      textStyle: {
        color: "#fff",
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
      data: ["探头1", "探头2", "探头3", "探头4", "探头5"],
      axisLine: {
        lineStyle: {
          color: "#fff",
        },
      },
    },
    yAxis: {
      type: "value",
      name: "水位(m)",
      axisLine: {
        lineStyle: {
          color: "#fff",
        },
      },
      splitLine: {
        lineStyle: {
          color: "rgba(255,255,255,0.1)",
        },
      },
    },
    series: [
      {
        name: "实时水位",
        type: "bar",
        data: waterLevels.value.map((level) => level.value),
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: "#00ffff",
            },
            {
              offset: 1,
              color: "rgba(0,255,255,0.1)",
            },
          ]),
        },
      },
      {
        name: "警戒水位",
        type: "line",
        data: [4, 4, 4, 4, 4],
        lineStyle: {
          color: "#ff4757",
          type: "dashed",
        },
        symbol: "none",
      },
    ],
  };
  chart.setOption(option);
  charts.push(chart);
};

const initNh3nDetailChart = () => {
  if (!nh3nDetailChart.value) return;
  const chart = echarts.init(nh3nDetailChart.value);
  const option = {
    tooltip: {
      trigger: "axis",
    },
    legend: {
      data: ["氨氮浓度"],
      textStyle: {
        color: "#fff",
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
      data: Array.from({ length: 30 }, (_, i) => `${i + 1}日`),
      axisLine: {
        lineStyle: {
          color: "#fff",
        },
      },
    },
    yAxis: {
      type: "value",
      name: "浓度(mg/L)",
      axisLine: {
        lineStyle: {
          color: "#fff",
        },
      },
      splitLine: {
        lineStyle: {
          color: "rgba(255,255,255,0.1)",
        },
      },
    },
    series: [
      {
        name: "氨氮浓度",
        type: "line",
        data: Array.from({ length: 30 }, () =>
          (Math.random() * 2 + 1).toFixed(2)
        ),
        markLine: {
          silent: true,
          lineStyle: {
            color: "#ff4757",
          },
          data: [
            {
              yAxis: 2.0,
              name: "标准限值",
            },
          ],
        },
        itemStyle: {
          color: "#ffa502",
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: "rgba(255,165,2,0.3)",
            },
            {
              offset: 1,
              color: "rgba(255,165,2,0)",
            },
          ]),
        },
        smooth: true,
      },
    ],
  };
  chart.setOption(option);
  charts.push(chart);
};

const initNh3nChart = () => {
  if (!nh3nChart.value) return;
  const chart = echarts.init(nh3nChart.value);
  const option = {
    backgroundColor: "rgba(0, 0, 0, 0.2)",
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
      top: 50,
      left: 60,
      right: 20,
      bottom: 30,
      containLabel: true,
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: Array.from({ length: 60 }, (_, i) => `${i}s`),
      axisLine: {
        lineStyle: {
          color: "rgba(255, 255, 255, 0.5)",
        },
      },
      axisLabel: {
        fontSize: 12,
        color: "rgba(255, 255, 255, 0.7)",
      },
    },
    yAxis: {
      type: "value",
      name: "浓度(mg/L)",
      nameTextStyle: {
        color: "rgba(255, 255, 255, 0.7)",
        fontSize: 12,
        padding: [0, 30, 0, 0],
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: "rgba(255, 255, 255, 0.5)",
        },
      },
      splitLine: {
        lineStyle: {
          color: "rgba(255, 255, 255, 0.1)",
          type: "dashed",
        },
      },
      axisLabel: {
        fontSize: 12,
        color: "rgba(255, 255, 255, 0.7)",
        formatter: "{value}",
      },
    },
    series: [
      {
        type: "line",
        data: Array.from({ length: 60 }, () =>
          (Math.random() * 2 + 1).toFixed(2)
        ),
        itemStyle: {
          color: "#ffa502",
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: "rgba(255, 165, 2, 0.3)",
            },
            {
              offset: 1,
              color: "rgba(255, 165, 2, 0)",
            },
          ]),
        },
        smooth: true,
        showSymbol: false,
      },
    ],
  };
  chart.setOption(option);
  charts.push(chart);

  // 自动更新数据
  setInterval(() => {
    const data = option.series[0].data;
    data.shift();
    data.push((Math.random() * 2 + 1).toFixed(2));
    chart.setOption({
      series: [
        {
          data: data,
        },
      ],
    });
  }, 1000);
};

const initCodChart = () => {
  if (!codChart.value) return;
  const chart = echarts.init(codChart.value);
  const option = {
    backgroundColor: "rgba(0, 0, 0, 0.2)",
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
      top: 50,
      left: 60,
      right: 20,
      bottom: 30,
      containLabel: true,
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: Array.from({ length: 60 }, (_, i) => `${i}s`),
      axisLine: {
        lineStyle: {
          color: "rgba(255,255,255,0.5)",
        },
      },
      axisLabel: {
        fontSize: 10,
      },
    },
    yAxis: {
      type: "value",
      name: "浓度",
      nameTextStyle: {
        color: "rgba(255,255,255,0.5)",
      },
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
        fontSize: 10,
      },
    },
    series: [
      {
        type: "line",
        data: Array.from({ length: 60 }, () =>
          (Math.random() * 20 + 35).toFixed(1)
        ),
        itemStyle: {
          color: "#ff9f7f",
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: "rgba(255,159,127,0.3)",
            },
            {
              offset: 1,
              color: "rgba(255,159,127,0)",
            },
          ]),
        },
        smooth: true,
        showSymbol: false,
      },
    ],
  };
  chart.setOption(option);
  charts.push(chart);

  // 自动更新数据
  setInterval(() => {
    const data = option.series[0].data;
    data.shift();
    data.push((Math.random() * 20 + 35).toFixed(1));
    chart.setOption({
      series: [
        {
          data: data,
        },
      ],
    });
  }, 1000);
};

const initGasChart = () => {
  if (!gasChart.value) return;
  const chart = echarts.init(gasChart.value);
  const option = {
    backgroundColor: "rgba(0, 0, 0, 0.2)",
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
      top: 50,
      left: 60,
      right: 20,
      bottom: 30,
      containLabel: true,
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: Array.from({ length: 60 }, (_, i) => `${i}s`),
      axisLine: {
        lineStyle: {
          color: "rgba(255,255,255,0.5)",
        },
      },
      axisLabel: {
        fontSize: 10,
      },
    },
    yAxis: {
      type: "value",
      name: "浓度",
      nameTextStyle: {
        color: "rgba(255,255,255,0.5)",
      },
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
        fontSize: 10,
      },
    },
    series: [
      {
        name: "甲烷",
        type: "line",
        data: Array.from({ length: 60 }, () => (Math.random() * 1).toFixed(2)),
        itemStyle: { color: "#ff9f7f" },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "rgba(255,159,127,0.3)" },
            { offset: 1, color: "rgba(255,159,127,0)" },
          ]),
        },
        smooth: true,
        showSymbol: false,
      },
      {
        name: "一氧化碳",
        type: "line",
        data: Array.from({ length: 60 }, () => (Math.random() * 5).toFixed(2)),
        itemStyle: { color: "#ff6b81" },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "rgba(255,107,129,0.3)" },
            { offset: 1, color: "rgba(255,107,129,0)" },
          ]),
        },
        smooth: true,
        showSymbol: false,
      },
      {
        name: "硫化氢",
        type: "line",
        data: Array.from({ length: 60 }, () =>
          (Math.random() * 0.5).toFixed(2)
        ),
        itemStyle: { color: "#ffd43b" },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "rgba(255,212,59,0.3)" },
            { offset: 1, color: "rgba(255,212,59,0)" },
          ]),
        },
        smooth: true,
        showSymbol: false,
      },
      {
        name: "氧气",
        type: "line",
        data: Array.from({ length: 60 }, () => (20 + Math.random()).toFixed(2)),
        itemStyle: { color: "#70a1ff" },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "rgba(112,161,255,0.3)" },
            { offset: 1, color: "rgba(112,161,255,0)" },
          ]),
        },
        smooth: true,
        showSymbol: false,
      },
    ],
  };
  chart.setOption(option);
  charts.push(chart);

  // 自动更新数据
  setInterval(() => {
    const newData = {
      ch4: (Math.random() * 1).toFixed(2),
      co: (Math.random() * 5).toFixed(2),
      h2s: (Math.random() * 0.5).toFixed(2),
      o2: (20 + Math.random()).toFixed(2),
    };

    // 更新数据显示
    gasData.value = newData;

    // 更新图表
    const series = option.series.map((s: any) => {
      const data = s.data.slice(1);
      switch (s.name) {
        case "甲烷":
          data.push(newData.ch4);
          break;
        case "一氧化碳":
          data.push(newData.co);
          break;
        case "硫化氢":
          data.push(newData.h2s);
          break;
        case "氧气":
          data.push(newData.o2);
          break;
      }
      return { data };
    });

    chart.setOption({ series });
  }, 1000);
};

const initPowerChart = () => {
  if (!powerChart.value) return;
  const chart = echarts.init(powerChart.value);
  const option = {
    backgroundColor: "rgba(0, 0, 0, 0.2)",
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
      top: 50,
      left: 60,
      right: 20,
      bottom: 30,
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        return `${date.getMonth() + 1}/${date.getDate()}`;
      }),
      axisLine: {
        lineStyle: {
          color: "rgba(255,255,255,0.5)",
        },
      },
    },
    yAxis: {
      type: "value",
      name: "用电量(kWh)",
      nameTextStyle: {
        color: "rgba(255,255,255,0.5)",
      },
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
    },
    series: [
      {
        name: "日用电量",
        type: "bar",
        data: Array.from({ length: 7 }, () =>
          (Math.random() * 50 + 100).toFixed(1)
        ),
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "#00ffff" },
            { offset: 1, color: "#006666" },
          ]),
        },
        barWidth: "40%",
      },
    ],
  };
  chart.setOption(option);
  charts.push(chart);

  // 每小时更新一次数据
  setInterval(() => {
    const newData = Array.from({ length: 7 }, () =>
      (Math.random() * 50 + 100).toFixed(1)
    );
    chart.setOption({
      series: [
        {
          data: newData,
        },
      ],
    });
  }, 3600000);
};

onMounted(() => {
  initCharts();
  initNh3nChart();
  initCodChart();
  initGasChart();
  initPowerChart();
  window.addEventListener("resize", handleResize);
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
  pause();
  charts.forEach((chart) => chart.dispose());
});

const handleResize = () => {
  nextTick(() => {
    charts.forEach((chart) => {
      chart && chart.resize();
    });
  });
};

const initCharts = () => {
  // 初始化数据统计图表
  if (statisticsChart.value) {
    const chart = echarts.init(statisticsChart.value);
    charts.push(chart);

    // 生成模拟数据
    const hours = [
      "00:00",
      "02:00",
      "04:00",
      "06:00",
      "08:00",
      "10:00",
      "12:00",
      "14:00",
      "16:00",
      "18:00",
      "20:00",
      "22:00",
    ];
    const data = hours.map(() => ({
      flow: Math.round(Math.random() * 100 + 50),
      quality: Math.round(Math.random() * 100 + 80),
      energy: Math.round(Math.random() * 100 + 30),
    }));

    chart.setOption({
      backgroundColor: "transparent",
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
        textStyle: {
          color: "#fff",
        },
        backgroundColor: "rgba(0,0,0,0.8)",
        borderColor: "#00ffff",
      },
      legend: {
        data: ["流量", "水质", "能耗"],
        textStyle: {
          color: "#fff",
        },
        top: 10,
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        top: "15%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        data: hours,
        axisLine: {
          lineStyle: {
            color: "#fff",
          },
        },
        axisLabel: {
          color: "#fff",
          fontSize: 10,
        },
      },
      yAxis: {
        type: "value",
        splitLine: {
          lineStyle: {
            color: "rgba(255,255,255,0.1)",
          },
        },
        axisLine: {
          lineStyle: {
            color: "#fff",
          },
        },
        axisLabel: {
          color: "#fff",
        },
      },
      series: [
        {
          name: "流量",
          type: "bar",
          data: data.map((item) => item.flow),
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: "#00ffff" },
              { offset: 1, color: "#006666" },
            ]),
          },
          barWidth: "20%",
        },
        {
          name: "水质",
          type: "line",
          data: data.map((item) => item.quality),
          smooth: true,
          symbol: "circle",
          symbolSize: 8,
          lineStyle: {
            color: "#00ff00",
            width: 2,
          },
          itemStyle: {
            color: "#00ff00",
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: "rgba(0,255,0,0.3)" },
              { offset: 1, color: "rgba(0,255,0,0)" },
            ]),
          },
        },
        {
          name: "能耗",
          type: "line",
          data: data.map((item) => item.energy),
          smooth: true,
          symbol: "circle",
          symbolSize: 8,
          lineStyle: {
            color: "#ff9f7f",
            width: 2,
          },
          itemStyle: {
            color: "#ff9f7f",
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: "rgba(255,159,127,0.3)" },
              { offset: 1, color: "rgba(255,159,127,0)" },
            ]),
          },
        },
      ],
    });

    // 添加自动更新效果
    setInterval(() => {
      const newData = hours.map(() => ({
        flow: Math.round(Math.random() * 100 + 50),
        quality: Math.round(Math.random() * 100 + 80),
        energy: Math.round(Math.random() * 100 + 30),
      }));

      chart.setOption({
        series: [
          {
            data: newData.map((item) => item.flow),
          },
          {
            data: newData.map((item) => item.quality),
          },
          {
            data: newData.map((item) => item.energy),
          },
        ],
      });
    }, 3000);
  }
};

// 更新图表数据
const updateCharts = () => {
  // 更新统计图表
  const statisticsChartInstance = charts.find(
    (chart) => chart.getDom() === statisticsChart.value
  );
  if (statisticsChartInstance) {
    const hours = [
      "00:00",
      "02:00",
      "04:00",
      "06:00",
      "08:00",
      "10:00",
      "12:00",
      "14:00",
      "16:00",
      "18:00",
      "20:00",
      "22:00",
    ];
    const newData = hours.map(() => ({
      flow: Math.round(Math.random() * 100 + 50),
      quality: Math.round(Math.random() * 100 + 80),
      energy: Math.round(Math.random() * 100 + 30),
    }));

    statisticsChartInstance.setOption({
      series: [
        {
          data: newData.map((item) => item.flow),
        },
        {
          data: newData.map((item) => item.quality),
        },
        {
          data: newData.map((item) => item.energy),
        },
      ],
    });
  }

  // 更新氨氮图表
  const nh3nChartInstance = charts.find(
    (chart) => chart.getDom() === nh3nChart.value
  );
  if (nh3nChartInstance) {
    const option = nh3nChartInstance.getOption();
    const data = (option.series as any)[0].data;
    data.shift();
    data.push((Math.random() * 2 + 1).toFixed(2));
    nh3nChartInstance.setOption({
      series: [
        {
          data: data,
        },
      ],
    });
  }

  // 更新COD图表
  const codChartInstance = charts.find(
    (chart) => chart.getDom() === codChart.value
  );
  if (codChartInstance) {
    const option = codChartInstance.getOption();
    const data = (option.series as any)[0].data;
    data.shift();
    data.push((Math.random() * 20 + 35).toFixed(1));
    codChartInstance.setOption({
      series: [
        {
          data: data,
        },
      ],
    });
  }
};
</script>

<style lang="scss" scoped>
/* 添加全局滚动条样式 */
:deep(*::-webkit-scrollbar) {
  width: 12px;
  height: 12px;
}

:deep(*::-webkit-scrollbar-track) {
  background: rgba(0, 30, 60, 0.3);
  border-radius: 0;
}

:deep(*::-webkit-scrollbar-thumb) {
  background: rgba(100, 100, 100, 0.4);
  border: 2px solid transparent;
  background-clip: padding-box;
  border-radius: 6px;

  &:hover {
    background: rgba(100, 100, 100, 0.7);
    border: 2px solid transparent;
    background-clip: padding-box;
  }
}

.dashboard-container {
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

    .title {
      font-size: 24px;
      font-weight: bold;
      background: linear-gradient(45deg, #00ffff, #0066ff);
      -webkit-background-clip: text;
      color: transparent;
      text-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
    }

    .time {
      font-size: 18px;
      color: #00ffff;
    }
  }

  .content {
    flex: 1;
    display: flex;
    gap: 20px;
    height: calc(100% - 80px);

    .panel {
      display: flex;
      flex-direction: column;
      gap: 20px;

      &.left-panel {
        width: 25%;
        overflow-y: auto;
      }

      &.center-panel {
        width: 50%;
        overflow-y: auto;
      }

      &.right-panel {
        width: 25%;
        overflow-y: auto;
      }
    }
  }

  .chart-card {
    background: rgba(0, 30, 60, 0.5);
    border: 1px solid rgba(0, 255, 255, 0.1);
    border-radius: 8px;
    padding: 15px;
    backdrop-filter: blur(10px);
    flex: 1;
    display: flex;
    flex-direction: column;
    box-shadow: 0 0 20px rgba(0, 255, 255, 0.1);
    transition: all 0.3s ease;

    &:hover {
      border-color: rgba(0, 255, 255, 0.3);
      box-shadow: 0 0 30px rgba(0, 255, 255, 0.2);
    }

    .card-header {
      font-size: 18px;
      color: #00ffff;
      margin-bottom: 15px;
      padding-bottom: 10px;
      border-bottom: 1px solid rgba(0, 255, 255, 0.1);
      display: flex;
      justify-content: space-between;
      align-items: center;

      :deep(.el-button) {
        padding: 0;
        height: auto;
        font-size: 14px;
        color: rgba(0, 255, 255, 0.8);

        &:hover {
          color: #00ffff;
        }
      }
    }

    .chart-container {
      flex: 1;
      min-height: 300px;

      .chart {
        width: 100%;
        height: 100%;
      }
    }
  }

  .station-list {
    .station-item {
      padding: 10px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        background: rgba(0, 255, 255, 0.1);
      }

      .name {
        font-size: 16px;
        margin-right: 10px;
      }

      .status {
        padding: 2px 8px;
        border-radius: 4px;
        font-size: 12px;

        &.normal {
          background: rgba(0, 255, 0, 0.2);
          color: #00ff00;
        }

        &.warning {
          background: rgba(255, 255, 0, 0.2);
          color: #ffff00;
        }

        &.error {
          background: rgba(255, 0, 0, 0.2);
          color: #ff0000;
        }
      }

      .station-data {
        margin-top: 5px;
        display: flex;
        gap: 10px;
        font-size: 12px;
        color: #999;
      }

      &.active {
        background: rgba(0, 255, 255, 0.2);
        border-left: 3px solid #00ffff;
        transform: translateX(5px);
      }
    }
  }

  .device-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    padding: 20px;

    .device-item {
      background: rgba(0, 30, 60, 0.3);
      border: 1px solid rgba(0, 255, 255, 0.1);
      border-radius: 8px;
      padding: 15px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        transform: translateY(-2px);
        border-color: rgba(0, 255, 255, 0.5);
        box-shadow: 0 0 15px rgba(0, 255, 255, 0.2);

        .icon {
          transform: scale(1.1);
        }
      }

      &:active {
        transform: translateY(0);
      }

      .icon {
        font-size: 36px;
        color: #00ffff;
        transition: all 0.3s ease;
        padding: 10px;
        border-radius: 50%;
        background: rgba(0, 255, 255, 0.1);
      }

      .name {
        font-size: 16px;
        color: #fff;
      }

      .device-info {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 5px;
        font-size: 12px;
        color: #999;

        span {
          display: block;
          text-align: center;
        }
      }

      &.normal {
        border-color: rgba(0, 255, 0, 0.3);
        .icon {
          color: #00ff00;
          background: rgba(0, 255, 0, 0.1);
        }
      }

      &.warning {
        border-color: rgba(255, 255, 0, 0.3);
        .icon {
          color: #ffff00;
          background: rgba(255, 255, 0, 0.1);
        }
      }

      &.error {
        border-color: rgba(255, 0, 0, 0.3);
        .icon {
          color: #ff0000;
          background: rgba(255, 0, 0, 0.1);
        }
      }
    }
  }

  .env-data-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 15px;
    padding: 10px;

    .data-item {
      background: rgba(0, 30, 60, 0.3);
      padding: 15px;
      border-radius: 8px;
      text-align: center;

      .label {
        font-size: 14px;
        color: #999;
        margin-bottom: 5px;
      }

      .value {
        font-size: 20px;
        color: #00ffff;
      }
    }
  }

  .monitor-data {
    .data-row {
      display: flex;
      justify-content: space-between;
      padding: 10px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);

      .label {
        color: #999;
      }

      .value {
        color: #00ffff;
      }
    }
  }

  .alarm-list {
    .alarm-item {
      padding: 15px;
      border-left: 3px solid transparent;
      margin-bottom: 15px;
      background: rgba(0, 30, 60, 0.3);
      border-radius: 4px;

      .alarm-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;

        .station {
          font-weight: bold;
          color: #fff;
        }

        .time {
          font-size: 12px;
          color: #999;
        }
      }

      .alarm-content {
        margin-bottom: 10px;

        .device {
          color: #00ffff;
          margin-right: 10px;
        }

        .info {
          color: #fff;
        }
      }

      .alarm-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .type {
          font-size: 12px;
          color: #999;
        }

        .level-tag {
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 12px;
        }
      }

      &.warning {
        border-left-color: #ffff00;
        .level-tag {
          background: rgba(255, 255, 0, 0.2);
          color: #ffff00;
        }
      }

      &.error {
        border-left-color: #ff0000;
        .level-tag {
          background: rgba(255, 0, 0, 0.2);
          color: #ff0000;
        }
      }

      &.info {
        border-left-color: #00ffff;
        .level-tag {
          background: rgba(0, 255, 255, 0.2);
          color: #00ffff;
        }
      }
    }
  }

  .water-level-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 10px;
    padding: 10px;

    .data-item {
      background: rgba(0, 30, 60, 0.3);
      padding: 15px;
      border-radius: 8px;
      text-align: center;

      .label {
        font-size: 14px;
        color: #999;
        margin-bottom: 5px;
      }

      .value {
        font-size: 20px;
        margin-bottom: 5px;

        &.normal {
          color: #00ffff;
        }

        &.warning {
          color: #ffff00;
        }

        &.error {
          color: #ff0000;
        }
      }

      .status-text {
        font-size: 12px;
        color: #999;
      }
    }
  }

  .monitor-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 15px;
    padding: 15px;
    margin-bottom: 15px;

    .data-box {
      background: rgba(0, 30, 60, 0.3);
      border-radius: 8px;
      padding: 15px;
      text-align: center;
      border: 1px solid rgba(0, 255, 255, 0.1);
      transition: all 0.3s ease;

      &:hover {
        border-color: rgba(0, 255, 255, 0.3);
        transform: translateY(-3px);
      }

      .current-value {
        margin-bottom: 8px;
        display: flex;
        align-items: baseline;
        justify-content: center;
        gap: 5px;

        .value {
          font-size: 24px;
          color: #00ffff;
          font-weight: bold;
        }

        .unit {
          font-size: 12px;
          color: #666;
        }
      }

      .label {
        font-size: 14px;
        color: #999;
      }
    }
  }

  .nh3n-chart,
  .cod-chart,
  .gas-chart,
  .power-chart {
    height: 300px;
    margin: 20px 0;

    .chart {
      width: 100%;
      height: 100%;
    }
  }

  .power-grid {
    display: flex;
    gap: 20px;
    padding: 15px;
    margin-bottom: 15px;

    .power-total {
      flex: 1;
      background: rgba(0, 30, 60, 0.3);
      border-radius: 8px;
      padding: 20px;
      text-align: center;
      border: 1px solid rgba(0, 255, 255, 0.1);

      .value {
        font-size: 32px;
        color: #00ffff;
        font-weight: bold;
        margin-bottom: 10px;
      }

      .label {
        font-size: 14px;
        color: #999;
      }
    }

    .power-stats {
      flex: 2;
      display: flex;
      flex-direction: column;
      gap: 10px;

      .power-item {
        background: rgba(0, 30, 60, 0.3);
        border-radius: 8px;
        padding: 10px 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border: 1px solid rgba(0, 255, 255, 0.1);

        .label {
          color: #999;
        }

        .value {
          color: #00ffff;
          font-weight: bold;
        }
      }
    }
  }
}

@media screen and (max-width: 1400px) {
  .dashboard-container {
    .content {
      .panel {
        &.left-panel {
          width: 30%;
        }
        &.center-panel {
          width: 40%;
        }
        &.right-panel {
          width: 30%;
        }
      }
    }
  }
}

@media screen and (max-width: 1200px) {
  .dashboard-container {
    .content {
      flex-direction: column;

      .panel {
        width: 100% !important;
        height: auto;
      }
    }
  }
}
</style>
