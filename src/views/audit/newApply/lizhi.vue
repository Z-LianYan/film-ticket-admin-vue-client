<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" style="text-align: center" class="clearfix">
        <span>离职申请</span>
      </div>

      <el-form
        :model="ruleForm"
        :rules="rules"
        status-icon
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <!-- <el-form-item 
        label="申请类型" 
        prop="type">
          <el-select 
          v-model="ruleForm.type" 
          placeholder="请选择申请类型" 
          v-if="auditType.length"
          @change="onChangeType">
            <el-option
              v-for="(item, idx) in auditType"
              :key="idx"
              :label="item.rule_name"
              :value="item.type"
            ></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item 
        label="申请人" 
        prop="applyData.admin_id"
        :rules="{
          required: true, message: '请选择申请人', trigger: ['blur','change']
        }">
          <el-select 
          v-model="ruleForm.applyData.admin_id" 
          filterable
          remote
          reserve-keyword
          placeholder="请输入关键词"
          :remote-method="getAdmin"
          :loading="loadingAdmin"
          value="1"
          @change="onChangeAdmin">
            <el-option
              v-for="(item, idx) in adminList"
              :key="idx+'admin'"
              :label="item.username"
              :value="item._id"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- <div style="position:relative;display: inline-block;"> -->
          <el-form-item 
          label="离职日期" 
          prop="applyData.lizhi_date"
          :rules="{
            required: true, message: '请选择离职日期', trigger: ['blur','change']
          }">
            <el-date-picker
              v-model="ruleForm.applyData.lizhi_date"
              @change="onStartDateChange"
              type="date"
              placeholder="请选择离职日期"
            ></el-date-picker>
          </el-form-item>
          <!-- <el-form-item 
          label="结束时间" 
          prop="applyData.end_leave_date"
          :rules="{
            required: true, message: '请选择结束时间', trigger: ['blur','change']
          }">
            <el-date-picker
              v-model="ruleForm.applyData.end_leave_date"
              @change="onEndDateChange"
              type="date"
              placeholder="选择结束时间"
            ></el-date-picker>
            <el-select v-model="ruleForm.applyData.end_leave_type" placeholder="">
              <el-option label="上午" :value="1"/>
              <el-option label="下午" :value="2"/>
            </el-select>
          </el-form-item>
          <div style="position:absolute;right:0;top:50%;transform: translate(120%,-100%);">
            请假时长：{{calcLeaveDay()}}天
          </div> -->
        <!-- </div> -->
        <el-form-item 
        label="离职原因" 
        prop="applyData.type_id"
        :rules="{
          required: true, message: '请选择离职原因', trigger: ['blur','change']
        }">
          <el-select 
          v-model="ruleForm.applyData.type_id" 
          placeholder="请选择离职原因"
          @change="onChangeLeaveType">
            <el-option
              v-for="(val, key,idx) in typeList"
              :key="idx+'type'"
              :label="val"
              :value="Number(key)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item 
        label="离职备注" 
        prop="applyData.remark"
        :rules="{
          required: false, message: '请输入离职备注', trigger: ['blur','change']
        }">
          <el-input v-model="ruleForm.applyData.remark" placeholder="请输入离职备注" type="textarea" :rows="4"></el-input>
        </el-form-item>
        <el-form-item 
        label="附件" 
        prop="applyData.appendix"
        :rules="{
          required: false, message: '请上传附件', trigger: ['blur','change']
        }">
          <UploadImageMul
            :imageLimit="5"
            :uploadPrefix="'audit/appendix/'"
            v-model="ruleForm.applyData.appendix"
          />
        </el-form-item>


       

        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')"
            >提交</el-button
          >
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>

      <AuditProcess :processList="processList"/>


    </el-card>
  </div>
</template>

<script>
import UploadImageMul from "@/components/UploadImage-mul";
import AuditProcess from "@/views/audit/component/AuditProcess";

