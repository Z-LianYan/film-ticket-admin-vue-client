<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" style="text-align: center" class="clearfix">
        <el-page-header
          @back="goBack"
          title="返回"
          content="编辑部门"
          center
        ></el-page-header>
      </div>

      <el-form
        :model="ruleForm"
        :rules="rules"
        :status-icon="false"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="部门名称" prop="dep_name">
          <el-input v-model="ruleForm.dep_name" placeholder="请输入部门名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import UploadImage from "@/components/UploadImage";
export default {
  name: "DepartmentEdit",
  components: {
    UploadImage,
  },
  data() {
    return {
      ruleForm: {
        id: "",
        dep_name: "",
      },
      roleList: [],
      rules: {
        dep_name: [
          { required: true, message: "请输入部门名称", trigger: ["blur","change"] }
        ]
      },
    };
  },
  mounted() {

    this.getById();
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log("00", this.ruleForm);

          this.$store.dispatch("department/edit", this.ruleForm);
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    
    //获取部门详情
    getById() {
      const { dep_id } = this.$route.params;
      this.$store
        .dispatch("department/getById", { dep_id })
        .then((data) => {
          console.log('data===>>',data.dep_name);
          this.ruleForm = {
            dep_name: data.dep_name,
            dep_id: dep_id,
          };
        });
    },
    goBack() {
      history.go(-1);
    },
  },
};
</script>

<style lang="scss" scoped>
$dark_gray: #889aa4;
.show-pwd {
  position: absolute;
  right: 10px;
  top: 2px;
  font-size: 16px;
  color: $dark_gray;
  cursor: pointer;
  user-select: none;
}
.el-collapse {
  border-top: 1px solid transparent;
  margin-bottom: 30px;
}
</style>
