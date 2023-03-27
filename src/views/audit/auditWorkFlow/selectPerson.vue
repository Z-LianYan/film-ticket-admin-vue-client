<template>
     <el-dialog 
        :modal="false"
        :append-to-body="true"	
        style="z-index:9999"
        title="选择成员" :visible.sync="isVisible" width="600px" 
                class="promoter_person">
                    <div class="person_body clear">
                        <div class="person_tree l">
                            <div>
                                  <el-input type="text" placeholder="搜索成员" v-model="promoterSearchName" @input="getDebounceData($event,promoterTabActive)">
                                  </el-input>
                                  <el-button type="primary" @click="getDebounceData($event,promoterTabActive)" size="mini">
                                      查询 
                                  </el-button>
                            </div>
                            
                             <el-tabs v-model="promoterTabActive" @tab-click="handleClick">
                                <el-tab-pane label="门店列表" name="1" v-if="isShowPosList"></el-tab-pane>
                                <el-tab-pane label="职位列表" name="2"  v-if="isShowDepartments"></el-tab-pane>
                                <el-tab-pane label="员工列表" name="3"></el-tab-pane>
                            </el-tabs>
                            <p class="ellipsis tree_nav" v-if="!promoterSearchName">
                                <!-- <span @click="getDepartmentList(0)" class="ellipsis"></span> -->
                                <!-- <span v-for="(item,index) in departments.titleDepartments" class="ellipsis" 
                                :key="index+'a'" @click="getDepartmentList(item.id)">{{item.name}}</span>    -->
                            </p>
                            <ul v-if="promoterTabActive==1">
                                <li 
                                
                                v-for="(item,index) in filterDepartments" :key="promoterTabActive+index+'a'" class="check_box">
                                    <a :class="toggleClass(checkedDepartmentList,item)&&'active'" @click="toChecked(checkedDepartmentList,item)">
                                        <img src="@/views/audit/auditWorkFlow/assets/images/icon_file.png">{{item.name}}</a>
                                    <!-- <i @click="getDepartmentList(item.id)">下级</i> -->
                                </li>
                                <!-- <li v-for="(item,index) in departments.employees" :key="index+'c'" class="check_box">
                                    <a :class="toggleClass(checkedEmployessList,item)&&'active'" @click="toChecked(checkedEmployessList,item)" :title="item.names">
                                        <img src="@/views/audit/auditWorkFlow/assets/images/icon_people.png">{{item.employeeName}}</a>
                                </li> -->
                            </ul>
                            <ul  v-if="promoterTabActive==2">    
                                 <li 
                                    v-for="(item,index) in filterPosList" :key="promoterTabActive+index+'b'" class="check_box">
                                    <a :class="toggleClass(checkedPosList,item)&&'active'" @click="toChecked(checkedPosList,item)">
                                        <img src="@/views/audit/auditWorkFlow/assets/images/icon_role.png">{{item.name}}</a>
                                    <!-- <i @click="getDepartmentList(item.id)">下级</i> -->
                                </li>
                            </ul>
                            <ul  v-if="promoterTabActive==3">    
                                 <li 
                                    v-for="(item,index) in filterEmployeeList" :key="promoterTabActive+index+'c'" class="check_box">
                                    <a :class="toggleClass(checkedEmployessList,item)&&'active'" @click="toChecked(checkedEmployessList,item ,'id')">
                                        <img :src="item.thumb_avatar">{{item.name}}</a>
                                    <!-- <i @click="getDepartmentList(item.id)">下级</i> -->
                                </li>
                            </ul>
                        </div>
                        <div class="has_selected l">
                            <p class="clear">已选（{{checkedDepartmentList.length+checkedEmployessList.length+checkedPosList.length}}）
                                <a @click="checkedDepartmentList=[];checkedEmployessList=[];checkedPosList=[]">清空</a>
                            </p>
                            <ul>
                                <li v-for="(item,index) in checkedDepartmentList" :key="promoterTabActive+index+'d'">
                                    <img src="@/views/audit/auditWorkFlow/assets/images/icon_file.png">
                                    <span>{{item.name}}</span>
                                    <img src="@/views/audit/auditWorkFlow/assets/images/cancel.png" @click="removeEle(checkedDepartmentList,item)">
                                </li>
                                <li v-for="(item,index) in checkedEmployessList" :key="promoterTabActive+index+'a'">
                                    <img :src="item.thumb_avatar">
                                    <span>{{item.name}}</span>
                                    <img src="@/views/audit/auditWorkFlow/assets/images/cancel.png" @click="removeEle(checkedEmployessList,item)">
                                </li>
                                <li v-for="(item,index) in checkedPosList" :key="promoterTabActive+index+'e'">
                                    <img src="@/views/audit/auditWorkFlow/assets/images/icon_role.png">
                                    <span>{{item.name}}</span>
                                    <img src="@/views/audit/auditWorkFlow/assets/images/cancel.png" @click="removeEle(checkedPosList,item)">
                                </li>

                            </ul>
                        </div>
                    </div>
                    <span slot="footer" class="dialog-footer">
                        <el-button @click="close">取 消</el-button>
                        <el-button type="primary" @click="surePromoter">确 定</el-button>
                    </span>
                </el-dialog>
