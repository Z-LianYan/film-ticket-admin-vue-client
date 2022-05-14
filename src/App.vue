<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  mounted(){},
  methods:{}
}
</script>

<style lang="scss">
.drawer-scrollbar-wrapper{
  height: calc(100vh - 80px) !important;
}
// ./ding -config=./ding.cfg -subdomain=eryi-qy-manager 1028
.float-left{
  float: left;
}
.float-right{
  float: right;
}
.price{
  color: #f73131;
  font-weight: bolder;
}
</style>
