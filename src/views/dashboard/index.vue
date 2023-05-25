<template>
  <div>
    <br />
    <Business/>
    <BoxOfficeStatistics/>
    <!-- <Visit/> -->
  </div>
</template>

<script>
import Business from "@/views/dashboard/Business";
import BoxOfficeStatistics from "@/views/dashboard/BoxOfficeStatistics";
import Visit from "@/views/dashboard/Visit";

export default {
  props: {
    
  },
  data() {
    return {
    };
  },
  components:{
    Business,
    BoxOfficeStatistics,
    Visit
  },
  created(){
  },
  mounted() {
  },
  beforeDestroy() {
    
  },
  watch: {
   
  },
  methods: {
    
  }
};
</script>
<style lang='scss' scoped>
* {
  touch-action: none;
}
</style>
