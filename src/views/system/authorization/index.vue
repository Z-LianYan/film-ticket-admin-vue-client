<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" style="text-align: center" class="clearfix">
        <el-page-header
          @back="goBack"
          title="返回"
          content="角色授权"
          center
        ></el-page-header>
      </div>
      <!-- <div slot="header" style="text-align:center;" class="clearfix">
      <span>角色授权</span>
    </div> -->
      <el-row :gutter="20">
        <el-col :span="6">
          <el-tabs
            tab-position="left"
            v-model="activeName"
            @tab-click="handleClick"
          >
            <el-tab-pane
              :label="item.title"
              :lazy="true"
              :name="item._id.toString()"
              v-for="item in roleList"
              :key="item._id"
            >
            </el-tab-pane>
          </el-tabs>
        </el-col>
        <el-col :span="18">
          <el-tree
            :data="menuData"
            :show-checkbox="true"
            node-key="_id"
            default-expand-all
            ref="tree_menu"
            :check-strictly="false"
            :expand-on-click-node="false"
            :props="defaultProps"
          >
          </el-tree>
          <br />
          <br />
          <el-button type="primary" @click="authorizationSubmit" size="small"
            >提交</el-button
          >
        </el-col>
      </el-row>
      <br />
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Authorization",
  data() {
    return {
      roleListPosition: "left",
      menuData: [],
      defaultProps: {
        children: "children",
        label: "title",
      },
      roleList: [],
      activeName: "",
      notParentChildren: [],
    };
  },
  computed: {},
  mounted() {
    this.$nextTick(() => {
      this.getRoleData();
      this.getAccessMenuData();
    });
  },
  watch: {},
  methods: {
    getRoleData() {
      console.log("----", this.$store.getters.userInfo.role_id);
      // const { _id } = this.$route.query;
      // this.activeName = _id.toString();
      this.$store.dispatch("role/list").then((res) => {
        this.roleList = res;
      });
    },

    getAccessMenuData() {
      this.$store.dispatch("accessMenu/list").then((res) => {
        // res.data.shift()
        this.menuData = res.data;
        this.roleAuth();
      });
    },

    filterMenu(menuData) {
      //递归筛选出无子菜单的_id

      for (let i = 0; i < menuData.length; i++) {
        if (menuData[i].children) {
          this.filterMenu(menuData[i].children);
        } else {
          this.notParentChildren.push(menuData[i]._id);
        }
      }
    },

    roleAuth(roleId) {
      const { _id } = this.$route.query;

      // this.roleId = roleId ? roleId : _id;

      this.activeName = _id
        ? _id.toString()
        : this.$store.getters.userInfo &&
          this.$store.getters.userInfo.role_id.toString();
      this.roleId = roleId ? roleId : this.activeName;
      this.$store
        .dispatch("authorization/roleAuth", { role_id: this.roleId })
        .then((res) => {
          //获取当前角色被选中的所有节点

          this.notParentChildren = [];

          this.filterMenu(this.menuData);

          let checkedChildrenId = [];

          for (let i = 0; i < res.length; i++) {
            if (this.notParentChildren.indexOf(res[i].access_id) != -1)
              checkedChildrenId.push(res[i].access_id);
          }

          this.$refs.tree_menu &&
            this.$refs.tree_menu.setCheckedKeys(checkedChildrenId);
        });
    },

    authorizationSubmit() {
      const checkedId = this.$refs.tree_menu
        .getCheckedKeys()
        .concat(this.$refs.tree_menu.getHalfCheckedKeys());
      const { _id } = this.$route.query;
      this.$store.dispatch("authorization/roleAuthorizationEdit", {
        checkedAccess: checkedId,
        role_id: this.roleId ? this.roleId : _id,
      });
    },

    handleClick(val) {
      this.roleAuth(val.name);
    },

    goBack() {
      history.go(-1);
    },
  },
};
</script>

<style lang='scss' scoped>
.box-card {
  /deep/ {
    .el-tree > .el-tree-node.is-expanded > .el-tree-node__children {
      display: flex;
    }
  }
}
</style>