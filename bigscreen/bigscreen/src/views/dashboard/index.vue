<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from "vue";
import * as echarts from "echarts";
import { useIntervalFn } from "@vueuse/core";
import "echarts-liquidfill";

// 时间显示
const currentTime = ref(new Date().toLocaleString());
const { pause: timePause } = useIntervalFn(() => {
  currentTime.value = new Date().toLocaleString();
}, 1000);

// 站点列表数据
const stationList = ref([
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

// 自动更新站点数据
setInterval(() => {
  stationList.value = stationList.value.map((station) => {
    if (station.status === "error") return station;
    return {
      ...station,
      flow: (parseFloat(station.flow) + (Math.random() * 2 - 1)).toFixed(1),
      ph: (parseFloat(station.ph) + (Math.random() * 0.2 - 0.1)).toFixed(1),
      power:
        (parseFloat(station.power) + (Math.random() * 2 - 1)).toFixed(1) + "kW",
    };
  });
}, 2000);

// 设备列表数据
interface DeviceData {
  name: string;
  status: string;
  runtime: string;
  load: string;
  maintenance: string;
  icon: string;
  efficiency: string;
}

const deviceList = ref<DeviceData[]>([
  {
    name: "水泵A",
    status: "normal",
    runtime: "1234.5h",
    load: "85%",
    maintenance: "正常",
    icon: "el-icon-water-pump",
    efficiency: "85%",
  },
  {
    name: "水泵B",
    status: "warning",
    runtime: "892.3h",
    load: "92%",
    maintenance: "需检查",
    icon: "el-icon-water-pump",
    efficiency: "92%",
  },
  {
    name: "阀门1",
    status: "normal",
    runtime: "2156.7h",
    load: "75%",
    maintenance: "正常",
    icon: "el-icon-switch",
    efficiency: "75%",
  },
  {
    name: "阀门2",
    status: "error",
    runtime: "1678.2h",
    load: "0%",
    maintenance: "故障",
    icon: "el-icon-switch",
    efficiency: "0%",
  },
  {
    name: "传感器1",
    status: "normal",
    runtime: "3567.8h",
    load: "88%",
    maintenance: "正常",
    icon: "el-icon-cpu",
    efficiency: "88%",
  },
  {
    name: "传感器2",
    status: "warning",
    runtime: "2890.4h",
    load: "79%",
    maintenance: "需校准",
    icon: "el-icon-cpu",
    efficiency: "79%",
  },
  {
    name: "控制器1",
    status: "normal",
    runtime: "4521.6h",
    load: "82%",
    maintenance: "正常",
    icon: "el-icon-monitor",
    efficiency: "82%",
  },
  {
    name: "控制器2",
    status: "normal",
    runtime: "3789.2h",
    load: "86%",
    maintenance: "正常",
    icon: "el-icon-monitor",
    efficiency: "86%",
  },
]);

// 自动更新设备状态
setInterval(() => {
  deviceList.value = deviceList.value.map((device) => {
    if (device.status === "error") return device;
    return {
      ...device,
      load:
        (parseFloat(device.load) + (Math.random() * 4 - 2)).toFixed(0) + "%",
      runtime: (parseFloat(device.runtime) + 0.1).toFixed(1) + "h",
    };
  });
}, 3000);

// 环境数据
const envData = ref({
  temperature: "25.6",
  humidity: "65",
  waterLevel: "2.35",
  pressure: "101.3",
  windSpeed: "3.2",
  rainfall: "0.0",
  waterQuality: "优",
  airQuality: "良",
});

// 自动更新环境数据
setInterval(() => {
  envData.value = {
    temperature: (
      parseFloat(envData.value.temperature) +
      (Math.random() * 0.4 - 0.2)
    ).toFixed(1),
    humidity: (
      parseFloat(envData.value.humidity) +
      (Math.random() * 2 - 1)
    ).toFixed(0),
    waterLevel: (
      parseFloat(envData.value.waterLevel) +
      (Math.random() * 0.1 - 0.05)
    ).toFixed(2),
    pressure: (
      parseFloat(envData.value.pressure) +
      (Math.random() * 0.2 - 0.1)
    ).toFixed(1),
    windSpeed: (
      parseFloat(envData.value.windSpeed) +
      (Math.random() * 0.4 - 0.2)
    ).toFixed(1),
    rainfall: (
      parseFloat(envData.value.rainfall) +
      Math.random() * 0.1
    ).toFixed(1),
    waterQuality: envData.value.waterQuality,
    airQuality: envData.value.airQuality,
  };
}, 1000);

// 监测数据
interface MonitorData {
  nh3n: string;
  cod: string;
  ph: string;
  turbidity: string;
  dissolvedOxygen: string;
  conductivity: string;
  totalPhosphorus: string;
  totalNitrogen: string;
  gas: string;
  power: string;
}

const monitorData = ref<MonitorData>({
  nh3n: "0.52",
  cod: "45.6",
  ph: "7.2",
  turbidity: "3.5",
  dissolvedOxygen: "6.8",
  conductivity: "526",
  totalPhosphorus: "0.28",
  totalNitrogen: "1.65",
  gas: "2.3",
  power: "1234.5",
});

// 自动更新监测数据
setInterval(() => {
  monitorData.value = {
    nh3n: (
      parseFloat(monitorData.value.nh3n) +
      (Math.random() * 0.1 - 0.05)
    ).toFixed(2),
    cod: (parseFloat(monitorData.value.cod) + (Math.random() * 2 - 1)).toFixed(
      1
    ),
    ph: (
      parseFloat(monitorData.value.ph) +
      (Math.random() * 0.2 - 0.1)
    ).toFixed(1),
    turbidity: (
      parseFloat(monitorData.value.turbidity) +
      (Math.random() * 0.4 - 0.2)
    ).toFixed(1),
    dissolvedOxygen: (
      parseFloat(monitorData.value.dissolvedOxygen) +
      (Math.random() * 0.2 - 0.1)
    ).toFixed(1),
    conductivity: (
      parseFloat(monitorData.value.conductivity) +
      (Math.random() * 10 - 5)
    ).toFixed(0),
    totalPhosphorus: (
      parseFloat(monitorData.value.totalPhosphorus) +
      (Math.random() * 0.04 - 0.02)
    ).toFixed(2),
    totalNitrogen: (
      parseFloat(monitorData.value.totalNitrogen) +
      (Math.random() * 0.1 - 0.05)
    ).toFixed(2),
    gas: parseFloat(monitorData.value.gas) + (Math.random() * 1 + 1).toFixed(1),
    power: (parseFloat(monitorData.value.power) + Math.random() * 10).toFixed(
      1
    ),
  };
}, 2000);

// 告警信息
const alarmList = ref([
  {
    time: "10:25:33",
    info: "水泵1压力异常",
    level: "warning",
    levelText: "警告",
    device: "水泵1",
  },
  {
    time: "10:20:15",
    info: "有毒气体超标",
    level: "error",
    levelText: "严重",
    device: "传感器2",
  },
  {
    time: "10:15:42",
    info: "水位过高",
    level: "warning",
    levelText: "警告",
    device: "水位计",
  },
  {
    time: "10:10:28",
    info: "COD数值异常",
    level: "warning",
    levelText: "警告",
    device: "在线监测仪",
  },
]);

// 自动添加新的告警信息
setInterval(() => {
  const now = new Date();
  const time = `${now.getHours().toString().padStart(2, "0")}:${now
    .getMinutes()
    .toString()
    .padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}`;

  // 随机生成告警信息
  const alarmTypes = [
    { info: "水泵压力异常", level: "warning", device: "水泵" },
    { info: "有毒气体超标", level: "error", device: "气体传感器" },
    { info: "水位过高", level: "warning", device: "水位计" },
    { info: "pH值异常", level: "warning", device: "pH传感器" },
    { info: "设备离线", level: "error", device: "控制器" },
    { info: "水质超标", level: "error", device: "水质监测仪" },
  ];

  if (Math.random() < 0.3) {
    // 30%的概率生成新告警
    const alarm = alarmTypes[Math.floor(Math.random() * alarmTypes.length)];
    alarmList.value.unshift({
      time,
      info: alarm.info,
      level: alarm.level,
      levelText: alarm.level === "error" ? "严重" : "警告",
      device: alarm.device,
    });

    // 保持最新的10条记录
    if (alarmList.value.length > 10) {
      alarmList.value.pop();
    }
  }
}, 5000);

// 图表实例
const statisticsChart = ref<HTMLElement>();
const waterLevelChart = ref<HTMLElement>();
const qualityTrendChart = ref<HTMLElement>();
const powerChart = ref<HTMLElement>();
let charts: echarts.ECharts[] = [];

// 更新数据的定时器
const { pause: dataPause } = useIntervalFn(() => {
  updateData();
}, 3000);

// 更新数据
const updateData = () => {
  // 更新环境数据
  envData.value.temperature = (20 + Math.random() * 10).toFixed(1);
  envData.value.humidity = (50 + Math.random() * 30).toFixed(0);
  envData.value.waterLevel = (2 + Math.random()).toFixed(2);

  // 更新监测数据
  monitorData.value.nh3n = (0.2 + Math.random() * 0.6).toFixed(2);
  monitorData.value.cod = (30 + Math.random() * 30).toFixed(1);
  monitorData.value.gas = (1 + Math.random() * 2).toFixed(1);
  monitorData.value.power = (
    parseFloat(monitorData.value.power) +
    Math.random() * 10
  ).toFixed(1);

  // 更新图表数据
  updateCharts();
};

// 站点点击处理
const handleStationClick = (station: any) => {
  console.log("站点点击:", station);
};

onMounted(() => {
  initCharts();
  window.addEventListener("resize", handleResize);
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
  timePause();
  dataPause();
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

  // 初始化水位图表
  if (waterLevelChart.value) {
    const chart = echarts.init(waterLevelChart.value);
    charts.push(chart);
    chart.setOption({
      series: [
        {
          type: "liquidFill",
          data: [0.6, 0.5, 0.4],
          radius: "80%",
          color: ["#00ffff", "#0cc2ff", "#1a94bc"],
          backgroundStyle: {
            color: "rgba(0, 0, 0, 0.1)",
          },
          outline: {
            borderDistance: 3,
            itemStyle: {
              borderColor: "#00ffff",
              borderWidth: 2,
            },
          },
          label: {
            color: "#fff",
          },
        },
      ],
    });
  }

  // 初始化水质趋势图
  if (qualityTrendChart.value) {
    const chart = echarts.init(qualityTrendChart.value);
    charts.push(chart);
    chart.setOption({
      tooltip: {
        trigger: "axis",
      },
      legend: {
        data: ["COD", "NH3-N", "pH"],
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
        data: ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00", "24:00"],
        axisLine: {
          lineStyle: {
            color: "#fff",
          },
        },
      },
      yAxis: {
        type: "value",
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
          name: "COD",
          type: "line",
          smooth: true,
          data: [45, 42, 47, 43, 40, 45, 42],
          lineStyle: {
            color: "#00ffff",
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: "rgba(0,255,255,0.3)" },
              { offset: 1, color: "rgba(0,255,255,0)" },
            ]),
          },
        },
        {
          name: "NH3-N",
          type: "line",
          smooth: true,
          data: [0.5, 0.4, 0.6, 0.5, 0.4, 0.5, 0.4],
          lineStyle: {
            color: "#ff9f7f",
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: "rgba(255,159,127,0.3)" },
              { offset: 1, color: "rgba(255,159,127,0)" },
            ]),
          },
        },
        {
          name: "pH",
          type: "line",
          smooth: true,
          data: [7.2, 7.1, 7.3, 7.2, 7.0, 7.1, 7.2],
          lineStyle: {
            color: "#37a2da",
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: "rgba(55,162,218,0.3)" },
              { offset: 1, color: "rgba(55,162,218,0)" },
            ]),
          },
        },
      ],
    });
  }

  // 初始化电量图表
  if (powerChart.value) {
    const chart = echarts.init(powerChart.value);
    charts.push(chart);
    chart.setOption({
      tooltip: {
        trigger: "item",
      },
      series: [
        {
          name: "设备用电",
          type: "pie",
          radius: ["40%", "70%"],
          center: ["50%", "50%"],
          itemStyle: {
            borderRadius: 10,
            borderColor: "#fff",
            borderWidth: 2,
          },
          label: {
            show: true,
            color: "#fff",
          },
          data: [
            { value: 1048, name: "水泵系统" },
            { value: 735, name: "风机系统" },
            { value: 580, name: "污水处理" },
            { value: 484, name: "监控系统" },
            { value: 300, name: "照明系统" },
          ],
        },
      ],
    });
  }
};

