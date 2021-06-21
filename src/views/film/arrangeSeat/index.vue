<template>
  <el-card class="box-card">
    <div slot="header" style="text-align:center;" class="clearfix">
      <span>安排座位</span>
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
        page: 1,
        limit: 20,
        keywords: "",
        cinema_id:'',
      },
      show_time_range: [],
      total: 0,
      currentView:""
    };
  },
  components: {},
  computed: {},
  mounted() {
    
  },
  watch: {},
  methods: {
    
  },
  
};
</script>

<style lang="scss" scoped>
</style>
