<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" style="text-align: center" class="clearfix">
        <span>电影列表</span>
        <el-button type="text" @click="getData" class="float-right">
          <i class="el-icon-refresh"></i>刷新
        </el-button>
      </div>

      <el-form label-width="90px">
        <el-form-item label="关键字搜索" style="display: inline-block">
          <el-input
            v-model="fetchOptions.keywords"
            style="width: 200px"
            @keyup.enter.native="getData()"
            placeholder="请输入关键字"
          ></el-input>
        </el-form-item>
        <el-form-item label="上映日期" style="display: inline-block">
          <el-date-picker
            @change="onDateChange"
            v-model="show_time_range"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>

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
        <el-table-column prop="id" label="#id"></el-table-column>
        <el-table-column prop="film_name" label="电影名称">
          <template slot-scope="scope">
            {{ scope.row.film_name }}
            <el-tag v-if="scope.row.play_type_label">{{
              scope.row.play_type_label
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="category_labels" label="类型"></el-table-column>
        <el-table-column prop="poster_img" label="海报">
          <template slot-scope="scope">
            <el-image
              fit="contain"
              style="width: 50px; height: 50px"
              :src="scope.row.poster_img"
              :preview-src-list="[scope.row.poster_img]"
            >
            </el-image>
          </template>
        </el-table-column>
        <el-table-column prop="director" label="导演"></el-table-column>
        <el-table-column prop="nation" label="国家"></el-table-column>
        <el-table-column prop="play_time" label="播放时间">
          <template slot-scope="scope">
            {{ scope.row.play_time }} 分钟
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.status == 1">上架</el-tag>
            <el-tag type="info" v-else>下架</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="show_time" label="上映时间">
          <template slot-scope="scope">{{
            scope.row.show_time | formatDate
          }}</template>
        </el-table-column>
        <el-table-column prop="add_time" label="添加时间">
          <template slot-scope="scope">{{
            scope.row.create_at | formatDate
          }}</template>
        </el-table-column>

        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="doDetail(scope.row)">
              <i class="el-icon-view"></i>详情
            </el-button>
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

      <FilmDetail ref="film_detail" />
    </el-card>
  </div>
</template>

<script>
import FilmDetail from "@/views/film/filmList/Detail";
export default {
  name: "FilmList",
  data() {
    return {
      loading: false,
      tableData: [],
      fetchOptions: {
        page: 1,
        limit: 20,
        keywords: "",
        start_show_time: "",
        end_show_time: "",
      },
      show_time_range: [],
      total: 0,
      currentView: "",
    };
  },
  components: {
    FilmDetail,
  },
  computed: {},
  mounted() {
    this.getData();
  },
  watch: {},
  methods: {
    doDetail(rows) {
      this.$refs.film_detail.open(rows);
    },
    onDateChange(date) {
      this.fetchOptions.start_show_time = date ? date[0] : "";
      this.fetchOptions.end_show_time = date ? date[1] : "";
      this.getData();
    },
    getData() {
      this.loading = true;
      this.$store
        .dispatch("filmListManager/list", this.fetchOptions)
        .then((res) => {
          this.tableData = res.rows;
          this.total = res.count;
          this.loading = false;
        });
    },
    doEdit(rows) {
      this.$router.push({ path: "/film-system/film/edit/" + rows.id });
    },
    doDelete(rows) {
      const { id } = rows;
      this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$store.dispatch("filmListManager/doDel", { id }).then(() => {
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
