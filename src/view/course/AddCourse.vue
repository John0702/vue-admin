<template>
  <div class="content">
    <el-card>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="课程名称:" prop="name">
          <el-input v-model="form.name" placeholder="请输入课程名称"></el-input>
        </el-form-item>
        <el-form-item label="课程分类:" prop="category">
          <el-cascader
            placeholder="请选择课程分类"
            style="width: 440px"
            v-model="form.category"
            :options="categoryList"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="课程售价:">
          <el-input-number
            v-model="form.price"
            :min="1"
            :max="9999"
            :step="1"
            :precision="2"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="课程讲师:" prop="lecturer">
          <el-select
            v-model="form.lecturer.name"
            @change="handleLecChange"
            placeholder="请选择讲师"
          >
            <el-option
              v-for="item in lecturerList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="课程封面:">
          <el-upload
            ref="upload"
            action="/open-book/course/upload"
            list-type="picture-card"
            :file-list="[form.courseUrl]"
            :limit="1"
            accept=".png, .jpeg, .jpg, .gif, .svg, .bmp, .webp"
            :on-change="uploadFile"
            :on-success="uploadSuccess"
            :on-error="uploadError"
            :on-preview="handlePictureCardPreview"
          >
            <span slot="default">{{form.id?'更新课程封面':'上传课程封面'}}</span>

            <div slot="tip" class="el-upload__tip">
              支持扩展名：.png .jpeg .jpg .gif .svg .bmp .webp ，文件大小限制
              10M。
            </div>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="" />
          </el-dialog>
        </el-form-item>
        <el-form-item label="课程简介" prop="desc">
          <el-input
            style="width: 440px"
            maxlength="1000"
            show-word-limit
            type="textarea"
            v-model="form.courseDesc"
            placeholder="请输入课程简介"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit('form')">保 存</el-button>
          <el-button @click="handleBack">取 消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
const Mock = require("mockjs");
const Random = Mock.Random;
export default {
  data() {
    return {
      emptyUrl: require("@/assets/img/emptyUrl.png"),
      newCourseUrl: "",
      dialogVisible: false,
      dialogImageUrl: "",
      form: {
        id: "",
        name: "",
        code: "",
        lecturer: {
          id: "",
          name: "",
        },
        category: [],
        price: "",
        courseDesc: "",
        courseUrl: "",
      },
      categoryList: [
        {
          value: "1",
          label: "前端",
          children: [
            { value: "1-1", label: "html5" },
            { value: "1-2", label: "vue" },
            { value: "1-3", label: "node" },
            { value: "1-4", label: "react" },
            { value: "1-5", label: "javascript" },
          ],
        },
        {
          value: "2",
          label: "后端",
          children: [
            { value: "2-1", label: "springboot" },
            { value: "2-2", label: "微服务" },
            { value: "2-3", label: "Redis" },
          ],
        },
        {
          value: "3",
          label: "移动端",
          children: [
            { value: "3-1", label: "iOS" },
            { value: "3-2", label: "Android" },
            { value: "3-3", label: "Flutter" },
          ],
        },
      ],
      lecturerList: [
        { id: 123123, name: "尤雨溪" },
        { id: 123124, name: "OB最强讲师" },
        { id: 123125, name: "J神讲JS" },
      ],
      cascaderProps: {
        value: "id",
        label: "name",
        children: "child",
      },
      rules: {
        name: [
          {
            required: true,
            message: "请输入课程名称",
            trigger: "blur",
          },
        ],
        category: [
          {
            required: true,
            message: "请选择课程分类",
            trigger: "change",
          },
        ],
        lecturer: [
          {
            required: true,
            message: "请选择课程分类",
            trigger: "change",
          },
        ],
        courseDesc: [
          {
            required: true,
            message: "请输入课程简介",
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    // this.getCourseCategory();
    if (this.$route.query.id) {
      this.getCourseDetail(this.$route.query.id);
    }
  },
  methods: {
    handlePictureCardPreview(file) {
      console.log(1);
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    uploadFile(file) {
      let reader = new FileReader();
      reader.onload = () => {
        this.newCourseUrl = reader.result;
      };
      reader.readAsDataURL(file.raw);
    },
    uploadSuccess() {
      this.$message.success("上传成功");
    },
    uploadError() {
      this.$message.error("上传失败");
    },
    // 获取课程详情
    getCourseDetail(id) {
      const data = JSON.parse(localStorage.getItem("courseData")).find(
        (item) => item.id == id
      );
      this.form = data;
    },
    // 新增/编辑课程内容
    onSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let type = this.$route.query.id ? "edit" : "add";
          // 新增
          if (type == "add") {
            this.form.id = new Date().getTime();
            this.form.code = Random.string("number", 8);
            this.form.state = "off";
            this.form.stateName = "未上架";
            this.form.courseUrl = this.newCourseUrl?this.newCourseUrl:this.emptyUrl;

            let newData = this.form;
            localStorage.setItem(
              "courseData",
              JSON.stringify([
                newData,
                ...JSON.parse(localStorage.getItem("courseData")),
              ])
            );
            this.$message.success("新增成功");
            this.$router.back();
          } else {
            // 编辑
            if (this.newCourseUrl) {
              this.form.courseUrl = this.newCourseUrl;
            }
            let newData = JSON.parse(localStorage.getItem("courseData")).map(
              (item) => {
                if (item.id == this.form.id) {
                  return this.form;
                } else {
                  return item;
                }
              }
            );
            localStorage.setItem("courseData", JSON.stringify(newData));
            this.$message.success("编辑成功");
            this.$router.back();
          }
        } else {
          return false;
        }
      });
    },
    handleLecChange(value) {
      this.form.lecturer = this.lecturerList.find((item) => item.id == value);
    },
    handleBack() {
      this.form.courseUrl = this.newCourseUrl;
      this.$router.back();
    },
  },
};
</script>

<style scoped>
.el-input,
.el-select {
  width: 440px;
}
.content >>> .el-input__inner:focus {
  border-color: #4f7458;
}
.content >>> .el-textarea__inner:focus {
  border-color: #4f7458;
}
.el-button--primary {
  background-color: #4f7458;
  border-color: #4f7458;
}
.el-button.el-button--default:hover {
  color: #4f7458;
  border-color: #dcf5e1;
  background-color: #dcf5e1;
}
.content >>> .el-cascader .el-input.is-focus .el-input__inner {
  border-color: #4f7458;
}
.content >>> .el-input-number__decrease:hover,
.content >>> .el-input-number__increase:hover {
  color: #4f7458;
}
.content
  >>> .el-input-number__decrease:hover:not(.is-disabled)
  ~ .el-input
  .el-input__inner:not(.is-disabled),
.content
  >>> .el-input-number__increase:hover:not(.is-disabled)
  ~ .el-input
  .el-input__inner:not(.is-disabled) {
  border-color: #4f7458;
}
.content >>> .el-input__count {
  line-height: 15px;
  margin-bottom: -20px;
}
.el-button:active {
  color: #4f7458;
  border-color: #4f7458;
}
.el-button:focus {
  color: #4f7458;
  border-color: none;
  background-color: #dcf5e1;
}
.content >>> .el-upload--picture-card:hover,
.content >>> .el-upload:focus {
  border-color: #4f7458;
  color: #4f7458;
}
</style>
