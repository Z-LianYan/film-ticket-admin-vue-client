<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" style="text-align: center" class="clearfix">
        <span>新申请</span>
      </div>

      <div @click="getAuditConfigDetail">888</div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "ManagerList",
  data() {
    return {
      
    };
  },
  components: {},
  computed: {},
  mounted() {
  },
  watch: {},
  methods: {
    async getAuditConfigDetail(){
      const result = await this.$store.dispatch("newApply/getAuditConfigDetail", { admin_id: 83,type:'lizhi' });
      console.log('result====>>',result);

    }
  }
};
</script>

<style lang="scss" scoped>

</style>
