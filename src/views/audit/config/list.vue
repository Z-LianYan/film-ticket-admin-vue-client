<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" style="text-align: center" class="clearfix">
        <span>审批配置列表</span>
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
        <!-- <el-form-item label="状态" style="display: inline-block">
          <el-radio-group v-model="fetchOptions.status" class="clear" @change="getData()">
            <el-radio label="">全部</el-radio>
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item> -->
        
        <el-form-item label="" style="display: inline-block">
          <el-button @click="getData" type="primary">筛选</el-button>
        </el-form-item>
      </el-form>

      <el-table
        v-loading="loading"
        :data="tableData"
        highlight-current-row
        border
        style="width: 100%"
      >
        <el-table-column prop="rule_name" label="规则名称"></el-table-column>
        <!-- <el-table-column prop="type" label="类型"></el-table-column> -->
        <el-table-column prop="sort" label="排序"></el-table-column>
        <!-- <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            <span style="color:green" v-if="scope.row.status==1">启用</span>
            <span style="color:grey" v-else>禁用</span>
          </template>
        </el-table-column> -->
        
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button 
            type="text" 
            size="small" 
            @click="$router.push({
              path: '/auditConfig',
              query: {
                type: scope.row.type,
              },
            })">
              <i class="el-icon-edit"></i>编辑
            </el-button>
            <!-- <el-button 
            type="text" 
            size="small" 
            @click="onChangeStatus(scope.row)">
              {{ scope.row.status?"禁用":"启用" }}
            </el-button> -->
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
  name: "ManagerList",
  data() {
    return {
      loading: false,
      tableData: [],
      fetchOptions: {
        page: 1,
        limit: 20,
        keywords: "",
        status: "",
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
      this.$store.dispatch("auditConfig/getConfiglist", this.fetchOptions).then((res) => {
        console.log(res);
        this.tableData = res.rows;
        this.total = res.count;
        this.loading = false;
      });
    },
    async onChangeStatus(rows) {
      const { id,status } = rows;
      console.log('status',status,typeof status);
      await this.$store.dispatch("auditConfig/changeStatus", { id,status:status?0:1 });
      this.getData();
    },
    doDelete(rows) {
      const { id } = rows;
      this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$store.dispatch("auditConfig/delConfig", { id }).then(() => {
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
  //     this.$route.meta.keep_alive = false;
  //   }else{
  //     this.$route.meta.keep_alive = true;
  //   }
  //   next();
  // },
};
</script>

<style lang="scss" scoped>

</style>
