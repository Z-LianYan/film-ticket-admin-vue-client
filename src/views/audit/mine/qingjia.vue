<template>
    <el-form label-width="100px">
        <!-- <el-form-item label="审批编号">{{detail.id}}</el-form-item> -->
        <el-form-item label="请假天数">
            {{detail.info.leave_day}}天 <el-tag>{{detail.info.leave_type_name}}</el-tag>
        </el-form-item>
        
    
        <el-form-item label="请假日期">
            {{detail.info.start_leave_date}}{{detail.info.start_leave_type==2?'上午':'下午'}} ～ {{detail.info.end_leave_date}}{{detail.info.end_leave_type==2?'上午':'下午'}}
        </el-form-item>
        <el-form-item label="申请原因">{{detail.info.leave_reason}}</el-form-item>
        <el-form-item label="附件" v-if="detail.info.appendix.length">
            <el-image
            v-for="(item,index) in detail.info.appendix"
            :key="index"
            style="width: 50px; height: 50px;margin-right:5px;"
            :src="item"
            :preview-src-list="detail.info.appendix"
            />
            <!-- 共{{detail.info.imgs.length}}张，点击预览 -->
        </el-form-item>
        <!-- <el-form-item label="入职时间">{{detail.info.entry_time}}</el-form-item> -->
        <!-- <el-button type='primary' @click="onViewHistoryRecord">查看{{detail.employee_name}}的历史记录</el-button> -->
    </el-form>
</template>

<script>
// import QingjiaList  from '@/pages/audit/qingjia-list'
export default {
    name:'MineAuditQingjia',
    props: {
        detail: {
            type: Object,
            default: () => {
                return {}
            }
        }
    },
    components: {
        // QingjiaList
    },
    data() {
        return {};
    },

    async created() {},

    methods: {
        // onViewHistoryRecord(){
        //     this.$router.push({
        //         path:'/audit-qingjia-record',
        //         query:{
        //             employee_id:this.detail.employee_id,
        //             employee_name:this.detail.employee_name
        //         }
        //     })
        //     this.$emit('onSkip')
        // }
    },
};
</script>
<style lang="scss" scoped>
/deep/.el-form-item{
    margin-bottom: 0;
}
</style>
