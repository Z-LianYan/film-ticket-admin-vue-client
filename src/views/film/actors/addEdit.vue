<template>
  <el-drawer
    :title="title + '影厅'"
    :visible.sync="isDrawer"
    size="50%"
    @close="drawerClose"
  >
    <el-scrollbar wrap-class="actors-addedit-scrollbar-wrapper">
      <div style="padding-right:40px;">
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="140px"
          class="demo-ruleForm"
        >
          <el-form-item label="姓名" prop="name">
            <el-input v-model="ruleForm.name"></el-input>
          </el-form-item>
          <el-form-item label="上传头像"  required>
            <upload-image
              @getImgUrl="getImgUrl"
              uploadPrefix="actors/"
              :staticImageUrl="ruleForm.avatar"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')"
              >提交</el-button
            >
            <el-button @click="resetForm">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-scrollbar>
  </el-drawer>
</template>

<script>
import UploadImage from "@/components/UploadImage";
function ruleForm() {
  return {
    name: "",
    avatar: ""
  };
}
export default {
  name: "HallAddEdit",
  props:['cinemaList'],
  components: {
    UploadImage
  },
  data() {
    return {
      isDrawer: false,
      title: "添加",
      ruleForm: ruleForm(),
      rules: {
        name: [
          { required: true, message: "影厅名称不能为空", trigger: ["change","blur"] },
        ],
        avatar: [
          { required: true, message: "请上传头像", trigger: ['change','blur','input'] },
        ]
      }
    };
  },
  mounted() {

  },
  methods: {
    getImgUrl(imgUrl) {
      console.log("上传的图片路径：", imgUrl);
      this.ruleForm.avatar = imgUrl;
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if(!this.ruleForm.avatar) return this.$message.info('请上传头像');
          if (this.title == "添加") {
            this.$store.dispatch("actors/add", this.ruleForm).then(() => {
              this.$emit("on-getData");
              this.resetForm();
            });
          } else {
            this.$store.dispatch("actors/update", this.ruleForm).then(() => {
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
      this.ruleForm = ruleForm();
    },
    open(val) {
      if (val) {
        console.log("编辑");
        this.title = "编辑";
        var rows = _.clone(val);
        this.ruleForm = rows;
      } else {
        console.log("添加");
        this.title = "添加";
      }
      this.isDrawer = true;
    },
    drawerClose() {
      if (this.title == "编辑") {
        this.ruleForm = ruleForm();
        this.resetForm();
      }
    },
  },
};
</script>

<style lang="scss">
.actors-addedit-scrollbar-wrapper {
  height: calc(100vh - 60px);
  .el-drawer__body {
    padding-right: 10px;
  }
}
</style>
<style scoped>
.amap-container {
  height: 500px;
}
.address {
  font-size: 15px;
  font-weight: bold;
}
</style>
