<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" style="text-align: center" class="clearfix">
        <span>影院列表</span>
        <el-button
          type="text"
          @click="doAdd"
          class="float-right"
          style="marign-right: 10px"
        >
          <i class="el-icon-plus"></i>添加影院
        </el-button>
      </div>

      <el-form label-width="90px">
        <el-form-item label="关键字搜索" style="display: inline-block">
          <el-input
            v-model="fetchOptions.keywords"
            style="width: 200px"
            @keyup.enter.native="getData(true)"
            placeholder="搜索影院名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="状态" style="display: inline-block">
          <el-radio-group v-model="fetchOptions.status" @change="getData(true)">
            <el-radio label>全部</el-radio>
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="" style="display: inline-block">
          <el-button type="primary" @click="getData(true)">筛选</el-button>
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
        <el-table-column prop="name" label="影院名称"></el-table-column>
        <el-table-column prop="address" label="地址"></el-table-column>
        <el-table-column prop="phone" label="联系电话"  width="220"></el-table-column>
        <!-- <el-table-column prop="low_price" label="最低售价" width="100">
          <template slot-scope="scope">
            <span class="price"
              >¥ {{ scope.row.low_price | currencyFormat }}</span
            >
          </template>
        </el-table-column> -->
        <el-table-column prop="premium" label="服务费" width="100">
          <template slot-scope="scope">
            <span class="price"
              >¥ {{ scope.row.premium | currencyFormat }}</span
            >
          </template>
        </el-table-column>

        <el-table-column prop="status" label="状态" width="80">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.status == 1">启用</el-tag>
            <el-tag type="info" v-else>禁用</el-tag>
          </template>
        </el-table-column>

        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.status==1"
              class="el-icon-time"
              type="text"
              size="small"
              @click="onSchedule(scope.row)"
            >
              排片
            </el-button>
            <el-divider 
            v-if="scope.row.status==1"
            direction="vertical"></el-divider>
            <el-button
              class="el-icon-setting"
              type="text"
              size="small"
              @click="onHallManager(scope.row)"
            >
              影厅管理
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
import AddEdit from "@/views/film/cinema/addEdit";
export default {
  name: "CinemaList",
  data() {
    return {
      loading: false,
      tableData: [],
      fetchOptions: {
        page: 1,
        limit: 20,
        keywords: "",
        status:''
      },
      show_time_range: [],
      total: 0,
      currentView: "",
    };
  },
  components: {
    AddEdit,
  },
  computed: {},
  mounted() {
    this.getData();
  },
  watch: {},
  methods: {
    onHallManager(rows) {
      this.$router.push({
        path: "/film-system/cinema/hall-manage/hall",
        query: {
          cinema_id: rows.id,
        },
      });
    },
    onSchedule(row) {
      this.$router.push({
        path:"/film-system/schedule",
        query:{
          cinema_id: row.id
        }
      });
    },
    doAdd() {
      this.$refs.add_edit.open();
    },
    onDateChange(date) {
      this.fetchOptions.start_show_time = date ? date[0] : "";
      this.fetchOptions.end_show_time = date ? date[1] : "";
      this.getData();
    },
    getData() {
      this.loading = true;
      this.$store
        .dispatch("cinemaManager/list", this.fetchOptions)
        .then((res) => {
          this.tableData = res.rows;
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
          this.$store.dispatch("cinemaManager/doDel", { id }).then(() => {
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
