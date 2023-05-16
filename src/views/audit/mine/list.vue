<template>
  <div class="app-container">
    <el-card class="box-card">
      <div
        slot="header"
        style="
          display: flex;
          align-items: center;
          justify-content: center;
        "
      >
        <span>我的审批</span>
      </div>
      <el-tabs v-model="fetchOptions.queryType" type="card" @tab-click="getData(true)" style="display: inline-block;">
        <el-tab-pane label="未处理" name="un_handle"></el-tab-pane>
        <el-tab-pane label="已处理" name="handle"></el-tab-pane>
        <el-tab-pane label="抄送我的" name="reader"></el-tab-pane>
        <el-tab-pane label="我提交的" name="mine_submit"></el-tab-pane>
      </el-tabs>
      <el-form label-width="90px">
        <el-form-item label="关键字搜索" style="display: inline-block">
          <el-input
            v-model="fetchOptions.keywords"
            style="width: 200px"
            @keyup.enter.native="getData(true)"
            placeholder="搜索关键字"
          ></el-input>
        </el-form-item>
        <el-form-item label="审批类型" style="display: inline-block">
          <el-select
            style="width: 350px"
            v-model="fetchOptions.type"
            filterable
            reserve-keyword
            placeholder="请输入关键词"
            @change="getData(true)"
          >
            <el-option
              label="全部"
              value=""
            />
            <el-option
              v-for="(val,key,idx) in auditTypeMap"
              :key="key + 'type'+idx"
              :label="val"
              :value="key"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="请假类型" style="display: inline-block" v-if="fetchOptions.type=='qingjia'">
          <el-select
            style="width: 350px"
            v-model="fetchOptions.leave_type"
            filterable
            reserve-keyword
            placeholder="请输入关键词"
            @change="getData(true)"
          >
            <el-option
              label="全部"
              value=""
            />
            <el-option
              v-for="(val,key,idx) in qingajiaTypeMap"
              :key="key + 'type'+idx"
              :label="val"
              :value="Number(key)"
            />
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="状态" style="display: inline-block">
          <el-radio-group v-model="fetchOptions.status" @change="getData(true)">
            <el-radio label>全部</el-radio>
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item> -->
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
      <el-table-column type="selection" width="55"> </el-table-column>
          <el-table-column
            prop="id"
            label="审批编号"
            sortable
          ></el-table-column>
          <el-table-column prop="typeName" label="类型"></el-table-column>
          <el-table-column
            prop="readStatusName"
            label="阅读状态"
            v-if="fetchOptions.queryType == 'reader'"
          >
            <template slot-scope="scope">
              <el-tag type="primary" v-if="scope.row.readStatus == 'reader'">{{
                scope.row.readStatusName
              }}</el-tag>
              <el-tag
              type="info"
              v-else-if="scope.row.readStatus == 'un_read'"
              >{{ scope.row.readStatusName }}</el-tag>
              <span v-else>{{ scope.row.readStatusName }}</span>
            </template>
          </el-table-column>

          <el-table-column
            prop="admin_name"
            label="申请人"
          ></el-table-column>
          <el-table-column
            prop="dep_name"
            label="申请人门店"
          ></el-table-column>
          <el-table-column prop="role_name" label="申请人职位"></el-table-column>

          <!-- <el-table-column prop="current_index" label="当前审核阶段">
            <template slot-scope="scope">
              {{scope.row.current_index}} 级
            </template>
          </el-table-column> 
          <el-table-column prop="processStatus" label="当前阶段状态"></el-table-column>  -->

          <!-- <el-table-column prop="cate_name" label="类型">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.type==1">题目</el-tag>
              <el-tag v-if="scope.row.type==2">试卷</el-tag>
            </template>
          </el-table-column> -->

          <el-table-column prop="auditStatusName" label="审核状态">
            <template slot-scope="scope">
              <el-tag type="info" v-if="scope.row.auditStatus == 'REVOKE'">{{
                scope.row.auditStatusName
              }}</el-tag>
              <el-tag
                type="primary"
                v-if="scope.row.auditStatus == 'IN_REVIEW'"
                >{{ scope.row.auditStatusName }}</el-tag
              >
              <el-tag
                type="success"
                v-if="scope.row.auditStatus == 'REVIEWED'"
                >{{ scope.row.auditStatusName }}</el-tag
              >
              <el-tag
                type="danger"
                v-if="scope.row.auditStatus == 'REJECT'"
                >{{ scope.row.auditStatusName }}</el-tag
              >
            </template>
          </el-table-column>

          <el-table-column prop="infoString" label="详情" width="400">
            <template slot-scope="scope">
              
              <Qingjia :detail="scope.row" v-if="scope.row.type == 'qingjia'" />
              
              <!-- <Lizhi :detail="scope.row" v-if="scope.row.type == 'lizhi'" /> -->
            </template>
          </el-table-column>

          <el-table-column prop="created_at" label="提交时间"></el-table-column>
          <el-table-column
            prop="submit_admin_name"
            label="提交人"
          ></el-table-column>

          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                type="text"
                @click.native="viewDetail(scope.row, scope.$index)"
                >查看详情</el-button
              >
               <el-button
                type="text"
                @click.native="doAudit(scope.row)"
                v-if="fetchOptions.queryType == 'un_handle'"
                >审批</el-button
              >

              <!-- <el-button
                type="text"
                v-if="scope.row.show_force_btn"
                @click.native="doEnforceAudit(scope.row)"
                >强制审批</el-button
              > -->

              <!-- <el-button
                v-if="
                  (scope.row.type != 'prepaid_expenses_apply' && scope.row.type != 'kaoqin_patch_apply') &&
                  (queryType == 'handle' || queryType == 'reader')
                "
                type="text"
                @click.native="resetSubmit(scope.row)"
                >{{
                  scope.row.status == "IN_REVIEW" ? "重新提交" : "再提交"
                }}</el-button
              > -->

              <!-- <el-button
              type="text"
              @click.native="copySubmit(scope.row)"
              >复制提交</el-button>

              <el-button
              type="text"
              v-if="scope.row.status == 'IN_REVIEW' && ($store.getters.admin.employee_id==scope.row.employee_id || $store.getters.admin.employee_id==scope.row.submit_emp_id)"
              @click.native="resetSubmit(scope.row)"
              >
                重新提交
              </el-button> -->

              <!-- <el-button
                type="text"
                v-if="scope.row.show_edit"
                @click.native="doAuditApplyEdit(scope.row)"
                >编辑</el-button
              > -->
              <!-- <el-button 
              type="text" 
              @click.native="doExpedit(scope.row)">催审</el-button> -->
              <!-- <el-button
                v-if="queryType == 'un_handle'"
                type="text"
                @click.native="doTurn(scope.row)"
                >转审</el-button
              > -->
              <!-- <el-button type="text" @click.native="goComment(scope.row)"
                >评论</el-button
              > -->
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

      <!-- <AddEdit ref="add_edit" @on-getData="getData" :cinemaList='cinemaList'/> -->



      <AuditDetail
        ref="audit_detail"
      >
        <template slot="btn" slot-scope="scope">
          <div style="display: flex; justify-content: space-between">
            <!-- <el-button
              v-if="queryType == 'un_handle'"
              type="primary"
              @click.native="doTurn(scope.detail)"
              >转审</el-button
            > -->


            <!-- <el-button
              v-if="
                (scope.detail.type != 'prepaid_expenses_apply' && scope.detail.type != 'kaoqin_patch_apply') &&
                (queryType == 'handle' || queryType == 'reader')
              "
              type="primary"
              @click.native="resetSubmit(scope.detail)"
              >{{
                scope.detail.status == "IN_REVIEW" ? "重新提交" : "再提交"
              }}</el-button
            > -->
            
            <!-- <el-button
            type="primary"
            @click.native="copySubmit(scope.detail)"
            >复制提交 </el-button>
            <el-button
            type="primary"
            v-if="scope.detail.status == 'IN_REVIEW'"
            @click.native="resetSubmit(scope.detail)"
            >重新提交</el-button> -->

            <!-- <el-button
              type="primary"
              v-if="scope.detail.show_edit"
              @click.native="doAuditApplyEdit(scope.detail, 'detail')"
              >编辑</el-button
            >

            <el-button
              v-if="queryType == 'un_handle'"
              type="primary"
              @click.native="doAudit(scope.detail)"
              >审批</el-button
            > -->

            <!-- <el-button
            type="primary"
            v-if="scope.detail.show_force_btn && queryType == 'handle'"
            @click.native="doEnforceAudit(scope.detail, 'detail')"
            >强制审批</el-button> -->
          </div>
        </template>
      </AuditDetail>
      <AuditTurn ref="audit_turn" @submitSuccess="getTableData()" />
    </el-card>
  </div>
