<template>
  <el-drawer
    :title="title + '排片'"
    :visible.sync="isDrawer"
    size="60%"
    @close="drawerClose"
  >
    <el-scrollbar wrap-class="order-addedit-scrollbar-wrapper">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="150px"
        class="demo-ruleForm"
      >
        
        <el-form-item label="电影" prop='film_id'>
          <el-select
            style="width: 300px"
            v-model="ruleForm.film_id"
            filterable
            reserve-keyword
            placeholder="请选择您要排期的电影"
            @change="onChangeFilm"
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
        
        <el-form-item label="上映时间" prop='show_time' v-if="filmDetail.show_time">
          {{dayjs(filmDetail.show_time*1000).format('YYYY-MM-DD')}}
        </el-form-item>
        <el-form-item label="放映时长" v-if="filmDetail.runtime" prop='runtime'>
          {{filmDetail.runtime}} 分钟
        </el-form-item>
        <el-form-item label="开始放映时间" prop='start_runtime'>
          <el-date-picker
          :disabled="ruleForm.film_id?false:true"
          v-model="ruleForm.start_runtime"
          type="datetime"
          format="yyyy-MM-dd HH:mm"
          @change="onChangeStartRuntime"
          :picker-options="{disabledDate: disabledDate}"
          placeholder="开始放映时间"/>
          <span style="color:#999;" v-if="!ruleForm.film_id">先选电影才能选择放映时间</span>
        </el-form-item>
        <el-form-item label="结束放映时间" prop='end_runtime'>
          <el-date-picker
          :disabled="true"
          v-model="ruleForm.end_runtime"
          type="datetime"
          format="yyyy-MM-dd HH:mm"
          @change="onChangeEndRuntime"
          
          :picker-options="{disabledDate: disabledDate}"
          placeholder="结束放映时间"/>
          <!-- <span style="color:#999;">先选电影才能选择放映时间</span> -->
        </el-form-item>

        

        <el-form-item 
        label="影厅" 
        prop='hall_id'>
          <el-select
            style="width: 300px"
            v-model="ruleForm.cinema_id"
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
            @change="onChangeHall"
          >
            <el-option
              v-for="item in hallList"
              :key="item.id + 'h'"
              :label="item.name+'( '+item.hall_type_name+' )'"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        
        <el-form-item label="语言" prop='language'>
          <el-input
            v-model="ruleForm.language"
            type="text"
            placeholder="选择输入语言"
          />
        </el-form-item>
        <el-form-item 
        label="一次最多购买座位数" 
        prop="buy_max" 
        >
          <el-input type="number" v-model="ruleForm.buy_max"></el-input>
          <div>不设置或0不限购（建议设置一个较小值防止恶意购票）</div>
        </el-form-item>
        
        <el-form-item 
        label="服务费" 
        prop="premium" 
        >
          <el-input style="width:200px;" type="number" v-model="ruleForm.premium">
            <el-button slot="append">元</el-button>
          </el-input>
        </el-form-item>

        <el-form-item 
        label="座位是否分区销售" 
        prop="is_section">
          <el-radio-group v-model="ruleForm.is_section">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>

        

        
        <el-form-item 
        v-if="ruleForm.is_section==0"
        :key="ruleForm.is_section"
        style="display:inline-block;"
        label="售价/座位"
        :rules="[
          { required: true, message: '请输入售价', trigger: 'blur' },
        ]" 
        prop="price">
          <el-input type="number" placeholder="请输入售价" v-model="ruleForm.price">
            <el-button slot="append">元</el-button>
          </el-input>
        </el-form-item>
        

        <el-form-item 
        label="座位分区价格" 
        :key="ruleForm.is_section"
        prop="sectionPrice" 
        v-if="ruleForm.is_section==1">
          <el-table
            border
            :data="ruleForm.sectionPrice"
            style="width: 100%">
            <el-table-column
              prop="section_name"
              label="分区名称">
              <template slot-scope="scope">
                <el-form-item 
                :rules="[
                  { required: true, message: '请输入分区名称', trigger: 'blur' },
                ]"
                label=""
                :prop="`sectionPrice[${scope.$index}].section_name`">
                  <el-input placeholder="请输入分区名称" v-model="scope.row.section_name"/>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              prop="price"
              label="售价">
              <template slot-scope="scope">
                <el-form-item
                :rules="[
                  { required: true, message: '请输入分区名称', trigger: 'blur' },
                ]" 
                label=""
                :prop="`sectionPrice[${scope.$index}].price`">
                  <el-input v-model="scope.row.price" type="number" placeholder="请输入分区售价">
                    <el-button slot="append">元</el-button>
                  </el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <!-- <el-table-column
              width="100"
              label="操作">
              <template slot-scope="scope">
                <el-button 
                type="text"
                class="el-icon-delete" 
                @click="onDeleteSectionPrice(scope.$index)">删除</el-button>
              </template>
            </el-table-column> -->
          </el-table>
        </el-form-item>

        <el-form-item label="状态">
          <el-radio-group v-model="ruleForm.status" >
            <el-radio :label="1">上架</el-radio>
            <el-radio :label="0">下架</el-radio>
          </el-radio-group>
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
    cinema_id:"",
    hall_id: "",
    start_runtime: "",
    end_runtime: "",
    language: "",
    status:1,

    is_section:0,
    price: "",
    buy_max:6,
    premium:0,
    sectionPrice:[
    //   {
    //   section_id:"a",
    //   section_name:"",
    //   price:""
    // }
    ],
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
    // "ruleForm.sectionPrice":{
    //   handler(val){
    //     try{
    //       for(let i=0;i<val.length;i++){
    //         val[i].section_id = this.sectionList[i];
    //       }
    //       this.ruleForm.sectionPrice = val;
    //     }catch(err){
    //       console.error(err.message);
    //     }
    //   },
    //   deep: true, //true 深度监听
    //   // 加上immediate选项后，实例化后立刻回调一次
    //   immediate: true
    // }
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
        start_runtime: [
          { required: true, message: "播放开始时间不能为空", trigger: "blur" },
        ],
        end_runtime: [
          { required: true, message: "播放结束时间不能为空", trigger: "blur" },
        ],
        // buy_max: [
        //   { required: true, message: "填写一次最多购买座位数", trigger: "blur" },
        // ],
        language: [
          { required: true, message: "放映语言不能为空", trigger: "blur" },
        ],
        is_section: [{ required: true, message: "请选择座位是否分区", trigger: "blur" }],
        premium: [{ required: true, message: "请选择输入服务费", trigger: "blur" }],
      },
      filmList: [],
      cinema_id:"",
      hallList:[],
      // sectionList:['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z']
      filmDetail:{}
    };
  },
  mounted() {
    this.getFilmList();
  },
  methods: {
    dayjs,
    disabledDate(time){
      return time.getTime() < dayjs(this.filmDetail.show_time*1000).toDate();
    },
    onChangeStartRuntime(time){
      let { ruleForm,filmDetail  } = this;
      this.ruleForm.end_runtime = dayjs(time).add(filmDetail.runtime,'minute')
      // if(ruleForm.end_runtime && dayjs(time).unix()>dayjs(ruleForm.end_runtime).unix()){
      //   ruleForm.start_runtime = '';
      //   this.$message.info('开始放映时间不能大于结束放映时间')
      // }
    },
    onChangeEndRuntime(time){
      let { ruleForm  } = this;
      // if(ruleForm.start_runtime && dayjs(time).unix()<dayjs(ruleForm.start_runtime).unix()){
      //   ruleForm.end_runtime = '';
      //   this.$message.info('开始放映时间不能大于结束放映时间')
      // }
    },
    onChangeFilm(film_id){
      this.filmList.map(item=>{
        if(item.id == film_id){
          this.filmDetail = item;
        }
      })
      this.ruleForm.start_runtime = "";
      this.ruleForm.end_runtime = "";
    },
    // onDeleteSectionPrice(index){
    //   this.ruleForm.sectionPrice.splice(index,1);
    // },
    // onAddSectionPrice(){
    //   this.ruleForm.sectionPrice.push({
    //     section_id:"",
    //     section_name:"",
    //     price:""
    //   })
    // },
    onChangeCinema(cinema_id){
      this.cinemaList.map(item=>{
        if(item.id == cinema_id){
          this.ruleForm.premium = item.premium;
        }
      })
      this.cinema_id = cinema_id;
      this.ruleForm.hall_id = '';
      this.ruleForm.sectionPrice = [];
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
    onChangeHall(hall_id){
      let  { hallList } = this;
      this.ruleForm.sectionPrice = [];
      for(let i=0;i<hallList.length;i++){
        if(hallList[i].id == hall_id && hallList[i].section && hallList[i].section.length){
          let section = hallList[i].section;
          for(let j=0;j<section.length;j++){
            section.price = 0;
          }
          this.ruleForm.sectionPrice = section;
        }
      } 
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
      // let { query } = this.$route;
      // if (query.cinema_id) {
      //   this.ruleForm.cinema_id = query.cinema_id;
      // }
      // let { is_section,sectionPrice,price } = this.ruleForm;
      // if(is_section==0){
      //   if(!price) return this.$message.error('缺少售价')
      // }else{
      //   for(var item of sectionPrice){
      //     if(!item.section_id) return this.$message.error('缺少分区id');
      //     if(!item.section_name) return this.$message.error('缺少分区名称');
      //     if(!item.price) return this.$message.error('缺少分区售价');
      //   }
      // }
      
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
        // console.log("编辑",val);
        this.title = "编辑";
        var rows = _.clone(val);
        this.ruleForm = rows;
        this.filmDetail.show_time = rows.show_time;
        this.filmDetail.runtime = rows.runtime;
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
        this.filmDetail = {};
      }
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/ {
  .order-addedit-scrollbar-wrapper {
    height: calc(100vh - 60px) !important;
    .el-drawer__body {
      padding-right: 10px;
    }
  }
}
.amap-container {
  height: 500px;
}
.address {
  font-size: 15px;
  font-weight: bold;
}
</style>
