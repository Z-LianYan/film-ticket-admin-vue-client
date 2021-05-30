<template>
  <div class="drawer-container">
    <div>
      <h3 class="drawer-title">设置</h3>

      <!-- <div class="drawer-item">
        <span>Theme Color</span>
        <theme-picker style="float: right;height: 26px;margin: -3px 8px 0 0;" @change="themeChange" />
      </div> -->

      <div class="drawer-item">
        <span>打开 TagsView</span>
        <el-switch v-model="tagsView" class="drawer-switch" />
      </div>

      <div class="drawer-item">
        <span>悬浮头部</span>
        <el-switch 
        v-model="fixedHeader"
        class="drawer-switch" />
      </div>

      <div class="drawer-item">
        <span>显示 Logo</span>
        <el-switch v-model="sidebarLogo" class="drawer-switch" />
      </div>

    </div>
  </div>
</template>

<script>
import ThemePicker from '@/components/ThemePicker'

export default {
  components: { ThemePicker },
  data() {
    return {
    }
  },
  mounted(){
    // const fixedHeader = localStorage.getItem("fixedHeader");
    // if(fixedHeader){
    //   this.fixedHeader = fixedHeader
    // }
    let tagsView = localStorage.getItem("tagsView");
    if(tagsView!=='null'){
      console.log('tagsView123--',tagsView,typeof(tagsView));
      this.$store.state.settings.tagsView = tagsView==1?true:false;
    }
    let fixedHeader = localStorage.getItem("fixedHeader");
    if(fixedHeader!=='null'){
      console.log('fixedHeader123--',fixedHeader,typeof(fixedHeader));
      this.$store.state.settings.fixedHeader = fixedHeader==1?true:false;
    }
    let sidebarLogo = localStorage.getItem("sidebarLogo");
    if(sidebarLogo!=='null'){
      console.log('fixedHeader123--',sidebarLogo,typeof(sidebarLogo));
      this.$store.state.settings.sidebarLogo = sidebarLogo==1?true:false;
    }
    
  },
  watch:{
  },
  computed: {
    fixedHeader: {
      get() {
        console.log('fixedHeader---get',localStorage.getItem('fixedHeader'))
        return this.$store.state.settings.fixedHeader
      },
      set(val){
        console.log('fixedHeader---set')
        this.$store.dispatch('settings/changeSetting', {
          key: 'fixedHeader',
          value: val?1:0
        })
      }
    },
    tagsView: {
      get() {
        return this.$store.state.settings.needTagsView
      },
      set(val) {
        this.$store.dispatch('settings/changeSetting', {
          key: 'needTagsView',
          value: val?1:0
        })
      }
    },
    sidebarLogo: {
      get() {
        return this.$store.state.settings.sidebarLogo
      },
      set(val) {
        this.$store.dispatch('settings/changeSetting', {
          key: 'sidebarLogo',
          value: val?1:0
        })
      }
    }
  },
  methods: {
    fixedHeaderChange(val){
      console.log('val',val);
      this.$store.dispatch('settings/changeSetting', {
        key: 'fixedHeader',
        value: val
      })
    },
    // themeChange(val) {
    //   this.$store.dispatch('settings/changeSetting', {
    //     key: 'theme',
    //     value: val
    //   })
    // }
  }
}
</script>

<style lang="scss" scoped>
.drawer-container {
  padding: 24px;
  font-size: 14px;
  line-height: 1.5;
  word-wrap: break-word;

  .drawer-title {
    margin-bottom: 12px;
    color: rgba(0, 0, 0, .85);
    font-size: 14px;
    line-height: 22px;
  }

  .drawer-item {
    color: rgba(0, 0, 0, .65);
    font-size: 14px;
    padding: 12px 0;
  }

  .drawer-switch {
    float: right
  }
}
</style>
