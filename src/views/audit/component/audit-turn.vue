<template>
<el-dialog
  :title="(title?title:'')+'审批'"
  :visible.sync="dialogVisible"
  width="40%"
  center
  :before-close="handleClose"
  :append-to-body="true">
  <el-radio-group v-model="formData.type">
    <el-radio label="AGREE" :disabled='(audit_type=="enforce" && approve_status=="REVIEWED")?true:false'>同意</el-radio>
    <el-radio label="REJECT" :disabled='(audit_type=="enforce" && approve_status=="REJECT")?true:false'>驳回</el-radio>
  </el-radio-group>
  <div style="height:30px;"></div>
  <el-input
    type="textarea"
    rows="5"
    placeholder="请输入备注内容"
    v-model="formData.remark"
    maxlength="100"
    show-word-limit
  />
  <el-button type="primary" style="margin-top:30px;" @click="submitComment">提交</el-button>
</el-dialog>
</template>

<script>
function option(){
  return {
    type:"AGREE",
    // approve_id:"",
    // audit_ids:[],
    remark:""
  }
}
export default {
  props:{
    // isModal:{
    //   type:Boolean,
    //   default:false
    // }
  },
  components: {
  },
  data() {
    return {
      dialogVisible:false,
      formData:option(),
      title:"",
      audit_type:"",//用来判断是否是强制审批
      approve_status:""
    };
  },

  async created() {
    
  },

  methods: {
    handleClose(){
      this.formData = option();
      this.audit_type = '';
      this.approve_status = '';
      this.close()
    },
    open(ids,title,callBack,obj){
      console.log("id title",ids,title,obj)
      this.audit_type = "";
      this.approve_status = "";
      this.formData.type = 'AGREE';
      if(obj){
        this.audit_type = obj.audit_type;//用来判断是否是强制审批
        this.approve_status = obj.row.approve_status;
        console.log("id this.type",this.type)
        if(obj.audit_type=='enforce' && obj.row.approve_status=="REVIEWED"){
          this.formData.type = 'REJECT';
        }else{
          this.formData.type = 'AGREE';
        }
        this.formData.approve_id = ids;
      }else{
        this.formData.audit_ids = ids;
      }
      
      this.title = title;
      
      this.dialogVisible = true;

      this.callBack = callBack;
    },
    close(){
      this.dialogVisible = false;
    },
    submitComment(){
      this.$store.dispatch(this.audit_type=='enforce'?"ENFORCE_AUDIT":"newApply/checkAudit",this.formData).then(res=>{
        console.log("评论",res);
        this.formData = option();
        // this.$emit('submitSuccess');
        this.close();
        this.callBack && this.callBack()
      })
    }
  }
};
</script>