const updateCharts = () => {
  // 更新水位图表
  const waterLevelChart = charts.find(
    (chart) => chart.getDom() === waterLevelChart.value
  );
  if (waterLevelChart) {
    const level = parseFloat(envData.value.waterLevel) / 4;
    waterLevelChart.setOption({
      series: [
        {
          data: [level, level * 0.9, level * 0.8],
        },
      ],
    });
  }

  // 更新水质趋势图
  const qualityChart = charts.find(
    (chart) => chart.getDom() === qualityTrendChart.value
  );
  if (qualityChart) {
    const now = new Date();
    const time = now.getHours() + ":" + now.getMinutes();
    const chartOption = qualityChart.getOption();
    const series = chartOption.series as any[];
    const xAxis = chartOption.xAxis as any[];

    if (series && series[0] && series[0].data) {
      series[0].data.shift();
      series[0].data.push(parseFloat(monitorData.value.cod));
    }

    if (series && series[1] && series[1].data) {
      series[1].data.shift();
      series[1].data.push(parseFloat(monitorData.value.nh3n));
    }

    if (xAxis && xAxis[0] && xAxis[0].data) {
      xAxis[0].data.shift();
      xAxis[0].data.push(time);
    }

    qualityChart.setOption({
      series: series,
      xAxis: xAxis,
    });
  }
};
</script>

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
        <div class="section-card">
          <div class="section-header">站点列表</div>
          <div class="station-list">
            <div
              v-for="(station, index) in stationList"
              :key="index"
              class="station-item"
            >
              <span class="name">站点{{ index + 1 }}</span>
              <span class="status" :class="station.status">{{
                station.statusText
              }}</span>
            </div>
          </div>
        </div>

        <!-- 数据统计 -->
        <div class="section-card">
          <div class="section-header">数据统计</div>
          <div class="chart-container">
            <div ref="statisticsChart" class="chart"></div>
          </div>
        </div>
      </div>

      <!-- 中间面板 -->
      <div class="center-panel panel">
        <!-- 设备状态 -->
        <div class="section-card">
          <div class="section-header">设备状态</div>
          <div class="device-grid">
            <div
              v-for="(device, index) in deviceList"
              :key="index"
              class="device-item"
              :class="device.status"
            >
              <i :class="device.icon"></i>
              <span class="name">{{ device.name }}</span>
              <div class="device-info">
                <span>运行: {{ device.runtime }}</span>
                <span>效率: {{ device.efficiency }}</span>
              </div>
              <div class="status-indicator" :class="device.status"></div>
            </div>
          </div>
        </div>

        <!-- 视频监控 -->
        <div class="section-card">
          <div class="section-header">视频监控</div>
          <div class="video-grid">
            <div class="video-item">
              <div class="video-placeholder">摄像头 1</div>
            </div>
            <div class="video-item">
              <div class="video-placeholder">摄像头 2</div>
            </div>
            <div class="video-item">
              <div class="video-placeholder">摄像头 3</div>
            </div>
            <div class="video-item">
              <div class="video-placeholder">摄像头 4</div>
            </div>
          </div>
        </div>

        <!-- 实时环境数据 -->
        <div class="section-card">
          <div class="section-header">实时环境数据</div>
          <div class="env-data-grid">
            <div class="env-item">
              <span class="label">温度</span>
              <span class="value">{{ envData.temperature }}°C</span>
            </div>
            <div class="env-item">
              <span class="label">湿度</span>
              <span class="value">{{ envData.humidity }}%</span>
            </div>
            <div class="env-item">
              <span class="label">水位</span>
              <span class="value">{{ envData.waterLevel }}m</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧面板 -->
      <div class="right-panel panel">
        <!-- 监测数据 -->
        <div class="section-card">
          <div class="section-header">监测数据</div>
          <div class="monitor-data">
            <div class="data-row">
              <span class="label">氨氮浓度:</span>
              <span class="value">{{ monitorData.nh3n }}mg/L</span>
            </div>
            <div class="data-row">
              <span class="label">COD浓度:</span>
              <span class="value">{{ monitorData.cod }}mg/L</span>
            </div>
            <div class="data-row">
              <span class="label">有毒气体:</span>
              <span class="value">{{ monitorData.gas }}ppm</span>
            </div>
            <div class="data-row">
              <span class="label">累计电量:</span>
              <span class="value">{{ monitorData.power }}kW·h</span>
            </div>
          </div>
        </div>

        <!-- 告警信息 -->
        <div class="section-card">
          <div class="section-header">告警信息</div>
          <div class="alarm-list">
            <div
              v-for="(alarm, index) in alarmList"
              :key="index"
              class="alarm-item"
              :class="alarm.level"
            >
              <span class="time">{{ alarm.time }}</span>
              <span class="info">{{ alarm.info }}</span>
              <span class="level-tag">{{ alarm.levelText }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.dashboard-container {
  width: 100%;
  height: 100vh;
  background: #000;
  color: #fff;
  padding: 10px;
  box-sizing: border-box;
  background-image: radial-gradient(circle at center, #1a2b3c 0%, #000 100%);
  display: flex;
  flex-direction: column;
  overflow: hidden;

  .header {
    height: 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    margin-bottom: 10px;
    flex-shrink: 0;
    background: rgba(0, 0, 0, 0.3);
    border-radius: 8px;
    border: 1px solid rgba(0, 255, 255, 0.1);

    .title {
      font-size: 24px;
      font-weight: bold;
      background: linear-gradient(to right, #00ffff, #00ff00);
      -webkit-background-clip: text;
      color: transparent;
      animation: titleGlow 2s infinite;
    }

    .time {
      font-size: 18px;
      color: #00ffff;
    }
  }

  .content {
    display: flex;
    gap: 10px;
    flex: 1;
    min-height: 0;
    overflow: hidden;

    .panel {
      background: rgba(0, 0, 0, 0.3);
      border-radius: 10px;
      padding: 10px;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(0, 255, 255, 0.1);
      display: flex;
      flex-direction: column;
      gap: 10px;
      overflow: hidden;
    }

    .left-panel {
      flex: 1;
      min-width: 300px;
    }

    .center-panel {
      flex: 2;
      min-width: 500px;
    }

    .right-panel {
      flex: 1;
      min-width: 300px;
    }
  }
}

.section-card {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  padding: 10px;
  border: 1px solid rgba(0, 255, 255, 0.1);
  animation: cardBreathing 3s infinite;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 0 20px rgba(0, 255, 255, 0.3);
  }

  .section-header {
    font-size: 16px;
    color: #00ffff;
    margin-bottom: 10px;
    padding-left: 10px;
    border-left: 3px solid #00ffff;
  }

  .chart-container {
    position: relative;
    height: 300px !important;

    &::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: radial-gradient(
        circle at center,
        rgba(0, 255, 255, 0.1) 0%,
        transparent 70%
      );
      pointer-events: none;
      z-index: 1;
    }

    .chart {
      height: 100%;
      width: 100%;
    }
  }
}

.station-list {
  .station-item {
    display: flex;
    justify-content: space-between;
    padding: 8px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);

    .status {
      padding: 2px 8px;
      border-radius: 2px;
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
  }
}

.device-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 10px;
  padding: 10px;

  .device-item {
    background: rgba(255, 255, 255, 0.05);
    padding: 15px;
    border-radius: 8px;
    text-align: center;
    position: relative;
    transition: all 0.3s;

    &:hover {
      transform: scale(1.05);
    }

    i {
      font-size: 24px;
      margin-bottom: 5px;
    }

    .device-info {
      font-size: 12px;
      color: rgba(255, 255, 255, 0.7);
      margin-top: 5px;
      display: flex;
      flex-direction: column;
    }

    .status-indicator {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      position: absolute;
      top: 5px;
      right: 5px;

      &.running {
        background: #00ff00;
        animation: pulse 1.5s infinite;
      }

      &.stopped {
        background: #ff0000;
      }

      &.warning {
        background: #ffff00;
        animation: warningPulse 1.5s infinite;
      }

      &.error {
        background: #ff0000;
        animation: errorPulse 1.5s infinite;
      }
    }
  }
}

