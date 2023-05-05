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
          {{ item.nodeName }}
        </h3>
        <div :style="'display:flex;flex-wrap:wrap;align-items:center;margin-left:5px;'+(((index+1)==processList.length)?'':'border-left:2px solid #ccc')">
          <div
            style="display: inline-block;"
            v-for="(sstt, idx) in item.arr"
            :key="idx"
            class="auditor-row"
          >
            <div class="person">
              <el-image
                style="width: 40px; height: 40px; border-radius: 20px"
                :src="sstt.img_head"
                :preview-src-list="[sstt.img_head]"
              >
              </el-image>
              <div class="name">{{ sstt.username }}</div>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  </section>
</template>

<script>

export default {
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
