<template>
  <el-drawer
    title="演员列表"
    :visible.sync="isDrawer"
    size="50%"
    direction="rtl"
  >
    <el-scrollbar :wrap-class="['drawer-scrollbar-wrapper']">
      <div class="app-container">
        <el-card class="box-card">
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
              <el-button  @click="getData">筛选</el-button>
            </el-form-item>
          </el-form>
          <el-button type="primary" class="float-right" @click="onComfirmSelected">确定选择</el-button>
          <el-table
            v-loading="loading"
            :data="tableData"
            @selection-change="handleSelectionChange"
            highlight-current-row
            border
            style="width: 100%"
          >
            <el-table-column type="selection" width="55"> </el-table-column>
            <el-table-column prop="avatar" label="头像" width="200">
              <template slot-scope="scope">
                <el-avatar :size="50" :src="scope.row.avatar"></el-avatar>
              </template>
            </el-table-column>
            <el-table-column
              prop="name"
              label="姓名"
            ></el-table-column>
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
    </el-scrollbar>
  </el-drawer>
</template>

<script>
import AddEdit from "@/views/film/actors/addEdit";
export default {
  name: "HallList",
  data() {
    return {
      isDrawer: false,
      loading: false,
      tableData: [],
      fetchOptions: {
        page: 1,
        limit: 20,
        keywords: "",
        cinema_id: "",
        status: ""
      },
      show_time_range: [],
      total: 0,

      selectedActors:[]
    };
  },
  components: {
    AddEdit
  },
  computed: {},
  mounted() {
    this.getData();
  },
  watch: {},
  methods: {
    onComfirmSelected(){
      this.callBack && this.callBack(this.selectedActors);
      this.close();
    },
    handleSelectionChange(val){
      console.log('val',val);
      this.selectedActors = val;
    },
    open(callBack) {
      this.isDrawer = true;
      this.callBack = callBack;
    },
    close() {
      this.isDrawer = false;
    },
    getData(Filter) {
      if (Filter) {
        this.fetchOptions.page = 1;
      }
      this.loading = true;
      this.$store.dispatch("actors/list", this.fetchOptions).then(res => {
        this.tableData = res.rows;
        this.total = res.count;
        this.loading = false;
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
  }
};
</script>

<style lang="scss" scoped>
</style>
