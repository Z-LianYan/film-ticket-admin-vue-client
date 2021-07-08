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

      <ul class="template-ul">
        <li class="selected">
          选中 <i class="selected-col-icon el-icon-check"></i>
        </li>
        <li class="disabled">
          禁用 <i class="selected-col-icon el-icon-circle-close"></i>
        </li>
      </ul>

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
                :indeterminate="row.indeterminate"
                style="display:block;"
                :label="key"
                @change="handleCheckedChange($event,key)"
              ></el-checkbox>
            </div>
          </el-checkbox-group>
        </div>
        <div class="table-wrapper">
          <div class="row" v-for="(value, key) in seat" :key="key + 'r'">
            <div
              :class="[
                'init-col',
                item.disabled==1?'disabled-col':'',
                selectedSeatIds.includes(item.id) ? 'selected-col' : '',
              ]"
              v-for="(item, index) in value.seat_data"
              :key="index + 'c'"
              @click="onSelectSeat(item,value.seat_data,key)"
            >
              {{ item.row }}排{{ item.column }}座
              <i
                v-if="selectedSeatIds.includes(item.id)"
                class="selected-col-icon el-icon-check"
              ></i>
              <i
                v-else-if="item.disabled==1"
                class="selected-col-icon el-icon-circle-close"
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
  computed: {
    
  },
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
      seat[row].indeterminate = false;
      let row_arr = seat[row].seat_data;
      for(let item of row_arr){
        if(bool && !selectedSeatIds.includes(item.id)) this.selectedSeatIds.push(item.id);
        let idx = selectedSeatIds.indexOf(item.id);
        if(!bool && idx!=-1) this.selectedSeatIds.splice(idx,1);
      }
    },
    async onSetSeatDisabled(val) {
      let result = await this.$store.dispatch("hall/setSeatDisabled", {
        seat_ids: this.selectedSeatIds,
        disabled: val,
      });
      this.getSeat();
    },
    onSelectSeat(item,seat_data,row) {
      let { selectedSeatIds,seat } = this;
      if (selectedSeatIds.includes(item.id)) {
        selectedSeatIds.splice(selectedSeatIds.indexOf(item.id), 1);
      } else {
        selectedSeatIds.push(item.id);
      }
      let num = 0;
      for(let item of seat_data){
        if(selectedSeatIds.includes(item.id)) num += 1;
      }
      if(num==seat_data.length) {
        seat[row].indeterminate = false;
        this.checkedRow.push(row.toString());
      }else if(num!=0){
        seat[row].indeterminate = true;
      }else{
        seat[row].indeterminate = false;
        this.checkedRow.splice(selectedSeatIds.indexOf(row.id),1);
      }
    },
    goBack() {
      this.$router.back();
    },
    reSeat(){
      this.checkedRow = [];
      this.selectedSeatIds = [];
    },
    async getSeat() {
      this.reSeat();
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
          obj[item.row] = {
            indeterminate:false,
            seat_data:[item]
          };
        } else {
          obj[item.row].seat_data.push(item);
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
.template-ul{
  display: flex;
  li{
    width: 60px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    position:relative;
    border: 1px solid #eee;
    font-size: 12px;
  }
  .selected{
    background: #13c2c2;
  }
  .disabled{
    background: #ccc;
  }
}
.selected-col-icon {
  position: absolute;
  top: 2px;
  right: 4px;
  color: #fff;
  font-weight: bolder;
  font-size: 12px;
}
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
      .disabled-col{
        background: #ccc;
        position: relative;
      }
      .selected-col {
        background: #13c2c2;
        position: relative;
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
