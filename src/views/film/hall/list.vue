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
        <el-page-header @back="goBack" title="返回" content="影厅管理" center />
        <span>{{cinema_name}}</span>
        <el-button
          type="text"
          @click="doAdd"
          class="el-icon-plus"
          style="marign-right: 10px"
          >添加影厅</el-button
        >
      </div>

      <el-form label-width="90px">
        <el-row :gutter="24">
          <el-col :span="12">
            <!-- <el-form-item label="影院">
              <el-select
                style="width: 350px"
                v-model="fetchOptions.cinema_id"
                filterable
                reserve-keyword
                placeholder="请输入关键词"
                @change="getData(true)"
              >
                <el-option
                  v-for="item in cinemaList"
                  :key="item.id + 'c'"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item> -->
          </el-col>
          <el-col :span="12">
            <el-form-item label="关键字搜索" style="display: inline-block">
              <el-input
                v-model="fetchOptions.keywords"
                style="width: 200px"
                @keyup.enter.native="getData(true)"
                placeholder="搜索影厅名称"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="">
          <el-button @click="getData">筛选</el-button>
        </el-form-item>
      </el-form>

      <el-table
        v-loading="loading"
        :data="tableData"
        highlight-current-row
        border
        style="width: 100%"
      >
        <!-- <el-table-column prop="id" label="#id"></el-table-column> -->
        <el-table-column
          prop="name"
          label="影厅名称"
          width="200"
        >
          <template slot-scope="scope">
            {{scope.row.name}}<el-tag>{{scope.row.hall_type_name}}</el-tag>
          </template>
        </el-table-column>
        <!-- <el-table-column
          prop="cinema_name"
          label="影院名称"
          width="300"
        ></el-table-column> -->
        <el-table-column
          prop="seat_num"
          label="座位数"
          width="70"
        ></el-table-column>
        <el-table-column
          prop="seat_row_num"
          label="排数"
          width="50"
        ></el-table-column>
        <el-table-column
          prop="seat_column_num"
          label="列数"
          width="50"
        ></el-table-column>
        <el-table-column
          prop="describe"
          label="描述"
          width="300"
        ></el-table-column>

        <el-table-column prop="status" label="状态" width="80">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.status == 1">启用</el-tag>
            <el-tag type="info" v-else>禁用</el-tag>
          </template>
        </el-table-column>

        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              class="el-icon-setting"
              type="text"
              size="small"
              @click="onArrangeSeat(scope.row)"
            >
              安排座位
            </el-button>
            <el-divider direction="vertical"></el-divider>

            <el-button
              class="el-icon-edit"
              type="text"
              size="small"
              @click="doEdit(scope.row)"
            >
              编辑
            </el-button>
            <el-divider direction="vertical"></el-divider>
            <el-button
              class="el-icon-delete"
              type="text"
              size="small"
              @click="doDelete(scope.row)"
            >
              删除
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

      <AddEdit ref="add_edit" @on-getData="getData" />
    </el-card>
  </div>
</template>

<script>
import AddEdit from "@/views/film/hall/addEdit";
export default {
  name: "HallList",
  data() {
    return {
      loading: false,
      tableData: [],
      fetchOptions: {
        page: 1,
        limit: 20,
        keywords: "",
        cinema_id: "",
      },
      show_time_range: [],
      total: 0,
      cinemaList: [],
      cinema_name:""
    };
  },
  components: {
    AddEdit,
  },
  computed: {},
  mounted() {
    let { query } = this.$route;
    // console.log("query", query);
    if (query.cinema_id) {
      this.fetchOptions.cinema_id = query.cinema_id;
    }
    // this.getCinemaList();
    this.getData();
  },
  watch: {
    // $route(to, from) {
    //   // console.log('to',to,"from",from);
    //   if (from.path == "/film-system/cinema/list") {
    //     this.fetchOptions.cinema_id = to.query.cinema_id;
    //     this.getData();
    //   }
    // },
  },
  methods: {
    // async getCinemaList() {
    //   let result = await this.$store.dispatch("cinemaManager/list", {
    //     page: 1,
    //     limit: 1000000,
    //   });
    //   this.cinemaList = result.rows;
    // },
    goBack() {
      this.$router.back();
    },
    onArrangeSeat(rows) {
      this.$router.push({
        path: "/film-system/cinema/hall-manage/arrange-seat",
        query: {
          hall_id: rows.id,
        },
      });
    },
    doAdd() {
      this.$refs.add_edit.open();
    },
    doDetail(rows) {
      this.$refs.film_detail.open(rows);
    },
    onDateChange(date) {
      this.fetchOptions.start_show_time = date ? date[0] : "";
      this.fetchOptions.end_show_time = date ? date[1] : "";
      this.getData();
    },
    getData(Filter) {
      if (Filter) {
        this.fetchOptions.page = 1;
      }
      this.loading = true;
      this.$store.dispatch("hall/list", this.fetchOptions).then((res) => {
        this.cinema_name = res.data.name;
        this.tableData = res.data.halls;
        this.total = res.count;
        this.loading = false;
      });
    },
    doEdit(rows) {
      this.$refs.add_edit.open(rows);
    },
    doDelete(rows) {
      const { id } = rows;
      this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$store.dispatch("hall/del", { id }).then(() => {
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

    handleSizeChange(limit) {
      console.log("limit", limit);
      this.fetchOptions.limit = limit;
      this.getData();
    },

    handleCurrentChange(page) {
      console.log("page", page);
      this.fetchOptions.page = page;
      this.getData();
    },
  },
  // beforeRouteLeave(to,from,next){
  //   if(to.name == "ManagerAdd" || to.name == "ManagerEdit"){
  //     this.$route.meta.keep_alive = true;
  //   }else{
  //     this.$route.meta.keep_alive = false;
  //   }
  //   next();
  // },
};
</script>

<style lang="scss" scoped>
</style>
