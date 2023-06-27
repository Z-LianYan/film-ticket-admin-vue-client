<template>
  <el-drawer
    :title="title + '安装包'"
    :visible.sync="isDrawer"
    size="50%"
    @close="drawerClose"
  >
    <el-scrollbar wrap-class="actors-addedit-scrollbar-wrapper">
      <div style="padding-right:40px;">
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="140px"
          class="demo-ruleForm"
        >
          <el-form-item label="更新备注" prop="remark">
            <el-input v-model="ruleForm.remark"></el-input>
          </el-form-item>
          <el-form-item label="上传头像"  required>
            <!-- <upload-image
              @getImgUrl="getImgUrl"
              uploadPrefix="actors/"
              :staticImageUrl="ruleForm.avatar"
            /> -->
            <el-upload
              class="upload-demo"
              drag
              :action="upload_qiniu_url"
              :multiple="false"
              :on-success="handleAddUploadSuccess"
              :on-error="handleUploadError"
              :auto-upload="true"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :data="qiniuData"
              :before-upload="beforeUpload"
              accept=".apk">
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">将安装包拖到此处，或<em>点击上传</em></div>
              <!-- <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div> -->
            </el-upload>
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
import UploadImage from "@/components/UploadImage";
import * as qiniu from "qiniu-js";

function ruleForm() {
  return {
    remark: "",
    avatar: ""
  };
}
export default {
  name: "HallAddEdit",
  props:['cinemaList'],
  components: {
    UploadImage
  },
  data() {
    return {
      qiniuData: {
        key: "",
        token: ""
      },
      upload_qiniu_url: "",
      upload_qiniu_addr: "",
      isDrawer: false,
      title: "添加",
      ruleForm: ruleForm(),
      rules: {
        remark: [
          { required: true, message: "更新备注中", trigger: ["change","blur"] },
        ],
        avatar: [
          { required: true, message: "请上传头像", trigger: ['change','blur','input'] },
        ]
      }
    };
  },
  mounted() {
    this.getUploadQiNiuToken();
  },
  methods: {
    getImgUrl(imgUrl) {
      console.log("上传的图片路径：", imgUrl);
      this.ruleForm.avatar = imgUrl;
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if(!this.ruleForm.avatar) return this.$message.info('请上传头像');
          if (this.title == "添加") {
            this.$store.dispatch("actors/add", this.ruleForm).then(() => {
              this.$emit("on-getData");
              this.resetForm();
            });
          } else {
            this.$store.dispatch("actors/update", this.ruleForm).then(() => {
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


    getUploadQiNiuToken() {

      this.$store.dispatch("sourceManager/getUploadQiNiuToken").then(res => {

        this.upload_qiniu_addr = res.static_host;

        qiniu.getUploadUrl({ useCdnDomain: true, region: qiniu.region.z2 },res.upload_token).then(res => {

          this.upload_qiniu_url = res;

        }); // res 即为上传的 url
      });
    },

    beforeUpload(file) {
      console.log('beforeUpload---->>',file)
      

      return new Promise((resolve, reject) => {

        // qiniu.compressImage(file, {quality: 0.5,maxWidth: 720}).then(compress_res => {

        //   this.$store.dispatch("sourceManager/getUploadQiNiuToken").then(res => {

        //     this.qiniuData.token = res.upload_token;

        //     this.qiniuData.key ='app/android/'+dayjs().format("YYYYMMDDHHmmss")+'/'+file.name;

        //     this.upload_qiniu_addr = res.static_host;

        //     resolve(compress_res.dist);

        //   });
        // });
      });

    },
    handleAddUploadSuccess(res, file) {

      this.imgUrl = this.upload_qiniu_addr + res.key;

      console.log("res.key",res)

    this.$emit("getImgUrl",this.imgUrl);

    },
    handleUploadError(err, file, fileList) {
      console.log("err", err);
    },
    handlePreview(file) {
      console.log(file);
    },
    handleRemove() {}
  },
};
</script>

<style lang="scss">
.actors-addedit-scrollbar-wrapper {
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
