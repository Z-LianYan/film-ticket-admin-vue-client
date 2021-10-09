<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" style="text-align: center" class="clearfix">
        <el-page-header
          @back="goBack"
          title="返回"
          content="编辑电影"
          center
        ></el-page-header>
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
          <el-input v-model="ruleForm.play_time" type="number">
            <template slot="append">分钟</template>
          </el-input>
        </el-form-item>

        <!-- <el-form-item label="上映区域" prop="nation">
          <el-input v-model="ruleForm.nation"></el-input>
        </el-form-item> -->
        <el-form-item label="上映区域" prop="nation">
          <el-select
            style="width:200px;"
            v-model="ruleForm.nation"
            multiple
            placeholder="请选择上映区域"
          >
            <el-option
              v-for="(item, index) in showPlayAreaList"
              :key="index"
              :label="item.area_name"
              :value="item.area_name"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="导演" prop="director">
          <el-input v-model="ruleForm.director"></el-input>
        </el-form-item>

        <el-form-item label="上映时间" prop="show_time">
          <el-date-picker
            v-model="ruleForm.show_time"
            type="datetime"
            placeholder="选择日期上映时间"
          >
          </el-date-picker>
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="ruleForm.status">
            <el-radio :label="1">上架</el-radio>
            <el-radio :label="2">下架</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="播放类型" prop="play_type" required>
          <el-radio-group v-model="ruleForm.play_type">
            <el-radio :label="2">2D</el-radio>
            <el-radio :label="3">3D</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="电影类型" prop="category_ids">
          <el-select
            style="width:400px;"
            v-model="ruleForm.category_ids"
            multiple
            placeholder="请选择电影类型"
          >
            <el-option
              v-for="(item, index) in categoryList"
              :key="index"
              :label="item.label"
              :value="item.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="演员" prop="actors">
          <el-button
            type="text"
            class="el-icon-plus float-right"
            @click="onAddActors"
            >添加演员</el-button
          >
          <el-table
            :data="ruleForm.actors"
            highlight-current-row
            border
            style="width: 100%"
          >
            <el-table-column prop="name" label="姓名">
              <template slot-scope="scope">
                <el-input type="text" v-model="scope.row.name"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="name" label="角色">
              <template slot-scope="scope">
                <el-input type="text" v-model="scope.row.role"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="name" label="头像">
              <template slot-scope="scope">
                <upload-image
                  @getImgUrl="onActorsAvatar($event, scope.$index)"
                  uploadPrefix="film/actors_avatar/"
                  :staticImageUrl="scope.row.avatar"
                />
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="text" @click="onDelActors(scope.$index)"
                  >删除</el-button
                >
                <el-button
                  type="text"
                  @click="onUpActors(scope.$index)"
                  v-if="scope.$index != 0"
                  >上移</el-button
                >
                <el-button
                  type="text"
                  @click="onDownActors(scope.$index)"
                  v-if="scope.$index + 1 != ruleForm.actors.length"
                  >下移</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>

        <el-form-item label="电影海报" prop="poster_img" required>
          <upload-image
            @getImgUrl="getImgUrl"
            uploadPrefix="film/"
            :staticImageUrl="ruleForm.poster_img"
          />
        </el-form-item>

        <el-form-item label="摘要" prop="abstract">
          <el-input
            v-model="ruleForm.abstract"
            type="textarea"
            rows="3"
          ></el-input>
        </el-form-item>
        <!-- <el-form-item label="语言" prop="language">
          <el-input v-model="ruleForm.language" type="text"></el-input>
        </el-form-item> -->
        <el-form-item label="剧照" prop="stage_photo" required>
          <UploadImageMul
            :imageLimit="5"
            :uploadPrefix="'film/stage_photo/'"
            v-model="ruleForm.stage_photo"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')"
            >提交</el-button
          >
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <ActorsSelected ref="actors_selected"/>
  </div>
</template>

<script>
import UploadImage from "@/components/UploadImage";
import UploadImageMul from "@/components/UploadImage-mul";
import ActorsSelected from "@/components/ActorsSelected/list";
import _ from "lodash";

