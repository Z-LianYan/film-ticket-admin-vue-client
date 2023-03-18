<template>
  <div>

    <div class="header-wrapper">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="120px"
        class="demo-ruleForm"
      >
        
        <el-form-item 
        label="合同名称" 
        prop="name" 
        style="display:inline-block;">
          <el-input
            v-model="ruleForm.name"
            placeholder="请输入合同名称"
          ></el-input>
        </el-form-item>

        <el-form-item 
        label="状态" 
        prop="status" 
        style="display:inline-block;">
          <el-radio-group v-model="ruleForm.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      
      
    </div>

    <div class="container">
      

      <div class="left-wrapper">
        <div>
          文件 <el-tooltip class="item" effect="dark" content="文件须小于30M，仅支持PDF文件" placement="top-start">
              <i class="el-icon-info"></i>
          </el-tooltip>
        </div>
        <div class="upload-file-wrapper">
          <el-upload
            :action="upload_qiniu_url"
            :data="qiniuData"
            class="upload-demo"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            :on-success="handleAddUploadSuccess"
            multiple
            :limit="1"
            :show-file-list='false'
            :on-exceed="handleExceed"
            :before-upload="beforeUpload"
            :file-list="fileList">
            <el-button 
            size="small" 
            type="primary">选择文件上传</el-button>
            <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
          </el-upload>
        </div>
        
        
        <div class="left-title">我的印章</div>
        <draggable v-model="mainImagelist" :group="{name:'itext',pull:'clone'}" :sort="false" @end="end">
            <transition-group type="transition">
                <li v-for="(item,index) in mainImagelist" :key="item" class="item">
                    <img 
                    v-if="index==0" 
                    :src="item" 
                    width="100%;" 
                    height="100%" 
                    class="imgstyle"/>
                    <div 
                    v-if="index==1" 
                    style="border:1px solid #ccc;width:100%;height:30px;text-align:center;line-height:30px;">
                      文本
                    </div>
                </li>
            </transition-group>
        </draggable>
      </div>
      
      <div class="center-wrapper">
        <div class="operator-btn-wrapper">
          <div style="width:200px;display:flex;align-items:center;">
            <el-slider 
            v-model="scaleValue" 
            :step="10" 
            :min="50"
            :max="300"
            @input="onInputSlider"
            style="flex:1;margin-right:10px;"></el-slider>{{scaleValue}}%
          </div>
          
          <div v-if="locationInfo.length">
            <el-button type="primary" @click="removeSignature">
              点击删除选中设置
            </el-button>
            <el-button type="primary" @click="clearSignature">
              删除所有设置
            </el-button>
          </div>

          <screenfull style="margin-left:15px;" />

          <el-button type="primary" @click="onSubmit">提交</el-button>
        </div>
        <el-scrollbar class="page-component__scroll" style="width:100%;">
        <!-- <div class="scroll-content-box"> -->
          <div 
          class="scroll-item-wrapper" 
          :style="{width:pageSizeObj[item]?(pageSizeObj[item].width*(scaleValue/100))+'px':0}"
          v-for="(item) in totalPage" 
          :key="item+'the-canvas'">
            <canvas
              :id="'the-canvas-' + item"
              class="the-canvas"
            ></canvas>
            <canvas
              :id="'ele-canvas-' + item"
              class="ele-canvas"
            ></canvas>

          </div>
          
          
          <!-- <div class="ele-canvas-wrapper">
            <canvas
              v-for="item in totalPage"
              :key="item+'ele-canvas'"
              :id="'ele-canvas-' + item"
              class="ele-canvas"
              :data-index="item"
            ></canvas>
          </div> -->
        <!-- </div> -->
          
        </el-scrollbar>
      </div>

      <!-- <div class="right-wrapper">
        <h3>位置信息</h3>
        <el-table
          :data="locationInfo"
          :key="1"
          fit
          style="width: 100%"
        >
          <el-table-column prop="pageNum" label="名称"></el-table-column>
          <el-table-column prop="pageNum" label="所在页面">
            <template slot-scope="{row}">{{row.pageNum+1}}</template>
          </el-table-column>
          <el-table-column prop="left" label="x坐标"></el-table-column>
          <el-table-column prop="top" label="y坐标"></el-table-column>
          <el-table-column prop="width" label="宽"></el-table-column>
          <el-table-column prop="height" label="高"></el-table-column>
        </el-table>
        
      </div> -->
        


    </div>
      
    
  </div>
