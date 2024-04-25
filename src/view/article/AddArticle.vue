<template>
  <div class="content">
    <el-card>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="文章名称:" prop="title">
          <el-input
            v-model="form.title"
            placeholder="请输入文章名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="文章编号:" prop="code">
          <el-input v-model="form.code" placeholder="请输入文章编号"></el-input>
        </el-form-item>
        <el-form-item label="作者:" prop="author">
          <el-input
            v-model="form.author"
            placeholder="请输入文章作者"
          ></el-input>
        </el-form-item>
        <el-form-item label="作者简介:">
          <el-input
            style="width: 440px"
            maxlength="1000"
            show-word-limit
            type="textarea"
            v-model="form.authorDesc"
            placeholder="请输入作者简介"
          ></el-input>
        </el-form-item>
        <el-form-item label="文章封面:">
          <el-upload
            ref="upload"
            action="/open-book/article/upload"
            list-type="picture-card"
            :file-list="[form.articleUrl]"
            :limit="1"
            accept=".png, .jpeg, .jpg, .gif, .svg, .bmp, .webp"
            :on-change="uploadFile"
            :on-success="uploadSuccess"
            :on-error="uploadError"
            :on-preview="handlePictureCardPreview"
          >
            <span slot="default">{{
              form.id ? "更新文章封面" : "上传文章封面"
            }}</span>
            <div slot="tip" class="el-upload__tip">
              支持扩展名：.png .jpeg .jpg .gif .svg .bmp .webp ，文件大小限制
              10M。
            </div>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="" />
          </el-dialog>
        </el-form-item>
        <el-form-item label="文章简介">
          <el-input
            style="width: 440px"
            maxlength="1000"
            show-word-limit
            type="textarea"
            v-model="form.articleDesc"
            placeholder="请输入文章简介"
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
import dateTransform from "@/utils/dateTransform";
export default {
  data() {
    return {
      emptyUrl: require("@/assets/img/emptyUrl.png"),
      newArticleUrl: "",
      dialogVisible: false,
      dialogImageUrl: "",
      form: {
        title: "",
        code: "",
        articleUrl: "",
        pv: "",
        articleDesc: "",
        authorDesc: "",
      },
      rules: {
        title: [
          {
            required: true,
            message: "请输入文章名称",
            trigger: "blur",
          },
        ],
        code: [
          {
            required: true,
            message: "请输入文章编号",
            trigger: "change",
          },
        ],
        author: [
          {
            required: true,
            message: "请输入作者",
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    // this.getarticleCategory();
    if (this.$route.query.id) {
      this.getArticleDetail(this.$route.query.id);
    }
  },
  methods: {
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    uploadFile(file) {
      let reader = new FileReader();
      reader.onload = () => {
        this.newArticleUrl = reader.result;
      };
      reader.readAsDataURL(file.raw);
    },
    uploadSuccess() {
      this.$message.success("上传成功");
    },
    uploadError() {
      this.$message.error("上传失败");
    },
    // 获取文章详情
    getArticleDetail(id) {
      const data = JSON.parse(localStorage.getItem("articleData")).find(
        (item) => item.id == id
      );
      this.form = data;
    },
    // 新增/编辑文章内容
    onSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let type = this.$route.query.id ? "edit" : "add";
          // 新增
          if (type == "add") {
            this.form.code = Random.string("number", 8);
            this.form.articleUrl = this.newArticleUrl
              ? this.newArticleUrl
              : this.emptyUrl;

            let newData = this.form;
            localStorage.setItem(
              "articleData",
              JSON.stringify([
                newData,
                ...JSON.parse(localStorage.getItem("articleData")),
              ])
            );
            this.$message.success("新增成功");
            this.$router.back();
          } else {
            // 编辑
            if (this.newArticleUrl) {
              this.form.articleUrl = this.newArticleUrl;
            }
            this.form.updateTime = dateTransform(new Date());
            this.form.pv = 0;
            console.log(this.form);
            let newData = JSON.parse(localStorage.getItem("articleData")).map(
              (item) => {
                if (item.id == this.form.id) {
                  return this.form;
                } else {
                  return item;
                }
              }
            );
            localStorage.setItem("articleData", JSON.stringify(newData));
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
      this.form.articleUrl = this.newArticleUrl;
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
