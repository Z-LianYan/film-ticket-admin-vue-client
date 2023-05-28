<template>
  <div>
    <br />
    <el-form label-width="120px">
      <el-form-item label="统计类型" style="display: inline-block">
          <el-select
            style="width:200px;"
            v-model="fetchOptions.type"
            placeholder="请选择统计类型"
            @change="fetchData"
          >
            <el-option label="按时间段统计" :value="1"/>
            <el-option label="按日期统计" :value="2"/>
          </el-select>
        </el-form-item>
      <el-form-item label="日期" style="display: inline-block">
          <el-date-picker
            v-model="fetchOptions.dates"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            type="daterange"
            :picker-options="pickerOptions"
            @change="fetchData(true)"
            format="yyyy-MM-dd"
          />
        </el-form-item>
    </el-form>
    <div :class="className" ref="chart" :style="{height:height,width:width}"></div>
  </div>
</template>

<script>
// import echarts from "echarts";
// require("echarts/theme/macarons"); // echarts theme
import { debounce } from "@/common/tools";

export default {
  props: {
    className: {
      type: String,
      default: "chart"
    },
    width: {
      type: String,
      default: "100%"
    },
    height: {
      type: String,
      default: "500px"
    },
    autoResize: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      chart: null,
      fetchOptions:{
        start_date: '',
        end_date: '',
        type:2,
        dates: [dayjs().subtract(6,'days').format('YYYY-MM-DD'),dayjs().format('YYYY-MM-DD')]
      },
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },

    };
  },
  created(){
    this.fetchData();
  },
  mounted() {
    this.initChart();
    if (this.autoResize) {
      this.__resizeHanlder = debounce(() => {
        if (this.chart) {
          this.chart.resize();
        }
      }, 100);
      window.addEventListener("resize", this.__resizeHanlder);
    }
    // 监听侧边栏的变化
    const sidebarElm = document.getElementsByClassName("sidebar-container")[0];
    sidebarElm.addEventListener("transitionend", this.__resizeHanlder);
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    if (this.autoResize) {
      window.removeEventListener("resize", this.__resizeHanlder);
    }
    const sidebarElm = document.getElementsByClassName("sidebar-container")[0];
    sidebarElm &&
      sidebarElm.removeEventListener("transitionend", this.__resizeHanlder);
    this.chart.dispose();
    this.chart = null;
  },
  watch: {
    autoResize: {
      handler(val) {}
    }
  },
  methods: {
    async fetchData(){
      if(!this.fetchOptions.dates) return this.$message.info('请选择日期！！！')
      const result = await this.$store.dispatch('order/cinema_sale_summary',{
        start_date: this.fetchOptions.dates && this.fetchOptions.dates[0],
        end_date: this.fetchOptions.dates && this.fetchOptions.dates[1],
        type: this.fetchOptions.type
      });
      this.setOptions(result.options);
    },
    setOptions(options = {}) {
      if (this.chart) {
        this.chart.setOption(options, true);
      }
    },
    initChart() {
      this.chart = echarts.init(this.$refs.chart, "macarons");
      this.setOptions();
    }
  }
};
</script>
<style lang='scss' scoped>
* {
  touch-action: none;
}
</style>
