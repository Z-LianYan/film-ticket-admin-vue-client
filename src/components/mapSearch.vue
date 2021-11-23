<template>
  <el-dialog
    title="位置搜索"
    :visible.sync="isMapDialog"
    width="70%"
    @close="close"
    :append-to-body="true"
    :lock-scroll="false"
    top="0"
  >
    <div style="display: flex; align-items: center">
      <!-- <el-amap-search-box
        ref="search_box"
        class="search-box"
        :default="
          searchLocation.place_name ? searchLocation.place_name : '搜索关键字'
        "
        :search-option="searchOption"
        :on-search-result="onSearchResult"
      ></el-amap-search-box> -->
      <el-input v-model="keywords" @input="onSearchResult">
        <el-button  slot="append" @click="onSearchResult">搜索</el-button>
      </el-input>
      <el-button class="comfirm-btn" type="primary" @click="onComfirm"
        >确 定</el-button
      >
    </div>

    <el-amap
      vid="amap_search"
      ref="amap_com_search"
      :amap-manager="amapManager"
      :zoom="15"
      :plugin="plugin"
      :events="events"
      class="el-amap"
    ></el-amap>
    <el-scrollbar wrap-class="map-search-scrollbar-wrapper">
      <div class="search_result-box" v-if="searchResultData.length">
        <div
          @click="onSelectLocation(item, index)"
          class="result-item"
          v-for="(item, index) in searchResultData"
          :key="index"
        >
          <div class="left">
            <p class="top">{{ item.name }}</p>
            <p class="bottom">{{ item.address }}</p>
          </div>
          <div class="right">
            <el-button
              v-if="selectIndex == index"
              type="text"
              class="el-icon-check"
              style="font-size: 35px;font-seze:bolder;"
            ></el-button>
          </div>
        </div>
      </div>
      <div v-if="!searchResultData.length && keywords" class="not-find">
        没有相关位置信息
      </div>
    </el-scrollbar>
  </el-dialog>
</template>

