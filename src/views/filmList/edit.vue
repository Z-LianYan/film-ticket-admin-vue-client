<template>
  <el-card class="box-card">
    <div slot="header" style="text-align:center;" class="clearfix">
      编辑电影
    </div>

    <el-form
      :model="ruleForm"
      :rules="rules"
      status-icon
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="电影名称" prop="film_name">
        <el-input v-model="ruleForm.film_name"></el-input>
      </el-form-item>
      <el-form-item label="播放时间" prop="play_time">
        <el-input v-model="ruleForm.play_time" type="number"></el-input>
      </el-form-item>

      <el-form-item label="国家" prop="nation">
        <el-input v-model="ruleForm.nation"></el-input>
      </el-form-item>
      <el-form-item label="导演" prop="director">
        <el-input v-model="ruleForm.director"></el-input>
      </el-form-item>

      <el-form-item label="上映时间" prop="show_time">
        <el-date-picker
          v-model="ruleForm.show_time"
          type="datetime"
          placeholder="选择日期上映时间">
        </el-date-picker>
      </el-form-item>

      <el-form-item label="状态" prop="status">
        <el-radio-group v-model="ruleForm.status">
          <el-radio :label="1">上架</el-radio>
          <el-radio :label="2">下架</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="电影类型" prop="category_ids">
        <el-select v-model="ruleForm.category_ids" multiple placeholder="请选择电影类型">
          <el-option
          v-for="(item,index) in categoryList"
          :key="index"
          :label="item.label"
          :value="item.id"/>
        </el-select>
      </el-form-item>

      

      <el-form-item label="上传海报" prop="poster_img">
        <upload-image 
        @getImgUrl="getImgUrl" 
        uploadPrefix="film/"  
        :staticImageUrl='ruleForm.poster_img'
        />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import UploadImage from "@/components/UploadImage";
function formOptions(){
  return {
    film_name:"",
    play_time:"",
    nation:"",
    poster_img:"",
    director:"",
    show_time:"",
    status:1,
    category_ids:[],
  }
}
export default {
  name:'manager_add',
  components:{
    UploadImage
  },
  data() {
    

    return {
      ruleForm: formOptions(),
      rules: {
        film_name: [{ required: true, message: "请输入电影名称" }],
        play_time: [{ required: true, message: "请输入播放时间", trigger: "blur" }],
        nation: [{ required: true, message: "请输入国家", trigger: "blur" }],
        poster_img: [{ required: true, message: "请上传海报", trigger: "change" }],
        director: [{ required: true, message: "请输入导演", trigger: "blur" }],
        show_time: [{ required: true, message: "请选择上映时间", trigger: "change" }],
        status: [{ required: true, message: "请选择状态", trigger: "change" }],
        category_ids: [{ required: true, message: "请电影类型", trigger: "change" }],
      },
      categoryList:[]
    };
  },
  mounted() {
    this.getCategoryList();

    this.getFilmDetial();
  },
  methods: {
    async getFilmDetial(){
      const { id } = this.$route.params;
      const result = await this.$store.dispatch('filmListManager/getFilmDetial',{id});
      result.show_time = result.show_time * 1000;
      this.ruleForm = result;
      console.log("电影详情",result);
    },
    async getCategoryList(){
      const result = await this.$store.dispatch('filmListManager/get_category_list');
      this.categoryList = result;
      console.log('获取分类列表',result);
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$store.dispatch("filmListManager/doEdit", this.ruleForm).then(() => {
            // this.resetForm("ruleForm");
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
    getImgUrl(imgUrl){
      console.log("上传的图片路径：",imgUrl);
      this.ruleForm.poster_img = imgUrl;
    },
    activated(){
      console.log("管理员添加activated");
    },
    deactivated(){
      console.log("管理员添加activated");
    },
    destroyed(){
      console.log("管理员添加destroyed");
    },
    beforeDestroy(){
      console.log("管理员添加beforeDestroy");
    },
  }
};
</script>

<style lang="scss" scoped>
</style>
