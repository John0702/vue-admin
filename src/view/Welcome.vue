<template>
  <div class="content">
    <!-- 运营状况 -->
    <div class="main-info">
      <el-card class="info">
        <el-button type="primary" icon="el-icon-user-solid" circle />
        <h2 class="num-info">{{ initData.totalUser }}</h2>
        <p class="desc">总用户数</p>
      </el-card>
      <el-card class="info">
        <el-button type="success" icon="el-icon-s-data" circle />
        <h2 class="num-info">{{ initData.totalCourse }}</h2>
        <p class="desc">总课程数</p>
      </el-card>
      <el-card class="info">
        <el-button type="danger" icon="el-icon-coin" circle />
        <h2 class="num-info">{{ initData.totalOrder }}</h2>
        <p class="desc">总订单数</p>
      </el-card>
      <el-card class="info">
        <el-button type="warning" icon="el-icon-data-line" circle />
        <h2 class="num-info">{{ initData.totalIncome }}</h2>
        <p class="desc">总收入</p>
      </el-card>
    </div>
    <!-- 图表 -->
    <div class="chart">
      <el-card class="e-chart" id="one-chart"></el-card>
      <el-card class="e-chart" id="two-chart"></el-card>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      initData: {
        totalUser: 0,
        totalCourse: 0,
        totalOrder: 0,
        totalIncome: 0,
      },
    };
  },
  created() {
    if(!localStorage.getItem('homeData')){
      this.getInitData();
    }
    else{
      this.initData = JSON.parse(localStorage.getItem('homeData'));
    }
  },
  methods: {
    // 初始化数据
    async getInitData() {
      const result = await this.$axios.get("/home/init");
      if (result.data.code===200) {
        Object.assign(this.initData, result.data.data);
        localStorage.setItem('homeData', JSON.stringify(this.initData));
      } else {
        this.$message.error(result.data.message);
      }
    },
    myEcharts() {
      var myChart = this.$echarts.init(document.getElementById("one-chart"));
      //配置图表
      var option = {
        tooltip: {},
        legend: {
          data: ["课程销量"],
        },
        xAxis: {
          data: [
            "docker实战",
            "SpringBoot",
            "vue3源码",
            "k8s全能",
            "React全栈",
            "SSR渲染",
          ],
        },
        yAxis: {},
        series: [
          {
            name: "课程销量",
            type: "bar",
            data: [5, 20, 36, 10, 10, 20],
          },
        ],
      };
      myChart.setOption(option);
    },
    twoEcharts() {
      var chartDom = document.getElementById("two-chart");
      var myChart = this.$echarts.init(chartDom);
      var option;

      option = {
        legend: {
          data: ["用户增长情况"],
        },
        xAxis: {
          type: "category",
          data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            name: "用户增长情况",
            data: [150, 230, 224, 218, 135, 147, 260],
            type: "line",
          },
        ],
      };
      myChart.setOption(option);
    },
  },
  mounted() {
    this.myEcharts();
    this.twoEcharts();
  },
};
</script>

<style scoped>
.content {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  height: 100%;
}
.main-info {
  flex: 1;
  display: flex;
  justify-content: space-around;
  background: white;
  min-width: 800px;
  border-radius: 8px;
}

.info {
  background: white;
  width: 18%;
  height: 60%;
  align-self: center;
  text-align: center;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
}
.info .num-info {
  margin: 10px 0px;
}
.info .desc {
  font-size: 10px;
  color: gray;
}
.chart {
  flex: 1;
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
  border-radius: 8px;
  width: 100%;
  height: 100%;
}

.e-chart {
  padding-top: 10px;
  width: 49%;
  height: auto;
  min-width: 500px;
}
</style>
