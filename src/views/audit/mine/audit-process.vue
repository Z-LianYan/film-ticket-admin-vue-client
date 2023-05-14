<template>
  <section class="container">
    <div style="dispaly:flex;padding:10px;">
      <span style="color: #4092f2; font-weight: bold">|</span>
      <span 
      class="custom-title" 
      style="color: #6d6d6d;font-size: 14px;font-weight: 500;margin-left: 6px;">审批流程</span>
    </div>
    <div>
      <div
        class="process-item"
        v-for="(item, index) in processList"
        :key="index"
      >
        <h3>
          <span
            v-if="item.type == 'approve'"
            class="icon icon-shenpi iconfont"
          ></span>
          <span
            v-if="item.type == 'reader'"
            class="icon icon-chaosong iconfont"
          ></span>

          {{ item.node_name }} ~ {{item.processStatus}}
        </h3>
        <div :style="'display:flex;flex-wrap:wrap;align-items:center;margin-left:5px;'+(((index+1)==processList.length)?'':'border-left:2px solid #ccc')">
          <!-- <div 
          style="width:2px;height:50px;background:#ccc;margin-left:5px;" 
          v-if="(index+1)!=processList.length"></div> -->
          <div
            :style="{ display: 'inline-block' }"
            v-for="(sstt, idx) in item.all_check_names"
            :key="idx"
            class="auditor-row"
          >
            <div class="person" style="position: relative;">
              <el-image
                style="width: 40px; height: 40px; border-radius: 20px"
                :src="sstt.avatar"
                :preview-src-list="[sstt.avatar]"
              >
              </el-image>
              <div class="name">{{ sstt.admin_name }}</div>
              <span :style="{position: 'absolute',right:0,top:0,color: sstt.readStatus=='reader'?'#409EFF':'#ccc','font-size':'12px'}">{{sstt.readStatusName}}</span>
            </div>
            <div 
            style="font-size:12px;" 
            v-if="sstt.processStatus && sstt.aduitTime">
              <el-tag v-if="item.status=='AGREE'" type="success">{{sstt.processStatus}}</el-tag>
              <el-tag v-if="item.status=='REJECT'" type="danger">{{sstt.processStatus}}</el-tag>
              {{sstt.aduitTime }}
            </div>
            <p v-if="sstt.aduitTime" style="max-width:180px;color:#999;">
              {{item.remark}}
            </p>
          </div>
        </div>
        
      </div>
    </div>

    <!-- </div> -->
  </section>
</template>

<script>

export default {
  name:'MineAuditProcess',
  props: {
    processList:{
      type:Array,
      default:()=>{
        return [];
      }
    }
  },
  components: {
  },
  data() {
    return {};
  },

  async created() {},

  methods: {},
};
</script>

<style lang="scss" scoped>
h3 {
  line-height: 30px;
  .icon {
    color: #666;
    padding-right: 6px;
  }
}
.process-item {
  .person {
    width: 80px;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    cursor: pointer;
    .name {
      line-height: 25px;
      font-size: 13px;
    }
  }
  .reader-con {
    margin-top: 50px;
  }
  .auditor-row {
    margin-left: 30px;
  }
}
</style>
