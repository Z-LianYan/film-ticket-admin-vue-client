<template>
	<div>
		<div class="fd-nav">
			<div class="fd-nav-left">
				<div class="fd-nav-back" @click="toReturn"><i class="anticon anticon-left"></i></div>
				<div class="fd-nav-title">{{processConfig.rule_name}}</div>
			</div>
			<!-- <div class="fd-nav-center">
                <div class="fd-nav-container">
                    <div class="ghost-bar" style="transform: translateX(300px);"></div>
                    <div class="fd-nav-item"><span class="order-num">1</span>基础设置</div>
                    <div class="fd-nav-item"><span class="order-num">2</span>表单设计</div>
                    <div class="fd-nav-item active"><span class="order-num">3</span>流程设计</div>
                    <div class="fd-nav-item"><span class="order-num">4</span>高级设置</div>
                </div>
            </div> -->
			<div class="fd-nav-right">
				<!-- <button type="button" class="ant-btn button-preview"><span>预 览</span></button> -->
				<button type="button" class="ant-btn button-publish" @click="saveSet"><span>发 布</span></button>
			</div>
		</div>
		<div class="fd-nav-content">
			<section class="dingflow-design">
				<div class="zoom">
					<div :class="'zoom-out'+ (nowVal==50?' disabled':'')" @click="zoomSize(1)"></div>
					<span>{{nowVal}}%</span>
					<div :class="'zoom-in'+ (nowVal==300?' disabled':'')" @click="zoomSize(2)"></div>
				</div>
				<div class="box-scale" id="box-scale" :style="'transform: scale('+nowVal/100+'); transform-origin: 50% 0px 0px;'">
					<nodeWrap 
					:data_posList="posList"
					:data_departments="departments"
					:nodeConfig.sync="nodeConfig" 
					:flowPermission.sync="flowPermission"
					:isTried.sync="isTried" 
					:directorMaxLevel="directorMaxLevel" 
					:conditions="conditions"
					:tableId="tableId"></nodeWrap>
					<div class="end-node">
						<div class="end-node-circle"></div>
						<div class="end-node-text">流程结束</div>
					</div>
				</div>
			</section>
		</div>
		<el-dialog title="提示" :visible.sync="tipVisible">
			<div class="ant-confirm-body">
				<i class="anticon anticon-close-circle" style="color: #f00;"></i>
				<span class="ant-confirm-title">当前无法发布</span>
				<div class="ant-confirm-content">
					<div>
						<p class="error-modal-desc">以下内容不完善，需进行修改</p>
						<div class="error-modal-list">
							<div class="error-modal-item" v-for="(item,index) in tipList" :key="index">
								<div class="error-modal-item-label">流程设计</div>
								<div class="error-modal-item-content">{{item.name}} 未选择{{item.type}}</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<span slot="footer" class="dialog-footer">
				<el-button @click="tipVisible = false">我知道了</el-button>
				<el-button type="primary" @click="tipVisible = false">前往修改</el-button>
			</span>
		</el-dialog>
	</div>
</template>
<script>
import mockData from './data.js';
import  _  from 'lodash';
import nodeWrap from '@/views/audit/auditWorkFlow/nodeWrap';

export default {
	components: {
		nodeWrap
	},
	data() {
		return {
			isTried: false,
			tipList: [],
			tipVisible: false,
			nowVal: 100,
			processConfig: {},
			nodeConfig: {},
			workFlowDef: {},
			flowPermission: [],
			directorMaxLevel: 0,
			dialogVisible: true,
			tableId: "",
			posList:[],
			departments:[],
			conditions:[],
		};
	},
	async created() {
		const row = await this.$store.dispatch("auditConfig/getConfigDetail", { type: this.$route.query.type, });
		console.log("row",row);
		this.processConfig=row||{};
		if(JSON.stringify(row.config)=='{}'){
					this.nodeConfig =_.cloneDeep(mockData);
		}else{
				this.nodeConfig =row.config;
			if(row.conditions){
				this.conditions = JSON.parse(row.conditions);
			}else{
				this.conditions = []
			}
	
	
		}
		this.posList = await this.$store.dispatch("role/list",{page:1,limit:1000});
		this.posList.map((item)=>{
				item.id=item._id;
				item.name = item.title;
		})
		const result =await this.$store.dispatch("department/getList",{page:1,limit:1000});
		console.log("result",result);
		const department = result.data;
		this.departments = department.map((item)=>{
				item.id=item.dep_id;
				item.departmentName=item.dep_name;
				item.name=item.dep_name;
				return item;
		});

	},
	methods: {
		toReturn() {
			this.$router.back();
		},
		reErr(data) {
			if (data.childNode) {
				if (data.childNode.type == 1) {//审批人
					if (data.childNode.error) {
						this.tipList.push({ name: data.childNode.nodeName, type: "审核人" })
					}
					this.reErr(data.childNode)
				} else if (data.childNode.type == 2) {
					if (data.childNode.error) {
						this.tipList.push({ name: data.childNode.nodeName, type: "抄送人" })
					}
					this.reErr(data.childNode)
				} else if (data.childNode.type == 3) {
					this.reErr(data.childNode.childNode)
				} else if (data.childNode.type == 4) {
					this.reErr(data.childNode)
					for (var i = 0; i < data.childNode.conditionNodes.length; i++) {
						if (data.childNode.conditionNodes[i].error) {
							this.tipList.push({ name: data.childNode.conditionNodes[i].nodeName, type: "条件" })
						}
						this.reErr(data.childNode.conditionNodes[i])
					}
				}
			} else {
				data.childNode = null
			}
		},
		saveSet() {
			this.isTried = true;
			this.tipList = [];
			this.reErr(this.nodeConfig);
			if (this.tipList.length != 0) {
				this.tipVisible = true;
				return;
			}
			this.processConfig.config=this.nodeConfig;
			this.HttpUtil.post('/API/admin/audit/updateApproveConfig', this.processConfig).then(res => {
				console.log('0---->>',res);
				if(res.error==0) this.$message.success(res.message);
				if(res.error == 401) this.$message.error(res.message);
      }).catch(error => {
				console.log('error--->>',error)
      })
		},
		zoomSize(type) {
			if (type == 1) {
				if (this.nowVal == 50) {
					return;
				}
				this.nowVal -= 10;
			} else {
				if (this.nowVal == 300) {
					return;
				}
				this.nowVal += 10;
			}
		}
	}
};
</script>
<style>
@import "./index.css";
.error-modal-list {
	width: 455px;
}
</style>