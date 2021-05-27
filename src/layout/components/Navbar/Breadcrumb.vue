<template>
  <el-breadcrumb class="app-breadcrumb" separator="/">
    <transition-group name="breadcrumb">
      <!-- <el-breadcrumb-item v-for="(item,index) in levelList" :key="item.path">
        <span v-if="item.redirect==='noRedirect'||index==levelList.length-1" class="no-redirect">{{ item.meta.title }}</span>
        <a v-else @click.prevent="handleLink(item)">{{ item.meta.title }}</a>
      </el-breadcrumb-item> -->
      <el-breadcrumb-item v-for="(item,index) in levelList" :key="item.path">
        <span v-if="!item.redirect||item.redirect==='noRedirect'||index==levelList.length-1" class="no-redirect">{{ item.title }}</span>
        <a v-else @click.prevent="handleLink(item)">{{ item.title }}</a>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script>
import pathToRegexp from 'path-to-regexp'

export default {
  data() {
    return {
      levelList: null
    }
  },
  watch: {
    $route() {
      this.getBreadcrumb()
    }
  },
  created() {
    
  },
  mounted(){
    this.$nextTick(()=>{
      this.getBreadcrumb()
    })
    
  },
  methods: {
    // getBreadcrumb() {
    //   // only show routes with meta.title
    //   let matched = this.$route.matched.filter(item => item.meta && item.meta.title)
    //   const first = matched[0];
    //   if (!this.isDashboard(first)) {
    //     matched = [{ path: '/dashboard', meta: { title: '首页' }}].concat(matched)
    //   }
    //   this.levelList = matched.filter(item => item.meta && item.meta.title && item.meta.breadcrumb !== false);
    //   console.log('this.levelList',this.levelList);
    // },
    // isDashboard(route) {
    //   const name = route && route.name
    //   if (!name) {
    //     return false
    //   }
    //   return name.trim().toLocaleLowerCase() === 'Dashboard'.toLocaleLowerCase()
    // },
    getBreadcrumb() {
      // only show routes with meta.title
      console.log('this.$route嘻嘻😁',this.$route)
      let breadcrumb = this.$route.meta.breadcrumb.filter(item=>item.title);
      console.log('this.$route嘻嘻😁-',breadcrumb)
      const first = (breadcrumb && breadcrumb.length)?breadcrumb[0]:{};
      if (!this.isDashboard(first)) {
        breadcrumb = [{ path: '/dashboard', redirect: '/dashboard', title: '首页' }].concat(breadcrumb)
      }
      this.levelList = (breadcrumb && breadcrumb.length)?breadcrumb:[];
      console.log('this.levelList',this.levelList);
    },
    isDashboard(item) {
      const title = item && item.title
      if (!title) {
        return false
      }
      return title.trim() === '首页'
    },
    pathCompile(path) {
      // To solve this problem https://github.com/PanJiaChen/vue-element-admin/issues/561
      const { params } = this.$route
      var toPath = pathToRegexp.compile(path)
      return toPath(params)
    },
    // handleLink(item) {
    //   const { redirect, path } = item
    //   // console.log(item)
    //   if (redirect) {
    //     this.$router.push(redirect)
    //     return
    //   }
    //   this.$router.push(this.pathCompile(path))
    // },
    handleLink(item) {
      const { redirect, path } = item
      // console.log(item)
      if (redirect) {
        this.$router.push(redirect);
      }
      
    }
  }
}
</script>

<style lang="scss" scoped>
.app-breadcrumb.el-breadcrumb {
  display: inline-block;
  font-size: 14px;
  line-height: 50px;
  margin-left: 8px;

  .no-redirect {
    color: #97a8be;
    cursor: text;
  }
}
</style>
