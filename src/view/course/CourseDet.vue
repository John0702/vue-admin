<template>
  <div class="content">
    <el-drawer
      title="课程详情"
      :visible.sync="drawer"
      :before-close="handleClose"
      :wrapperClosable="false"
      size="40%"
    >
      <!-- 讲师介绍 -->
      <el-card class="course_info">
        <el-row type="flex" justify="space-between">
          <el-col :span="6">
            <el-avatar
              style="width: 80px; height: 80px; margin-top: 25px"
              :src="require('../../assets/img/open-book.svg')"
            ></el-avatar>
          </el-col>
          <el-col :span="16">
            <h3>
              <!-- {{ formData.lecturer ? formData.lecturer : "Open-Book" }} -->
              {{$constant.officialAccount}}
              <i
                style="color: #67c23a; font-size: 25px"
                class="el-icon-success"
              ></i>
            </h3>
            <p class="lecturer_desc">
              {{
                formData.lecturerDesc
                  ? formData.lecturerDesc
                  : "十年一线大厂经验，中科院研究院技术专家，全栈开发。"
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
          :src="require('../../assets/img/courseurl.jpeg')"
          fit="contain"
        />
      </div>
      <!-- 课程介绍 -->
      <el-card class="course_info">
        <p>
          {{ formData.courseDesc
            ? formData.courseDesc
            : "课程简介：本课程是一门面向初学者的课程，主要讲解Vue.js的基础知识。" }}
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
        lecturer: "",
        lecturerDesc: "",
        courseDesc: "",
        state: "",
        fans: "",
      },
    };
  },
  created(){
    // console.log(this.formData);
  },
  methods: {
    getCourseDetail() {
      const det=JSON.parse(localStorage.getItem("courseData")).find(
        (item) => item.id === this.formData.id
      );
      this.formData = { lecturer, lecturerDesc, courseDesc, id, state }=det;

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
