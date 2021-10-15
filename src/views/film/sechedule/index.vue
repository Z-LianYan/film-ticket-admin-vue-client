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
        <el-form-item label="放映时间" style="display: inline-block">
          <el-date-picker
            v-model="fetchOptions.play_date_range"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            type="datetimerange"
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
        <el-table-column prop="id" label="#id" sortable></el-table-column>
        <el-table-column prop="film_name" label="电影名称"></el-table-column>
        <el-table-column prop="cinema_name" label="影院"></el-table-column>
        <el-table-column
          prop="hall_name"
          label="影厅"
          width="90"
        >
          <template slot-scope="scope">
            {{ scope.row.hall_name}}<el-tag>{{scope.row.hall_type_name}}</el-tag>
          </template></el-table-column>
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
        <el-table-column prop="price" label="售价" width="150">
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
        <el-table-column prop="play_date" label="放映日期" sortable>
          <template slot-scope="scope">
            {{ scope.row.play_date | formatDate }}
          </template>
        </el-table-column>
        <el-table-column
          prop="start_runtime"
          label="放映时间"
        >
          <template slot-scope="scope">
            {{ scope.row.start_runtime + ' ~ ' + scope.row.end_runtime }}
          </template>
        </el-table-column>

        <el-table-column
          prop="status"
          label="状态"
        >
          <template slot-scope="scope">
            <el-tag :type="scope.row.status==1?'success':'info'">{{scope.row.status==1?'上架':'下架'}}</el-tag>
          </template>
        </el-table-column>

        <el-table-column label="操作">
          <template slot-scope="scope">
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
    </el-card>
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
        // play_date: "",
        play_date_range:[],
        page: 1,
        limit: 20,
        keywords: "",
        status:"",
        order:{
          play_date:'asc'
        }
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