</template>

<script>
// import E from "wangeditor";
// import QiniuUpload from "@/components/QiniuUpload";
import tools from "@/common/tools";
import * as qiniu from "qiniu-js";
import Screenfull from '@/components/Screenfull/index';
import html2canvas from "html2canvas";

import draggable from 'vuedraggable';

let pdfjsLib = window["pdfjs-dist/build/pdf"];

pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://static.eryicaier.com/public/pdfjs/pdf.worker.js'; // 这里使用好别扭，固定写法


let storage = window.localStorage;

function options(){
  return {
    name:'',
    status: 1,
  }
}

export default {
  name:'addedit',
  components: {
    Screenfull,
    draggable
  },
  props: {
  },
  data() {
    return {
      upload_qiniu_url:"",      		      		
			qiniuData:{
				key: "",
				token: ""
			},
			upload_qiniu_addr:"",
      fileList: [
        // {
        //   name: 'food2.jpeg', 
        //   url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
        // }
      ],
      isDrawer: false,
      title: "新增",

      ruleForm:options(),
      rules: {
        name: [
          { required: true, message: "请输入合同名称", trigger: ["change"] },
        ],
        status: [
          { required: true, message: "请选择状态", trigger: ["change"] }
        ],
       
      },


      // upload_token: "",
      // site_static_host: "",
      // proxy_url: "",

      pdfUrl: '',
      pdfDoc: null,
      totalPage: 0,
      pageNum: 1,
      scale: 1,
      pageRendering: false,
      pageNumPending: null,
      sealUrl: '',
      signUrl: '',
      canvas: null,
      ctx: null,
      canvasEle: null,
      whDatas: null,
      isSpinShow: false,
      mainImagelist: [],
      taskInfo: {},

      canvasEleList:[],

      locationInfo:[],
      scaleValue:100,

      pageSizeObj:{

      }
    };
  },
  //计算属性,就是依赖其它的属性计算所得出最后的值
  computed: {
      hasSigna() {
          return !!this.canvasEle && !!this.canvasEle.getObjects()[0] ? true : false;
      },
  },
  created(){
    this.getUploadQiNiuToken();
  },
  mounted() {

    // this.pdfUrl = 'https://static.eryicaier.com/public/pdfjs/show.pdf'; 
    this.mainImagelist = ['https://static.eryicaier.com/public/pdfjs/seal.png','https://static.eryicaier.com/public/pdfjs/sign.png'];
    this.taskInfo = {'title':'测试盖章', uname:'张三', endtime:'2021-09-01 17:59:59'};


  },
  //监听一个值的变化,然后执行相对应的函数。
  watch: {
      whDatas: {
          handler() {
              if (!!this.whDatas) {
                  this.renderFabric();
                  this.canvasEvents();
              }
          },
      },

      pdfUrl: function(val){
          this.$nextTick(() => {
              this.showpdf(val);
          });
      },
      // pageNum: function(pageNum) {
      //   let pageNums = Number(pageNum)
      //   this.commonSign(this.pageNum);
      //   this.queueRenderPage(this.pageNum);
      // },
      canvasEleList:{
        deep: true,
        handler(val) {
          this.getObjects();
        }
      },
  },
  methods: {
    getUploadQiNiuToken() {

      this.$store.dispatch("sourceManager/getUploadQiNiuToken").then(res => {
        console.log('res----',res);

        this.qiniuData.token = res.upload_token;

        this.upload_qiniu_addr = res.static_host;

        qiniu.getUploadUrl({ useCdnDomain: true, region: qiniu.region.z2 },res.upload_token).then(res => {

          this.upload_qiniu_url = res;

        }); // res 即为上传的 url
      });
    },
    onInputSlider(val){
      // console.log(val)
      // const eleCanvas = document.getElementsByClassName("ele-canvas");
      // for(let item of eleCanvas){
      //   console.log('item=====',item);
      //   item.style= `transform:scale(${val/100})`;
      // }
      // console.log('eleCanvas',eleCanvas);

      let percent = val/100;
      console.log('percent',percent);
      
      const canvasContainer = document.getElementsByClassName("canvas-container");
      const upperCanvas = document.getElementsByClassName("upper-canvas");
      
      for(let j=0;j<upperCanvas.length;j++){//这里的j=0就是第一页
        // console.log(this.pageSizeObj[j+1]);
        upperCanvas[j].style.width= `${this.pageSizeObj[j+1].width*percent}px`;
        upperCanvas[j].style.height= `${this.pageSizeObj[j+1].height*percent}px`;

        canvasContainer[j].style.width= `${this.pageSizeObj[j+1].width*percent}px`;
        canvasContainer[j].style.height= `${this.pageSizeObj[j+1].height*percent}px`;
      }
      for(let i=1;i<=this.totalPage;i++){
        const theCanvas = document.getElementById("the-canvas-" + i);
        const eleCanvas = document.getElementById("ele-canvas-" + i);

        // theCanvas.style.transform= `scale(${percent})`;
        // eleCanvas.style.transform= `scale(${percent})`;


        theCanvas.style.width= `${this.pageSizeObj[i].width*percent}px`;
        theCanvas.style.height= `${this.pageSizeObj[i].height*percent}px`;

        eleCanvas.style.width= `${this.pageSizeObj[i].width*percent}px`;
        eleCanvas.style.height= `${this.pageSizeObj[i].height*percent}px`;
        
      }
    },
    getObjects(){
      this.locationInfo = [];
      for(let i = 0;i<this.canvasEleList.length;i++){
        let data = this.canvasEleList[i].getObjects();
        // console.log('getObjects===>',data) 
        for(let item of data){
          this.locationInfo.push({
            width: item.getScaledWidth(),
            height: item.getScaledHeight(),
            top: item.top,
            left: item.left,
            scaleX: item.scaleX,
            scaleY: item.scaleY,
            pageNum: item.pageNum,
            // sealUrl: this.mainImagelist[item.index],
            // index: item.index
          })
        }
        
      }
    },
    renderPage(num) {
      let _this = this;
      this.pageRendering = true;
      // Using promise to fetch the page
      return this.pdfDoc.getPage(num).then((pdfPage) => {
          // let viewport = pdfPage.getViewport({ scale: 1 });
          // let scale = (that.winW / viewport.width).toFixed(2);
          let scaledViewport = pdfPage.getViewport({ scale:1 });
          const canvas = document.getElementById("the-canvas-" + num);
          canvas.width = scaledViewport.width;
          canvas.height = scaledViewport.height;
          console.log('scaledViewport',scaledViewport)
          this.pageSizeObj[num] = {
            width:scaledViewport.width,
            height:scaledViewport.height
          }
          const ctx = canvas.getContext("2d");
          const renderTask = pdfPage.render({
            canvasContext: ctx,
            viewport: scaledViewport,
          });
          this.renderPdf({
            width: scaledViewport.width,
            height: scaledViewport.height,
            num
          });
          return renderTask.promise;
      });
    },
    queueRenderPage(num) {
      if (this.pageRendering) {
        this.pageNumPending = num;
      } else {
        this.renderPage(num);
      }
    },
    prevPage() {
      this.confirmSignature();
      if (this.pageNum <= 1) {
        return;
      }
      this.pageNum--;
    },
    nextPage() {
      this.confirmSignature();
      if (this.pageNum >= this.totalPage) {
        return;
      }
      this.pageNum++;
    },
    cutover() {
      this.confirmSignature();
      let pageNums = Number(this.$refs.getPages.value);
      if(pageNums > this.totalPage) {
        this.pageNum = this.totalPage;
        return;
      }

      if (pageNums < 1) {
        this.pageNum = 1;
        return;
      }

      if(!(/(^[1-9]\d*$)/.test(pageNums))) {
        this.pageNum = 1;
        return;
      }
      this.pageNum = pageNums;
    },
    showpdf(pdfUrl) {
      // this.canvas = document.getElementById("the-canvas");
      
      // console.log('pdfUrl',pdfUrl,this.canvas);
      // this.ctx = this.canvas.getContext("2d");


      pdfjsLib.getDocument({url:pdfUrl, rangeChunkSize:65536, disableAutoFetch:false}).promise.then((pdfDoc_) => {
          console.log('pdfDoc_----',pdfDoc_);

          this.pdfDoc = pdfDoc_;
          this.totalPage = this.pdfDoc.numPages;
          // let totalPage = this.pdfDoc.totalPage;
          for(let i=1;i<=this.totalPage;i++){
            this.renderPage(i).then(() => {});
          }
          
          // this.commonSign(this.pageNum, true);
      });
    },

    /**
      *  盖章部分开始
      */
    // 设置绘图区域宽高
    renderPdf(data) {
      // this.whDatas = data;ele-canvas-
      // document.querySelector(".elesign").style.width = data.width + "px";
      this.renderFabric(data)
    },

    // 生成绘图区域
    renderFabric({width,height,num}) {
      let canvaEle = document.querySelector("#ele-canvas-"+num);

      canvaEle.width =width;
      canvaEle.height = height;

      this.canvasEleList = [...this.canvasEleList,new fabric.Canvas(canvaEle)];

      // let container = document.querySelector(".canvas-container");
      // container.style.position = "absolute";
      // container.style.top = "42px";
      this.canvasEvents(num);

    },

    // 相关事件操作哟
    canvasEvents(num) {
      let i = num - 1;
      // 拖拽边界 不能将图片拖拽到绘图区域外
      // for(let i=0;i<this.canvasEleList.length;i++){
        this.canvasEleList[i].on("object:moving", function (e) {
          console.log('canvasEvents--->',e)
            var obj = e.target;
            // if object is too big ignore
            if(obj.currentHeight > obj.canvas.height || obj.currentWidth > obj.canvas.width){
                return;
            }
            obj.setCoords();
            // top-left  corner
            if(obj.getBoundingRect().top < 0 || obj.getBoundingRect().left < 0){
                obj.top = Math.max(obj.top, obj.top-obj.getBoundingRect().top);
                obj.left = Math.max(obj.left, obj.left-obj.getBoundingRect().left);
            }
            // bot-right corner
            if(obj.getBoundingRect().top+obj.getBoundingRect().height  > obj.canvas.height || obj.getBoundingRect().left+obj.getBoundingRect().width  > obj.canvas.width){
                obj.top = Math.min(obj.top, obj.canvas.height-obj.getBoundingRect().height+obj.top-obj.getBoundingRect().top);
                obj.left = Math.min(obj.left, obj.canvas.width-obj.getBoundingRect().width+obj.left-obj.getBoundingRect().left);
            }
        });

        this.canvasEleList[i].on("mouse:over", (e) => {
          console.log('mouse:over--->鼠标进去了',e,num)
          this.pageNum = i;
        });
        // this.canvasEleList[i].on("mouse:out", function (e) {
        //   console.log('mouse:out--->鼠标离开了',e);
        //   this.getObjects();
        // });


        this.canvasEleList[i].on("object:scaling", function (e) {
          console.log('object:scaling--->',e);
          // var selected = e.target;
          // // this.getObjects();

          // // height: selected.height * selected.scaleY,
          // // width: selected.width * selected.scaleX,
          // selected.set({
          //   ...selected,
          //   // height: selected.height * selected.scaleY,
          //   // width: selected.width * selected.scaleX,
          //   // scaleX: 1,
          //   // scaleY: 1
          //   width: selected.width * selected.scaleX,
          //   height: selected.height * selected.scaleY,
          // });
          // this.canvasEleList[selected.pageNum].renderAll();
          
        });

        

        // this.canvasEleList[i].on("object:added", function (e) {
        //   console.log('added--->',e)
            
        // });
      // }
      
    },

    // 添加公章
    addSeal(sealUrl, left, top,index) {
      if(index==0){
        fabric.Image.fromURL(sealUrl,(oImg) => {
          oImg.set({
            left: left,
            top: top,
            // angle: 10,
            scaleX: 1,
            scaleY: 1,
            // index:index,
            pageNum:this.pageNum
          });
          // oImg.scale(0.5); //图片缩小一
          // oImg.on('moving', function() { 
          //   console.log('moving')
          // });
          // oImg.on('scaling', function(e) { 
          //   console.log('scaling',e)
          // });
          this.canvasEleList[this.pageNum].add(oImg);
        });
      }

      if(index==1){
        // var dom = document.createElement('div');
        // dom.innerText = 'innerText';

        // create a rect object
        var deleteIcon = "data:image/svg+xml,%3C%3Fxml version='1.0' encoding='utf-8'%3F%3E%3C!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1//EN' 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3E%3Csvg version='1.1' id='Ebene_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='595.275px' height='595.275px' viewBox='200 215 230 470' xml:space='preserve'%3E%3Ccircle style='fill:%23F44336;' cx='299.76' cy='439.067' r='218.516'/%3E%3Cg%3E%3Crect x='267.162' y='307.978' transform='matrix(0.7071 -0.7071 0.7071 0.7071 -222.6202 340.6915)' style='fill:white;' width='65.545' height='262.18'/%3E%3Crect x='266.988' y='308.153' transform='matrix(0.7071 0.7071 -0.7071 0.7071 398.3889 -83.3116)' style='fill:white;' width='65.544' height='262.179'/%3E%3C/g%3E%3C/svg%3E";

        var img = document.createElement('img');
        img.src = deleteIcon;
        // let dom = document.createElement('div');
        // dom.innerText = '123'

        fabric.Object.prototype.transparentCorners = false;
        fabric.Object.prototype.cornerColor = 'blue';
        fabric.Object.prototype.cornerStyle = 'circle';

        
        let _this = this;

        function Add() {
          var rect = new fabric.Rect({
            // fontSize: 40,
            left: 100,
            top: 50,
            fill: 'yellow',
            width: 200,
            height: 100,
            // hoverCursor:true,
            objectCaching: false,
            stroke: 'lightgreen',
            strokeWidth: 4,
          });
          _this.canvasEleList[_this.pageNum].add(rect);
          _this.canvasEleList[_this.pageNum].getAbsoluteCoords(rect);

          // var absCoords = canvas.getAbsoluteCoords(obj);
        }

        fabric.Object.prototype.controls.deleteControl = new fabric.Control({
          x: 0.5,
          y: -0.5,
          offsetY: 16,
          cursorStyle: 'pointer',
          mouseUpHandler: deleteObject,
          render: renderIcon,
          cornerSize: 24
        });



        Add();

        function deleteObject(eventData, transform) {
          var target = transform.target;
          var canvas = target.canvas;
              canvas.remove(target);
              canvas.requestRenderAll();
        }

        function renderIcon(ctx, left, top, styleOverride, fabricObject) {
          let _index = _this.canvasEleList[_this.pageNum].getObjects();
          var size = this.cornerSize;
          ctx.save();
          ctx.translate(left, top);
          ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
          ctx.drawImage(img, -size/2, -size/2, size, size);
          ctx.fillText('img'+_index.length, -size/3, -size/2, size/2, size);
          ctx.restore();
        }
      }


      
      
    },


    // 删除签章
    removeSignature() {
      // this.getObjects();
      // return;
      // if(pageNum || pageNum===0){
      //   this.canvasEleList[pageNum].remove(this.canvasEleList[pageNum].getActiveObject())
      //   return;
      // }
      for(let i=0;i<this.canvasEleList.length;i++){
        this.canvasEleList[i].remove(this.canvasEleList[i].getActiveObject())
      }
    },

    //翻页展示盖章信息
    commonSign(pageNum, isFirst = false) {
        if(isFirst == false) this.canvasEle.remove(this.canvasEle.clear()); //清空页面所有签章
        let caches = JSON.parse(storage.getItem('signs')); //获取缓存字符串后转换为对象
        if(caches == null) return false;
        let datas = caches[this.pageNum];
        if(datas != null && datas != undefined) {
          for (let index in datas) {
            this.addSeal(datas[index].sealUrl, datas[index].left, datas[index].top, datas[index].index);
          }
        }
    },

    //确认签章位置并保存到缓存
    confirmSignature() {
        let data = this.canvasEle.getObjects(); //获取当前页面内的所有签章信息
        let caches = JSON.parse(storage.getItem('signs')); //获取缓存字符串后转换为对象
        let signDatas = {}; //存储当前页的所有签章信息
        let i = 0;
        let sealUrl = '';
        for(var val of data) {
            signDatas[i] =  {
                width: val.width,
                height: val.height,
                top: val.top,
                left: val.left,
                angle: val.angle,
                translateX: val.translateX,
                translateY: val.translateY,
                scaleX: val.scaleX,
                scaleY: val.scaleY,
                pageNum: this.pageNum,
                sealUrl: this.mainImagelist[val.index],
                index:val.index
            }
            i++;
        }
        if(caches == null) {
            caches = {};
            caches[this.pageNum] = signDatas;
        } else {
            caches[this.pageNum] = signDatas;
        }
        storage.setItem('signs', JSON.stringify(caches)); //对象转字符串后存储到缓存
    },

    //提交数据
    submitSignature() {
      this.confirmSignature();
      let caches = storage.getItem('signs');

      if (this.isSpinShow === false) {
        this.isSpinShow = true
        axios.post('/index.php?a=getInfo&m=sign&d=cg', {
          'pdfWidth':this.whDatas.width,
          'pdfHeight':this.whDatas.height,
          'signs':caches,
          'mid':mid
        }).then(function (response) {
            if(response.data.code == 200) {
                storage.removeItem('signs');
                this.isSpinShow = false
            }else{
                alert(response.data.msg);
            }
        })
        .catch(function (error) {
            this.isSpinShow = false
            console.log(error);
        });
      }
    },

    onSubmit() {
      this.loading = this.$loading({
        lock: true,
        text: "正在上传",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      for(let i=1;i<=this.totalPage;i++){
        var c = document.createElement('canvas');
        var ctx = c.getContext('2d');
        console.log('this.pageSizeObj[i]',this.pageSizeObj[i]);
        c.width = this.pageSizeObj[i].width;
        c.height = this.pageSizeObj[i].height;
        html2canvas(document.getElementById('the-canvas-'+i), {
          allowTaint: true,
          useCORS: true,
        }).then((canvas) => {
          // document.getElementsByClassName('certificate-box')[0].appendChild(canvas);
          ctx.drawImage(canvas,0,0,this.pageSizeObj[i].width,this.pageSizeObj[i].height);
          let base64Codes = c.toDataURL();
          this.upload(base64Codes);
        });
      }
      
    },

    upload(base64Codes) {
      let _this = this;
      _this.loading.close();
      var file = tools.convertBase64UrlToBlob(base64Codes);
      console.log("file---0099", file);
      var observable = qiniu.upload(
        file,
        "public/concatTmp/img/" + Date.now() + file.type.replace("image/", "."),
        _this.qiniuData.token,
        {},
        {
          useCdnDomain: true,
          region: qiniu.region.z2,
        }
      );
      observable.subscribe({
        next(res) {
          console.log("next", res);
          _this.loading = _this.$loading({
            lock: true,
            text: "正在上传图片:" + res.total.percent,
            spinner: "el-icon-loading",
            background: "rgba(0, 0, 0, 0.7)",
          });
        },
        error(err) {
          _this.loading.close();
          _this.$message.error(err.message);
        },
        complete: async (res) => {
          console.log("complete", res, this.upload_qiniu_addr + res.key);
          
          let certificate_url = this.upload_qiniu_addr + res.key;
          // await this.$store.dispatch('EDIT_CERTIFICATE_URL',{
          //   id: this.cur_row_data.id,
          //   certificate_photo: certificate_url
          // })
          _this.loading.close();
          _this.callBack && _this.callBack(certificate_url);
          // this.avatar = '';
          // this.$refs.qiniu_upload.clearFiles();
        },
      });
    },

    //清空数据
    clearSignature() {
      for(let item of this.canvasEleList){
        item.remove(item.clear()); //清空页面所有
      }
    },
    /**
      *  盖章部分结束
      */

    //获取url参数
    getParam(str) {
      var query = window.location.search.substring(1);
      var vars = query.split("&");
      for (var i=0;i<vars.length;i++) {
        var pair = vars[i].split("=");
        if(pair[0] == str){return pair[1];}
      }
      return(false);
    },
    end(e){
      this.addSeal(this.mainImagelist[e.newDraggableIndex], e.originalEvent.layerX, e.originalEvent.layerY, e.newDraggableIndex)
    },




    
    open(callBack,val) {
      this.callBack = callBack;

      
      if (val) {
        this.title = "编辑";
      } else {
        this.title = "新增";
      }
      this.isDrawer = true;
    },

    close() {
      this.isDrawer = false;
    },
    closeDrawer() {
      if (this.title == "编辑") {
        
      }
    },




    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${ file.name }？`);
    },
    async beforeUpload(file){
			console.log("beforeUpload",file);

      if(file.name.lastIndexOf('.pdf')===-1) return this.$message.error('只能上传pdf文件')

      // return;
			let config = await this.$store.dispatch("GET_UPLOAD_TOKEN");
			if(!config) return;
			this.qiniuData.token=config.upload_token;
			this.upload_qiniu_addr=config.site_static_host;

			return new Promise((resolve,reject)=>{
				if(this.compress){
					qiniu.compressImage(file,{
						quality:this.quality,
						maxWidth:this.maxWidth //720,
					}).then((compress_res)=>{
            this.qiniuData.key='public/concatTmp/pdf/'+moment().format("YYYYMMDDHHmmss")+parseInt(Math.random()*1000000)+"/"+file.name;
            resolve(compress_res.dist);
					})
				}else{
					this.qiniuData.key = 'public/concatTmp/pdf/'+moment().format("YYYYMMDDHHmmss")+parseInt(Math.random()*1000000)+"/"+file.name;
					resolve(file);
				}
			})
		},
    handleAddUploadSuccess(res, file, fileList){
      console.log('handleAddUploadSuccess===>',res, file, fileList)
      let url = this.upload_qiniu_addr+fileList[0].response.key;
      console.log('handleAddUploadSuccess===>url',url)
      this.pdfUrl = url;

      this.fileList = [];
			// var imgArr = [];
			// fileList.map(item=>{
			// 	item.response? imgArr.push(this.upload_qiniu_addr+item.response.key):imgArr.push(item.url)
			// });
			// this.$emit("uploadSuccess",imgArr.reverse());



		},	
    
  },
};



</script>

<style lang="scss" scoped>
:focus {
  outline: 0;
}
/deep/.el-scrollbar__wrap{
  background: #f7f8fa !important;
}

.header-wrapper{
  height:50px;
}
.container{
  display: flex;
  background: #f7f8fa;
  height: calc(100% - 50px);
  // position:relative;
  .left-wrapper{
    padding: 50px 10px 10px 10px;
    width:300px;
    // box-sizing: border-box;
    background: #fff;
    border-right:1px solid #f4f4f4;
    .upload-file-wrapper{
      // width:200px;
      display: flex;
      justify-content: flex-end;
      // padding:10px;
      padding:20px 0;
    }
  }
  .center-wrapper{
    // padding-top:60px;
    flex: 1;
    display: flex;
    flex-flow: column;
    // justify-content: center;
    // align-items: center;
    // padding-top: 10px;
    position: relative;
    .operator-btn-wrapper{
      // width:100%;
      height:60px;
      // position:absolute;
      // top: 0;
      // // bottom: 100px;
      // left: 0;
      // right:0px;
      text-align: center;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      padding: 10px;
      background-color: #fff;
      border-bottom:1px solid #f4f4f4;
      // box-shadow: 0px 10px 100px 10px #f4f4f4;
    }
    /deep/.el-scrollbar__view{
      // display: flex;
      // flex-flow: column;
      // justify-content: center;
      // align-items: center;
      // flex: 1;
      position: relative;
      width: calc(100vw - 600px);
      height:600px;
      overflow: scroll;

      .scroll-item-wrapper{
        margin:auto;
        position: relative;
        margin-bottom: 30px;
        .the-canvas{
          // border: 1px solid blue;
          box-shadow: 0.3125rem 0.3125rem 0.3125rem #e9e9e9;
          // margin: auto;
          // transform: translateX(25%);
          // margin-bottom: 30px;
        }
        .canvas-container{
          position: absolute !important;
          top: 0;
          margin-bottom: 30px !important;
          box-sizing: content-box;
          z-index: 1000;
          .ele-canvas {
            border: 1px solid #5ea6ef;
            // margin-bottom: 30px;
          }
        }
      }
      
      
      
      // .ele-canvas-wrapper{
      //   width:100%;
      //   position:absolute;
      //   left:0;
      //   right:0;
      //   top:0;
      //   display:flex;
      //   align-items:center;
      //   flex-flow:column;
      //   .ele-canvas {
      //     border: 1px solid #5ea6ef;
      //     margin-bottom: 30px;
      //   }
      // }
    }
    

    
  }
  .right-wrapper{
    background: #fff;
    padding:0 10px 10px 10px;
    border-left:1px solid #f4f4f4;
  }
}





</style>