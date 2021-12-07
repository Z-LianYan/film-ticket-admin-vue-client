<template>
  <el-drawer
    :title="title + '影院'"
    :visible.sync="isDrawer"
    size="60%"
    @close="drawerClose"
  >
    <el-scrollbar wrap-class="cinema-addedit-scrollbar-wrapper">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="130px"
        class="demo-ruleForm"
      >
        <el-form-item label="影院名称" prop="name">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>

        
        <el-form-item label="影院所属区域" prop="district_id">
          <el-cascader
            style="width:100%;"
            :filterable='true'
            :show-all-levels="true"
            clearable
            :options="city_list"
            :props="{ 
              checkStrictly: false,
              emitPath:false,//是否返回由该节点所在的各级菜单的值所组成的数组
              value: 'id', 
              label: 'name',
            }"
            v-model="ruleForm.district_id"
            placeholder="请选择所属模块"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="影院位置" prop="address">
          <el-input v-model="ruleForm.address" :disabled='ruleForm.address?false:true'>
            <el-button 
            slot="append" 
            icon="el-icon-location-outline" 
            type="primary"
            @click="appendLnglat"></el-button>
          </el-input>
          <!-- <el-button type='text' @click="openMap">
            {{ruleForm.address?ruleForm.address:"添加位置"}}
          </el-button> -->
          <!-- <span 
          @click="openMap"
          class="el-button--text address">
            {{ruleForm.address?ruleForm.address:"添加位置"}}
          </span> -->
        </el-form-item>

        
        <el-form-item label="最低价格" prop="low_price">
          <el-input v-model="ruleForm.low_price" type="number"></el-input>
        </el-form-item>

        <el-form-item label="电话" prop="phone">
          <el-input v-model="ruleForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="服务" prop="service">
          <el-button type="text" class="el-icon-plus" @click="onAddService">添加服务</el-button>
          <el-table
            :data="ruleForm.service"
            highlight-current-row
            border
            style="width: 100%"
          >
            <el-table-column prop="label" width="150" label="标签">
              <template slot-scope="{row}">
                <el-input v-model="row.label"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="content" label="内容">
              <template slot-scope="{row}">
                <el-input 
                type="textarea"
                :rows="3" 
                v-model="row.content"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="" width="200" label="#">
              <template slot-scope="{$index}">
                <el-button 
                type="text" 
                v-if="$index!=0"
                class="el-icon-upload2" 
                @click="onUp($index,'service')">上移</el-button>
                <el-button 
                type="text" 
                v-if="($index+1)!=ruleForm.service.length"
                class="el-icon-download" 
                @click="onDown($index,'service')">下移</el-button>
                <el-button 
                type="text" 
                class="el-icon-delete" 
                @click="onDelService($index,'service')">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item label="公告" prop="notices">
          <el-button type="text" class="el-icon-plus" @click="onAddNotice">添加公告</el-button>
          <el-table
            :data="ruleForm.notices"
            highlight-current-row
            border
            style="width: 100%"
          >
            <el-table-column prop="text" label="公告内容">
              <template slot-scope="{row}">
                <el-input 
                type="textarea"
                :rows="3" 
                v-model="row.text"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="" width="200" label="#">
              <template slot-scope="{$index}">
                <el-button 
                type="text" 
                v-if="$index!=0"
                class="el-icon-upload2" 
                @click="onUp($index,'notices')">上移</el-button>
                <el-button 
                type="text" 
                v-if="($index+1)!=ruleForm.notices.length"
                class="el-icon-download" 
                @click="onDown($index,'notices')">下移</el-button>
                <el-button 
                type="text" 
                class="el-icon-delete" 
                @click="onDelService($index,'notices')">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="ruleForm.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        


        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')"
            >提交</el-button
          >
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-scrollbar>

    <MapSearch ref='map_search' @onComfirm='onComfirmSearch'/>
  </el-drawer>
</template>

<script>
// import _ from "lodash";
import MapSearch from "@/components/mapSearch";
function ruleForm() {
  return {
    name: "",
    address: "",
    lng: "",
    low_price: "",
    district_id: "",
    phone:'',
    status: 1,
    service:[],
    notices:[]
  };
}
export default {
  name: "actors-add-edit",
  components: {
    MapSearch
  },
  data() {
    return {
      isDrawer: false,
      title: "添加",
      ruleForm: ruleForm(),
      rules: {
        name: [{ required: true, message: "请输入影院名字", trigger: "blur" }],
        district_id: [{ required: true, message: "请选择影院所属位置", trigger: "blur" }],
        address: [{ required: true, message: "请输入影院地址", trigger: "blur" }],
      },
      city_list:[]
    };
  },
  mounted() {
    this.getCityList();
  },
  methods: {
    onUp(index,fileds){
      // let { service } = this.ruleForm
      // console.log('index',index);
      let cur_row = this.ruleForm[fileds][index];
      this.ruleForm[fileds].splice(index,1,this.ruleForm[fileds][index-1]);
      this.ruleForm[fileds].splice(index-1,1,cur_row);
    },
    onDown(index,fileds){
      // let { service } = this.ruleForm
      // console.log('index',index);
      let cur_row = this.ruleForm[fileds][index];
      this.ruleForm[fileds].splice(index,1,this.ruleForm[fileds][index+1]);
      this.ruleForm[fileds].splice(index+1,1,cur_row);
    },
    onDelService(index,fileds){
      console.log('index',index);
      this.ruleForm[fileds].splice(index,1)
    },
    onAddService(){
      this.ruleForm.service.push({
        label:'',
        content:''
      })
    },
    onAddNotice(){
      this.ruleForm.notices.push({
        text:''
      })
    },
    appendLnglat(){
      this.$refs.map_search.open(this.ruleForm.address);
    },
    async getCityList(){
      let result = await this.$store.dispatch('common/cityList')
      console.log('result---城市列表',result);
      this.city_list = result.rows;
    },
    onComfirmSearch(res){
      console.log('res--',res);
      this.ruleForm = {
        ...this.ruleForm,
        ...res
      };
    },
    // openMap(){
    //   this.$refs.map_search.open();
    // },
    getImgUrl(imgUrl) {
      console.log("上传的图片路径：", imgUrl);
      this.ruleForm.avatar = imgUrl;
    },

    submitForm(formName) {
      console.log('134',this.ruleForm);
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.title == "添加") {
            this.$store.dispatch("cinemaManager/doAdd", this.ruleForm).then(() => {
              this.$emit("on-getData");
              this.resetForm();
            });
          } else {
            this.$store.dispatch("cinemaManager/doEdit", this.ruleForm).then(() => {
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
        console.log("编辑",val);
        this.title = "编辑";
        var rows = _.clone(val);
        this.ruleForm = {
          ...rows,
          service:val.service?val.service:[],
          notices:val.notices?val.notices:[],
        };
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
.address{
  font-size: 15px;
  font-weight: bold;
}
</style>
