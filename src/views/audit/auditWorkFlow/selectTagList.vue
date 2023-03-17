<template>
    <div>
        <p :class="userList.length > 0?'selected_list':''"  style="cursor:text">
        <span v-for="(item1,index1) in listData" :key="index1">
            <!-- <el-avatar size="small" v-type="item1.type==1" :src="item1.thumb_avatar"></el-avatar> -->
            <img
            v-if="item1.type==1" 
                src="@/views/audit/auditWorkFlow/assets/images/icon_people.png" style="width:17px;height:17px;" />
                <img
            v-if="item1.type==2" 
                src="@/views/audit/auditWorkFlow/assets/images/icon_role.png" style="width:17px;height:17px;" />
                <img
            v-if="item1.type==3" 
                src="@/views/audit/auditWorkFlow/assets/images/icon_file.png" style="width:17px;height:17px;" />

            {{item1.name}}<img src="@/views/audit/auditWorkFlow/assets/images/add-close1.png" 
            @click="removeEle(listData,item1,'targetId')">
        </span>
        <!-- <input type="text" placeholder="请选择具体人员/职位/部门" v-if="conditionConfig.nodeUserList.length == 0" @click="addConditionRole"> -->
        
    </p>
    <el-button v-if="listData.length" @click="clearData" icon="el-icon-close" type="text">
            清除
        </el-button>
    
    </div>
</template>


<script>
import _ from 'lodash';
export default {
    props:["userList"],
    data(){
        return{
            listData:[],
        }
    },
    mounted(){
        this.listData=_.cloneDeep(this.userList);
    },
    watch:{
        userList(val){
            this.listData=_.cloneDeep(this.userList);   
        }
    },
    methods:{
        clearData(){
              this.listData=[];
              this.$emit("update:userList", this.listData);
        }, 
        removeEle(arr, elem, key = 'id') {
            var includesIndex;
            arr.map((item, index) => {
                if (item[key] == elem[key]) {
                    includesIndex = index
                }
            });
            arr.splice(includesIndex, 1);
            this.$emit("update:userList",arr);
        },
    }
}
</script>

<style scoped>
.selected_list {
    margin-bottom: 20px;
    line-height: 30px;
}
.selected_list span {
    margin-right: 10px;
    padding: 3px 6px 3px 9px;
    line-height: 12px;
    white-space: nowrap;
    border-radius: 2px;
    border: 1px solid rgba(220, 220, 220, 1);
    margin-top:4px;
    display:inline-block;
}
.selected_list img {
    margin-left: 5px;
    width: 7px;
    height: 7px;
    cursor: pointer;
}
</style>