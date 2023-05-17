<template>
    <el-form label-width="100px">
        <el-form-item label="离职日期">
            {{detail.info.lizhi_date}}
        </el-form-item>
        <el-form-item label="离职原因">{{detail.info.type_name}}</el-form-item>
        <el-form-item label="离职备注">{{detail.info.remark}}</el-form-item>
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
    </el-form>
</template>

<script>
// import QingjiaList  from '@/pages/audit/qingjia-list'
export default {
    name:'Lizhi',
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
