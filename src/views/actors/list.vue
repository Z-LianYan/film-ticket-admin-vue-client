<template>
  <el-card class="box-card">
    <div slot="header" style="text-align:center;" class="clearfix">
      <span>演员列表</span>
      <el-button type="text" @click="getData" class="float-right">
        <i class="el-icon-refresh"></i>刷新
      </el-button>
    </div>

    <el-form label-width="90px">
      <el-form-item label="关键字搜索" style="display:inline-block">
        <el-input
          v-model="fetchOptions.keywords"
          style="width:200px;"
          @keyup.enter.native="getData()"
          placeholder="请输入关键字"
        ></el-input>
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
      <el-table-column prop="name" label="演员"></el-table-column>
      <el-table-column prop="avatar" label="头像">
        <template slot-scope="scope">
          <el-image 
            fit='contain'
            style="width: 50px; height: 50px"
            :src="scope.row.avatar" 
            :preview-src-list="[scope.row.avatar]">
          </el-image>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="doEdit(scope.row)">
            <i class="el-icon-edit"></i>编辑
          </el-button>
          <el-button type="text" size="small" @click="doDelete(scope.row)">
            <i class="el-icon-delete"></i>删除
          </el-button>
        </template>
      </el-table-column>
      
    </el-table>

    <br>
    <el-row>
      <mine-pagination
        :total="total"
        @sizeChange="handleSizeChange"
        @currentChange="handleCurrentChange"
        :pageSize="fetchOptions.limit"
        :currentPage="fetchOptions.page"
      />
    </el-row>
  </el-card>
</template>

<script>
export default {
  name: "manager",
  data() {
    return {
      loading: false,
      tableData: [],
      fetchOptions: {
        page: 1,
        limit: 20,
        keywords: "",
      },
      total: 0,
    };
  },
  components: {},
  computed: {},
  mounted() {
    this.getData();
  },
  watch: {},
  methods: {
    getData() {
      this.loading = true;
      this.$store.dispatch("actors/list", this.fetchOptions).then(res => {
        this.tableData = res.rows;
        this.total = res.count;
        this.loading = false;
      });
    },
    doEdit(rows) {
      this.$router.push({ path: "/film/list-manager/edit/" + rows.id });
    },
    doDelete(rows) {
      const { _id } = rows;
      this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$store.dispatch("actors/doDelete", { _id }).then(() => {
            this.getData();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
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
    }
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
