<template>
  <el-drawer
    :title="title + '排片'"
    :visible.sync="isDrawer"
    size="70%"
    @close="drawerClose"
  >
    <el-scrollbar wrap-class="cinema-addedit-scrollbar-wrapper">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="140px"
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
        <!-- <el-form-item label="售价" prop='price'>
          <el-input
            v-model="ruleForm.price"
            type="number"
            placeholder="选择输入售价"
          />
        </el-form-item> -->
        <el-form-item label="语言" prop='language'>
          <el-input
            v-model="ruleForm.language"
            type="text"
            placeholder="选择输入语言"
          />
        </el-form-item>
        <el-form-item label="状态" style="display: inline-block">
          <el-radio-group v-model="ruleForm.status" >
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item 
        label-width="140px"
        label="服务费" 
        prop="premium" 
        style="width:300px;"
        >
        <!-- :rules="[
        { type: 'object', required: true,  trigger: 'blur',message: '请输入服务费', fields: {
          premium: {required: true,  trigger: 'blur'}
        }}]" -->
          <el-input type="number" v-model="ruleForm.premium">
            <el-button slot="append">元</el-button>
          </el-input>
        </el-form-item>

        <el-form-item label="座位是否分区销售" prop="is_section">
          <el-radio-group v-model="ruleForm.is_section">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>

        

        
        <el-form-item 
        v-if="ruleForm.is_section==0"
        style="display:inline-block;"
        label="售价/座位" 
        prop="price">
          <el-input type="number" placeholder="选择输入售价" v-model="ruleForm.price">
            <el-button slot="append">元</el-button>
          </el-input>
        </el-form-item>
        

        <el-form-item label="座位分区价格" prop="sectionPrice" v-if="ruleForm.is_section==1">
          <el-button 
          type="text"
          class="el-icon-plus float-right" 
          @click="onAddSectionPrice">添加</el-button>
          <el-table
            border
            :data="ruleForm.sectionPrice"
            style="width: 100%">
            <el-table-column
              prop="section_name"
              label="分区名称">
              <template slot-scope="scope">
                <el-form-item 
                label="" 
                :prop="'sectionPrice.'+scope.$index+'.section_name'">
                  <el-input placeholder="请输入分区名称" v-model="scope.row.section_name"/>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              prop="price"
              label="售价">
              <template slot-scope="scope">
                <el-form-item 
                label="" 
                :prop="'sectionPrice.'+scope.$index+'.price'">
                  <el-input v-model="scope.row.price" placeholder="请输入分区售价">
                    <el-button slot="append">元</el-button>
                  </el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              label="操作">
              <template slot-scope="scope">
                <el-button 
                type="text"
                class="el-icon-delete" 
                @click="onDeleteSectionPrice(scope.$index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
          <!-- <el-button @click="resetForm">重置</el-button> -->
        </el-form-item>
      </el-form>
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
    language: "",
    status:1,

    is_section:0,
    price: "",
    premium:0,
    sectionPrice:[{
      section_id:"",
      section_name:"",
      price:""
    }]
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
  computed:{
    
  },
  watch:{
    "ruleForm.sectionPrice":{
      handler(val){
        for(let item of val){
          // item.section_id = 
        }
      },
      deep: true, //true 深度监听
      // 加上immediate选项后，实例化后立刻回调一次
      immediate: true
    }
  },
  data() {
    return {
      isDrawer: false,
      title: "添加",
      ruleForm: ruleForm(),
      rules: {
        film_id: [
          { required: true, message: "上传您要排期的电影", trigger: ['blur','change'] },
        ],
        hall_id: [{ required: true, message: "排期影厅不能为空", trigger: ['blur','change'] }],
        start_play_time: [
          { required: true, message: "播放开始时间不能为空", trigger: "blur" },
        ],
        end_play_time: [
          { required: true, message: "播放结束时间不能为空", trigger: "blur" },
        ],
        play_date: [
          { required: true, message: "放映日期不能为空", trigger: "blur" },
        ],
        language: [
          { required: true, message: "放映语言不能为空", trigger: "blur" },
        ],
        is_section: [{ required: true, message: "请选择座位是否分区", trigger: "blur" }],
        premium: [{ required: true, message: "请选择输入服务费", trigger: "blur" }],
      },
      filmList: [],
      cinema_id:"",
      hallList:[],

    };
  },
  mounted() {
    this.getFilmList();
  },
  methods: {
    onDeleteSectionPrice(index){
      this.ruleForm.sectionPrice.splice(index,1);
    },
    onAddSectionPrice(){
      this.ruleForm.sectionPrice.push({
        section_id:"",
        section_name:"",
        price:""
      })
    },
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
        this.hallList = res.data;
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
  height: calc(100vh - 60px) !important;
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
