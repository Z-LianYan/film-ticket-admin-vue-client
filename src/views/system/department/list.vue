<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" style="text-align: center" class="clearfix">
        <span>部门列表</span>
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
            placeholder="搜索部门名称"
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
        <el-table-column prop="dep_name" label="部门名称"></el-table-column>
       
        <el-table-column prop="created_at" label="添加时间">
          <template slot-scope="scope">{{
            scope.row.created_at | formatDateMS
          }}</template>
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
    </el-card>
  </div>
</template>

<script>
export default {
  name: "DepartmentList",
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
      currentView: "",
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
      this.$store.dispatch("department/getList", this.fetchOptions).then((res) => {
        this.tableData = res.data;
        this.total = res.count;
        this.loading = false;
      });
    },
    doEdit(rows) {
      this.$router.push({ path: "/system/department/edit/" + rows.dep_id });
    },
    doDelete(rows) {
      const { dep_id } = rows;
      this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$store.dispatch("department/del", { dep_id }).then(() => {
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
};
</script>

<style lang="scss" scoped>
</style>