export default {
  name: "ManagerList",
  data() {
    return {
      ruleForm: {
        type:'qingjia',
        applyData:{
          lizhi_date:'',
          type_id:'',
          remark:'',
          appendix: [],
          admin_id: '',
        },
        auditProcess:[]
      },
      rules: {
        type: [
          { required: true, message: "请选择申请类型", trigger: ["blur","change"] },
        ]
      },
      typeList:{},
      auditType:[],
      loadingAdmin: false,
      adminList: [],
      processList:[]
    };
  },
  components: {
    UploadImageMul,
    AuditProcess,
  },
  computed: {},
  mounted() {
    this.ruleForm.type = this.$route.query.type
    this.getAuditConfigDetail();
    this.getQingjiaType();
  },
  watch: {},
  methods: {
    async getQingjiaType(){
      const result = await this.$store.dispatch('auditConfig/getLizhiTypeList');
      if(!result||!result.length) return;
      // this.ruleForm.applyData.leave_type = result[0].id;
      // this.ruleForm.applyData.leave_type_name = result[0].name;
      result.map(element => {
        this.typeList[element.type_id] = element.type_name;
      });
    },
    onChangeLeaveType(value){
      // const { typeList } = this;
      // this.ruleForm.applyData.leave_type = value;
      // this.ruleForm.applyData.leave_type_name = typeList[value];
      // this.getAuditConfigDetail('','',value);
    },
    // onChangeType(value){
    //   this.getAuditConfigDetail('',value);
    // },
    onChangeAdmin(value){
      this.getAuditConfigDetail(value);
    },
    onStartDateChange(date){
      const { lizhi_date } = this.ruleForm.applyData;
      if(dayjs(date).format('YYYY-MM-DD')<dayjs().format('YYYY-MM-DD')) {
        this.$message.warning('离职日期要大于等于当前日期');
        this.ruleForm.applyData.lizhi_date = '';
        return;
      };
      this.ruleForm.applyData.lizhi_date = date;
    },
    // onEndDateChange(){
    //   const { start_leave_date,end_leave_date } = this.ruleForm.applyData;
    //   if(start_leave_date>end_leave_date) {
    //     this.$message.warning('开始时间不能大于结束时间');
    //     this.ruleForm.applyData.end_leave_date = '';
    //     return;
    //   };
    //   this.ruleForm.applyData.end_leave_date = date;
    // },
    // calcLeaveDay(){
    //   const { start_leave_date,end_leave_date, start_leave_type, end_leave_type } = this.ruleForm.applyData;
    //   if(!start_leave_date || !end_leave_date) return 0;
    //   const start_date = dayjs(start_leave_date).format('YYYY-MM-DD');
    //   const end_date = dayjs(end_leave_date).format('YYYY-MM-DD');
    //   let date_diff = dayjs(end_date).diff(start_date,'day')+1;
    //   if(start_leave_type===2 ) date_diff -= 0.5;
    //   if(end_leave_type===1) date_diff -= 0.5;
    //   return date_diff
    // },
    async getAdmin(keywords){
      this.loadingAdmin = true;
      const result = await this.$store.dispatch("manager/list", {page:1,limit:20,keywords});
      this.adminList = result.data;
      this.loadingAdmin = false;
    },
    // async getAuditType() {
    //   const result = await this.$store.dispatch("auditConfig/getConfiglist", {limit:100,page:1});
    //   this.auditType = result.rows;
    // },
    async getAuditConfigDetail(admin_id){
      const { applyData } = this.ruleForm
      const result = await this.$store.dispatch("newApply/getAuditConfigDetail", { admin_id: admin_id||this.$store.state.user.userInfo._id,type: this.ruleForm.type,auditInfo:{} });
      this.processList = result;
      this.ruleForm.auditProcess = result.map(item=>{
        return {
          nodeName: item.nodeName,
          type: item.type,
          auditIds: item.arr.map(it=>it.admin_id)
        }
      })

    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$store.dispatch("newApply/applyAudit",{
            ...this.ruleForm,
            applyData:{
              ...this.ruleForm.applyData,
              type_name: this.typeList[this.ruleForm.applyData.type_id]
            }
          }).then(() => {
            this.resetForm("ruleForm");
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  }
};
</script>

<style lang="scss" scoped>

</style>
