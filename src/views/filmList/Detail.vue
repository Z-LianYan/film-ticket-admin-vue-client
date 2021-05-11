<template>
  <el-dialog
    title="电影详情"
    :visible.sync="isDialogVisible"
    width="50%"
    :before-close="handleClose"
    center
    :append-to-body="true"
  >
    <el-form label-width="100px" class="demo-ruleForm">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="电影名称" prop="film_name">{{
            detialData.film_name
          }}</el-form-item>
          <el-form-item label="导演" prop="director">{{
            detialData.director
          }}</el-form-item>
          <el-form-item label="播放时间" prop="play_time"
            >{{ detialData.play_time }} 分钟</el-form-item
          >
          <el-form-item label="上映时间" prop="show_time">{{
            detialData.show_time | formatDate
          }}</el-form-item>
          <el-form-item label="评分" prop="grade">{{
            detialData.grade
          }}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="类型" prop="category_labels">{{
            detialData.category_labels
          }}</el-form-item>
          <el-form-item label="国家" prop="nation">{{
            detialData.nation
          }}</el-form-item>
          <el-form-item label="状态" prop="status">
            <el-tag :type="detialData.status == 1 ? 'success' : 'info'">{{
              detialData.status == 1 ? "上架" : "下架"
            }}</el-tag>
            <!-- {{detialData.status}} -->
          </el-form-item>
          <el-form-item label="创建时间" prop="create_at">{{
            detialData.create_at | formatDate
          }}</el-form-item>
          <el-form-item label="电影海报" prop="poster_img">
            <el-image
              :z-index="2000000"
              fit="contain"
              style="width: 50px; height: 50px"
              :src="detialData.poster_img"
              :preview-src-list="[detialData.poster_img]"
            >
            </el-image>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="演员" prop="actors">
        <el-table
          :data="detialData.actors"
          highlight-current-row
          border
          style="width: 100%"
        >
          <el-table-column prop="name" label="姓名"></el-table-column>
          <el-table-column prop="role" label="角色"></el-table-column>
          <el-table-column prop="avatar" label="头像">
            <template slot-scope="scope">
              <el-image
                :z-index="2000000"
                fit="contain"
                style="width: 50px; height: 50px"
                :src="scope.row.avatar"
                :preview-src-list="[scope.row.avatar]"
              >
              </el-image>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
export default {
  name: "film-detail",
  components: {},
  data() {
    return {
      isDialogVisible: false,
      detialData: {},
    };
  },
  mounted() {},
  methods: {
    open(rows) {
      this.detialData = rows;
      this.isDialogVisible = true;
    },
    close() {
      this.isDialogVisible = false;
    },
    handleClose() {
      this.close();
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
