<template>
  <div>
    <br />
    <Business/>
    <Visit/>
  </div>
</template>

<script>
import Business from "@/views/dashboard/Business";
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
