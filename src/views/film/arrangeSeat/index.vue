<template>
  <el-card class="box-card">
    <div slot="header" style="display:flex;align-items:center;justify-content: space-between;">
      <el-page-header @back="goBack" title="返回" content="安排座位" center/>
      <span>{{$route.query.cinema_name && decodeURIComponent($route.query.cinema_name)}}</span>
      <span>{{$route.query.hall_name && decodeURIComponent($route.query.hall_name)}}</span>
    </div>

    

    

    
  </el-card>
</template>

<script>
export default {
  name: "ArrangeSeat",
  data() {
    return {
      loading: false,
      tableData: [],
      fetchOptions: {
        hall_id: 1,
      },
      show_time_range: [],
      total: 0,
      currentView:""
    };
  },
  components: {},
  computed: {},
  mounted() {
    let { query } = this.$route;
    if(query.hall_id) {
      this.fetchOptions.hall_id = query.hall_id;
      this.getSeat();
    };

  },
  watch: {},
  methods: {
    goBack(){
      this.$router.back();
    },

    async getSeat(){
      let result = await this.$store.dispatch('hall/arrangeSeat',this.fetchOptions);
      console.log('result---位置',result);
    },
    
  },
  
};
</script>

<style lang="scss" scoped>
</style>
