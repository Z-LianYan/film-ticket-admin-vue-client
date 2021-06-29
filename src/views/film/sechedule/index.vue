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
            placeholder="请选择影院"
            @change="onChangeCinema"
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
        <el-form-item label="放映日期" style="display: inline-block">
          <el-date-picker
            style="width: 150px"
            v-model="fetchOptions.play_date"
            type="date"
            placeholder="选择放映日期"
            @change="getData(true)"
          />
        </el-form-item>
        <el-form-item label="搜索电影" style="display: inline-block">
          <el-input
            v-model="fetchOptions.keywords"
            style="width: 200px"
            @keyup.enter.native="getData(true)"
            placeholder="搜索电影名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="状态" style="display: inline-block">
          <el-radio-group v-model="fetchOptions.status" @change="getData(true)">
            <el-radio label>全部</el-radio>
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">禁用</el-radio>
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
        border
        style="width: 100%"
      >
        <!-- <el-table-column prop="id" label="#id" width="100"></el-table-column> -->
        <el-table-column prop="film_name" label="电影名称"></el-table-column>
        <el-table-column prop="cinema_name" label="影院"></el-table-column>
        <el-table-column
          prop="hall_name"
          label="影厅"
          width="90"
        ></el-table-column>
        <el-table-column prop="price" label="售价">
          <template slot-scope="scope">
            <span class="price">¥ {{ scope.row.price | currencyFormat }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="play_date" label="放映日期">
          <template slot-scope="scope">
            {{ scope.row.play_date | formatDate }}
          </template>
        </el-table-column>
        <el-table-column
          prop="start_play_time"
          label="开始放映时间"
        ></el-table-column>
        <el-table-column
          prop="end_play_time"
          label="结束放映时间"
        ></el-table-column>

        <el-table-column
          prop="status"
          label="状态"
        >
          <template slot-scope="scope">
            <el-tag :type="scope.row.status==1?'success':'info'">{{scope.row.status==1?'启用':'禁用'}}</el-tag>
          </template>
        </el-table-column>

        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- <el-button type="text" size="small" @click="doDetail(scope.row)">
              <i class="el-icon-view"></i>详情
            </el-button> -->
            <el-button type="text" size="small" @click="doEdit(scope.row)">
              <i class="el-icon-edit"></i>编辑
            </el-button>
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
    </el-card>

    <!-- <svg id="icon-1-1" viewBox="0 0 1074 1024">
      <path
        d="M953.029703 182.49505h77.793584A43.849505 43.849505 0 0 1 1074.693069 226.334416v635.721505a43.849505 43.849505 0 0 1-43.869782 43.839366h-55.66099a10.138614 10.138614 0 0 0-10.138614 10.138614v33.710891A43.849505 43.849505 0 0 1 921.174178 993.584158H153.52903a43.849505 43.849505 0 0 1-43.869782-43.839366V916.023762a10.138614 10.138614 0 0 0-10.138614-10.138613h-55.66099A43.849505 43.849505 0 0 1 0 862.055921V226.334416A43.849505 43.849505 0 0 1 43.869782 182.49505H121.663366V81.108911a81.108911 81.108911 0 0 1 81.108911-81.108911h669.148515a81.108911 81.108911 0 0 1 81.108911 81.108911v101.386139z"
        fill="#FFFFFF"
      ></path>
      <path
        d="M202.772277 20.277228a60.831683 60.831683 0 0 0-60.831683 60.831683v709.70297a20.277228 20.277228 0 0 0 20.277228 20.277228h750.257426a20.277228 20.277228 0 0 0 20.277227-20.277228V81.108911a60.831683 60.831683 0 0 0-60.831683-60.831683H202.772277z m0-20.277228h669.148515a81.108911 81.108911 0 0 1 81.108911 81.108911v709.70297a40.554455 40.554455 0 0 1-40.554455 40.554456H162.217822a40.554455 40.554455 0 0 1-40.554456-40.554456V81.108911a81.108911 81.108911 0 0 1 81.108911-81.108911z"
        fill="#EFC100"
      ></path>
      <path
        d="M1030.823287 182.49505A43.849505 43.849505 0 0 1 1074.693069 226.334416v635.721505a43.849505 43.849505 0 0 1-43.869782 43.839366h-55.66099a10.138614 10.138614 0 0 0-10.138614 10.138614v33.710891A43.849505 43.849505 0 0 1 921.174178 993.584158H153.52903a43.849505 43.849505 0 0 1-43.869782-43.839366V916.023762a10.138614 10.138614 0 0 0-10.138614-10.138613h-55.66099A43.849505 43.849505 0 0 1 0 862.055921V226.334416A43.849505 43.849505 0 0 1 43.869782 182.49505h87.92206v20.277227H43.869782A23.572277 23.572277 0 0 0 20.277228 226.334416v635.721505a23.572277 23.572277 0 0 0 23.592554 23.562138h55.66099a30.415842 30.415842 0 0 1 30.415842 30.415842v33.710891A23.572277 23.572277 0 0 0 153.518891 973.306931h767.63501a23.572277 23.572277 0 0 0 23.592554-23.562139V916.023762a30.415842 30.415842 0 0 1 30.415842-30.415841h55.66099A23.572277 23.572277 0 0 0 1054.415842 862.055921V226.334416A23.572277 23.572277 0 0 0 1030.823287 202.772277h-86.989307v-20.277227h86.989307z m0 0A43.849505 43.849505 0 0 1 1074.693069 226.334416v635.721505a43.849505 43.849505 0 0 1-43.869782 43.839366h-55.66099a10.138614 10.138614 0 0 0-10.138614 10.138614v33.710891A43.849505 43.849505 0 0 1 921.174178 993.584158H153.52903a43.849505 43.849505 0 0 1-43.869782-43.839366V916.023762a10.138614 10.138614 0 0 0-10.138614-10.138613h-55.66099A43.849505 43.849505 0 0 1 0 862.055921V226.334416A43.849505 43.849505 0 0 1 43.869782 182.49505H121.663366v20.277227H43.869782A23.572277 23.572277 0 0 0 20.277228 226.334416v635.721505a23.572277 23.572277 0 0 0 23.592554 23.562138h55.66099a30.415842 30.415842 0 0 1 30.415842 30.415842v33.710891A23.572277 23.572277 0 0 0 153.518891 973.306931h767.63501a23.572277 23.572277 0 0 0 23.592554-23.562139V916.023762a30.415842 30.415842 0 0 1 30.415842-30.415841h55.66099A23.572277 23.572277 0 0 0 1054.415842 862.055921V226.334416A23.572277 23.572277 0 0 0 1030.823287 202.772277H953.029703v-20.277227h77.793584z"
        fill="#EFC100"
      ></path>
    </svg> -->
  </div>
</template>

<script>
import AddEdit from "@/views/film/sechedule/addEdit";
export default {
  name: "FilmList",
  data() {
    return {
      loading: false,
      tableData: [],
      fetchOptions: {
        cinema_id: "",
        hall_id: "",
        film_id: "",
        play_date: "",
        page: 1,
        limit: 20,
        keywords: "",
        status:""
      },
      show_time_range: [],
      total: 0,
      currentView: "",

      cinemaList: [],
      hallList: [],
    };
  },
  components: {
    AddEdit,
  },
  computed: {},
  mounted() {
    this.getData();
    this.getCinemaList();
    let { query } = this.$route;
    if (query.cinema_id) {
      this.fetchOptions.cinema_id = Number(query.cinema_id);
    }
  },
  watch: {},
  methods: {
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
    onChangeCinema(cinema_id) {
      this.getData(true);
      this.hallList = [];
      this.fetchOptions.hall_id = "";
      if (cinema_id) {
        this.getHallList(cinema_id);
      }
    },
    async getCinemaList() {
      let result = await this.$store.dispatch("cinemaManager/list", {
        page: 1,
        limit: 1000000,
        // status: 1,
      });
      this.cinemaList = result.rows;
    },
    getData(Filter) {
      if (Filter) this.fetchOptions.page = 1;
      this.loading = true;
      this.$store.dispatch("schedule/list", this.fetchOptions).then((res) => {
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
  },
};
</script>

<style lang="scss" scoped>
</style>
