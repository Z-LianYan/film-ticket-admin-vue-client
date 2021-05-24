<template>
  <keep-alive :include="cachedViews">
    <router-view :key="key"/>
  </keep-alive>
</template>

<script>
export default {
  name: "LayoutFollow",
  data() {
    return {};
  },
  components: {},
  computed: {
    cachedViews() {
      return this.$store.state.tagsView.cachedViews
    },
    key() {
      return this.$route.path
    }
  },
  mounted() {
  },
  watch: {},
  methods: {}
    
};
</script>

<style lang="scss" scoped>
</style>
