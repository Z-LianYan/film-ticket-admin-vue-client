<template>
  <el-dialog
    title="位置搜索"
    :visible.sync="isMapDialog"
    width="70%"
    @close="close"
    :append-to-body="true"
  >
    <div style="display: flex; align-items: center">
      <el-amap-search-box
        ref="search_box"
        class="search-box"
        :default="searchLocation.place_name ? searchLocation.place_name : '搜索关键字'"
        :search-option="searchOption"
        :on-search-result="onSearchResult"
      ></el-amap-search-box>
      <el-button class="comfirm-btn" type="primary" @click="onComfirm">确 定</el-button>
    </div>

    <div class="map-box-container" style="height: 500px" ref="map_box"></div>

    <div class="map-box" v-show="false">
      <el-amap
        vid="amap_search"
        ref="amap_com_search"
        :amap-manager="amapManager"
        :zoom="15"
        :plugin="plugin"
        class="amapDemo"
      ></el-amap>
    </div>
  </el-dialog>
</template>

<script>
function option() {
  return {
    place_name: "",
    address: "",
    lng: "",
    lat: ""
  };
}
import VueAMap from "vue-amap";
let amapManager = new VueAMap.AMapManager();
export default {
  components: {},
  props: {},
  data() {
    return {
      searchOption: {
        city: "广州",
        citylimit: false,
      },

      center: [],

      isMapDialog: false,
      amapManager: amapManager,
      marker: "",

      searchLocation: option(),

      flag: false,

      plugin: [
        //一些工具插件
        {
          pName: "Geolocation", //定位
          events: {
            init(o) {
              console.log("Geolocation", o);
              // o 是高德地图定位插件实例
              o.getCurrentPosition((status, result) => {
                console.log("Geolocation--status", status, result);
                if (result && result.position) {
                  // self.lng = result.position.lng; //设置经度
                  // self.lat = result.position.lat; //设置维度
                  // self.center = [self.lng, self.lat]; //设置坐标
                  // self.loaded = true; //load
                  // self.$nextTick(); //页面渲染好后
                }
              });

              // AMap.event.addListener(o,'complete',(res)=>{
              //   console.log('comfirm-btn',res)
              // })
            },
          },
        },
        // {
        //   pName: "ToolBar", //工具栏
        //   events: {
        //     init(instance) {
        //       console.log("ToolBar", instance);
        //     },
        //   },
        // },
        {
          pName: "OverView", //鹰眼
          events: {
            init(instance) {
              console.log("OverView", instance);
            },
          },
        },
        {
          pName: "MapType", //地图类型
          defaultType: 0,
          events: {
            init(instance) {
              console.log("MapType", instance);
            },
          },
        },
      ],
    };
  },

  async created() {},
  beforeDestroy() {},
  mounted() {},
  watch: {},
  computed: {},

  methods: {
    onComfirm() {
      let { searchLocation } = this;
      console.log("comfirm", searchLocation);
      if (!searchLocation.place_name)
        return this.$message.error("请搜索位置然后选择位置");
      this.$emit("onComfirm", this.searchLocation);
      this.close();
    },
    //点击搜索后触发的事件
    onSearchResult(pois) {
      console.log("pois", pois);
      // this.default_place_name = pois[0].name;
      this.searchLocation.place_name = pois[0].name;
      this.searchLocation.address = pois[0].address;
      this.searchLocation.lng = pois[0].lng;
      this.searchLocation.lat = pois[0].lat;
      this.center = [pois[0].lng, pois[0].lat];
      this.showMapDialog();
    },
    showMapDialog() {
      let { center } = this;
      this.isMapDialog = true;
      setTimeout(() => {
        let { amapManager } = this;
        console.log('哈哈哈哈哈哈',amapManager)
        let o = amapManager.getMap();
        if (center.length) {
          o.remove(this.marker);
          this.marker = new AMap.Marker({
            position: center,
          });
          o.add(this.marker);
          o.setCenter(center);
        }

        this.$refs.map_box.appendChild(this.$refs.amap_com_search.$el);
      });
    },
    open(val) {
      if (val) {
        this.flag = true;
        this.$nextTick(() => {
          console.log("this.$refs.search_box", this.$refs.search_box);
          setTimeout(() => {
            this.$refs.search_box.keyword = val.place_name;
          });

          // this.default_place_name = val.place_name;

          this.searchLocation.place_name = val.place_name;
          this.searchLocation.address = val.address;
          this.searchLocation.longitude = val.longitude;
          this.searchLocation.latitude = val.latitude;
          this.center = [val.longitude, val.latitude];
          this.showMapDialog();
        });
      } else {
        this.flag = false;
      }
      this.showMapDialog();
      this.isMapDialog = true;
    },
    close() {
      if (this.flag) {
        this.$refs.search_box.keyword = "";
        this.searchLocation = option();
      }
      this.isMapDialog = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.search-box {
  flex: 1;
}
.comfirm-btn{
  margin-left: 30px;
}
</style>