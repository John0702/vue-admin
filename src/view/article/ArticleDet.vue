<template>
  <div class="content">
    <el-drawer
      :title="formData.name"
      :visible.sync="drawer"
      :before-close="handleClose"
      :wrapperClosable="false"
      size="40%"
    >
      <!-- 讲师介绍 -->
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
                style="color: #67c23a; font-size: 25px"
                class="el-icon-success"
              ></i>
            </h3>
            <p class="lecturer_desc">
              {{
                formData.lecturerDesc
                  ? formData.lecturerDesc
                  : "这位讲师的身世很神秘，什么都没有留下。"
              }}
            </p>
            <p class="lecturer_desc">
              {{ formData.fans ? formData.fans : 20010702 }} 粉丝
            </p>
          </el-col>
        </el-row>
      </el-card>
      <!-- 课程封面 -->
      <div style="width: 96%; margin: 0px auto">
        <el-image
          :src="formData.courseUrl"
          fit="contain"
        />
      </div>
      <!-- 课程介绍 -->
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
.lecturer_desc {
  color: gray;
  font-size: 14px;
}
</style>