</template>


<script>
import _  from 'lodash';
export default {
    // props:["posList","departments","employeeList"],
    props:{
        posList:{
            type:Array,
            default:()=>{
                return [];
            }
        },
        departments:{
            type:Array,
            default:()=>{
                return [];
            }
        },
        employeeList:{
            type:Array,
            default:()=>{
                return [];
            }
        },
        isShowPosList:{
            type:Boolean,
            default:true
        },
        isShowDepartments:{
            type:Boolean,
            default:true
        },
        tabActive:{
            type: String,
            default:'1'
        },
        max:{
            type: Number,
            default:0
        }
        
    },
    data(){
        return{
            isVisible:false,
            activeName:1,
            checkedDepartmentList:[],
            checkedEmployessList:[],
            checkedPosList:[],
            filterDepartments:[],
            filterEmployeeList:[],
            filterPosList:[],
            promoterTabActive:"1",
            promoterSearchName:"",

        }
    },
    mounted(){
        // this.filterDepartmentList=_.cloneDeep(this.departments);
        // this.filterEmployeeList=_.cloneDeep(this.employeeList);
        // this.filterPosList=_.cloneDeep(this.posList);  
    },
    watch:{
        posList(val){
            this.filterPosList=val;
        },
        departments(val){
            this.filterDepartments=val
        },
        tabActive:{
            handler(val){
                if(val){
                    this.promoterTabActive=val,
                    this.handleClick();
                }
                
            },
            deep: true,
			immediate: true,
        }
    },
    methods:{
        open(nodeUserList=[],callback){
            console.log("nodeUserList",nodeUserList);
            this.checkedEmployessList=[]
            this.checkedDepartmentList=[];
            this.checkedPosList=[];
            for(var i=0;i<nodeUserList.length;i++){
                if(nodeUserList[i].type==1){
                    this.checkedEmployessList.push(nodeUserList[i]);    
                }else if(nodeUserList[i].type==2){
                    this.checkedPosList.push(nodeUserList[i]);
                }else{
                    this.checkedDepartmentList.push(nodeUserList[i]);
                }
            }
            this.callback=callback;
            this.isVisible=true;
        },
        close(){
            this.isVisible=false;
        },
        surePromoter(){
            //提交
            // nodeUserList ，  type=1 就是员工， type=2 就是职位。  type=3 门店
            var nodeUserList=[];
            for(var i=0;i<this.checkedDepartmentList.length;i++){
                nodeUserList.push({
                    "targetId": this.checkedDepartmentList[i].id,
                    "id": this.checkedDepartmentList[i].id,
                    "type": 3,
                    "name": this.checkedDepartmentList[i].name
                })
            }
            for(var i=0;i<this.checkedEmployessList.length;i++){
                nodeUserList.push({
                    "targetId": this.checkedEmployessList[i].id,
                    "id": this.checkedEmployessList[i].id,
                    "type": 1,
                    "userid":this.checkedEmployessList[i].userid,
                    "name": this.checkedEmployessList[i].name,
                    // "thumb_avatar": this.checkedEmployessList[i].name
                })
            }
            for(var i=0;i<this.checkedPosList.length;i++){
                nodeUserList.push({
                    "targetId": this.checkedPosList[i].id,
                    "id": this.checkedPosList[i].id,
                    "type": 2,
                    "name": this.checkedPosList[i].name
                })
            }
            // console.log("nodeUserList",nodeUserList);
            this.callback(nodeUserList);
            this.nodeUserList=nodeUserList
            this.close();
        },
        handleClick() {
            this.copyerSearchName = "";
            this.conditionRoleSearchName = "";
            // if (this.activeName == 1) {
            //     this.getDepartmentList();
            // } else {
            //     this.getRoleList();
            // }
           if(this.promoterSearchName){
               this.getDebounceData(null,this.promoterTabActive);
           }else{
               if(!this.isGetEmp  && this.promoterTabActive==3){
                    this.getDebounceData(null,this.promoterTabActive);
               }
           }
           
        },
        getRoleList(){

        },
        async getDepartmentList(parentId = 0) {
            // this.$axios.get(``).then(res => {
            //     this.departments = res.data;
            // })
            // this.isGetStore=true;
            // var res = await this.HttpUtil.post("/API/v2/private/qiyewxEmployee/getList",{
            //         page:1,
            //         limit:20,
            //         keywords:this.promoterSearchName,
            //         order: { id: "desc" },
            //     });
            // // console.log("rows",rows);
            // this.employeeList=res.data.rows.map((item)=>{

            //     return item;
            // })

        },
        async getEmployeeList(){
            this.isGetEmp=true;
            const res = await this.$store.dispatch('manager/list',{
                page:1,
                limit:20,
                keywords:this.promoterSearchName,
                order: { id: "desc" },
                loadingTxt:'加载中...'
            })
            console.log("rows--getEmployeeList",res);
            this.filterEmployeeList=res.data.map((item)=>{
                item.id=item._id;
                item.name=item.username;
                return item;
            })

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
        
        toggleClass(arr, elem, key = 'id') {
            return arr.some(item => { return item[key] == elem[key] });
        },
        toChecked(arr, elem, key = 'id') {
            var isIncludes = this.toggleClass(arr, elem, key);
            if(this.max && arr.length>=this.max) {
                if(isIncludes){
                    this.removeEle(arr, elem, key)
                }else{
                    arr.splice(0, 1);
                    arr.push(elem)
                }
                return;
            }; 
            
            !isIncludes ? arr.push(elem) : this.removeEle(arr, elem, key);
        },
         getDebounceData(event, type = 1) {
            this.$func.debounce( async function (){
                console.log("this.departments",this.departments);
                if(type==1){
                    this.filterDepartments= this.departments.filter((item)=>{
                        return item.name.match(this.promoterSearchName);
                    })
                }else if(type==2){ //职位
                    this.filterPosList= this.posList.filter((item)=>{
                        return item.name.match(this.promoterSearchName);
                    })
                }else{
                    // this.filterEmployeeList= this.employeeList.filter((item)=>{
                    //         return item.title.match(this.promoterSearchName);
                    //     })
                    this.getEmployeeList();
                }
                // console.log("event.target.value",event.target.value);
                // if (event.target.value) {
                //     if (type == 3) {
                        
                //         // this.departments.childDepartments = [];
                //         // this.$axios.get().then(res => {
                //         //     this.departments.employees = res.data.list
                //         // })
                        
                            
                //     }
                //     //  else {
                //     //     this.$axios.get(`${process.env.BASE_URL}roles.json?searchName=${event.target.value}&pageNum=1&pageSize=30`).then(res => {
                //     //         this.roles = res.data.list
                //     //     })
                //     // }
                // } else {
                //     // type == 1 ? this.getDepartmentList() : this.getRoleList();
                // }
            }.bind(this))()
        },
    }
};
</script>


<style scoped>

.promoter_person .el-dialog__body {
    padding: 10px 20px 14px 20px;
}

.person_body {
    border: 1px solid #f5f5f5;
    height: 500px;
    display: flex;

}
.person_tree {
    padding: 10px 12px 0 8px;
    width: 280px;
    height: 100%;
    border-right: 1px solid #f5f5f5;
}
.person_tree input {
    padding-left: 22px;
    width: 210px;
    height: 30px;
    font-size: 12px;
    border-radius: 2px;
    border: 1px solid #d5dadf;
    background: url(~@/views/audit/auditWorkFlow/assets/images/list_search.png) no-repeat 10px center;
    background-size: 14px 14px;
    margin-bottom: 14px;
}
.tree_nav span {
    display: inline-block;
    padding-right: 10px;
    margin-right: 5px;
    max-width: 6em;
    color: #38adff;
    font-size: 12px;
    cursor: pointer;
    background: url(~@/views/audit/auditWorkFlow/assets/images/jiaojiao.png) no-repeat right center;
}
.tree_nav span:last-of-type {
    background: none;
}
.person_tree ul,
.has_selected ul {
    height: 420px;
    overflow-y: auto;
}
.person_tree li {
    padding: 5px 0;
}
.person_tree li i {
    float: right;
    padding-left: 24px;
    padding-right: 10px;
    color: #3195f8;
    font-size: 12px;
    cursor: pointer;
    background: url(~@/views/audit/auditWorkFlow/assets/images/next_level_active.png) no-repeat 10px
        center;
    border-left: 1px solid rgb(238, 238, 238);
}
.person_tree li a.active + i {
    color: rgb(197, 197, 197);
    background-image: url(~@/views/audit/auditWorkFlow/assets/images/next_level.png);
    pointer-events: none;
}
.person_tree img {
    width: 14px;
    vertical-align: middle;
    margin-right: 5px;
}
.has_selected {
    width: 276px;
    height: 100%;
    font-size: 12px;
}
.has_selected ul {
    height: 460px;
}
.has_selected p {
    padding-left: 19px;
    padding-right: 20px;
    line-height: 37px;
    border-bottom: 1px solid #f2f2f2;
}
.has_selected p a {
    float: right;
}
.has_selected ul li {
    margin: 11px 26px 13px 19px;
    line-height: 17px;
}
.has_selected li span {
    vertical-align: middle;
}
.has_selected li img:first-of-type {
    width: 14px;
    vertical-align: middle;
    margin-right: 5px;
}
.has_selected li img:last-of-type {
    float: right;
    margin-top: 2px;
    width: 14px;
}



.radio_box a,
.check_box a {
    font-size: 12px;
    position: relative;
    padding-left: 20px;
    margin-right: 30px;
    cursor: pointer;
    color: #333;
    white-space: pre;
}
.check_box.not a:hover {
    color: #333;
}
.check_box.not a::before,
.check_box.not a:hover::before {
    border: none;
}
.check_box.not.active {
    background: #f3f3f3;
}
.radio_box a:hover::before,
.check_box a:hover::before {
    border: 1px solid #46a6fe;
}
.radio_box a::before,
.check_box a::before {
    position: absolute;
    width: 14px;
    height: 14px;
    border: 1px solid #dcdfe6;
    border-radius: 2px;
    left: 0;
    top: 1px;
    content: "";
}
.radio_box a::before {
    border-radius: 50%;
}
.check-dot.active::after,
.radio_box a.active::after,
.check_box a.active::after {
    position: absolute;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    top: 3px;
    left: 3px;
    content: "";
}
.radio_box a.active::after {
    background: #46a6fe;
}
.check_box a.active::after {
    background: url(~@/views/audit/auditWorkFlow/assets/images/check_box.png) no-repeat center;
}

</style>
