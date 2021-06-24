<template>
  <div class="qiniu-upload-image-box">
    <el-upload
      ref="qiniu_upload"
      drag
      :action="upload_qiniu_url"
      :on-success="handleAddUploadSuccess"
      :on-error="handleUploadError"
      :auto-upload="true"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
	    :on-progress="handleProgress"
      :data="qiniuData"
      :show-file-list="true"
      :limit="imageLimit"
      :multiple="true"
      :file-list="fileList"
      list-type="picture-card"
      :before-upload="beforeUpload"
      :on-exceed="handleExceed"
    >
      <i class="el-icon-plus"></i>
    </el-upload>
    <el-dialog :append-to-body="true" :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
  </div>
</template>

<script>
import * as qiniu from "qiniu-js";
export default {
  name: "UploadImageMul",
  props: {
    value: Array,
    quality: {
      type: Number,
      default: 0.5,
    },
    width: {
      type: Number,
      default: 100,
    },
    height: {
      type: Number,
      default: 100,
    },
    maxWidth: {
      type: Number,
      default: 720,
    },
    uploadPrefix: {
      type: String,
      default: "",
    },
    imageLimit: {
      type: Number,
      default: 2,
    },
    compress: {
      type: Boolean,
      default: true,
    },
    // file_list:{//图片回显 格式:[{url:''}]
    // 	type:Array,
    // 	default:()=>[]
    // }
  },
  watch: {
  },
  data() {
    return {
      // upload_headers:{
      // 	Authorization: "UpToken 2V7SpSAUC9f0QceZd_FJK1mRk-l-05KPpV05W9A5:4xMWTJKyLcOzmxChUJ0Kquo0Z-g=:eyJyZXR1cm5Cb2R5Ijoie1wia2V5XCI6XCIkKGtleSlcIixcImhhc2hcIjpcIiQoZXRhZylcIixcImZzaXplXCI6JChmc2l6ZSksXCJidWNrZXRcIjpcIiQoYnVja2V0KVwiLFwibmFtZVwiOlwiJCh4Om5hbWUpXCJ9Iiwic2NvcGUiOiJ0ZXN0IiwiZGVhZGxpbmUiOjE1NTYyNjI1NTF9",
      // 	'content-type': "application/octet-stream"
      // },
      upload_qiniu_url: "",
      qiniuData: {
        key: "",
        token: "",
      },
      upload_qiniu_addr: "",

      dialogImageUrl: "",
      dialogVisible: false,

	  beforeUploadNum:0,
	  uploadSuccessNum:0,
    };
  },
  mounted() {
    this.getToken();
  },
  computed: {
    fileList() {
      let fileList = [];
      if (this.value) {
        for (let i = 0; i < this.value.length; i++) {
          fileList.push({ url: this.value[i] });
        }
      }
      return fileList;
    },
  },
  methods: {
	
    async getToken() {
      let res = await this.$store.dispatch("sourceManager/getUploadQiNiuToken");

      this.upload_qiniu_addr = res.static_host;

      this.qiniuData.token = res.upload_token;

      let qiniu_result = await qiniu.getUploadUrl(
        {
          useCdnDomain: true,
          region: qiniu.region.z2,
        },
        res.upload_token
      );
      console.log("getUploadUrl", qiniu_result);
      this.upload_qiniu_url = qiniu_result;
    },
    emitInput(fileList,type) {
      let value = [];
      for (let i = 0; i < fileList.length; i++) {
        value.push(fileList[i].url);
      }
      this.$emit("input", value);

      if(type=='clearNum'){
        this.beforeUploadNum = 0;
        this.uploadSuccessNum = 0;
      }
    },
    getValues() {
      let value = [];
      for (let i = 0; i < this.fileList.length; i++) {
        value.push(this.fileList[i].url);
      }
      return value;
    },
    handleRemove(file, fileList) {
      this.emitInput(fileList);
    },

    handlePreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },

    async beforeUpload(file) {
      console.log("beforeUpload---上传前", file);
      this.beforeUploadNum += 1;
      return new Promise((resolve, reject) => {
        if (this.compress) {
          qiniu
            .compressImage(file, {
              quality: this.quality,
              maxWidth: this.maxWidth, //720,
            })
            .then((compress_res) => {
              // this.$store.dispatch("sourceManager/getUploadQiNiuToken").then(res => {

              // this.qiniuData.token = res.upload_token;

              this.qiniuData.key = this.uploadPrefix + dayjs().format("YYYYMMDDHHmmss") + parseInt(Math.random() * 1000000) + file.type.replace("image/", ".");

              // this.upload_qiniu_addr = res.static_host;

              resolve(compress_res.dist);

              // });
            });
        } else {
          	this.qiniuData.key = this.uploadPrefix + dayjs().format("YYYYMMDDHHmmss") + parseInt(Math.random() * 1000000) + file.type.replace("image/", ".");

          	resolve(file);
        }
      });
    },
    handleProgress(event, file, fileList){
      // console.log('文件上传时的钩子',event, file, fileList);
    },
    handleAddUploadSuccess(res, file, fileList) {
      this.uploadSuccessNum += 1;
      // console.log("上传成功呢", res, file, fileList, this.uploadNum);
      var url = this.upload_qiniu_addr + res.key;
      this.fileList.push({ url: url });
      if(this.beforeUploadNum == this.uploadSuccessNum){
        this.emitInput(this.fileList,'clearNum');
      }
    },
    handleUploadError(err, file, fileList) {
      // console.log("文件上传失败时的钩子", err, file, fileList);
	    this.beforeUploadNum -= 1;
    },
    
    clearFiles() {
      console.log("哈哈哈哈", this.$refs.qiniu_upload);
      this.$refs.qiniu_upload.clearFiles();
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 ${this.imageLimit} 个图片，本次选择了 ${
          files.length
        } 个图片，共选择了 ${files.length + fileList.length} 个文件`
      );
    },
  },
};
</script>

<style lang="scss">
.qiniu-upload-image-box {
  .el-upload-list--picture-card .el-upload-list__item {
    width: 80px;
    height: 80px;
  }
  .el-upload--picture-card {
    width: 80px;
    height: 80px;
    line-height: 80px;
    .el-upload-dragger {
      width: 80px;
      height: 80px;
    }
  }
}
</style>




