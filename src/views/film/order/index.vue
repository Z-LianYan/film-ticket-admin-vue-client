<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" style="text-align: center" class="clearfix">
        <span>订单列表</span>
        <!-- <el-button
          style="margin-left: 30px"
          type="text"
          @click="onAdd"
          class="el-icon-plus float-right"
        >
          添加
        </el-button> -->
        <!-- <el-button type="text" @click="getData" class="float-right">
          <i class="el-icon-refresh"></i>刷新
        </el-button> -->
      </div>

      <el-form label-width="70px">
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

        <el-form-item label="搜索电影" style="display: inline-block">
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

      <el-table
        v-loading="loading"
        :data="tableData"
        highlight-current-row
        @sort-change="handleSortChange"
        border
        style="width: 100%"
      >
        <el-table-column prop="order_id" label="订单编号" sortable width="120"></el-table-column>
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
        <el-table-column prop="film_name" label="电影名称" width="200"></el-table-column>
        <el-table-column prop="cinema_name" label="影院" width="300">
          <template scope="{row}">
            <p>{{row.cinema_name}}</p>
            <p>影厅：{{row.hall_name}} <el-tag>{{row.hall_type_name}}</el-tag></p>
          </template>
        </el-table-column>
        <!-- <el-table-column
          prop="hall_name"
          label="影厅"
          width="90"
        >
          <template slot-scope="scope">
            {{ scope.row.hall_name}}<el-tag>{{scope.row.hall_type_name}}</el-tag>
          </template>
        </el-table-column> -->
        <el-table-column prop="runtime" label="播放时长" sortable width="150">
          <template slot-scope="{row}">
            <p>{{ row.runtime }} 分钟</p>
          </template>
        </el-table-column>
        <el-table-column prop="start_runtime" label="放映时间" sortable width="150">
          <template slot-scope="{row}">
            <p>{{ dayjs(row.start_runtime).format("YYYY/MM/DD")}}</p>
            <el-button type="text">{{dayjs(row.start_runtime).format("HH:mm")}}</el-button> ~<el-button type="text">{{dayjs(row.start_runtime).add(row.runtime,'minute').format("HH:mm")}}</el-button>
          </template>
        </el-table-column>
        
        <el-table-column prop="price" label="金额" sortable width="80">
          <template slot-scope="{row}">
            <p class="price">¥ {{ row.price}}</p>
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态"
        >
          <template slot-scope="{row}">
            <el-tag type="info" v-if="row.status==0">待支付</el-tag>
            <el-tag :type="dayjs(row.end_runtime).unix()<dayjs().unix()?'info':''" v-if="row.status==1">待使用</el-tag>
            <el-tag type="success" v-if="row.status==2">已完成</el-tag>
            <!-- <el-button type="text" v-if="dayjs(row.end_runtime).unix()<dayjs().unix()">放映结束</el-button> -->
            <div style="color:#ccc;" v-if="dayjs(row.end_runtime).unix()<dayjs().unix()">放映已结束</div>
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
  </div>
</template>

<script>
import AddEdit from "@/views/film/sechedule/addEdit";
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
      currentView: "",

      cinemaList: [],
      hallList: [],
      isSelectLoading:false,

      filmList:[],
    };
  },
  components: {
    AddEdit,
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
    onOrderTimesChange(val){
      this.getData(true);
    },
    getHallList(cinema_id) {
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
        order_times:JSON.stringify(this.fetchOptions.order_times)
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
.user-info{
  display: flex;
  .right-content{
    .item{

    }
  }
}
</style>
