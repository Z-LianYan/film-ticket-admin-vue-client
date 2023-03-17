<template>
    <div>
        <div class="node-wrap" v-if="nodeConfig.type!=4">
            <div class="node-wrap-box" :class="(nodeConfig.type==0?'start-node ':'')+(isTried&&nodeConfig.error?'active error':'')">
                <div>
                    <div class="title" :style="'background: rgb('+ ['87, 106, 149','255, 148, 62','50, 150, 250'][nodeConfig.type] +');'">
                        <span class="iconfont" v-show="nodeConfig.type==1"></span>
                        <span class="iconfont" v-show="nodeConfig.type==2"></span>
                        <span v-if="nodeConfig.type==0">{{nodeConfig.nodeName}}</span>
                        <input type="text" class="ant-input editable-title-input" v-if="nodeConfig.type!=0&&isInput"
                        @blur="blurEvent()" @focus="$event.currentTarget.select()" v-focus
                        v-model="nodeConfig.nodeName" :placeholder="placeholderList[nodeConfig.type]">
                        <span class="editable-title" @click="clickEvent()" v-if="nodeConfig.type!=0&&!isInput">{{nodeConfig.nodeName}}</span>
                        <i class="anticon anticon-close close" v-if="nodeConfig.type!=0" @click="delNode()"></i>
                    </div>
                    <div class="content" @click="setPerson">
                        <div class="text" v-if="nodeConfig.type==0">{{arrToStr(nodeConfig.nodeUserList)?arrToStr(nodeConfig.nodeUserList):'所有人'}}</div>
                        <div class="text" v-if="nodeConfig.type==1">
                            <span class="placeholder" v-if="!setApproverStr(nodeConfig)">请选择{{placeholderList[nodeConfig.type]}}</span>
                            {{setApproverStr(nodeConfig)}}
                        </div>
                        <div class="text" v-if="nodeConfig.type==2">
                            <span class="placeholder" v-if="!copyerStr(nodeConfig)">请选择{{placeholderList[nodeConfig.type]}}</span>
                            {{copyerStr(nodeConfig)}}
                        </div>
                        <i class="anticon anticon-right arrow"></i>
                    </div>
                    <div class="error_tip" v-if="isTried&&nodeConfig.error">
                        <i class="anticon anticon-exclamation-circle" style="color: rgb(242, 86, 67);"></i>
                    </div>
                </div>
            </div>
            <addNode :childNodeP.sync="nodeConfig.childNode"></addNode>
        </div>
        <div class="branch-wrap" v-if="nodeConfig.type==4">
            <div class="branch-box-wrap">
                <div class="branch-box">
                    <button class="add-branch" @click="addTerm">添加条件</button>
                    <div class="col-box" v-for="(item,index) in nodeConfig.conditionNodes" :key="index">
                        <div class="condition-node">
                            <div class="condition-node-box">
                                <div class="auto-judge" :class="isTried&&item.error?'error active':''">
                                    <div class="sort-left" v-if="index!=0" @click="arrTransfer(index,-1)">&lt;</div>
                                    <div class="title-wrapper">
                                        <input type="text" class="ant-input editable-title-input" v-if="isInputList[index]"
                                        @blur="blurEvent(index)" @focus="$event.currentTarget.select()" v-focus v-model="item.nodeName">
                                        <span class="editable-title" @click="clickEvent(index)" v-if="!isInputList[index]">{{item.nodeName}}</span>
                                        <span class="priority-title" @click="setPerson(item.priorityLevel)">优先级{{item.priorityLevel}}</span>
                                        <i class="anticon anticon-close close" @click="delTerm(index)"></i>
                                    </div>
                                    <div class="sort-right" v-if="index!=nodeConfig.conditionNodes.length-1"
                                        @click="arrTransfer(index)">&gt;</div>
                                    <div class="content" @click="setPerson(item.priorityLevel)">{{conditionStr(item,index)}}</div>
                                    <div class="error_tip" v-if="isTried&&item.error">
                                        <i class="anticon anticon-exclamation-circle" style="color: rgb(242, 86, 67);"></i>
                                    </div>
                                </div>
                                <addNode :childNodeP.sync="item.childNode"></addNode>
                            </div>
                        </div>
                        <nodeWrap 
                         :conditions="conditions"
                        :data_posList="data_posList"
                        :data_departments="data_departments"
                        v-if="item.childNode && item.childNode" 
                        :nodeConfig.sync="item.childNode" :tableId="tableId"
                        :isTried.sync="isTried" :directorMaxLevel="directorMaxLevel"></nodeWrap>
                        <div class="top-left-cover-line" v-if="index==0"></div>
                        <div class="bottom-left-cover-line" v-if="index==0"></div>
                        <div class="top-right-cover-line" v-if="index==nodeConfig.conditionNodes.length-1"></div>
                        <div class="bottom-right-cover-line" v-if="index==nodeConfig.conditionNodes.length-1"></div>
                    </div>
                </div>
                <addNode :childNodeP.sync="nodeConfig.childNode"></addNode>
            </div>
        </div>
        <el-drawer :append-to-body="true" 
        :modal="false"
        title="申请人" :visible.sync="promoterDrawer" direction="rtl" class="set_promoter" 
        size="600px" :before-close="savePromoter"> 
            <div class="demo-drawer__content">
                <div class="promoter_content drawer_content">
                    <!-- <p>{{arrToStr(promoterList)?arrToStr(promoterList):'所有人'}}</p> -->
                    <selectTagList :userList.sync="promoterList" />
                    
                    <el-button type="primary" @click="addPromoter">添加/修改申请人</el-button>
                </div>
                <div class="demo-drawer__footer clear">
                    <el-button type="primary" @click="savePromoter">确 定</el-button>
                    <el-button @click="promoterDrawer = false">取 消</el-button>
                </div>
                
            </div>
        </el-drawer>

        <el-drawer :append-to-body="true"
        :modal="false"
         title="审核人设置" :visible.sync="approverDrawer" direction="rtl" class="set_promoter" size="550px" :before-close="saveApprover"> 
            <div class="demo-drawer__content">
                <div class="drawer_content">
                    <div class="approver_content">
                        <el-radio-group v-model="approverConfig.settype" class="clear" @change="changeType">
                            <el-radio :label="1">指定成员</el-radio>
                            <el-radio :label="2">指定上级</el-radio>
                            <!-- <el-radio :label="2">上级</el-radio>
                            <el-radio :label="4">申请人自选</el-radio>
                            <el-radio :label="5">申请人自己</el-radio>
                            <el-radio :label="7">连续多级上级</el-radio> -->
                        </el-radio-group>
                        <div class="approver_manager" v-if="approverConfig.settype==2">
                            <p>
                                <span>发起人的：</span>
                                <el-select v-model="approverConfig.directorLevel">
                                    <el-option v-for="item in 4" 
                                    :label="(item==1?'直接':'第'+item+'级')+'上级'"
                                    :value="item" 
                                    :key="item"/>
                                </el-select>
                            </p>
                            <p class="tip">由下至上查找</p>
                            <p>
                                <span>找不到上级时：</span>
                                 <el-select v-model="approverConfig.not_found_handle" class="clear">
                                    <el-option label="由上级上级代审批" :value="1" />
                                    <el-option label="跳转下一个节点" :value="2" />                                   
                                </el-select>

                            </p>
                          
                        </div>
                        
                        <div v-if="approverConfig.settype==1">    
                             <select-tag-list :userList.sync="approverConfig.nodeUserList"  />
                        </div>
                       
                        
                       <div v-if="approverConfig.settype==1">
                             <el-button type="primary" @click="addApprover" v-if="approverConfig.settype==1">添加/修改成员</el-button>
                       </div>
                    </div>
                    <div class="approver_some">
                        <p>审批人为空/异常时</p>
                        <el-radio-group v-model="approverConfig.noHanderAction" class="clear">
                            <!-- <el-radio :label="1">自动审批通过/不允许发起</el-radio>
                            <br/> -->
                            <el-radio :label="2">转交给指定管理员</el-radio>
                        </el-radio-group>

                        <div >   
                             <select-tag-list v-if="approverConfig.abnormalUserList" :userList.sync="approverConfig.abnormalUserList" />
                        </div>
                       
                        
                       <div>
                             <el-button type="primary" @click="addApproverAbnormal" >添加/修改成员</el-button>
                       </div>

                    </div>
                </div>
                <div class="demo-drawer__footer clear" style="margin-top:50px;">
                    <el-button type="primary" @click="saveApprover">确 定</el-button>
                    <el-button @click="approverDrawer = false">取 消</el-button>
                </div>
                
            </div>
        </el-drawer>
        <el-drawer :append-to-body="true" title="抄送人设置" :visible.sync="copyerDrawer" direction="rtl" class="set_copyer" size="550px" :before-close="saveCopyer"> 
            <div class="demo-drawer__content">
                <div class="copyer_content drawer_content">
                    <el-button type="primary" @click="addCopyer">添加成员</el-button>
                    <!-- <p class="selected_list">
                        <span v-for="(item,index) in copyerConfig.nodeUserList" :key="index">{{item.name}}
                            <img src="@/views/audit/auditWorkFlow/assets/images/add-close1.png" @click="removeEle(copyerConfig.nodeUserList,item,'targetId')">
                        </span>
                        <a v-if="copyerConfig.nodeUserList&&copyerConfig.nodeUserList.length!=0" @click="copyerConfig.nodeUserList=[]">清除</a>
                    </p> -->
                    <selectTagList :userList.sync="copyerConfig.nodeUserList" />
                    <!-- <el-checkbox-group v-model="ccSelfSelectFlag" class="clear">
                        <el-checkbox :label="1">允许申请人自选抄送人</el-checkbox>
                    </el-checkbox-group> -->
                </div>
                <div class="demo-drawer__footer clear">
                    <el-button type="primary" @click="saveCopyer">确 定</el-button>
                    <el-button @click="copyerDrawer = false">取 消</el-button>
                </div>
                
            </div>
        </el-drawer>


        
        <el-drawer :append-to-body="true" title="条件设置" :visible.sync="conditionDrawer" direction="rtl" class="condition_copyer" size="550px" :before-close="saveCondition"> 
            <select v-model="conditionConfig.priorityLevel" class="priority_level">
                <option v-for="item in conditionsConfig.conditionNodes.length" :value="item" :key="item">优先级{{item}}</option>
            </select>
            <div class="demo-drawer__content">
                <el-form ref="form"  label-width="80px" class="condition_content drawer_content">
                 <p class="tip">当审批单同时满足以下条件时进入此流程</p>
                    <el-form-item label="申请人：">
                             <selectTagList :userList.sync="conditionConfig.nodeUserList" />
                             <el-button type="primary" @click="addConditionRole">添加成员</el-button>
                        </el-form-item>
                       <el-form-item 
                       v-for="(item,index) in conditionConfig.conditionList" :key="index"
                       :label="item.name">
                            <div v-if="item.formType == 'checkbox'">
                              <el-checkbox-group v-model="item.value">
                                <el-checkbox v-for="item2 in  conditionsKeyMap[item.key].option" :label="item2.value" :key="item2.value">{{item2.label}}</el-checkbox>
                            </el-checkbox-group>
                            
                            </div>
                            <div v-if="item.formType=='input'">
                                <el-select 
                                style="width:80px;"
                                @change="changeOpTypeHandler(item)"
                                v-model="item.opType" placeholder="请选择">
                                    <el-option label="小于" value="lt"/>
                                    <el-option label="大于" value="gt"/>
                                    <el-option label="小于等于" value="lte"/>
                                    <el-option label="等于" value="eq"/>
                                    <el-option label="大于等于" value="gte"/>
                                    <el-option label="不等于" value="ne"/>
                                    <el-option label="范围" value="between"/>
                                </el-select>

                                <el-input
                                style="width:100px;"
                                 v-if="item.opType!='between'" type="text" :placeholder="'请输入'+item.name"  v-model="item.value">
                                </el-input>
                                <p v-if="item.opType=='between'">
                                    <span>大于等于</span>
                                    <el-input 
                                    placeholder=""
                                    type="text" style="width:100px;" class="mr_10"  v-model="item.value[0]">
                                    </el-input>
                                    <!-- <el-select style="width:60px;" v-model="item.opt1">
                                        <el-option value="<">></el-option>
                                        <el-option value="≤">>=</el-option>
                                    </el-select> -->
                                    <span class="ellipsis" style="display:inline-block;width:60px;vertical-align: text-bottom;"></span>
                                    <!-- <el-select style="width:60px;" class="ml_10" v-model="item.opt2">
                                        <el-option value="<">&lt;</el-option>
                                        <el-option value="≤">&lt;=</el-option>
                                    </el-select> -->
                                    <span>小于等于</span>
                                    <el-input 
                                    placeholder=""
                                    type="text" style="width:100px;"  v-model="item.value[1]">
                                    </el-input>
                                </p>
                            </div>
                       </el-form-item> 
                       <el-button type="primary" @click="addCondition">添加/修改条件</el-button>
                </el-form>

                    <el-dialog title="选择条件" 
                    :modal="false"
                    :visible.sync="conditionVisible" width="480px" append-to-body class="condition_list">
                        <p>请选择用来区分审批流程的条件字段</p>
                        <!--<p class="check_box">
                            <a v-for="(item,index) in conditions" :key="index" :class="toggleClass(conditionList,item,'value')&&'active'" 
                            @click="toChecked(conditionList,item,'value')">{{item.name}}</a>
                        </p>-->
                        
                         <el-checkbox-group v-model="conditionList">
                            <el-checkbox v-for="item2 in  conditions" :label="item2.key" :key="item2.key">{{item2.name}}</el-checkbox>
                        </el-checkbox-group>
                        

                        <span slot="footer" class="dialog-footer">
                            <el-button @click="conditionVisible = false">取 消</el-button>
                            <el-button type="primary" @click="sureCondition">确 定</el-button>
                        </span>
                    </el-dialog>
                <div class="demo-drawer__footer clear">
                    <el-button type="primary" @click="saveCondition">确 定</el-button>
                    <el-button @click="conditionDrawer = false">取 消</el-button>
                </div>
            </div>
        </el-drawer>
        <nodeWrap 
        :data_posList="data_posList"
        :data_departments="data_departments"
        :conditions="conditions"
        v-if="nodeConfig.childNode && nodeConfig.childNode" :nodeConfig.sync="nodeConfig.childNode" :tableId="tableId"
        :isTried.sync="isTried" :directorMaxLevel="directorMaxLevel"></nodeWrap>
        <selectPerson 
        :employeeList="employeeList"
         :posList="data_posList"
          :departments="data_departments"
        ref="promoter_select" />
         <selectPerson 
        :employeeList="employeeList"
         :posList="data_posList"
          :departments="data_departments"
        ref="copyer_select" />
          <selectPerson 
            :employeeList="employeeList"
         :posList="data_posList"
          :departments="data_departments"
        ref="approver_select" />

          <selectPerson 
        :employeeList="employeeList"
         :posList="data_posList"
          :departments="data_departments"
        ref="approver_abnormal_select" />

        <selectPerson 
        :employeeList="employeeList"
         :posList="data_posList"
          :departments="data_departments"
        ref="condition_emp_select" />

    </div>
