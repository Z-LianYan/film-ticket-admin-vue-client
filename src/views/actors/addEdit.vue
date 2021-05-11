<template>
  <el-drawer
    :title="title+'演员'"
    :visible.sync="isDrawer"
    size="45%"
    @close="drawerClose"
  >
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="130px"
        class="demo-ruleForm"
      >
        <el-form-item label="演员姓名" prop="name">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>

        <el-form-item label="上传头像" prop="avatar">
          <upload-image 
          @getImgUrl="getImgUrl" 
          uploadPrefix="film/actors/"  
          :staticImageUrl='ruleForm.avatar'
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-scrollbar>
  </el-drawer>
</template>

<script>
// import _ from "lodash";
import UploadImage from "@/components/UploadImage"
function ruleForm() {
  return {
    name:'',
    avatar:'',
  };
}
export default {
  name: "actors-add-edit",
  components:{
    UploadImage
  },
  data() {
    return {
      isDrawer: false,
      title: '添加',
      ruleForm: ruleForm(),
      rules: {
        name: [
          { required: true, message: "请输入演员姓名", trigger: "blur" }
        ],
        avatar: [{ required: true, message: "请上传演员头像", trigger: "change" }]
      }
    };
  },
  mounted() {
  },
  methods: {
    getImgUrl(imgUrl){
      console.log("上传的图片路径：",imgUrl);
      this.ruleForm.avatar = imgUrl;
    },
    
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.title=='添加') {
            this.$store.dispatch("actors/doAdd", this.ruleForm).then(() => {
              this.$emit("on-getData");
              this.resetForm();
            });
          } else {
            this.$store
              .dispatch("actors/doEdit", this.ruleForm)
              .then(() => {
                this.$emit("on-getData");
              });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm() {
      this.$refs.ruleForm.resetFields();
    },
    open(val) {
      
      if (val) {
        console.log('编辑');
        this.title = '编辑';
        var rows = _.clone(val);
        this.ruleForm = rows;
      }else{
        console.log('添加');
        this.title = '添加'
      }
      this.isDrawer = true;
    },
    drawerClose() {
      if (this.title=='编辑') {
        this.ruleForm = ruleForm();
        this.resetForm();
      }
    }
  }
};
</script>

<style lang="scss">
.el-drawer__body {
  padding-right: 10px;
}
.scrollbar-wrapper{
  height: calc(100vh - 60px);
}
</style>
