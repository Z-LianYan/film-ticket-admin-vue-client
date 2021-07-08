<template>
  <div class="app-container">
    <el-card class="box-card">
      <div
        slot="header"
        style="
          display: flex;
          align-items: center;
          justify-content: space-between;
        "
      >
        <el-page-header @back="goBack" title="返回" content="安排座位" center />
        <span>{{ hall_info.name }}</span>
        <span>{{ hall_info.cinema_name }}</span>
      </div>

      <el-button
        type="text"
        class="el-icon-circle-close"
        @click="onSetSeatDisabled(1)"
        >禁用</el-button
      >
      <el-button
        type="text"
        class="el-icon-circle-check"
        @click="onSetSeatDisabled(0)"
        >启用</el-button
      >

      <div class="table-container">
        <div class="checked-wrapper">
          <el-checkbox-group v-model="checkedRow">
            <div class="row" v-for="(row, key) in seat" :key="key">
              <el-checkbox
                style="display:block;"
                :label="key"
                @change="handleCheckedChange($event,key)"
              ></el-checkbox>
            </div>
          </el-checkbox-group>
        </div>
        <div class="table-wrapper">
          <div class="row" v-for="(arr, key) in seat" :key="key + 'r'">
            <div
              :class="[
                'init-col',
                selectedSeatIds.includes(item.id) ? 'selected-col' : '',
              ]"
              v-for="(item, index) in arr"
              :key="index + 'c'"
              @click="onSelectSeat(item)"
            >
              {{ item.row }}排{{ item.column }}座
              <i
                v-if="selectedSeatIds.includes(item.id)"
                class="selected-col-icon el-icon-check"
              ></i>
            </div>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "ArrangeSeat",
  data() {
    return {
      loading: false,
      tableData: [],
      fetchOptions: {
        hall_id: 1,
      },
      show_time_range: [],
      total: 0,
      hall_info: {
        seat: [],
      },

      seat: {},

      selectedSeatIds: [],
      checkedRow: [],
    };
  },
  components: {},
  computed: {},
  mounted() {
    let { query } = this.$route;
    if (query.hall_id) {
      this.fetchOptions.hall_id = query.hall_id;
      this.getSeat();
    }
  },
  watch: {},
  methods: {
    handleCheckedChange(bool,row) {
      let { seat,selectedSeatIds } = this;
      let row_arr = seat[row];
      for(let item of row_arr){
        if(bool){
          if(!selectedSeatIds.includes(item.id)) this.selectedSeatIds.push(item.id);
        }
        if(!bool){
          let idx = selectedSeatIds.indexOf(item.id);
          if(idx!=-1) this.selectedSeatIds.splice(idx,1);
        }
      }
    },
    async onSetSeatDisabled(val) {
      let result = await this.$store.dispatch("hall/setSeatDisabled", {
        seat_ids: [2158, 2159],
        disabled: val,
      });
    },
    onSelectSeat(item) {
      let { selectedSeatIds } = this;
      if (selectedSeatIds.includes(item.id)) {
        selectedSeatIds.splice(selectedSeatIds.indexOf(item.id), 1);
      } else {
        selectedSeatIds.push(item.id);
      }
    },
    goBack() {
      this.$router.back();
    },

    async getSeat() {
      let result = await this.$store.dispatch(
        "hall/arrangeSeat",
        this.fetchOptions
      );
      this.hall_info = result.rows;
      console.log("result---位置", result);
      this.reduce();
    },

    reduce() {
      let { hall_info } = this;
      let { seat } = hall_info;
      let obj = {};
      for (let item of seat) {
        if (!obj[item.row]) {

          obj[item.row] = [item];
        } else {
          obj[item.row].push(item);
        }
      }

      this.seat = obj;

      console.log("obj", obj);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~@/styles/variables.scss";
.table-container {
  display: flex;
  .table-wrapper {
    border-top: 1px solid #eee;
    border-left: 1px solid #eee;
    flex: 1;
    .row {
      display: flex;
      font-size: 15px;
      position: relative;
      .init-col {
        flex: 1;
        height: 50px;
        text-align: center;
        line-height: 50px;
        border-bottom: 1px solid #eee;
        border-right: 1px solid #eee;
        font-size: 0.5em;
        cursor: pointer;
        user-select: none; //阻止双击被选中文字
        -webkit-user-select: none; //阻止双击被选中文字
        -moz-user-select: none; //阻止双击被选中文字
      }
      .selected-col {
        background: #13c2c2;
        position: relative;
        .selected-col-icon {
          position: absolute;
          top: 2px;
          right: 4px;
          // top: 50%;
          // transform: translateY(-50%);
          color: #fff;
          font-weight: bolder;
          font-size: 12px;
        }
      }
    }
  }

  .checked-wrapper{
    border-bottom: 1px solid #eee;
    .row{
      height: 50px;
      line-height: 50px;
      width: 25px;
      text-align: center;
      border-left: 1px solid #eee;
      border-top: 1px solid #eee;
      /deep/ .el-checkbox{
        margin-right: 0 !important;
        .el-checkbox__label {
          display: none;
        }
      }
    }
  }
  
}
</style>
