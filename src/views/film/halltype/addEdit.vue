<template>
  <el-drawer
    :title="title + '影厅类型'"
    :visible.sync="isDrawer"
    size="50%"
    @close="drawerClose"
  >
    <el-scrollbar wrap-class="cinema-addedit-scrollbar-wrapper">
      <div style="padding-right:40px;">
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="130px"
          class="demo-ruleForm"
        >
          <el-form-item label="影厅类型名称" prop="hall_type_name">
            <el-input v-model="ruleForm.hall_type_name"></el-input>
          </el-form-item>

          <el-form-item label="状态" prop="status" style="display: inline-block">
            <el-radio-group v-model="ruleForm.status">
              <el-radio :label="1">启用</el-radio>
              <el-radio :label="0">禁用</el-radio>
            </el-radio-group>
          </el-form-item>
          
          <el-form-item label="排序" prop="sort">
            <el-input v-model="ruleForm.sort" type="number"></el-input>
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
function ruleForm() {
  return {
    hall_type_name: "",
    sort: 0,
    status:1
  };
}
export default {
  name: "HallTypeAddEdit",
  components: {},
  data() {
    return {
      isDrawer: false,
      title: "添加",
      ruleForm: ruleForm(),
      rules: {
        hall_type_name: [
          { required: true, message: "影厅类型名称不能为空", trigger: "blur" },
        ],
        status: [
          { required: true, message: "状态不能为空", trigger: "blur" },
        ],
      },
      hallTypeList:[]
    };
  },
  mounted() {
  },
  methods: {
    submitForm(formName) {
      console.log("134", this.ruleForm);
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.title == "添加") {
            this.$store.dispatch("hall/addHallType", this.ruleForm).then(() => {
              this.$emit("on-getData");
              this.resetForm();
            });
          } else {
            this.$store.dispatch("hall/updateHallType", this.ruleForm).then(() => {
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
.cinema-addedit-scrollbar-wrapper {
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
