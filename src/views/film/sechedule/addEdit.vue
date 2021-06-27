<template>
  <el-drawer
    :title="title + '排片'"
    :visible.sync="isDrawer"
    size="50%"
    @close="drawerClose"
  >
    <el-scrollbar wrap-class="cinema-addedit-scrollbar-wrapper">
      <div style="padding-right: 40px">
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="130px"
          class="demo-ruleForm"
        >
          <el-form-item label="电影" prop='film_id'>
            <el-select
              style="width: 300px"
              v-model="ruleForm.film_id"
              filterable
              reserve-keyword
              placeholder="请选择您要排期的电影"
            >
              <el-option
                v-for="item in filmList"
                :key="item.id + 'f'"
                :label="item.film_name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item 
          label="影厅" 
          prop='hall_id'>
            <el-select
              style="width: 300px"
              v-model="cinema_id"
              filterable
              reserve-keyword
              placeholder="请选择您要排期的影院"
              @change="onChangeCinema"
            >
              <el-option
                v-for="item in cinemaList"
                :key="item.id + 'c'"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>

            <el-select
              style="width: 150px"
              v-model="ruleForm.hall_id"
              filterable
              reserve-keyword
              placeholder="排期的影厅"
            >
              <el-option
                v-for="item in hallList"
                :key="item.id + 'h'"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="放映日期" prop='play_date'>
            <el-date-picker
              v-model="ruleForm.play_date"
              type="date"
              placeholder="选择放映日期"
            />
          </el-form-item>
          <el-form-item label="放映开始时间" prop='start_play_time'>
            <el-time-select
              v-model="ruleForm.start_play_time"
              :picker-options="{
                start: '00:00',
                step: '00:01',
                end: '23:59'
              }"
              placeholder="选择放映开始时间"
            />
          </el-form-item>
          <el-form-item label="放映结束时间" prop='end_play_time'>
            <el-time-select
              v-model="ruleForm.end_play_time"
              :picker-options="{
                start: '00:00',
                step: '00:01',
                end: '23:59'
              }"
              placeholder="选择放映结束时间"
            />
          </el-form-item>
          <el-form-item label="售价" prop='price'>
            <el-input
              v-model="ruleForm.price"
              type="number"
              placeholder="选择输入售价"
            />
          </el-form-item>
          <el-form-item label="语言" prop='language'>
            <el-input
              v-model="ruleForm.language"
              type="text"
              placeholder="选择输入语言"
            />
          </el-form-item>
          <!-- <el-form-item label="影厅名称" prop="name">
            <el-input v-model="ruleForm.name"></el-input>
          </el-form-item>

          <el-form-item label="排数" prop="seat_row_num">
            <el-input v-model="ruleForm.seat_row_num" type="number"></el-input>
          </el-form-item>

          <el-form-item label="列数" prop="seat_column_num">
            <el-input
              v-model="ruleForm.seat_column_num"
              type="number"
            ></el-input>
          </el-form-item>
          <el-form-item label="描述" prop="describe">
            <el-input v-model="ruleForm.describe" type="textarea"></el-input>
          </el-form-item>

          <el-form-item label="状态" prop="status">
            <el-radio-group v-model="ruleForm.status">
              <el-radio :label="1">启用</el-radio>
              <el-radio :label="0">禁用</el-radio>
            </el-radio-group>
          </el-form-item> -->

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
    film_id: "",
    hall_id: "",
    start_play_time: "",
    end_play_time: "",
    play_date: "",
    price: 0,
    language: "",
  };
}
export default {
  name: "HallAddEdit",
  components: {},
  props:{
    cinemaList:{
      type:Array,
      default:[]
    },
  },
  data() {
    return {
      isDrawer: false,
      title: "添加",
      ruleForm: ruleForm(),
      rules: {
        film_id: [
          { required: true, message: "上传您要排期的电影", trigger: "blur" },
        ],
        hall_id: [{ required: true, message: "排期影厅不能为空", trigger: "blur" }],
        start_play_time: [
          { required: true, message: "播放开始时间不能为空", trigger: "blur" },
        ],
        end_play_time: [
          { required: true, message: "播放结束时间不能为空", trigger: "blur" },
        ],
        play_date: [
          { required: true, message: "放映日期不能为空", trigger: "blur" },
        ],
        price: [
          { required: true, message: "影片价格不能为空", trigger: "blur" },
        ],
        language: [
          { required: true, message: "放映语言不能为空", trigger: "blur" },
        ],
      },
      filmList: [],
      cinema_id:"",
      hallList:[]
    };
  },
  mounted() {
    this.getFilmList();
  },
  methods: {
    onChangeCinema(cinema_id){
      this.cinema_id = cinema_id;
      this.ruleForm.hall_id = '';
      this.getHallList();
    },
    getHallList(){
      this.$store.dispatch("hall/list", {
        page:1,
        limit:1000,
        cinema_id:this.cinema_id
      }).then((res) => {
        this.hallList = res.data.halls;
      });
    },
    async getFilmList() {
      let result = await this.$store.dispatch("filmListManager/list", {
        page: 1,
        limit: 1000000,
        status:1
      });
      this.filmList = result.rows;
    },
    getImgUrl(imgUrl) {
      console.log("上传的图片路径：", imgUrl);
      this.ruleForm.avatar = imgUrl;
    },

    submitForm(formName) {
      let { query } = this.$route;
      if (query.cinema_id) {
        this.ruleForm.cinema_id = query.cinema_id;
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.title == "添加") {
            this.$store.dispatch("schedule/add", this.ruleForm).then(() => {
              this.$emit("on-getData");
              this.resetForm();
            });
          } else {
            this.$store.dispatch("schedule/update", this.ruleForm).then(() => {
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
    open(val,cinemaId) {
      if (cinemaId) {
        console.log('ciname_id',cinemaId);
        this.cinema_id = Number(cinemaId);
        this.getHallList();
      }else{
        this.cinema_id = "";
      }

      if (val) {
        console.log("编辑");
        this.title = "编辑";
        
        var rows = _.clone(val);
        rows.play_date = val.play_date * 1000;
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
