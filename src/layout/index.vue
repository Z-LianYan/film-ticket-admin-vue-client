<template>
  <div
    :class="classObj"
    class="app-wrapper"
    v-if="$store.state.accessMenu.initialize_system"
  >
    <!-- 移动端弹出左侧菜单的模态框 -->
    <div 
    v-if="device==='mobile'&&sidebar.opened" 
    class="drawer-bg" 
    @click="handleClickOutside" />

    <sidebar class="sidebar-container" />
    <!-- <div :class="{ hasTagsView: needTagsView }" class="main-container"> -->
    <div class="navbar-tags-container" :class="{ hasTagsView: !needTagsView }" v-if="fixedHeader"></div>
    <el-scrollbar :wrap-class="[
    'main-container-scrollbar-wrapper',
    fixedHeader?'change-main-container-scrollbar-wrapper':'',
    !needTagsView?'ned-tags-view-main-container-scrollbar-wrapper':'',
    'main-container']">
      <div :class="{ 'fixed-header': fixedHeader }">
        <navbar />
        <tags-view v-if="needTagsView" />
      </div>
      <app-main />
      <right-panel v-if="showSettings">
        <settings />
      </right-panel>
    </el-scrollbar>
    <!-- </div> -->
  </div>
  <InitSystemModal v-else />
</template>

<script>
import {
  Navbar,
  Sidebar,
  AppMain,
  TagsView,
  Settings,
  RightPanel,
} from "./components";
import ResizeMixin from "./mixin/ResizeHandler";
import InitSystemModal from "@/components/init-system-modal";

export default {
  name: "Layout",
  components: {
    Navbar,
    Sidebar,
    AppMain,
    TagsView,
    InitSystemModal,
    RightPanel,
    Settings,
  },
  mixins: [ResizeMixin],
  created() {},
  mounted() {},
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar;
    },
    device() {
      return this.$store.state.app.device;
    },
    fixedHeader() {
      return this.$store.state.settings.fixedHeader;
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === "mobile",
      };
    },
    showSettings() {
      return this.$store.state.settings.showSettings;
    },
    needTagsView() {
      return this.$store.state.settings.needTagsView;
    },
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch("app/closeSideBar", { withoutAnimation: false });
    },
  },
};
</script>
<style>
.layout-scrollbar-wrapper {
  height: 100vh !important;
  /* margin-bottom: -20px !important; */
}
.el-scrollbar__wrap{
  /* margin-bottom: -20px !important; */
}
</style>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
@import "~@/styles/variables.scss";



.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;
  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}
.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100% - #{$sideBarWidth});
  transition: width 0.28s;
}

.hideSidebar .fixed-header {
  width: calc(100% - 54px);
}

.mobile .fixed-header {
  width: 100%;
}

// .hasTagsView {
//   .app-main {
//     /* 84 = navbar + tags-view = 50 + 34 */
//     min-height: calc(100vh - 84px);
//   }

//   .fixed-header + .app-main {
//     padding-top: 84px;
//   }
// }

</style>

<style lang="scss">
.app-wrapper{
  
  .main-container-scrollbar-wrapper{
    // height: calc(100vh - 80px) !important;
    margin-bottom: -10px !important;
    overflow-x: hidden;
    height: 100vh !important;
    &.change-main-container-scrollbar-wrapper {
      height: calc(100vh - 80px) !important;
      &.ned-tags-view-main-container-scrollbar-wrapper {
        height: calc(100vh - 50px) !important;
      }
    }
    
  }
}

.navbar-tags-container {
  height: 84px !important;
  &.hasTagsView{
    height: 50px !important;
  }
}
// .app-wrapper{
//   .el-scrollbar{
//     overflow-x: hidden !important;
//   }
// }

// body::-webkit-scrollbar { width: 0 !important; display: none; }
// body { -ms-overflow-style: none; }
// body { overflow: -moz-scrollbars-none; }
</style>
