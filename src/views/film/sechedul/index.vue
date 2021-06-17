<template>
  <el-card class="box-card">
    <div slot="header" style="text-align: center" class="clearfix">
      <span>排片</span>
      <el-button type="text" @click="getData" class="float-right">
        <i class="el-icon-refresh"></i>刷新
      </el-button>
    </div>

    <el-form label-width="90px">
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="影院">
            <el-select
              v-model="fetchOptions.cinema_id"
              filterable
              reserve-keyword
              placeholder="请输入关键词"
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
        <el-col :span="12">
          <el-form-item label="月份">
            <el-date-picker
              v-model="fetchOptions.month"
              type="month"
              placeholder="选择月份"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <!-- <el-table
      v-loading="loading"
      :data="tableData"
      highlight-current-row
      border
      style="width: 100%"
    >
      <el-table-column prop="id" label="id"></el-table-column>
      <el-table-column prop="film_name" label="电影名称">
        <template slot-scope="scope">
          {{scope.row.film_name}} <el-tag v-if="scope.row.play_type_label">{{scope.row.play_type_label}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="category_labels" label="类型"></el-table-column>
      <el-table-column prop="poster_img" label="海报">
        <template slot-scope="scope">
          <el-image 
            fit='contain'
            style="width: 50px; height: 50px"
            :src="scope.row.poster_img" 
            :preview-src-list="[scope.row.poster_img]">
          </el-image>
        </template>
      </el-table-column>
      <el-table-column prop="director" label="导演"></el-table-column>
      <el-table-column prop="nation" label="国家"></el-table-column>
      <el-table-column prop="play_time" label="播放时间">
        <template slot-scope="scope">
          {{scope.row.play_time}} 分钟
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.status==1">上架</el-tag>
          <el-tag type="info" v-else>下架</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="show_time" label="上映时间">
        <template slot-scope="scope">{{scope.row.show_time|formatDate}}</template>
      </el-table-column>
      <el-table-column prop="add_time" label="添加时间">
        <template slot-scope="scope">{{scope.row.create_at|formatDate}}</template>
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
      
    </el-table> -->
    <br />
  </el-card>
</template>

<script>
export default {
  name: "FilmList",
  data() {
    return {
      loading: false,
      tableData: [],
      fetchOptions: {
        cinema_id: "",
        page: 1,
        limit: 20,
        keywords: "",
        start_show_time: "",
        end_show_time: "",
      },
      show_time_range: [],
      total: 0,
      currentView: "",

      cinemaList: [],
    };
  },
  components: {},
  computed: {},
  mounted() {
    // this.getData();
    this.getCinemaList();
  },
  watch: {},
  methods: {
    async getCinemaList() {
      let result = await this.$store.dispatch("cinemaManager/list", {
        page: 1,
        limit: 1000000,
      });
      this.cinemaList = result.rows;
      console.log("result---cinemaList", result);
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
    // doDelete(rows) {
    //   const { id } = rows;
    //   this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
    //     confirmButtonText: "确定",
    //     cancelButtonText: "取消",
    //     type: "warning"
    //   }).then(() => {
    //     this.$store.dispatch("filmListManager/doDel", { id }).then(() => {
    //       this.getData();
    //     });
    //   }).catch(() => {
    //     this.$message({
    //       type: "info",
    //       message: "已取消删除"
    //     });
    //   });
    // },
  },
};
</script>

<style lang="scss" scoped>
</style>
