<template>
  <el-card class="box-card">
    <div slot="header" style="text-align:center;" class="clearfix">
      <span>影院列表</span>
      <el-button 
      type="text" 
      @click="doAdd" 
      class="float-right" 
      style="marign-right:10px;">
        <i class="el-icon-plus"></i>添加影院
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
      <el-table-column prop="id" label="id"></el-table-column>
      <el-table-column prop="name" label="电影名称"></el-table-column>
      <el-table-column prop="address" label="地址"></el-table-column>
      
      
      <el-table-column prop="status" label="状态">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.status==1">启用</el-tag>
          <el-tag type="info" v-else>禁用</el-tag>
        </template>
      </el-table-column>
     

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

    <FilmDetail ref="film_detail"/>
    <AddEdit ref="add_edit"/>
  </el-card>
</template>

<script>
import FilmDetail  from "@/views/filmList/Detail";
import AddEdit  from "@/views/cinema/addEdit";
export default {
  name: "filmList",
  data() {
    return {
      loading: false,
      tableData: [],
      fetchOptions: {
        page: 1,
        limit: 20,
        keywords: "",
        start_show_time:'',
        end_show_time:''
      },
      show_time_range: [],
      total: 0,
      currentView:""
    };
  },
  components: {
    FilmDetail,
    AddEdit
  },
  computed: {},
  mounted() {
    this.getData();
  },
  watch: {},
  methods: {
    doAdd(){
      this.$refs.add_edit.open();
    },
    doDetail(rows){
      this.$refs.film_detail.open(rows);
    },
    onDateChange(date){
      this.fetchOptions.start_show_time = date?date[0]:'';
      this.fetchOptions.end_show_time = date?date[1]:'';
      this.getData();
    },
    getData() {
      this.loading = true;
      this.$store.dispatch("cinemaManager/list", this.fetchOptions).then(res => {
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
        type: "warning"
      }).then(() => {
        this.$store.dispatch("cinemaManager/doDel", { id }).then(() => {
          this.getData();
        });
      }).catch(() => {
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
