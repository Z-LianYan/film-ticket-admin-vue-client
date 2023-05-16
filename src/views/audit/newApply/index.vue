<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" style="text-align: center" class="clearfix">
        <span>新申请</span>
      </div>

      <ul class="wrapper">
        <li v-for="(item,index) in auditType" :key="index+'audittype'" @click="onClick(item.url+'?type='+item.type)">
          <i :class="[item.icon,'custom-type']"></i>
          <div class="title">{{item.rule_name}}</div>
        </li>
        
      </ul>
     


    </el-card>
  </div>
</template>

<script>

export default {
  name: "ManagerList",
  data() {
    return {
      auditType:[]
    };
  },
  components: {
    
  },
  computed: {},
  mounted() {
    this.getAuditType();
  },
  watch: {},
  methods: {
    async getAuditType() {
      const result = await this.$store.dispatch("auditConfig/getConfiglist", {limit:100,page:1});
      this.auditType = result.rows;
    },
    onClick(url){
      this.$router.push({
        path: url
      })
    }
  }
};
</script>

<style lang="scss" scoped>
.wrapper{
  display: flex;
  flex-flow: row wrap;
  li{
    width: 150px;
    height: 150px;
    border: 1px solid #eee;
    cursor: pointer;
    margin-right: 20px;
    border-radius: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-flow: column;
    font-size: 20px;
    .custom-type{
      font-size: 30px;
      margin-bottom: 20px;
    }
  }
}
</style>
