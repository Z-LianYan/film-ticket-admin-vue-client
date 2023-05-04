<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" style="text-align: center" class="clearfix">
        添加部门
      </div>

      <el-form
        :model="ruleForm"
        :rules="rules"
        status-icon
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="部门名称" prop="dep_name">
          <el-input v-model="ruleForm.dep_name" placeholder="请输入部门名称"></el-input>
        </el-form-item>
        

        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')"
            >提交</el-button
          >
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
// import UploadImage from "@/components/UploadImage";
export default {
  name: "DepartmentAdd",
  components: {
    // UploadImage,
  },
  data() {
    

    return {
      ruleForm: {
        dep_name: ""
      },
      roleList: [],
      rules: {
        dep_name: [
          { required: true, message: "请输入部门名称", trigger: ['blur','change'] }
        ],
        
      },
    };
  },
  mounted() {
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$store.dispatch("department/add", this.ruleForm).then(() => {
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
    activated() {
      console.log("activated");
    },
    deactivated() {
      console.log("activated");
    },
    destroyed() {
      console.log("destroyed");
    },
    beforeDestroy() {
      console.log("beforeDestroy");
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
