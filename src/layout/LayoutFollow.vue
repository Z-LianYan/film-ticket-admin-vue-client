<template>
  <!-- <keep-alive :include="cachedViews">
    <router-view :key="key"/>
  </keep-alive> -->
  <router-view />
    <!-- <AppMain /> -->

</template>

<script>
import { Navbar, Sidebar, AppMain, TagsView } from "./components";
export default {
  name: "LayoutFollow",
  data() {
    return {};
  },
  components: {
    AppMain
  },
  computed: {
    // cachedViews() {
    //   return this.$store.state.tagsView.cachedViews
    // },
    // key() {
    //   return this.$route.path
    // }
  },
  mounted() {
  },
  watch: {},
  methods: {}
    
};
</script>

<style lang="scss" scoped>
</style>
