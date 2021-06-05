<template>
  <div class="sidebar-logo-container" :class="{'collapse':collapse}" :style="{'background':variables.menuBg}">
    <transition name="sidebarLogoFade">
      <!-- <router-link v-if="collapse" key="collapse" class="sidebar-logo-link" to="">
        <img v-if="site_data.site_logo" :src="site_data.site_logo" class="sidebar-logo">
        <h1 v-else class="sidebar-title">{{site_data.site_title}}</h1>
      </router-link>
      <router-link v-else key="expand" class="sidebar-logo-link" to="">
        <img v-if="site_data.site_logo" :src="site_data.site_logo" class="sidebar-logo">
        <h1 class="sidebar-title">{{site_data.site_title}} </h1>
      </router-link> -->
      <div class="sidebar-logo-link">
        <div class="img-box" :style="{width:sidebar.opened?'80px':'40px',height:sidebar.opened?'80px':'40px'}">
          <img 
          v-if="site_data.site_logo" 
          :src="site_data.site_logo" 
          :style="{width:sidebar.opened?'50px':'30px',height:sidebar.opened?'50px':'30px'}"
          class="sidebar-logo">
        </div>
        <h1 class="sidebar-title">{{site_data.site_title}} </h1>
      </div>
    </transition>
  </div>
</template>

<script>
// import { mapGetters } from "vuex";

import variables from "@/styles/variables.scss";

export default {
  name: 'SidebarLogo',
  props: {
    collapse: {
      type: Boolean,
      required: true
    }
  },
  computed: {
    ...Vuex.mapGetters(["userInfo","site_data","sidebar"]),
    variables() {
      return variables;
    },
  },
  data() {
    return {}
  }
}
</script>

<style lang="scss" scoped>
.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.sidebar-logo-container {
  position: relative;
  width: 100%;
  // height: 50px;
  // line-height: 50px;
  background: #2b2f3a;
  text-align: center;
  overflow: hidden;

  & .sidebar-logo-link {
    height: 100%;
    width: 100%;
    display: flex;
    flex-flow: column;
    justify-content: center;
    align-items: center;
    padding-top: 10px;
    .img-box{
      border: 2px solid #fff;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    & .sidebar-logo {
      width: 32px;
      height: 32px;
      vertical-align: middle;
      // margin-right: 12px;
      border-radius: 50%;
    }

    & .sidebar-title {
      display: inline-block;
      margin: 0;
      color: #fff;
      font-weight: 600;
      line-height: 40px;
      font-size: 14px;
      font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
      vertical-align: middle;
    }
  }

  &.collapse {
    .sidebar-logo {
      margin-right: 0px;
    }
  }
}
</style>
