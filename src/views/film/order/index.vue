<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" style="text-align: center" class="clearfix">
        <span>订单列表</span>
      </div>

      <el-form label-width="70px">
        <div style="margin-bottom:15px;font-weight:bold;">筛选</div>
        <el-form-item
          label="影院"
          label-width="50px"
          style="display: inline-block"
        >
          <el-select
            style="width: 300px"
            v-model="fetchOptions.cinema_id"
            filterable
            reserve-keyword
            remote
            placeholder="请选择影院"
            :remote-method="getCinemaList"
            :loading="isSelectLoading"
            @change="onCinemaChange"
          >
            <el-option key="-c" label="全部" value />
            <el-option
              v-for="item in cinemaList"
              :key="item.id + 'c'"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="影厅"
          label-width="50px"
          style="display: inline-block"
        >
          <el-select
            style="width: 150px"
            v-model="fetchOptions.hall_id"
            filterable
            reserve-keyword
            placeholder="请选择影厅"
            @change="getData(true)"
          >
            <el-option label="全部" value />
            <el-option
              v-for="item in hallList"
              :key="item.id + 'h'"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="电影" style="display: inline-block">
          <el-select
            style="width: 300px"
            v-model="fetchOptions.film_id"
            filterable
            reserve-keyword
            remote
            placeholder="请选择影院"
            :remote-method="getFilmList"
            :loading="isSelectLoading"
            @change="getData(true)"
          >
            <el-option key="-c" label="全部" value />
            <el-option
              v-for="item in filmList"
              :key="item.id + 'c'"
              :label="item.film_name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="下单时间" style="display: inline-block">
          <el-date-picker
            v-model="fetchOptions.order_times"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            type="datetimerange"
            :picker-options="pickerOptions"
            @change="onOrderTimesChange"
            format="yyyy-MM-dd HH:mm"
          />
        </el-form-item>

        <el-form-item label="放映时间" style="display: inline-block">
          <el-date-picker
            v-model="fetchOptions.show_times"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            type="datetimerange"
            :picker-options="pickerOptions"
            @change="getData(true)"
            format="yyyy-MM-dd HH:mm"
          />
        </el-form-item>


        
        <el-form-item label="状态" style="display: inline-block">
          <el-radio-group v-model="fetchOptions.status" @change="getData(true)">
            <el-radio label>全部</el-radio>
            <el-radio :label="0">待支付</el-radio>
            <el-radio :label="1">待使用</el-radio>
            <el-radio :label="2">已完成</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item style="display: inline-block">
          <el-button type="primary" @click="getData(true)">搜索</el-button>
        </el-form-item>
      </el-form>
      <div class="pull-left">共有 {{total}} 个订单 <span style="margin-left:30px;">合计金额<span class="price"> ¥{{total_price|currencyFormat}}</span></span></div>
      <el-button
        type="primary"
        @click="exportExcel"
        size="mini"
        class="pull-right"
      >
        <i class="fa fa-send-o"></i>
        导出excel
      </el-button>
      
      <el-table
        v-loading="loading"
        :data="tableData"
        highlight-current-row
        @sort-change="handleSortChange"
        border
        style="width: 100%"
      >
        <el-table-column prop="order_id" label="订单编号" sortable width="120"></el-table-column>
        <el-table-column prop="price" label="金额" sortable width="80">
          <template slot-scope="{row}">
            <p class="price">¥ {{ row.price|currencyFormat}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="verify_code" label="验证码" width="150"></el-table-column>
        <el-table-column
          prop="user_id"
          label="会员信息"
          width="200"
        >
          <template slot-scope="{row}">
            <div class="user-info">
              <el-image
                :z-index="2000000"
                fit="contain"
                style="width: 50px; height: 50px;"
                :src="row.avatar"
                :preview-src-list="[row.avatar]"
              />
              <div class="right-content">
                <div class="item">
                  会员编号:{{row.user_id}}
                </div>
                <div class="item">
                  会员昵称:{{row.nickname}}
                </div>
              </div>
              
            </div>
            
          </template>
        </el-table-column>
        <el-table-column prop="film_name" label="电影名称" width="200">
          <template slot-scope="{row}">
            {{row.film_name}}
            <p>时长：{{row.runtime}} 分钟</p>
          </template>
        </el-table-column>
        <el-table-column prop="cinema_name" label="影院" width="300">
          <template scope="{row}">
            <p>{{row.cinema_name}}</p>
            <p>影厅：{{row.hall_name}} <el-tag>{{row.hall_type_name}}</el-tag></p>
          </template>
        </el-table-column>
        
        <el-table-column prop="start_runtime" label="放映时间" sortable width="150">
          <template slot-scope="{row}">
            <div>{{ dayjs(row.start_runtime).format("YYYY/MM/DD")}} {{handleWeek(dayjs(row.start_runtime).day())}}</div>
            <el-button type="text">{{dayjs(row.start_runtime).format("HH:mm")}}</el-button> ~<el-button type="text">{{dayjs(row.start_runtime).add(row.runtime,'minute').format("HH:mm")}}</el-button>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="runtime" label="播放时长" sortable width="150">
          <template slot-scope="{row}">
            <p>{{ row.runtime }} 分钟</p>
          </template>
        </el-table-column> -->
        
        <el-table-column
          prop="status"
          label="状态"
          width="100"
        >
          <template slot-scope="{row}">
            <el-tag 
            type="info" 
            v-if="row.status==0"
            size="mini">待支付</el-tag>
            <el-tag 
            :type="dayjs(row.end_runtime).unix()<dayjs().unix()?'info':''" 
            v-if="row.status==1"
            size="mini">待使用</el-tag>
            <el-tag 
            type="success" 
            v-if="row.status==2" 
            size="mini">已完成</el-tag>

            <div style="color:#ccc;font-size:12px;" v-if="dayjs(row.start_runtime).unix()>dayjs().unix()">待放映</div>
            <div style="color:#ccc;font-size:12px;" v-if="dayjs(row.end_runtime).unix()<dayjs().unix()">放映已结束</div>
            <div style="color:#ccc;font-size:12px;" v-if="dayjs(row.start_runtime).unix()<dayjs().unix() && dayjs(row.end_runtime).unix()>dayjs().unix()">放映中</div>
          </template>
        </el-table-column>

        <el-table-column prop="created_at" label="下单时间" sortable width="140"></el-table-column>

        <!-- <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="doEdit(scope.row)">
              <i class="el-icon-edit"></i>编辑
            </el-button>
            <el-divider direction="vertical"></el-divider>
            <el-button type="text" size="small" @click="doDelete(scope.row)">
              <i class="el-icon-delete"></i>删除
            </el-button>
          </template>
        </el-table-column> -->
      </el-table>
      <br />
      <el-row>
        <mine-pagination
          :total="total"
          @sizeChange="handleSizeChange"
          @currentChange="handleCurrentChange"
          :pageSize="fetchOptions.limit"
          :currentPage="fetchOptions.page"
        />
      </el-row>

      <AddEdit
        ref="add_edit"
        :cinemaList="cinemaList"
        @on-getData="getData(true)"
      />
    </el-card>

    <el-dialog
      title="正在下载excel文件，请稍等！"
      :visible.sync="is_downloading"
      :before-close="handleDownloadClose"
      width="30%"
    >
      <el-progress
        :text-inside="true"
        :stroke-width="18"
        :percentage="downloadPercentage"
      ></el-progress>
      已下载{{ exportExcelData.length }}条数据；共{{ download_count }}条数据
    </el-dialog>
  </div>
</template>

<script>
import AddEdit from "@/views/film/sechedule/addEdit";
import XLSX from "xlsx";
export default {
  name: "FilmList",
  data() {
    return {
      dayjs:dayjs,
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
      loading: false,
      tableData: [],
      fetchOptions: {
        cinema_id: "",
        hall_id: "",
        film_id: "",
        order_times:[],
        show_times:[],
        page: 1,
        limit: 20,
        keywords: "",
        status:'',
        order:{
          created_at:'desc'
        },
        
      },
      show_time_range: [],
      total: 0,
      total_price:0,
      currentView: "",

      cinemaList: [],
      hallList: [],
      isSelectLoading:false,

      filmList:[],
      statusList:{
        0:'待支付',
        1:'待使用',
        2:'已完成',
      },


      exportExcelData: [],
      is_downloading: false,
      download_count: 0,
    };
  },
  components: {
    AddEdit,
  },
  computed: {
    downloadPercentage() {
      var percentage = Number(
        ((this.exportExcelData.length / this.download_count) * 100).toFixed(2)
      );
      if (isNaN(percentage)) {
        return 0;
      } else {
        return percentage;
      }
    },
  },
  mounted() {
    // this.getData();
    this.getCinemaList();
    this.getFilmList();
    let { query } = this.$route;
    if (query.cinema_id) {
      this.fetchOptions.cinema_id = Number(query.cinema_id);
      this.getData(true);
      this.getHallList(query.cinema_id);
    }else{
      this.getData();
    }
  },
  watch: {},
  methods: {
    handleWeek(day) {
      switch (day) {
        case 0:
          return "周日";
        case 1:
          return "周一";
        case 2:
          return "周二";
        case 3:
          return "周三";
        case 4:
          return "周四";
        case 5:
          return "周五";
        case 6:
          return "周六";
        default:
          return "";
      }
    },
    exportExcel() {
      this.exportExcelData = [];
      this.is_downloading = true;

      this.download_count = 0;

      var workBook = XLSX.utils.book_new();

      this.getExportData(1, () => {
        var exportExcelData = this.exportExcelData;

        var excelData = [
          [
            "编号",
            "金额",
            "验证码",
            "会员编号",
            "会员昵称",
            "电影名称",
            "影院",
            "影厅",
            "放映时间",
            "播放时长",
            
            "状态",
            "下单时间",
          ]
        ];

        for (var i = 0; i < exportExcelData.length; i++) {
          excelData.push([
            exportExcelData[i].order_id,
            exportExcelData[i].price,
            exportExcelData[i].verify_code,
            exportExcelData[i].user_id,
            exportExcelData[i].nickname,
            exportExcelData[i].film_name,
            exportExcelData[i].cinema_name,
            exportExcelData[i].hall_name+'('+exportExcelData[i].hall_type_name+')',
            exportExcelData[i].start_runtime + "~" + exportExcelData[i].end_runtime,
            exportExcelData[i].runtime,
            this.statusList[exportExcelData[i].status],
            exportExcelData[i].created_at
          ]);
        }

        var merges = [
          // 设置单元格合并
          // { s: { c: 0, r: 0 }, e: { c: 0, r: 1 } },
        ];

        this.bookAppendSheet(workBook, excelData, "账目列表", merges);
        // this.$refs.selected_option.selectedLabel
        XLSX.writeFile(
          workBook,
          "账目列表.xlsx"
        );

        this.$message.success("导出成功");
        setTimeout(() => {
          this.is_downloading = false;
        }, 2000);
      });
    },

    getExportData(page, callBack) {
      if (!this.is_downloading) {
        return;
      }
      this.$store
        .dispatch("order/get_order_list", {
          ...this.fetchOptions,
          order_times:JSON.stringify(this.fetchOptions.order_times),
          show_times:JSON.stringify(this.fetchOptions.show_times),
          limit: 100,
          page,
        })
        .then((res) => {
          console.log("res", res);
          var data = res.rows;
          this.download_count = res.count;
          if (this.exportExcelData.length >= res.count) {
            return callBack && callBack();
          }
          this.exportExcelData = this.exportExcelData.concat(data);
          this.getExportData(page + 1, callBack);
        });
    },

    bookAppendSheet(workBook, data, sheetName, mergesData = []) {
      var workSheetPosChange = XLSX.utils.aoa_to_sheet(data);
      if (mergesData.length > 0) {
        workSheetPosChange["!merges"] = mergesData;
      }
      XLSX.utils.book_append_sheet(workBook, workSheetPosChange, sheetName);
    },

    handleDownloadClose(done) {
      this.$confirm("您确认要终止下载吗？")
        .then((_) => {
          this.is_downloading = false;
          this.$message.success("已终止下载");
          done();
        })
        .catch((_) => {});
    },





    onFilmChange(film_id){
      this.getData(true);
    },
    onCinemaChange(cinema_id){
      this.getData(true);
      this.fetchOptions.hall_id='';
      this.getHallList(cinema_id);
    },
    onOrderTimesChange(val){
      this.getData(true);
    },
    getHallList(cinema_id) {
      if(!cinema_id) return this.hallList = [];
      this.$store
        .dispatch("hall/list", {
          page: 1,
          limit: 1000,
          cinema_id: cinema_id,
        })
        .then((res) => {
          this.hallList = res.data;
        });
    },
    // onChangeCinema(cinema_id) {
    //   this.getData(true);
    //   this.hallList = [];
    //   this.fetchOptions.hall_id = "";
    //   if (cinema_id) {
    //     this.getHallList(cinema_id);
    //   }
    // },
    async getCinemaList(keywords) {
      this.isSelectLoading = true;
      let result = await this.$store.dispatch("cinemaManager/list", {
        page: 1,
        limit: 50,
        status: 1,
        keywords:keywords?keywords:''
      });
      this.isSelectLoading = false;
      this.cinemaList = result.rows;
    },
    async getFilmList(keywords) {
      this.isSelectLoading = true;
      let result = await this.$store.dispatch("filmListManager/list", {
        page: 1,
        limit: 50,
        status: 1,
        keywords:keywords?keywords:''
      });
      this.isSelectLoading = false;
      this.filmList = result.rows;
    },
    getData(Filter) {
      if (Filter) this.fetchOptions.page = 1;
      this.loading = true;
      this.$store.dispatch("order/get_order_list", {
        ...this.fetchOptions,
        order_times:JSON.stringify(this.fetchOptions.order_times),
        show_times:JSON.stringify(this.fetchOptions.show_times)
      }).then((res) => {
        this.tableData = res.rows;
        this.total = res.count;
        this.total_price = res.total_price;
        this.loading = false;
      });
    },
    doDelete(rows) {
      const { id } = rows;
      this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$store.dispatch("schedule/del", { id }).then(() => {
            this.getData();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    doDetail(rows) {},
    onAdd() {
      this.$refs.add_edit.open(null, this.fetchOptions.cinema_id);
    },
    doEdit(rows) {
      this.$refs.add_edit.open(rows, rows.cinema_id);
    },
    handleSizeChange(limit) {
      this.fetchOptions.limit = limit;
      this.getData();
    },

    handleCurrentChange(page) {
      this.fetchOptions.page = page;
      this.getData();
    },
    handleSortChange(val) {
      var order = "";
      if (val.order == "descending") {
        order = "desc";
      } else {
        order = "asc";
      }
      this.fetchOptions.order[val.prop] = order;
      this.getData();
    },
  },
};
</script>

<style lang="scss" scoped>
.user-info{
  display: flex;
  .right-content{
    .item{

    }
  }
}
</style>
