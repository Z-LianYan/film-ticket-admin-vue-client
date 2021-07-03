<template>
  <el-drawer
    :title="title + '影厅'"
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
          <el-form-item label="影厅名称" prop="name">
            <el-input v-model="ruleForm.name"></el-input>
          </el-form-item>
          <el-form-item label="所属影院" prop="cinema_id">
            <el-select
              v-model="ruleForm.cinema_id"
              filterable
              reserve-keyword
              style="width:100%;"
              placeholder="请选择影院"
            >
              <el-option
                v-for="item in cinemaList"
                :key="item.id + 'c'"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="可售座位数" prop="seat_num">
            <el-input v-model="ruleForm.seat_num" type="number"></el-input>
          </el-form-item> -->

          <el-form-item label="影厅类型" prop="hall_type_id">
            <el-select
              v-model="ruleForm.hall_type_id"
              filterable
              reserve-keyword
              style="width:100%;"
              placeholder="请选择影厅类型"
            >
              <el-option
                v-for="item in hallTypeList"
                :key="item.id + 'ht'"
                :label="item.hall_type_name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="排数" prop="seat_row_num" v-if="title=='添加'">
            <el-input v-model="ruleForm.seat_row_num" type="number" max="50"></el-input>
          </el-form-item>

          <el-form-item label="列数" prop="seat_column_num" v-if="title=='添加'">
            <el-input v-model="ruleForm.seat_column_num" type="number" max="50"></el-input>
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-radio-group v-model="ruleForm.status">
              <el-radio :label="1">启用</el-radio>
              <el-radio :label="0">禁用</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="描述" prop="describe">
            <el-input v-model="ruleForm.describe" type="textarea"></el-input>
          </el-form-item>

          <el-form-item label="分区" prop="sectionPrice">
            
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
import hall from '@/store/modules/film/hall';
function ruleForm() {
  return {
    name: "",
    // seat_num: "",
    seat_row_num: "",
    seat_column_num: "",
    describe: "",
    status: 1,
    cinema_id:"",
    hall_type_id:""
  };
}
export default {
  name: "HallAddEdit",
  props:['cinemaList'],
  components: {},
  data() {
    return {
      isDrawer: false,
      title: "添加",
      ruleForm: ruleForm(),
      rules: {
        name: [
          { required: true, message: "影厅名称不能为空", trigger: "blur" },
        ],
        // seat_num: [
        //   { required: true, message: "可售座位数不能空", trigger: "blur" },
        // ],
        seat_row_num: [
          { required: true, message: "排数不能为空", trigger: "blur" },
        ],
        seat_column_num: [
          { required: true, message: "列数不能为空", trigger: "blur" },
        ],
        status: [{ required: true, message: "状态不能为空", trigger: "blur" }],
        cinema_id: [{ required: true, message: "请选择要添加的影院", trigger: "blur" }],
        hall_type_id: [{ required: true, message: "请选择影厅类型", trigger: "blur" }],
      },
      // cinemaList:[],
      hallTypeList:[]
    };
  },
  mounted() {
    // this.getCinemaList();
    this.getHallType();
    // let { query } = this.$route;
    // if(query.cinema_id){
    //   this.ruleForm.cinema_id = query.cinema_id;
    // }

  },
  methods: {
    async getHallType(){
      let result = await this.$store.dispatch('hall/getUsableHallType');
      console.log('影厅类型',result);
      this.hallTypeList = result;
    },
    // async getCinemaList() {
    //   let result = await this.$store.dispatch("cinemaManager/list", {
    //     page: 1,
    //     limit: 1000000,
    //   });
    //   this.cinemaList = result.rows;
    //   console.log("result---cinemaList", result);
    // },
    onComfirmSearch(res) {
      console.log("res--", res);
      this.ruleForm = {
        ...this.ruleForm,
        ...res,
      };
    },
    getImgUrl(imgUrl) {
      console.log("上传的图片路径：", imgUrl);
      this.ruleForm.avatar = imgUrl;
    },

    submitForm(formName) {
      console.log("134", this.ruleForm);
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.title == "添加") {
            this.$store.dispatch("hall/add", this.ruleForm).then(() => {
              this.$emit("on-getData");
              this.resetForm();
            });
          } else {
            this.$store.dispatch("hall/update", this.ruleForm).then(() => {
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
