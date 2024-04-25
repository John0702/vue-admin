<template>
  <div class="content">
    <el-drawer
      title="课程详情"
      :visible.sync="drawer"
      :before-close="handleClose"
      size="40%"
    >
      <!-- 课程名称 -->
      <el-divider>课程名称</el-divider>
      <el-card class="course_info">
        {{ formData.courseName ? formData.courseName : "Open-Book" }}
      </el-card>
      <!-- 讲师介绍 -->
      <el-divider>作者简介</el-divider>
      <el-card class="course_info">
        <el-row type="flex" justify="space-between">
          <el-col :span="6">
            <img
              style="width: 80px; height: 80px; margin-top: 20px"
              src='../../assets/img/open-book.svg'
            />
          </el-col>
          <el-col :span="16">
            <h3 style="margin-bottom: -10px;">
              {{ formData.lecturer ? formData.lecturer.name : "Open-Book" }}
              <i
                style="color: #67c23a; font-size: 20px"
                class="el-icon-success"
              ></i>
            </h3>
            <p class="desc">
              {{
                formData.lecturerDesc
                  ? formData.lecturerDesc
                  : "这位讲师的身世很神秘，什么都没有留下。"
              }}
            </p>
            <p class="desc">
              {{ formData.fans ? formData.fans : 20010702 }} 粉丝
            </p>
          </el-col>
        </el-row>
      </el-card>
      <el-divider>课程封面</el-divider>

      <!-- 课程封面 -->
      <el-card class="course_info">
        <div style="width: 100%; margin: 0px auto">
        <el-image
          :src="formData.courseUrl"
          fit="contain"
        />
      </div>
      </el-card>
      <!-- 课程介绍 -->
      <el-divider>课程简介</el-divider>
      <el-card class="course_info">
        <p>
          {{ formData.courseDesc
            ? formData.courseDesc
            : "暂无简介" }}
        </p>
      </el-card>
    </el-drawer>
  </div>
</template>

<script>
export default {
  data() {
    return {
      drawer: false,
      formData: {
        id: "",
      },
    };
  },
  created(){
  },
  methods: {
    getCourseDetail() {
      const det=JSON.parse(localStorage.getItem("courseData")).find(
        (item) => item.id === this.formData.id
      );
      this.formData = det;
    },
    handleClose() {
      this.drawer = false;
    },
  },
};
</script>

<style scoped>
.course_info {
  margin: 0px 10px 10px;
}
.desc {
  color: gray;
  font-size: 14px;
}
.content>>>.el-drawer__header {
  margin-bottom: 15px;
}
</style>