function formOptions() {
  return {
    film_name: "",
    play_time: "",
    nation: [],
    poster_img: "",
    director: "",
    show_time: "",
    status: 1,
    category_ids: [],
    actors: [],
    abstract: "",
    stage_photo: [],
    play_type: 2,
    language: "",
  };
}
export default {
  name: "FilmEdit",
  components: {
    UploadImage,
    UploadImageMul,
    ActorsSelected
  },
  data() {
    return {
      ruleForm: formOptions(),
      rules: {
        film_name: [{ required: true, message: "请输入电影名称" }],
        play_time: [
          { required: true, message: "请输入播放时间", trigger: "blur" },
        ],
        nation: [{ required: true, message: "请输入国家", trigger: "blur" }],
        // poster_img: [
        //   { required: true, message: "请上传海报", trigger: "change" },
        // ],
        director: [{ required: true, message: "请输入导演", trigger: "blur" }],
        show_time: [
          { required: true, message: "请选择上映时间", trigger: "change" },
        ],
        status: [{ required: true, message: "请选择状态", trigger: "change" }],
        category_ids: [
          { required: true, message: "请电影类型", trigger: "change" },
        ],
        actors: [
          { required: true, message: "请上传演员信息", trigger: "change" },
        ],
        abstract: [
          { required: true, message: "请输入摘要", trigger: "change" },
        ],
      },
      categoryList: [],
      showPlayAreaList:[]
    };
  },
  mounted() {
    this.getCategoryList();
    this.getFilmDetial();
    this.getShowPlayArea();
  },
  methods: {
    getShowPlayArea(){
      this.$store.dispatch('filmListManager/get_show_paly_area_list').then(res=>{
        this.showPlayAreaList = res;
      })
    },
    goBack() {
      history.back();
    },
    onActorsAvatar(img, index) {
      console.log("上传头像", img, index);
      this.ruleForm.actors[index].avatar = img;
    },
    onUpActors(index) {
      let { ruleForm } = this;
      let { actors } = ruleForm;
      let item = _.clone(actors[index]);
      actors.splice(index, 1, actors[index - 1]);
      actors.splice(index - 1, 1, item);
    },
    onDownActors(index) {
      let { ruleForm } = this;
      let { actors } = ruleForm;
      let item = _.clone(actors[index]);
      actors.splice(index, 1, actors[index + 1]);
      actors.splice(index + 1, 1, item);
    },
    onDelActors(index) {
      this.ruleForm.actors.splice(index, 1);
    },
    onAddActors() {
      this.$refs.actors_selected.open((actors)=>{
        console.log('actors',actors);
        this.ruleForm.actors = this.ruleForm.actors.concat(actors.map(item=>{
          return {
            name: item.name,
            role: item.role,
            avatar: item.avatar,
          }
        }));
      });
      // this.ruleForm.actors.push({
      //   name: "",
      //   role: "",
      //   avatar: "",
      // });
    },
    async getFilmDetial() {
      const { id } = this.$route.params;
      const result = await this.$store.dispatch(
        "filmListManager/getFilmDetial",
        { id }
      );
      result.show_time = result.show_time * 1000;
      this.ruleForm = result;
      console.log("电影详情", result);
    },
    async getCategoryList() {
      const result = await this.$store.dispatch(
        "filmListManager/get_category_list"
      );
      this.categoryList = result;
      console.log("获取分类列表", result);
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // let { ruleForm } = this;
          let ruleForm = _.cloneDeep(this.ruleForm);
          let { actors,nation } = ruleForm;
          if(!nation.length) this.$message.info('请选择上映区域');
          ruleForm.nation = ruleForm.nation.join(',');
          for(var item of actors){
            if(!item.name) return this.$message.info('缺少演员姓名');
            if(!item.role) return this.$message.info('缺少角色');
            if(!item.avatar) return this.$message.info('缺少演员头像');
          }
          if(!ruleForm.poster_img) return this.$message.info('请上传电影海报')
          if(!ruleForm.stage_photo.length) return this.$message.info('请上传剧照')
          ruleForm.play_type = Number(ruleForm.play_type);
          this.$store
            .dispatch("filmListManager/doEdit", ruleForm)
            .then(() => {
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
    getImgUrl(imgUrl) {
      console.log("上传的图片路径：", imgUrl);
      this.ruleForm.poster_img = imgUrl;
    },
    activated() {
      console.log("管理员添加activated");
    },
    deactivated() {
      console.log("管理员添加activated");
    },
    destroyed() {
      console.log("管理员添加destroyed");
    },
    beforeDestroy() {
      console.log("管理员添加beforeDestroy");
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