.video-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  height: 200px;

  .video-item {
    background: rgba(0, 0, 0, 0.5);
    border-radius: 4px;
    overflow: hidden;

    .video-placeholder {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: rgba(255, 255, 255, 0.5);
    }
  }
}

.env-data-grid {
  display: flex;
  justify-content: space-around;
  padding: 20px 0;

  .env-item {
    text-align: center;

    .label {
      font-size: 14px;
      color: rgba(255, 255, 255, 0.7);
      margin-bottom: 5px;
    }

    .value {
      font-size: 24px;
      color: #00ffff;
    }
  }
}

.monitor-data {
  .data-row {
    display: flex;
    justify-content: space-between;
    padding: 8px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);

    .value {
      color: #00ffff;
    }
  }
}

.alarm-list {
  .alarm-item {
    padding: 8px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    display: flex;
    align-items: center;
    gap: 10px;

    .time {
      color: rgba(255, 255, 255, 0.5);
      font-size: 12px;
    }

    .level-tag {
      padding: 2px 8px;
      border-radius: 2px;
      font-size: 12px;
    }

    &.warning {
      border-left: 2px solid #ffff00;
      .level-tag {
        background: rgba(255, 255, 0, 0.2);
        color: #ffff00;
      }
    }

    &.error {
      border-left: 2px solid #ff0000;
      .level-tag {
        background: rgba(255, 0, 0, 0.2);
        color: #ff0000;
      }
    }
  }
}

