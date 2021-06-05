<template>
  <el-drawer
    :title="isAdd? '添加菜单': '编辑菜单'"
    :visible.sync="isDrawer"
    size="50%"
    @close="drawerClose"
  >
     <!-- <div class="menu-add-edit"> -->
      <el-scrollbar :wrap-class="['menu-add-edit-scrollbar-wrapper','456']">
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="165px"
          class="demo-ruleForm"
        >
          <el-form-item label="菜单名称 title" prop="title">
            <el-input v-model="ruleForm.title"></el-input>
          </el-form-item>

          <el-form-item label="所属模块" prop="module_id">
            <el-cascader 
              style="width:100%;"
              :options="accessMenulist"
              :props="{ 
              checkStrictly: true,
              emitPath:false,
              value: '_id', 
              label: 'title',
            }"
              v-model="ruleForm.module_id"
              placeholder="请选择所属模块"
            ></el-cascader>
          </el-form-item>

          <el-form-item label="路由 path" prop="path">
            <el-input v-model="ruleForm.path"></el-input>
            <div>注：如果是子路由 前面不得加 / 如：/childrenRouter 子路由错误的写法</div>
            
          </el-form-item>

          <el-form-item label="组件路径 component " prop="component">
            <el-input v-model="ruleForm.component" placeholder="请直接引入views文件下的组件"></el-input>
            <div>注：直接引入views文件下的组件 如：system/manager/list</div>
            <div>注：如果一级以上的路由有子路由，那么其组件路径为 noComponent</div>
          </el-form-item>

          <el-form-item label="路由名称 name" prop="name">
            <el-input v-model="ruleForm.name"></el-input>
            <div>注：此名称关系到组件缓存，必须与组件的name一致组件才能缓存</div>
          </el-form-item>

          <el-form-item label="重定向 redirect" prop="redirect">
            <el-input v-model="ruleForm.redirect"></el-input>
          </el-form-item>


          <el-form-item label="图标" prop="icon">
            <el-input v-model="ruleForm.icon"></el-input>
          </el-form-item>

          <el-form-item label="排序" prop="sort">
            <el-input v-model="ruleForm.sort"></el-input>
          </el-form-item>

          

          <el-form-item label="是否缓存页面" prop="keep_alive">
            <el-radio-group v-model="ruleForm.keep_alive">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="是否显示菜单" prop="hidden">
            <el-radio-group v-model="ruleForm.hidden">
              <el-radio :label="0">是</el-radio>
              <el-radio :label="1">否</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="历史菜单上显示" prop="affix">
            <el-radio-group v-model="ruleForm.affix">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
            <div>释：tagsView 预览历史菜单上没预览过的菜单默认显示且不可关闭</div>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
            <el-button @click="resetForm">重置</el-button>
          </el-form-item>
          
        </el-form>
      </el-scrollbar>
    <!-- </div>  -->
    
  </el-drawer>
</template>

<script>
// import _ from "lodash";
function ruleForm() {
  return {
    module_id: '',
    path: "",
    component: "noComponent",
    redirect: "",
    name: "",
    title: "",
    icon: "",
    keep_alive: 0,
    hidden: 0, //0显示，1隐藏
    affix: 0, //0不粘上可关闭，1粘上不可关闭
    sort:""
  };
}
export default {
  data() {
    return {
      isDrawer: false,
      isAdd: true,
      ruleForm: ruleForm(),
      rules: {
        module_id: [
          { required: true, message: "请选择所属模块", trigger: "blur" }
        ],
        path: [{ required: true, message: "请输入路由", trigger: "change" }],
        component: [
          { required: true, message: "请引入views下的组件", trigger: "blur" }
        ],
        // title: [
        //   { required: true, message: "请输入菜单名称", trigger: "change" }
        // ],
        // name: [
        //   { required: true, message: "请输入路由名称", trigger: "change" }
        // ]
      },
      accessMenulist: []
    };
  },
  mounted() {
    this.getMenuList()
  },
  methods: {
    getMenuList(){
      this.$store
      .dispatch("accessMenu/list", {
        page: 1,
        limit: 20000
      })
      .then(res => {
        res.data.unshift({ _id: '0', title: "顶级模块" });
        this.accessMenulist = res.data;
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.ruleForm.module_id = Number(this.ruleForm.module_id);
          if (this.isAdd) {
            this.$store.dispatch("accessMenu/doAdd", this.ruleForm).then(() => {
              this.$emit("on-getData");
              this.resetForm();
              
              this.getMenuList()//刷新模块
            });
          } else {
            this.$store
              .dispatch("accessMenu/doEdit", this.ruleForm)
              .then(() => {
                this.$emit("on-getData");

                this.getMenuList()//刷新模块
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
      console.log('val',val);
      if (val) {
        this.isAdd = false;
        var rows = _.clone(val);
        // delete rows.module_id;
        rows.module_id = rows.module_id==0?rows.module_id.toString():Number(rows.module_id);
        delete rows.children;
        this.ruleForm = {
          ...this.ruleForm,
          ...rows
        };
      }
      this.isDrawer = true;
    },
    drawerClose() {
      if (!this.isAdd) {
        this.ruleForm = ruleForm();
        this.resetForm();
      }
      this.isAdd = true;
    }
  }
};
</script>

<style lang="scss">
.el-drawer__body {
  padding-right: 10px;
}
// .menu-add-edit{
//   height: calc(100vh - 80px);
//   // background: #ccc;
//   overflow-x: hidden;
// }
.menu-add-edit-scrollbar-wrapper{
  height: calc(100vh - 80px) !important;
  // height: 400px;
}
</style>
