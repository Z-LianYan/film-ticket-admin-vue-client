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

      <el-form label-width="90px">
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="影院">
              <el-select
                style="width: 300px"
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
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="搜索电影" style="display: inline-block">
              <el-input
                v-model="fetchOptions.keywords"
                style="width: 200px"
                @keyup.enter.native="getData(true)"
                placeholder="搜索电影名称"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="放映日期">
              <el-date-picker
                v-model="fetchOptions.play_date"
                type="date"
                placeholder="选择放映日期"
                @change="getData(true)"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item>
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

      <AddEdit ref="add_edit" :cinemaList="cinemaList" @on-getData='getData(true)'/>
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
        film_id: "",
        play_date: "",
        page: 1,
        limit: 20,
        keywords: "",
      },
      show_time_range: [],
      total: 0,
      currentView: "",

      cinemaList: [],
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
    if(query.cinema_id){
      this.fetchOptions.cinema_id = Number(query.cinema_id);
    }
  },
  watch: {},
  methods: {
    async getCinemaList() {
      let result = await this.$store.dispatch("cinemaManager/list", {
        page: 1,
        limit: 1000000,
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
      this.$refs.add_edit.open(null,this.fetchOptions.cinema_id);
    },
    doEdit(rows) {
      this.$refs.add_edit.open(rows,rows.cinema_id);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