</template>
<script>
import selectPerson from './selectPerson';
import SelectTagList from './selectTagList.vue';
import _ from "lodash"

export default {
    props: ["nodeConfig", "flowPermission", "directorMaxLevel", "isTried", "tableId","data_posList","data_departments","conditions"],
    components:{
        selectPerson,
        SelectTagList
    },
    data() {
        return {
            promoterTabActive:"1",
            placeholderList: ["申请人", "审核人", "抄送人"],
            isInputList: [],
            isInput: false,
            promoterVisible: false,
            promoterDrawer: false,
            departments: [],
            checkedDepartmentList: [],
            checkedEmployessList: [],
            employeeList:[],
            posList:[],
            checkedPosList:[],

            promoterSearchName: "",
            flowPermission1: this.flowPermission,
            approverDrawer: false,
            approverVisible: false,
            approverRoleVisible: false,
            approverConfig: {},
            approverEmplyessList: [],
            approverSearchName: "",
            roles: [],
            roleList: [],
            approverRoleSearchName: "",
            copyerDrawer: false,
            copyerVisible: false,
            copyerConfig: {},
            copyerSearchName: "",
            activeName: "1",
            copyerEmployessList: [],
            copyerRoleList: [],
            ccSelfSelectFlag: [],
            conditionDrawer: false,
            conditionVisible: false,
            conditionConfig: {},
            conditionsConfig: {
                conditionNodes: [],
            },
            bPriorityLevel: "",
            // conditions: [],
            conditionList: [],
            conditionRoleVisible: false,
            conditionRoleSearchName: "",
            conditionDepartmentList: [],
            conditionEmployessList: [],
            conditionRoleList: [],

            promoterList:[], //申请人。
        }
    },
    async mounted() {
        if (this.nodeConfig.type == 1) {
            this.nodeConfig.error = !this.setApproverStr(this.nodeConfig)
        } else if (this.nodeConfig.type == 2) {
            this.nodeConfig.error = !this.copyerStr(this.nodeConfig)
        } else if (this.nodeConfig.type == 4) {
            for (var i = 0; i < this.nodeConfig.conditionNodes.length; i++) {
                this.nodeConfig.conditionNodes[i].error = this.conditionStr(this.nodeConfig.conditionNodes[i], i) == "请设置条件" && i != this.nodeConfig.conditionNodes.length - 1
            }
        }
        this.conditionsKeyMap={};
        this.conditions.map((item)=>{
            this.conditionsKeyMap[item.key]=item;
        });
        // this.$store.dispatch("")
        
    },
    watch:{
        data_posList(val){
            this.posList=val;
        },
        data_departments(val){
            this.departments=val
        }
    },
    methods: {
        changeOpTypeHandler(row){
            if(row.opType=='between'){
                // row.value
                this.$set(row,"value",[])
            }else{
                this.$set(row,"value","");
            }
        },
        clickEvent(index) {
            if (index || index === 0) {
                this.$set(this.isInputList, index, true)
            } else {
                this.isInput = true;
            }
        },
        blurEvent(index) {
            if (index || index === 0) {
                this.$set(this.isInputList, index, false)
                this.nodeConfig.conditionNodes[index].nodeName = this.nodeConfig.conditionNodes[index].nodeName ? this.nodeConfig.conditionNodes[index].nodeName : "条件"
            } else {
                this.isInput = false;
                this.nodeConfig.nodeName = this.nodeConfig.nodeName ? this.nodeConfig.nodeName : this.placeholderList[this.nodeConfig.type]
            }
        },

        conditionStr(item, index) {
            console.log('conditionStr',item);
            var { conditionList, nodeUserList } = item;
            var str="";
            if (conditionList.length == 0 && nodeUserList.length==0) {
                if(this.nodeConfig.conditionNodes.length==item.priorityLevel){
                    return '其他条件进入此流程';
                }else{
                    return '请设置条件';
                }
                return (index == this.nodeConfig.conditionNodes.length - 1) && this.nodeConfig.conditionNodes[0].conditionList.length != 0 ? '其他条件进入此流程' : '请设置条件'
            } else {
                // if(nodeUserList.length==0 && )
                if(nodeUserList && nodeUserList.length){
                    str+='申请人包含：'+nodeUserList.map((item)=>item.name).join("、")+'\n';
                } 
                if(conditionList.length){
                    for(var i=0;i<conditionList.length;i++){
                        if(conditionList[i].formType=="checkbox"){
                            var vals=[];
                            for(var j=0;j<conditionList[i].option.length;j++){
                                if(conditionList[i].value.indexOf(conditionList[i].option[j].value)!==-1){
                                    vals.push(conditionList[i].option[j].label);
                                }
                            }
                            str+=conditionList[i].name+':'+vals.join('、');
                        }else{
                            str+=conditionList[i].name+':'+conditionList[i].value;
                        }
                        
                    }
                }
                return str;
                // let str = ""
                // for (var i = 0; i < conditionList.length; i++) {
                //     var { columnId, columnType, showType, showName, optType, zdy1, opt1, zdy2, opt2, fixedDownBoxValue } = conditionList[i];
                //     if (columnId == 0) {
                //         if (nodeUserList.length != 0) {
                //             str += '申请人属于：'
                //             str += nodeUserList.map(item => { return item.name }).join("或") + " 并且 "
                //         }
                //     }
                //     if (columnType == "String" && showType == "3") {
                //         if (zdy1) {
                //             str += showName + '属于：' + this.dealStr(zdy1, JSON.parse(fixedDownBoxValue)) + " 并且 "
                //         }
                //     }
                //     if (columnType == "Double") {
                //         if (optType != 6 && zdy1) {
                //             var optTypeStr = ["", "<", ">", "≤", "=", "≥"][optType]
                //             str += `${showName} ${optTypeStr} ${zdy1} 并且 `
                //         } else if (optType == 6 && zdy1 && zdy2) {
                //             str += `${zdy1} ${opt1} ${showName} ${opt2} ${zdy2} 并且 `
                //         }
                //     }
                // }
                // return str ? str.substring(0, str.length - 4) : '请设置条件'
            }
        },
        dealStr(str, obj) {
            let arr = [];
            let list = str.split(",");
            for (var elem in obj) {
                list.map(item => {
                    if (item == elem) {
                        arr.push(obj[elem].value)
                    }
                })
            }
            return arr.join("或")
        },
        //添加条件的申请人。
        addConditionRole() {
            this.$refs.condition_emp_select.open(this.conditionConfig.nodeUserList,(nodeUserList)=>{
                this.conditionConfig.nodeUserList=nodeUserList;
            })
        },
       
        addCondition() {
            this.conditionList = [];
          
            this.conditionConfig.conditionList.map((item)=>{
                this.conditionList.push(item.key)
            })
              this.conditionVisible = true;
            // this.conditions = res.data;
            // if (this.conditionConfig.conditionList) {
            //     for (var i = 0; i < this.conditionConfig.conditionList.length; i++) {
            //         var { value } = this.conditionConfig.conditionList[i]
            //         this.conditionList.push(this.conditions.filter(item => { return item.value == value; })[0])
                    
            //     }
            // }
            
            // this.$axios.get(`${process.env.BASE_URL}conditions.json?tableId=${this.tableId}`).then(res => {
                
            // })
        },
        changeOptType(item) {
            if (item.optType == 1) {
                item.zdy1 = 2;
            } else {
                item.zdy1 = 1;
                item.zdy2 = 2;
            }
        },
        sureCondition() {
            
            
            var arr=[]
            this.conditionList.map((key)=>{
               arr.push(this.conditionsKeyMap[key])
            });
            // this.conditionConfig.conditionList=arr;
            var result=[];
            arr.map((item,index)=>{
                this.conditionConfig.conditionList.map((item2)=>{
                    if(item && item.key==item2.key){
                        item={
                            ...item2
                        }
                        // result.push(item2);
                    }
                })
            });
            this.conditionConfig.conditionList=arr.filter((item)=>item);
            console.log("arr",arr,"=======",this.conditionList,'result',result);
            this.conditionVisible = false;
        },
        saveCondition() {

            this.conditionDrawer = false;
            var a = this.conditionsConfig.conditionNodes.splice(this.bPriorityLevel - 1, 1)//截取旧下标
            this.conditionsConfig.conditionNodes.splice(this.conditionConfig.priorityLevel - 1, 0, a[0])//填充新下标
            this.conditionsConfig.conditionNodes.map((item, index) => {
                item.priorityLevel = index + 1
            });
            for (var i = 0; i < this.conditionsConfig.conditionNodes.length; i++) {
                this.conditionsConfig.conditionNodes[i].error = this.conditionStr(this.conditionsConfig.conditionNodes[i], i) == "请设置条件" && i != this.conditionsConfig.conditionNodes.length - 1
            }
            console.log("nodeConfig",this.conditionsConfig);
            // alert("11");
            this.$emit("update:nodeConfig", this.conditionsConfig);
        },
        getDebounceData(event, type = 1) {
            this.$func.debounce( async function (){
                 var res = await this.HttpUtil.post("/API/v2/private/qiyewxEmployee/getList",{
                            page:1,
                            limit:20,
                            keywords:this.promoterSearchName,
                            is_bind_employee_id:1, //绑定员工id。
                            order: { id: "desc" },
                        });
                // console.log("rows",rows);
                this.employeeList=res.data.rows.map((item)=>{
                
                    return item;
                })
                
            }.bind(this))()
        },
        handleClick() {
            this.copyerSearchName = "";
            this.conditionRoleSearchName = "";
            if (this.activeName == 1) {
                this.getDepartmentList();
            } else {
                this.getRoleList();
            }
        },
        addCopyer() {
            this.$refs.copyer_select.open(this.copyerConfig.nodeUserList,(nodeUserList)=>{
                this.copyerConfig.nodeUserList=nodeUserList;
             
            });
        },
        sureCopyer() {
            this.copyerConfig.nodeUserList = [];
            this.copyerEmployessList.map(item => {
                this.copyerConfig.nodeUserList.push({
                    type: 1,
                    targetId: item.id,
                    name: item.employeeName
                })
            });
            this.copyerRoleList.map(item => {
                this.copyerConfig.nodeUserList.push({
                    type: 2,
                    targetId: item.roleId,
                    name: item.roleName
                })
            });
            this.copyerVisible = false;
        },
        saveCopyer() {
            this.copyerConfig.ccSelfSelectFlag = this.ccSelfSelectFlag.length == 0 ? 0 : 1;
            this.copyerConfig.error = !this.copyerStr(this.copyerConfig);
            this.$emit("update:nodeConfig", this.copyerConfig);
            this.copyerDrawer = false;
        },
        copyerStr(nodeConfig) {
            if (nodeConfig.nodeUserList.length != 0) {
                return this.arrToStr(nodeConfig.nodeUserList)
            } else {
                if (nodeConfig.ccSelfSelectFlag == 1) {
                    return "申请人自选"
                }
            }
        },
        changeRange() {
            this.approverConfig.nodeUserList = [];
        },
        changeType(val) {
            this.approverConfig.nodeUserList = [];
            this.approverConfig.examineMode = 1;
            this.approverConfig.noHanderAction = 2;
            if (val == 2) {
                this.approverConfig.directorLevel = 1;
            } else if (val == 4) {
                this.approverConfig.selectMode = 1;
                this.approverConfig.selectRange = 1;
            } else if (val == 7) {
                this.approverConfig.examineEndDirectorLevel = 1
            }
        },
        addApproverAbnormal(){
            this.$refs.approver_abnormal_select.open(this.approverConfig.abnormalUserList,(abnormalUserList)=>{
                this.approverConfig.abnormalUserList=abnormalUserList;
                
            });

        },
        addApprover() {
              this.$refs.approver_select.open(this.approverConfig.nodeUserList,(nodeUserList)=>{
                this.approverConfig.nodeUserList=nodeUserList;
             
            });
        },
        addRoleApprover() {
            this.approverRoleVisible = true;
            this.approverRoleSearchName = "";
            this.getRoleList();
            this.roleList = [];
            for (var i = 0; i < this.approverConfig.nodeUserList.length; i++) {
                var { name, targetId } = this.approverConfig.nodeUserList[i];
                this.roleList.push({
                    roleName: name,
                    roleId: targetId
                });
            }
        },
        setApproverStr(nodeConfig) {
            if (nodeConfig.settype == 1) {
                if (nodeConfig.nodeUserList.length == 1) {
                    return nodeConfig.nodeUserList[0].name
                } else if (nodeConfig.nodeUserList.length > 1) {
                    if (nodeConfig.examineMode == 1) {
                        return this.arrToStr(nodeConfig.nodeUserList)
                    } else if (nodeConfig.examineMode == 2) {
                        return nodeConfig.nodeUserList.length + "人会签"
                    }
                }
            } else if (nodeConfig.settype == 2) {
                let level = nodeConfig.directorLevel == 1 ? '直接上级' : '第' + nodeConfig.directorLevel + '级上级'
                if (nodeConfig.examineMode == 1) {
                    return level
                } else if (nodeConfig.examineMode == 2) {
                    return level + "会签"
                }
            } else if (nodeConfig.settype == 4) {
                if (nodeConfig.selectRange == 1) {
                    return "申请人自选"
                } else {
                    if (nodeConfig.nodeUserList.length > 0) {
                        if (nodeConfig.selectRange == 2) {
                            return "申请人自选"
                        } else {
                            return '申请人从' + nodeConfig.nodeUserList[0].name + '中自选'
                        }
                    } else {
                        return "";
                    }
                }
            } else if (nodeConfig.settype == 5) {
                return "申请人自己"
            } else if (nodeConfig.settype == 7) {
                return '从直接上级到通讯录中级别最高的第' + nodeConfig.examineEndDirectorLevel + '个层级上级'
            }
        },
        saveApprover() {
            this.approverConfig.error = !this.setApproverStr(this.approverConfig)
            this.$emit("update:nodeConfig", this.approverConfig);
            this.approverDrawer = false;
        },
        addPromoter() {
            this.$refs.promoter_select.open(this.promoterList,(nodeUserList)=>{
                this.promoterList=nodeUserList;
             
            });
            
        },
        surePromoter() {
            this.flowPermission1 = [];
            this.checkedDepartmentList.map(item => {
                this.flowPermission1.push({
                    type: 3,
                    targetId: item.id,
                    name: item.departmentName
                })
            });
            this.checkedEmployessList.map(item => {
                this.flowPermission1.push({
                    type: 1,
                    targetId: item.id,
                    name: item.employeeName
                })
            });
            this.promoterVisible = false;
        },
        savePromoter() {
            // this.$emit("update:flowPermission", this.flowPermission1);
            this.nodeConfig.nodeUserList=_.cloneDeep(this.promoterList)
            this.promoterDrawer = false;
        },
        arrToStr(arr) {
            if (arr) {
                return arr.map(item => { return item.name }).join("、")
            }
        },
        toggleStrClass(item, key) {
            let a = item.zdy1 ? item.zdy1.split(",") : []
            return a.some(item => { return item == key });
        },
        toStrChecked(item, val) {
            for(var i=0;i<item.opiton.length;i++){
                if(item.opiton[i].value==val){
                    return true;
                }
            }
            // let a = item.zdy1 ? item.zdy1.split(",") : []
            // var isIncludes = this.toggleStrClass(item, key);
            // if (!isIncludes) {
            //     a.push(key)
            //     item.zdy1 = a.toString()
            // } else {
            //     this.removeStrEle(item, key);
            // }
        },
        removeStrEle(item, key) {
            let a = item.zdy1 ? item.zdy1.split(",") : []
            var includesIndex;
            a.map((item, index) => {
                if (item == key) {
                    includesIndex = index
                }
            });
            a.splice(includesIndex, 1);
            item.zdy1 = a.toString()
        },
        toggleClass(arr, elem, key = 'id') {
            return arr.some(item => { return item[key] == elem[key] });
        },
        toChecked(arr, elem, key = 'id') {
            var isIncludes = this.toggleClass(arr, elem, key);
            !isIncludes ? arr.push(elem) : this.removeEle(arr, elem, key);
        },
        removeEle(arr, elem, key = 'id') {
            var includesIndex;
            arr.map((item, index) => {
                if (item[key] == elem[key]) {
                    includesIndex = index
                }
            });
            arr.splice(includesIndex, 1);
        },
        getRoleList() {
            this.$axios.get(`${process.env.BASE_URL}roles.json`).then(res => {
                this.roles = res.data.list;
            })
        },
        async getDepartmentList(parentId = 0) {
            // this.$axios.get(``).then(res => {
            //     this.departments = res.data;
            // })
            
        },
        delNode() {
            this.$emit("update:nodeConfig", this.nodeConfig.childNode);
        },
        addTerm() {
            let len = this.nodeConfig.conditionNodes.length + 1
            this.nodeConfig.conditionNodes.push({
                "nodeName": "条件" + len,
                "type": 3,
                "priorityLevel": len,
                "conditionList": [],
                "nodeUserList": [],
                "childNode": null
            });
            for (var i = 0; i < this.nodeConfig.conditionNodes.length; i++) {
                this.nodeConfig.conditionNodes[i].error = this.conditionStr(this.nodeConfig.conditionNodes[i], i) == "请设置条件" && i != this.nodeConfig.conditionNodes.length - 1
            }
            this.$emit("update:nodeConfig", this.nodeConfig);
        },
        delTerm(index) {
            this.nodeConfig.conditionNodes.splice(index, 1)
            for (var i = 0; i < this.nodeConfig.conditionNodes.length; i++) {
                this.nodeConfig.conditionNodes[i].error = this.conditionStr(this.nodeConfig.conditionNodes[i], i) == "请设置条件" && i != this.nodeConfig.conditionNodes.length - 1
            }
            this.$emit("update:nodeConfig", this.nodeConfig);
            if (this.nodeConfig.conditionNodes.length == 1) {
                if (this.nodeConfig.childNode) {
                    if (this.nodeConfig.conditionNodes[0].childNode) {
                        this.reData(this.nodeConfig.conditionNodes[0].childNode, this.nodeConfig.childNode)
                    } else {
                        this.nodeConfig.conditionNodes[0].childNode = this.nodeConfig.childNode
                    }
                }
                this.$emit("update:nodeConfig", this.nodeConfig.conditionNodes[0].childNode);
            }
        },
        reData(data, addData) {
            if (!data.childNode) {
                data.childNode = addData
            } else {
                this.reData(data.childNode, addData)
            }
        },
        setPerson(priorityLevel) {
            var { type } = this.nodeConfig;
            if (type == 0) {
                this.promoterDrawer = true;
                this.promoterList = this.nodeConfig.nodeUserList;
            } else if (type == 1) {
                this.approverDrawer = true;
                this.approverConfig = JSON.parse(JSON.stringify(this.nodeConfig))
                this.approverConfig.settype = this.approverConfig.settype ? this.approverConfig.settype : 1
            } else if (type == 2) {
                this.copyerDrawer = true;
                this.copyerConfig = JSON.parse(JSON.stringify(this.nodeConfig))
                this.ccSelfSelectFlag = this.copyerConfig.ccSelfSelectFlag == 0 ? [] : [this.copyerConfig.ccSelfSelectFlag]
                //打开选择人
            } else {
                console.log('priorityLevel',priorityLevel,this.nodeConfig.conditionNodes);
                if(priorityLevel== this.nodeConfig.conditionNodes.length){
                    return null;
                }
                this.conditionDrawer = true
                this.bPriorityLevel = priorityLevel;
                this.conditionsConfig = JSON.parse(JSON.stringify(this.nodeConfig))
                this.conditionConfig = this.conditionsConfig.conditionNodes[priorityLevel - 1]
            }
        },
        arrTransfer(index, type = 1) {//向左-1,向右1
            this.nodeConfig.conditionNodes[index] = this.nodeConfig.conditionNodes.splice(index + type, 1, this.nodeConfig.conditionNodes[index])[0];
            this.nodeConfig.conditionNodes.map((item, index) => {
                item.priorityLevel = index + 1
            })
            for (var i = 0; i < this.nodeConfig.conditionNodes.length; i++) {
                this.nodeConfig.conditionNodes[i].error = this.conditionStr(this.nodeConfig.conditionNodes[i], i) == "请设置条件" && i != this.nodeConfig.conditionNodes.length - 1
            }
            this.$emit("update:nodeConfig", this.nodeConfig);
        }
    }
}
</script>
<style>
.error_tip {
    position: absolute;
    top: 0px;
    right: 0px;
    transform: translate(150%, 0px);
    font-size: 24px;
}
.add-node-popover-body {
    display: flex;
}
.promoter_content {
    padding: 0 20px;
}
.condition_content .el-button,
.copyer_content .el-button,
.approver_self_select .el-button,
.promoter_content .el-button,
.approver_content .el-button {
    margin-bottom: 20px;
}
.promoter_content p {
    padding: 18px 0;
    font-size: 14px;
    line-height: 20px;
    color: #000000;
}