@keyframes cardBreathing {
  0% {
    box-shadow: 0 0 10px rgba(0, 255, 255, 0.2);
  }
  50% {
    box-shadow: 0 0 20px rgba(0, 255, 255, 0.4);
  }
  100% {
    box-shadow: 0 0 10px rgba(0, 255, 255, 0.2);
  }
}

@keyframes titleGlow {
  0% {
    text-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
  }
  50% {
    text-shadow: 0 0 20px rgba(0, 255, 255, 0.8);
  }
  100% {
    text-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.5);
    opacity: 0.5;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes warningPulse {
  0% {
    transform: scale(1);
    opacity: 1;
    box-shadow: 0 0 10px #ffff00;
  }
  50% {
    transform: scale(1.5);
    opacity: 0.5;
    box-shadow: 0 0 20px #ffff00;
  }
  100% {
    transform: scale(1);
    opacity: 1;
    box-shadow: 0 0 10px #ffff00;
  }
}

@keyframes errorPulse {
  0% {
    transform: scale(1);
    opacity: 1;
    box-shadow: 0 0 10px #ff0000;
  }
  50% {
    transform: scale(1.5);
    opacity: 0.5;
    box-shadow: 0 0 20px #ff0000;
  }
  100% {
    transform: scale(1);
    opacity: 1;
    box-shadow: 0 0 10px #ff0000;
  }
}

@keyframes numberChange {
  from {
    transform: translateY(-20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes shimmer {
  100% {
    transform: translateX(100%);
  }
}

@keyframes warningBlink {
  0% {
    background: rgba(255, 255, 0, 0.1);
  }
  50% {
    background: rgba(255, 255, 0, 0.3);
  }
  100% {
    background: rgba(255, 255, 0, 0.1);
  }
}

@keyframes errorBlink {
  0% {
    background: rgba(255, 0, 0, 0.1);
  }
  50% {
    background: rgba(255, 0, 0, 0.3);
  }
  100% {
    background: rgba(255, 0, 0, 0.1);
  }
}

/* 响应式布局 */
@media screen and (max-width: 1400px) {
  .dashboard-container {
    .content {
      .left-panel {
        min-width: 250px;
      }
      .center-panel {
        min-width: 400px;
      }
      .right-panel {
        min-width: 250px;
      }
    }
  }
}

@media screen and (max-width: 1200px) {
  .dashboard-container {
    .content {
      flex-direction: column;

      .left-panel,
      .center-panel,
      .right-panel {
        width: 100%;
        min-width: 0;
        height: 33vh;
      }
    }
  }
}
</style>
