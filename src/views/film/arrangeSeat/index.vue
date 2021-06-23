<template>
  <el-card class="box-card">
    <div slot="header" style="display:flex;align-items:center;justify-content: space-between;">
      <el-page-header @back="goBack" title="返回" content="安排座位" center/>
      <span>{{hall_info.cinema_name}}</span>
      <span>{{hall_info.name}}</span>
    </div>


    <div style="border-top:1px solid #eee;border-left:1px solid #eee;">
      <div 
      style="display:flex;"
      v-for="(arr,key) in seat" 
      :key="key+'s'">
        <!-- {{item.row}}排{{item.column}}座 -->
        <div 
        style="flex:1;height:50px;text-align:center;line-height:50px;border-bottom:1px solid #eee;border-right:1px solid #eee;"
        v-for="(item,index) in arr" 
        :key="index+'a'">{{item.row}}排{{item.column}}座</div>
      </div>
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
      hall_info:{
        seat:[]
      },

      seat:{}
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
      this.hall_info = result.rows;
      console.log('result---位置',result);
      this.reduce();
    },

    reduce(){
      let { hall_info } = this;
      let { seat } = hall_info;
      let obj = {};
      for(let item of seat){
        if(!obj[item.row]){
          obj[item.row] = [item]
        }else{
          obj[item.row].push(item);
        }
      }

      this.seat = obj;

      console.log(obj);

    }
    
  },
  
};
</script>

<style lang="scss" scoped>
</style>