<script>
function option() {
  return {
    address: "",
    lng: "",
    lat: "",
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

      isMapDialog: false,
      amapManager: amapManager,
      marker: "",

      keywords:"",

      searchLocation: option(),

      plugin: [
        //一些工具插件
        {
          pName: "Geolocation", //定位
          enableHighAccuracy: true, //是否使用高精度定位，默认:true
          timeout: 100, //超过10秒后停止定位，默认：无穷大
          maximumAge: 0, //定位结果缓存0毫秒，默认：0
          convert: true, //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
          showButton: true, //显示定位按钮，默认：true
          buttonPosition: "RB", //定位按钮停靠位置，默认：'LB'，左下角
          showMarker: true, //定位成功后在定位到的位置显示点标记，默认：true
          showCircle: true, //定位成功后用圆圈表示定位精度范围，默认：true
          panToLocation: true, //定位成功后将定位到的位置作为地图中心点，默认：true
          zoomToAccuracy: true, //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：f
          extensions: "all",
          events: {
            init: (o) => {
              // console.log("Geolocation", o);
              // o 是高德地图定位插件实例
              o.getCurrentPosition((status, result) => {
                // console.log("Geolocation--status", status, result);
                if (result && result.position) {
                  // self.lng = result.position.lng; //设置经度
                  // self.lat = result.position.lat; //设置维度
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
              // console.log("OverView", instance);
            },
          },
        },
        {
          pName: "MapType", //地图类型
          defaultType: 0,
          events: {
            init(instance) {
              // console.log("MapType", instance);
            },
          },
        },
      ],
      events: {
        click: (e) => {
          // console.log("点击了地图", e);
          let lnglat = [e.lnglat.lng, e.lnglat.lat];
          this.onShowMarker(lnglat);
          this.onSearchPlace(lnglat);
          this.onResetOptioin();
        },
      },
      searchResultData: [],
      selectIndex: "-",
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
      // console.log("comfirm", searchLocation);
      if (!searchLocation.address) return this.$message.error("请选择位置");
      this.$emit("onComfirm", this.searchLocation);
      this.onResetOptioin();
      this.close();
    },
    onSearchPlace(lnglat = []) {
      AMap.plugin("AMap.PlaceSearch", () => {
        let GeocoderOptions = {
          city: "全国",
          // type: '餐饮服务', // 兴趣点类别
        };
        let placeSearch = new AMap.PlaceSearch(GeocoderOptions);
        // 第一个参数是关键字，这里传入的空表示不需要根据关键字过滤
        // 第二个参数是经纬度，数组类型
        // 第三个参数是半径，周边的范围
        // 第四个参数为回调函数
        placeSearch.searchNearBy('', lnglat, 1000, (status, result) => {
          console.log("经纬度拿到的周边地址", status, result);
          if (status === "complete" && result.info === "OK") {
            this.searchResultData = result.poiList.pois; // 周边地标建筑列表
          } else {
            this.searchResultData = [];
            console.log("获取位置信息失败!");
          }
        });
      });
    },

    onSelectLocation(item, index) {
      console.log('item-',item)
      this.selectIndex = index;
      let lnglat  = [item.location.lng, item.location.lat];
      this.onShowMarker(lnglat)
      this.getFormattedAddress(lnglat,(res) => {
        // console.log("res", res);
        this.searchLocation.address = (res.addressComponent.city?res.addressComponent.city:res.addressComponent.province) + res.addressComponent.district + item.address;
        this.searchLocation.lng = item.location.lng;
        this.searchLocation.lat = item.location.lat;
      });
    },

    getFormattedAddress(lnglat = [], callBack) {
      AMap.plugin("AMap.Geocoder", () => {
        let GeocoderOptions = {
          city: "全国",
        };
        let geocoder = new AMap.Geocoder(GeocoderOptions);
        geocoder.getAddress(lnglat, (status, result) => {
          console.log("通过经纬度拿到的地址", result);
          if (status === "complete" && result.info === "OK") {
            callBack && callBack(result.regeocode);
          }
        });
      });
    },
    //点击搜索后触发的事件
    onSearchResult() {
      let { keywords } = this;
      // console.log("keywords", keywords);
      AMap.plugin("AMap.PlaceSearch", () => {
        let PlaceSearchOptions = {
          city: "全国",
        };
        let PlaceSearch = new AMap.PlaceSearch(PlaceSearchOptions);
        PlaceSearch.search(keywords, (status, result) => {
          console.log("关键字搜索",status,result);
          if (status === "complete" && result.info === "OK") {
            this.searchResultData = result.poiList.pois; // 周边地标建筑列表
          }else{
            this.searchResultData = []
          }
        });
      });

      this.onResetOptioin();
    },
    onResetOptioin(){
      this.selectIndex = '-';
      this.searchLocation = option();
    },
    onShowMarker(lnglat=[]) {
      let { amapManager } = this;
      let o = amapManager.getMap();//获取到地图实列
      if (lnglat.length) {
        o.remove(this.marker);
        this.marker = new AMap.Marker({
          position: lnglat,
        });
        o.add(this.marker);
        o.setCenter(lnglat);
      }
    },
    open(val) {
      console.log(val)
      this.keywords = val;
      this.onSearchResult();
      this.isMapDialog = true;
    },
    close() {
      this.onResetOptioin();
      this.isMapDialog = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.search-box {
  flex: 1;
}
.comfirm-btn {
  margin-left: 30px;
}
.el-amap {
  height: 300px;
}

.search_result-box {
  .result-item {
    display: flex;
    align-items: center;
    border-bottom: 1px solid #eee;
    .left {
      flex: 1;

      .top {
      }
      .botttom {
      }
    }
    .right {
    }
  }
  .result-item:last-child {
    border-bottom: 1px solid transparent;
  }
}
.not-find{
  padding: 20px;
  color: #ccc;
  text-align: center;
}
</style>

<style>
.map-search-scrollbar-wrapper {
  max-height: calc(100vh - 445px);
}
</style>