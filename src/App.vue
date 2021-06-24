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
// ./ding -config=./ding.cfg -subdomain=eryi-qy-manager 1028
.common-float-right{
  float: right;
}
.price{
  color: #f73131;
  font-weight: bolder;
}
</style>
