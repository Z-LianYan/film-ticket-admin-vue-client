<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header"  class="clearfix">
        <div style="display: flex;justify-content: space-between;align-items: center;">
          <span></span>
          <span>app版本管理</span>
          <el-button type="text" @click="onAdd" class="float-right">
            <i class="el-icon-plus"></i>添加
          </el-button>
        </div>
      </div>

      <el-form label-width="90px">
        <el-form-item label="关键字搜索" style="display: inline-block">
          <el-input
            v-model="fetchOptions.keywords"
            style="width: 200px"
            @keyup.enter.native="getData()"
            placeholder="搜索包名"
          ></el-input>
        </el-form-item>
        <el-form-item label="平台" style="display: inline-block">
          <el-select v-model="fetchOptions.platform" placeholder="请选择状态">
            <el-option label="安卓" value="android"/>
            <el-option label="苹果" value="ios"/>
          </el-select>
        </el-form-item>
        
        <el-form-item label="">
          <el-button @click="getData(true)">筛选</el-button>
        </el-form-item>
      </el-form>

      <el-table
        v-loading="loading"
        :data="tableData"
        highlight-current-row 
        border
        style="width: 100%"
      >
        <el-table-column prop="platform" label="平台">
          <template slot-scope="{row}">
            <span>{{['android'].includes(row.platform)?'安卓':'苹果'}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="package" label="icon">
          <template slot-scope="{row}">
            <img :src="row.icon" alt="" style="width: 50px;height: 50px;">
          </template>
        </el-table-column>
        <el-table-column prop="package" label="安装包名称"></el-table-column>
        <el-table-column prop="versionName" label="版本号"></el-table-column>
        <el-table-column prop="versionCode" label="编译版本号"></el-table-column>
        <el-table-column prop="remark" label="更新备注"></el-table-column>
        <el-table-column width="100"  prop="download_url"  label="下载二维码" >
          <template slot-scope="{row}">
              <qrcode-vue v-if="row.download_url"  @click.native="showDownloadCode(row)" :value="row.download_url" :size="80" level="H"></qrcode-vue>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            <el-tag type="info" v-if="scope.row.status==0">禁用</el-tag>
            <el-tag type="success" v-if="scope.row.status==1">启用</el-tag>
          </template>
        </el-table-column>

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
    <AddEdit ref="add_edit"/>

    <el-dialog
	  title="下载二维码"
	  :visible.sync="is_visible_download_2code"
	  width="400px" 
	  style="text-align:center"
	  center
		:modal-append-to-body="true"
		:append-to-body="true"		  
	   >
      <qrcode-vue  v-if="download_url" :value="download_url" :size="300" level="H"></qrcode-vue>
    </el-dialog>
  </div>
</template>

<script>
import AddEdit from '@/views/system/appVersions/addEdit';
import QrcodeVue from 'qrcode.vue';

export default {
  name: "AppVersions",
  data() {
    return {
      loading: false,
      tableData: [],
      fetchOptions: {
        page: 1,
        limit: 20,
        keywords: "",
        platform: "android"
      },
      total: 0,
      currentView: "",

      download_url:'',
      is_visible_download_2code:false
    };
  },
  components: {
    AddEdit,
    QrcodeVue
  },
  computed: {},
  mounted() {
    this.getData();
  },
  watch: {},
  methods: {
    showDownloadCode(row){
			this.download_url=row.download_url;
			this.is_visible_download_2code=true;
		},
    onAdd(){
      this.$refs.add_edit.open(()=>{
        this.getData(true);
      });
    },
    getData(filter) {
      if(filter){
        this.fetchOptions.page = 1;
      }
      this.loading = true;
      this.$store.dispatch("appVersions/getList", this.fetchOptions).then((res) => {
        this.tableData = res.data;
        this.total = res.count;
        this.loading = false;
      });
    },
    doEdit(row) {
      this.$refs.add_edit.open(()=>{
        this.getData(true);
      },row);
    },
    doDelete(rows) {
      const { id } = rows;
      this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$store.dispatch("appVersions/del", { id }).then(() => {
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