el-radio-group {
    padding: 20px 0;
}
.approver_content {
    padding-bottom: 10px;
    border-bottom: 1px solid #f2f2f2;
}
.approver_content .el-radio,
.approver_some .el-radio,
.approver_self_select .el-radio {
    width: 27%;
    margin-bottom: 20px;
}
.copyer_content .el-checkbox {
    margin-bottom: 20px;
}
.el-checkbox__label {
    font-size: 12px;
}
.condition_content,
.copyer_content,
.approver_self_select,
.approver_manager,
.approver_content,
.approver_some {
    padding: 20px 20px 0;
}
.approver_manager p:first-of-type,
.approver_some p {
    line-height: 19px;
    font-size: 14px;
    margin-bottom: 14px;
}

.approver_manager p {
    line-height: 32px;
}
.approver_manager select {
    width: 420px;
    height: 32px;
    background: rgba(255, 255, 255, 1);
    border-radius: 4px;
    border: 1px solid rgba(217, 217, 217, 1);
}
.approver_manager p.tip {
    margin: 10px 0 22px 0;
    font-size: 12px;
    line-height: 16px;
    color: #f8642d;
}
.approver_self {
    padding: 28px 20px;
}
.approver_self_select h3 {
    margin: 5px 0 20px;
    font-size: 14px;
    font-weight: bold;
    line-height: 19px;
}
.condition_copyer .el-drawer__body .priority_level {
    position: absolute;
    top: 11px;
    right: 30px;
    width: 100px;
    height: 32px;
    background: rgba(255, 255, 255, 1);
    border-radius: 4px;
    border: 1px solid rgba(217, 217, 217, 1);
}
.condition_content p.tip {
    margin: 20px 0;
    width: 510px;
    text-indent: 17px;
    line-height: 45px;
    background: rgba(241, 249, 255, 1);
    border: 1px solid rgba(64, 163, 247, 1);
    color: #46a6fe;
    font-size: 14px;
}
.condition_content ul {
    max-height: 500px;
    overflow-y: scroll;
    margin-bottom: 20px;
}
.condition_content li > span {
    float: left;
    margin-right: 8px;
    width: 70px;
    line-height: 32px;
    text-align: right;
}
.condition_content li > div {
    display: inline-block;
    width: 370px;
}
.condition_content li:not(:last-child) > div > p {
    margin-bottom: 20px;
}
.condition_content li > div > p:not(:last-child) {
    margin-bottom: 10px;
}
.condition_content li > a {
    float: right;
    margin-right: 10px;
    margin-top: 7px;
}
.condition_content li select,
.condition_content li input {
    width: 100%;
    height: 32px;
    background: rgba(255, 255, 255, 1);
    border-radius: 4px;
    border: 1px solid rgba(217, 217, 217, 1);
}
.condition_content li select + input {
    width: 260px;
}
.condition_content li select {
    margin-right: 10px;
    width: 100px;
}
.condition_content li p.selected_list {
    padding-left: 10px;
    border-radius: 4px;
    min-height: 32px;
    border: 1px solid rgba(217, 217, 217, 1);
}
.condition_content li p.check_box {
    line-height: 32px;
}
.condition_list .el-dialog__body {
    padding: 16px 26px;
}
.condition_list p {
    color: #666666;
    margin-bottom: 10px;
}
.condition_list p.check_box {
    margin-bottom: 0;
    line-height: 36px;
}
</style>