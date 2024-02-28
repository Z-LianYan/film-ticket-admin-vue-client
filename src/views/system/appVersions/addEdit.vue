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
          <el-form-item label="平台" required prop="platform">
            <el-select v-model="ruleForm.platform" placeholder="请选择平台">
              <el-option label="安卓" value="android"/>
              <el-option label="苹果" value="ios"/>
            </el-select>
          </el-form-item>
          <el-form-item label="更新备注" prop="remark">
            <el-input v-model="ruleForm.remark" type="textarea" placeholder="请输入备注"></el-input>
          </el-form-item>
          <el-form-item label="上传安装包"  :required="false" prop="download_url" v-if="title=='添加'">
            <el-upload
              ref="qn_upload"
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
              :limit="1"
              accept=".apk">
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">将安装包拖到此处，或<em>点击上传</em></div>
            </el-upload>
          </el-form-item>
          <el-form-item label="状态" required prop="status">
            <el-select v-model="ruleForm.status" placeholder="请选择状态">
              <el-option label="启用" :value="1"/>
              <el-option label="禁用" :value="0"/>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
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
import AppInfoParser from 'app-info-parser';
function ruleForm() {
  return {
    remark: "",
    download_url: "",
    status: 1,
    platform: 'android',
    package: '',
    versionCode: '',
    versionName: '',
    icon: '',
    size: '',
    compileSdkVersion: ''
  };
}
export default {
  name: "AppVersionsAddEdit",
  props:[],
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
        download_url: [
          { required: true, message: "请上传安装包", trigger: ['change','blur','input'] },
        ],
        status: [
          { required: true, message: "请选择状态", trigger: ['change','blur','input'] },
        ],
        platform: [
          { required: true, message: "请选择平台", trigger: ['change','blur','input'] },
        ],
      }
    };
  },
  mounted() {
    this.getUploadQiNiuToken();
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.title == "添加") {
            this.$store.dispatch("appVersions/create", this.ruleForm).then(() => {
              this.callback && this.callback()
              this.resetForm();
              this.$refs.qn_upload.clearFiles();
            });
          } else {
            this.$store.dispatch("appVersions/update", {
              platform: this.ruleForm.platform,
              remark: this.ruleForm.remark,
              status: this.ruleForm.status,
              id: this.ruleForm.id
            }).then(() => {
              this.callback && this.callback();
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
    open(callback,val) {
      this.callback = callback;
      if (val) {
        console.log("编辑");
        this.title = "编辑";
        const rows = _.clone(val);
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


    async getUploadQiNiuToken() {
      const res = await this.$store.dispatch("sourceManager/getUploadQiNiuToken")
      this.upload_qiniu_addr = res.static_host;
      const qn_res = await qiniu.getUploadUrl({ useCdnDomain: true, region: qiniu.region.z2 },res.upload_token);
      this.upload_qiniu_url = qn_res;
    },

    handerAppFileNameSuffix(fileName){
      const idx = fileName.lastIndexOf('.');
      return fileName.substring(idx)
    },

    beforeUpload(file) {
      return new Promise(async (resolve, reject) => {
        const parser = new AppInfoParser(file) // file  上传的apk文件
        const appInfo = await parser.parse();
        this.ruleForm.packageName = appInfo.package;
        this.ruleForm.versionCode = appInfo.versionCode;
        this.ruleForm.versionName = appInfo.versionName;
        this.ruleForm.icon = appInfo.icon;
        this.ruleForm.compileSdkVersion = appInfo.compileSdkVersion;
        this.ruleForm.size = file.size;
        this.$store.dispatch("sourceManager/getUploadQiNiuToken").then(res => {
          this.qiniuData.token = res.upload_token;
          this.qiniuData.key ='app/android/'+appInfo.package+'/'+dayjs().format("YYYYMMDDHHmmss") + this.handerAppFileNameSuffix(file.name);
          this.upload_qiniu_addr = res.static_host;
          resolve();
        });
      });

    },
    handleAddUploadSuccess(res, file) {
      this.ruleForm.download_url = this.upload_qiniu_addr + res.key;
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