</template>

<script>
// import AddEdit from "@/views/film/hall/addEdit";
import Qingjia from "@/views/audit/mine/qingjia";
import AuditDetail from "@/views/audit/mine/detail";
import AuditTurn from "@/views/audit/component/audit-turn";

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
        // audit_status: "",
        leave_type:'',
        type:'',
        queryType:'un_handle'
      },
      show_time_range: [],
      total: 0,
      // cinemaList: [],
      // cinema_name: "",
      qingajiaTypeMap:{},
      auditTypeMap:{}
    };
  },
  components: {
    // AddEdit,
    Qingjia,
    AuditDetail,
    AuditTurn
  },
  computed: {},
  mounted() {
    let { query } = this.$route;
    // console.log("query", query);
    if (query.cinema_id) {
      this.fetchOptions.cinema_id = Number(query.cinema_id);
    }
    // this.getCinemaList();
    this.getData();
    this.getQingjiaType();
    this.getAuditTypeList();
  },
  watch: {
    // $route(to, from) {
    //   // console.log('to',to,"from",from);
    //   if (from.path == "/film-system/cinema/list") {
    //     this.fetchOptions.cinema_id = to.query.cinema_id;
    //     this.getData();
    //   }
    // },
  },
  methods: {
    doAudit(row) {
      this.$refs.audit_turn.open(
        [row.id],
        row.admin_name + "的" + this.auditTypeMap[row.type],
        () => {
          this.getData();
          this.$refs.audit_detail.close();
          // this.$refs.audit_detail.getDetail(row.id);
        }
      );
    },
    doEnforceAudit(row, type) {
      this.$refs.audit_turn.open(
        row.id,
        row.admin_name + "的" + this.auditTypeMap[row.type],
        () => {
          this.getData();
          if (type == "detail") {
            this.$refs.audit_detail.getDetail(row.id);
          }
        },
        { audit_type: "enforce", row }
      );
    },
    getAuditTypeList() {
      this.$store.dispatch("auditConfig/getConfiglist").then((res) => {
        this.auditTypeMap = {};
        for (var i = 0; i < res.rows.length; i++) {
         this.auditTypeMap[res.rows[i].type] = res.rows[i].rule_name;
        }
      });
    },
    viewDetail(row, index) {
      this.dataIndex = index;
      this.$refs.audit_detail.open(row.id, this.auditTypeList);
    },
    // async getCinemaList() {
    //   let result = await this.$store.dispatch("cinemaManager/list", {
    //     page: 1,
    //     limit: 1000000,
    //   });
    //   this.cinemaList = result.rows;
    // },
    async getQingjiaType(){
      this.qingajiaTypeMap = {};
      const result = await this.$store.dispatch('auditConfig/getQingjiaType');
      if(!result||!result.length) return;
      result.map(element => {
        this.qingajiaTypeMap[element.value] = element.type_name;
      });
    },
    // doDetail(rows) {
    //   this.$refs.film_detail.open(rows);
    // },
    // onDateChange(date) {
    //   this.fetchOptions.start_show_time = date ? date[0] : "";
    //   this.fetchOptions.end_show_time = date ? date[1] : "";
    //   this.getData();
    // },
    getData(Filter) {
      if (Filter) {
        this.fetchOptions.page = 1;
      }
      this.loading = true;
      this.$store.dispatch("auditQuery/getMineAuditList", this.fetchOptions).then((res) => {
        console.log('res====>>',res);
        // this.cinema_name = res.data.name;
        this.tableData = res.rows;
        this.total = res.count;
        this.loading = false;
      });
    },
    // doEdit(rows) {
    //   this.$refs.add_edit.open(rows);
    // },
    // doDelete(rows) {
    //   const { id } = rows;
    //   this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
    //     confirmButtonText: "确定",
    //     cancelButtonText: "取消",
    //     type: "warning",
    //   })
    //     .then(() => {
    //       this.$store.dispatch("hall/del", { id }).then(() => {
    //         this.getData();
    //       });
    //     })
    //     .catch(() => {
    //       this.$message({
    //         type: "info",
    //         message: "已取消删除",
    //       });
    //     });
    // },

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
