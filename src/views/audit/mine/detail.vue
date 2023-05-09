<template>
  <el-dialog
    title="详情"
    :visible.sync="dialogVisible"
    width="800px"
    center
    :before-close="handleClose"
    :append-to-body="true"
  >
    <div
      style="
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;
        align-items: center;
      "
    >
      <!-- <el-button
        v-if="detail.type == 'baoxiao' || detail.type == 'fund_change' || detail.type == 'payment_apply'"
        class="pull-left"
        icon="el-icon-printer"
        type="primary"
        @click="doPrint"
      >
        打印
      </el-button> -->
      <div v-if="page">
        <p style="margin-right: 10px">
          {{ dataIndex + 1 }}/{{ totalIndex }} <span>第 {{ page }} 页</span>
        </p>
        <el-button
          type="primary"
          @click="preDefault"
          :disabled="page == 1 && dataIndex + 1 == 1 ? true : false"
          >上一张</el-button
        >
        <el-button
          type="primary"
          @click="nextDefault"
          :disabled="
            limit * page >= total && dataIndex + 1 >= totalIndex ? true : false
          "
          >下一张</el-button
        >
      </div>
    </div>
    <div style="display: flex; justify-content: space-between">
      <div style="display: flex; align-items: center">
        <el-image
          style="
            width: 50px;
            height: 50px;
            border-radius: 25px;
            margin-right: 10px;
          "
          :src="detail.avatar"
          :preview-src-list="[detail.avatar]"
        />
        <div>
          {{ detail.admin_name }}的{{ audit_type_list[detail.type] }}申请
          <p>
            <!-- <el-tag type="primary">{{detail.approveStatus}}</el-tag> -->
            <el-tag type="info" v-if="detail.approve_status == 'REVOKE'">{{
              detail.approveStatus
            }}</el-tag>
            <el-tag
              type="primary"
              v-if="detail.approve_status == 'IN_REVIEW'"
              >{{ detail.approveStatus }}</el-tag
            >
            <el-tag type="success" v-if="detail.approve_status == 'REVIEWED'">{{
              detail.approveStatus
            }}</el-tag>
            <el-tag type="danger" v-if="detail.approve_status == 'REJECT'">{{
              detail.approveStatus
            }}</el-tag>
          </p>
        </div>
      </div>

      <div>
        <p>{{ detail.created_at }}</p>
        <p v-if="detail.employee_id != 2071">
          {{
            detail.employee_id == detail.submit_emp_id
              ? ""
              : detail.submit_emp_name + "帮提交"
          }}
        </p>
      </div>
    </div>
    <div>申请人部门：{{ detail.dep_name }}</div>
    <div>申请人角色：{{ detail.role_name }}</div>
    <br />

   
    <Qingjia :detail="detail" v-if="detail.type == 'qingjia'" @onSkip="close" />
    <!-- <Lizhi :detail="detail" v-if="detail.type == 'lizhi'" /> -->
    
    <br />
    <AuditProcess :processList="detail.process" />
    <!-- <commentContent
      :commentList="detail.comment"
      @writeComment="writeComment"
      @submitSuccess="getDetail(detail.id)"
    />

    <Comment ref="comment" @submitSuccess="getDetail(detail.id)" /> -->

    <div style="margin-top: 20px; background: #fff">
      <slot name="btn" :detail="detail" />
      <el-button 
      type="primary" 
      style="margin-top:10px;" 
      @click="onShowEntryStockDetail(detail.info.entry_stock_id)"
      v-if="detail.info.entry_stock_id && detail.type == 'procurement_apply'">查看入库详情</el-button>

      <el-button 
      type="primary" 
      style="margin-top:10px;" 
      @click="onShowProcurementDetail(detail.info.entry_stock_id)"
      v-if="detail.info.purchase_id && detail.type == 'baoxiao'">采购详情</el-button>
    </div>

    <!-- <EnterDepotListDetail ref="enter_depot_Detail"/> -->
    
    <!-- <DetailComponent ref="detail_component"/> -->
  </el-dialog>
  
</template>

<script>
import AuditProcess from "@/views/audit/mine/audit-process";
import Qingjia from "@/views/audit/mine/qingjia";
// import Lizhi from "@/pages/audit/mine-audit/lizhi";


export default {
  name: "MineAuditDetails",
  props: ["dataIndex", "totalIndex", "page", "limit", "total"],
  components: {
    AuditProcess,
    Qingjia,
    // Lizhi,
  },
  data() {
    return {
      dialogVisible: false,
      detail: {
        info: {},
        comment: [],
      },
      audit_type_list: {},
    };
  },

  async created() {},

  methods: {
    onShowProcurementDetail(){
      this.$refs.detail_component.open(this.detail.id);
    },
    onShowEntryStockDetail(id){
      this.$refs.enter_depot_Detail.open(id)
    },
    async doPrint(row) {
      // location.href = 'www.baidu.com';
      // open('www.baidu.com','_blank');row.id
      let result = await this.$store.dispatch("GET_PRINT_LINK", {
        approve_id: this.detail.id,
      });
      open(result.url, "_blank");
    },
    // preDefault() {
    //   this.$emit("onchange", "pre");
    // },
    // nextDefault() {
    //   this.$emit("onchange", "next");
    // },
    writeComment() {
      this.$refs.comment.open(
        this.detail.id,
        this.detail.employee_name +
          "的" +
          this.audit_type_list[this.detail.type]
      );
    },
    getDetail(id, callBack) {
      this.$store.dispatch("auditQuery/getAuditDetail", {id}).then((res) => {
        console.log("审批详情", res);
        if (res) {
          this.detail = res;
          this.dialogVisible = true;
        } else {
          callBack && callBack(); //奖罚列表的回调
        }
      });
    },
    handleClose() {
      this.detail = {
        info: {},
        comment: [],
      };
      this.close();
    },
    open(id, auditTypeList, detail_type, callBack) {
      if (!auditTypeList && !Object.keys(this.audit_type_list).length) {
        this.getAuditTypeList();
      }
      if (auditTypeList) {
        this.audit_type_list = auditTypeList;
      }
      this.getDetail(id, detail_type, callBack);
    },
    close() {
      this.dialogVisible = false;
    },
    getAuditTypeList() {
      this.$store.dispatch("auditConfig/getConfiglist").then((res) => {
        this.audit_type_list = {};
        for (var i = 0; i < res.rows.length; i++) {
         this.audit_type_list[res.rows[i].type] = res.rows[i].rule_name;
        }
      });
    },
  },
};
</script>

<style lang='scss' scoped>
/deep/ {
  .el-dialog--center .el-dialog__body {
    background: #fff;
  }
}
</style>
