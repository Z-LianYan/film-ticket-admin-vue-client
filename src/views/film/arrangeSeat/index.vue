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
        <li class="on-disabled">
          n排n座 
          <!-- <i class="selected-col-icon"></i> -->
        </li>
        <!-- <li class="no-seat">
          无座 <i class="selected-col-icon el-icon-delete"></i>
        </li> -->
      </ul>
      <br/>

      <div style="display:flex;align-items:center;justify-content:space-between;">
        <div>
          <el-button
            type="text"
            style="color:#ccc;font-weight:bold;"
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
          <el-button
            type="text"
            style="color:#1890FF;"
            class="el-icon-delete"
            @click="onSetSeatDisabled(2)"
            >无座</el-button
          >
        </div>
        <div>
          <el-button 
          v-for="(item,index) in hall_info.section" 
          type="text"
          style="margin-right:10px;"
          @click="onSetSeatSection(item.section_id)"
          :key="index">
            {{item.section_name}}<i 
            :style="{color:handleShowColor(item.section_id),'margin-left':'10px','font-weight':'bolder'}" 
            class="iconfont icon-kexuanzuobiankuang"></i>
          </el-button>
          <el-button 
          type="text"
          style="margin-right:10px;color:#ccc;"
          @click="onSetSeatSection()"
          key="index1">
            取消分区
          </el-button>
        </div>
        <el-switch
        style="display: block"
        v-model="switchRowSortValue"
        @change="onSwitchChange"
        active-color="#6959CD"
        inactive-color="#1890FF"
        active-text="横排倒序"
        active-value="desc"
        inactive-text="横排正序"
        inactive-value="asc"/>
      </div>
      

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
              <span v-if="item.disabled!=2">{{ item.row_id }}排{{ item.column_id }}座</span>
              <i 
              v-if="item.disabled!=2 && item.section_id"
              :style="{color:handleShowColor(item.section_id),'margin-left':'10px','font-weight':'bolder'}" 
              class="iconfont icon-kexuanzuobiankuang"></i>
              <i
                v-if="selectedSeatIds.includes(item.id)"
                class="selected-col-icon el-icon-check"
              ></i>
              <i
                v-else-if="item.disabled==1"
                class="selected-col-icon el-icon-circle-close"
              ></i>
              <!-- <i 
              v-else-if="item.disabled==2"
              class="selected-col-icon el-icon-delete"></i> -->
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

      // isControlOpration:false

      switchRowSortValue:'asc'
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
    handleShowColor(id){
      switch(id){
        case 'a':
          return '#16B328'
        case 'b':
          return '#C213BF'
        case 'c':
          return '#F5222D'
        case 'd':
          return '#1890FF'
      }

    },
    async onSetSeatSection(section_id){
      let { selectedSeatIds } = this;
      let result = await this.$store.dispatch('hall/setSeatSection',{section_id:section_id,ids:selectedSeatIds});
      console.log('result',result);
      this.getSeat();
    },
    onSwitchChange(val){
      console.log('val',val,this.switchRowSortValue);
      
      this.$confirm(`您确定要进行此操作吗`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        let result = await this.$store.dispatch("hall/setSeatRowSort", {
          rowSort: val,
          hall_id: this.hall_info.id
        });
        this.getSeat();
      }).catch(() => {
        this.switchRowSortValue = val=='desc'?'asc':'desc';
        this.$message({
          type: 'info',
          message: '已取消'
        });          
      });

    },
    handleCheckedChange(bool,row) {
      let { seat,selectedSeatIds } = this;
      seat[row].indeterminate = false;
      let row_arr = seat[row].seat_data;
      for(let item of row_arr){
        if(bool && !selectedSeatIds.includes(item.id)) selectedSeatIds.push(item.id);
        let idx = selectedSeatIds.indexOf(item.id);
        if(!bool && idx!=-1) selectedSeatIds.splice(idx,1);
      }
    },
    async onSetSeatDisabled(val) {
      let { selectedSeatIds } = this;
      if(!selectedSeatIds.length) return this.$message.info('请选择座位');
      this.$confirm(`您确定要${val==1?'禁售':val==2?'设置无座':'启用'}吗`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        let result = await this.$store.dispatch("hall/setSeatDisabled", {
          seat_ids: this.selectedSeatIds,
          disabled: val,
          hall_id: this.hall_info.id
        });
        this.getSeat();
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        });          
      });
      
    },
    onSelectSeat(item,seat_data,row) {
      let { selectedSeatIds,seat,checkedRow } = this;
      if (selectedSeatIds.includes(item.id)) {
        selectedSeatIds.splice(selectedSeatIds.indexOf(item.id), 1);
      } else {
        selectedSeatIds.push(item.id);
      }
      let num = 0;
      for(let it of seat_data) if(selectedSeatIds.includes(it.id)) num += 1;
      if(num==seat_data.length) {
        seat[row].indeterminate = false;
        checkedRow.push(row.toString());
      }else if(num!=0){
        let idx = checkedRow.indexOf(row);
        if(idx!=-1) checkedRow.splice(idx,1);
        seat[row].indeterminate = true;
      }else{
        seat[row].indeterminate = false;
        let idx = checkedRow.indexOf(row);
        if(idx!=-1) checkedRow.splice(idx,1);
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
      this.switchRowSortValue = result.rows.rowSort;
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
    color: #fff;
  }
  .disabled{
    background: #ccc;
    color: #999;
  }
  .on-disabled{
    .selected-col-icon{
      line-height: 1;
    }
    .selected-col-icon:before{
      content: '启用';
      font-size: 12px;
    }
  }
  .no-seat{
    .selected-col-icon{
      color: rgb(24, 144, 255);
    }
  }
}
.selected-col-icon {
  position: absolute;
  top: 2px;
  right: 4px;
  font-weight: bolder;
  font-size: 12px;
  // color: #fff;
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
        // display: flex;
        // flex-flow: row wrap;

        position: relative;
      }
      .disabled-col{
        background: #ccc;
        color: #fff;
      }
      .selected-col {
        background: #13c2c2;
        color: #fff;
        // position: relative;
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
