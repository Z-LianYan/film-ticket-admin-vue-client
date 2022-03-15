<template>
  <el-dialog
    :title="selectedSchedule.cinema_name"
    :visible.sync="isDrawer"
    size="60%"
    @close="drawerClose"
    center
  >
    <el-form
      ref="ruleForm"
      label-width="80px"
      class="demo-ruleForm"
    >
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="电影" prop='film_name'>
            {{selectedSchedule.film_name}}
          </el-form-item>
          <el-form-item label="语言" prop='language'>
            {{selectedSchedule.language}}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="放映时间" prop='start_runtime'>
            {{handleWeek(dayjs(selectedSchedule.start_runtime).day())}} {{dayjs(selectedSchedule.start_runtime).format("YYYY-MM-DD HH:mm")}} 
          </el-form-item>
          <el-form-item label="放映类型" prop='play_type_name'>
            {{selectedSchedule.play_type_name}}
          </el-form-item>
        </el-col>
      </el-row>

      <div>
        <!-- src/assets/images/film/screen.png -->

      </div>
        
    </el-form>
  </el-dialog>
</template>

<script>
export default {
  name: "BuyTicketDetail",
  components: {},
  props:{
    
  },
  computed:{
    
  },
  watch:{
    // "ruleForm.sectionPrice":{
    //   handler(val){
    //   },
    //   deep: true, //true 深度监听
    //   // 加上immediate选项后，实例化后立刻回调一次
    //   immediate: true
    // }
  },
  data() {
    return {
      isDrawer: false,
      selectedSchedule:{}
      
    };
  },
  mounted() {
  },
  methods: {
    dayjs,
    handleWeek(day) {
      switch (day) {
        case 0:
          return "周日";
        case 1:
          return "周一";
        case 2:
          return "周二";
        case 3:
          return "周三";
        case 4:
          return "周四";
        case 5:
          return "周五";
        case 6:
          return "周六";
        default:
          return "";
      }
    },
    getDetail(){
      let { id,hall_id } = this.selectedSchedule;
      this.$store.dispatch("schedule/getSeatList", {
        schedule_id:id,
        hall_id
      }).then((res) => {
        console.log('res',res);
        this.hallList = res.data;



        this.isDrawer = true;
      });
    },

    
    open(row) {
      console.log('selectedSchedule',row)
      this.selectedSchedule = row;
      this.getDetail();
      
    },
    drawerClose() {
      
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
