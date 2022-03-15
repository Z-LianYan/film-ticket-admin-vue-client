<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" style="text-align: center" class="clearfix">
        <span>排片</span>
        <el-button
          style="margin-left: 30px"
          type="text"
          @click="onAdd"
          class="el-icon-plus float-right"
        >
          添加
        </el-button>
        <el-button type="text" @click="getData" class="float-right">
          <i class="el-icon-refresh"></i>刷新
        </el-button>
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
        <el-form-item label="放映时间" style="display: inline-block">
          <el-date-picker
            v-model="fetchOptions.play_date_range"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            type="datetimerange"
            :picker-options="pickerOptions"
            @change="getData(true)"
          />
        </el-form-item>
        
        <!-- <el-form-item label="搜索电影" style="display: inline-block">
          <el-input
            v-model="fetchOptions.keywords"
            style="width: 200px"
            @keyup.enter.native="getData(true)"
            placeholder="搜索电影名称"
          ></el-input>
        </el-form-item> -->
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
        <el-form-item label="状态" style="display: inline-block">
          <el-radio-group v-model="fetchOptions.status" @change="getData(true)">
            <el-radio label>全部</el-radio>
            <el-radio :label="1">上架</el-radio>
            <el-radio :label="0">下架</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item style="display: inline-block">
          <el-button type="primary" @click="getData(true)">搜索</el-button>
        </el-form-item>
      </el-form>

      <el-table
        v-loading="loading"
        :data="tableData"
        highlight-current-row
        @sort-change="handleSortChange"
        border
        style="width: 100%"
      >
        <el-table-column prop="id" label="排片编号" sortable></el-table-column>
        <el-table-column prop="film_name" label="电影名称"></el-table-column>
        <el-table-column prop="cinema_name" label="影院"></el-table-column>
        <el-table-column
          prop="hall_name"
          label="影厅"
          width="90"
        >
          <template slot-scope="scope">
            {{ scope.row.hall_name}}<el-tag>{{scope.row.hall_type_name}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="run_time" label="播放时长" sortable width="150">
          <template slot-scope="{row}">
            <p>{{ row.runtime }} 分钟</p>
          </template>
        </el-table-column>
        <el-table-column prop="start_runtime" label="放映时间" sortable width="150">
          <template slot-scope="{row}">
            <p>{{ dayjs(row.start_runtime).format("YYYY/MM/DD")}} {{handleWeek(dayjs(row.start_runtime).day())}}</p>
            <el-button type="text">{{dayjs(row.start_runtime).format("HH:mm")}}</el-button> ~<el-button type="text">{{dayjs(row.end_runtime).format("HH:mm")}}</el-button>
          </template>
        </el-table-column>
        
        <el-table-column prop="show_time" label="上映时间" sortable width="150">
          <template slot-scope="{row}">
            <p>{{ dayjs(row.show_time*1000).format("YYYY/MM/DD")}} {{handleWeek(dayjs(row.show_time*1000).day())}}</p>
          </template>
        </el-table-column>
        <!-- <el-table-column
          prop="start_runtime"
          label="放映时间"
        >
          <template slot-scope="{row}">
            {{ dayjs(row.start_runtime).format("HH:mm") + ' ~ ' + dayjs(row.end_runtime).format("HH:mm") }}
          </template>
        </el-table-column> -->
        
        <el-table-column
          prop="language"
          label="语言"
          width="90"
        ></el-table-column>
        <el-table-column prop="premium" label="服务费">
          <template slot-scope="scope">
            <span class="price">¥ {{ scope.row.premium | currencyFormat }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="price" label="售价/座位" width="150">
          <template slot-scope="scope">
            <div v-if="scope.row.is_section==1">
              <div v-for="(item,index) in scope.row.sectionPrice" :key="index">
                <el-tag>{{item.section_name}} <span class="price">¥ {{item.price}}</span></el-tag>
              </div>
            </div>
            <span 
            class="price" 
            v-else>¥ {{ scope.row.price | currencyFormat }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="price" label="售价" width="150">
          <template slot-scope="{row}">
            <div v-if="row.is_section==1">
              <div v-for="(item,index) in row.sectionPrice" :key="index">
                <el-tag>{{item.section_name}} <span class="price">¥ {{Number(item.price)+row.premium}}</span></el-tag>
              </div>
            </div>
            <span 
            class="price" 
            v-else>¥ {{ (row.price+row.premium) | currencyFormat }}</span>
          </template>
        </el-table-column>
        

        <el-table-column
          prop="status"
          label="状态"
          width="100px"
        >
          <template slot-scope="{row}">
            <el-tag :type="row.status==1 && dayjs(row.end_runtime).unix()>dayjs().unix()?'success':'info'" size="mini">{{row.status==1?'上架':'下架'}}</el-tag>
            <!-- <el-button type="text" v-if="dayjs(row.end_runtime).unix()<dayjs().unix()">放映结束</el-button> -->
            <div style="color:#ccc;font-size:12px;" v-if="dayjs(row.start_runtime).unix()>dayjs().unix()">待放映</div>
            <div style="color:#ccc;font-size:12px;" v-if="dayjs(row.end_runtime).unix()<dayjs().unix()">放映已结束</div>
            <div style="color:#ccc;font-size:12px;" v-if="dayjs(row.start_runtime).unix()<dayjs().unix() && dayjs(row.end_runtime).unix()>dayjs().unix()">放映中</div>
          </template>
        </el-table-column>

        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="onShowBuyTicketDetail(scope.row)">
              <i class="el-icon-view"></i>查看购票情况
            </el-button>
            <el-button type="text" size="small" @click="doEdit(scope.row)">
              <i class="el-icon-edit"></i>编辑
            </el-button>
            <el-divider direction="vertical"></el-divider>
            <el-button type="text" size="small" @click="doDelete(scope.row)">
              <i class="el-icon-delete"></i>删除
            </el-button>
          </template>
        </el-table-column>
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
      <BuyTicketDetail ref="buy_ticket_detail"/>
    </el-card>
  </div>
</template>

<script>
import AddEdit from "@/views/film/sechedule/addEdit";
import BuyTicketDetail from "@/views/film/sechedule/buyTicketDetail";

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
        // play_date: "",
        play_date_range:[],
        page: 1,
        limit: 20,
        keywords: "",
        status:1,
        order:{
          start_runtime:'asc'
        }
      },
      show_time_range: [],
      total: 0,
      currentView: "",

      cinemaList: [],
      hallList: [],
      filmList:[],
      isSelectLoading:false,
    };
  },
  components: {
    AddEdit,
    BuyTicketDetail
  },
  computed: {},
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
    onShowBuyTicketDetail(row){
      this.$refs.buy_ticket_detail.open(row);
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
    onCinemaChange(cinema_id){
      // this.getData(true);
      this.fetchOptions.hall_id='';
      this.getHallList(cinema_id);
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
    onChangeCinema(cinema_id) {
      this.getData(true);
      this.hallList = [];
      this.fetchOptions.hall_id = "";
      if (cinema_id) {
        this.getHallList(cinema_id);
      }
    },
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
    getData(Filter) {
      if (Filter) this.fetchOptions.page = 1;
      this.loading = true;
      let play_date_range = JSON.stringify(this.fetchOptions.play_date_range);
      // this.fetchOptions.play_date_range = JSON.stringify()
      this.$store.dispatch("schedule/list", {
        ...this.fetchOptions,
        play_date_range
      }).then((res) => {
        this.tableData = res.rows;
        this.total = res.count;
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
</style>
