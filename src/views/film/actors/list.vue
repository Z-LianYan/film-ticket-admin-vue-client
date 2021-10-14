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
        <span></span>
        <el-button
          type="text"
          @click="doAdd"
          class="el-icon-plus"
          style="marign-right: 10px"
          >添加影厅</el-button
        >
      </div>

      <el-form label-width="90px">
        <el-form-item label="关键字搜索" style="display: inline-block">
          <el-input
            v-model="fetchOptions.keywords"
            style="width: 200px"
            @keyup.enter.native="getData(true)"
            placeholder="搜索演员姓名"
          ></el-input>
        </el-form-item>
        
        <el-form-item label="" style="display: inline-block">
          <el-button type="primary" @click="getData">筛选</el-button>
        </el-form-item>
      </el-form>

      <el-table
        v-loading="loading"
        :data="tableData"
        highlight-current-row
        border
        style="width: 100%"
      >
        <el-table-column prop="avatar" label="头像" width="200">
          <template slot-scope="scope">
            <el-avatar :size="50" :src="scope.row.avatar"></el-avatar>
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="姓名"
          width="300"
        ></el-table-column> 
        
        <el-table-column label="操作">
          <template slot-scope="scope">
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

      <AddEdit ref="add_edit" @on-getData="getData"/>
    </el-card>
  </div>
</template>

<script>
import AddEdit from "@/views/film/actors/addEdit";
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
        status: "",
      },
      total: 0,
    };
  },
  components: {
    AddEdit,
  },
  computed: {},
  mounted() {
    let { query } = this.$route;
    if (query.cinema_id) {
      this.fetchOptions.cinema_id = Number(query.cinema_id);
    }
    this.getData();
  },
  watch: {
    
  },
  methods: {
    
    doAdd() {
      this.$refs.add_edit.open();
    },
    getData(Filter) {
      if (Filter) {
        this.fetchOptions.page = 1;
      }
      this.loading = true;
      this.$store.dispatch("actors/list", this.fetchOptions).then((res) => {
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
          this.$store.dispatch("actors/del", { id }).then(() => {
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
  }
};
</script>

<style lang="scss" scoped>
</style>
