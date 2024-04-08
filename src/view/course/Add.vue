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
            @change="handleChange"
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
          <el-select v-model="form.lecturer" placeholder="请选择讲师">
            <el-option
              v-for="item in lecturerList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="课程封面:">
          <Upload
            ref="uploadFile"
            :upload-list="form.courseUrl"
            @uploadFile="uploadFile"
            @removeFile="removeFile"
          />
        </el-form-item>
        <el-form-item label="课程简介" prop="desc">
          <el-input
            style="width: 440px"
            maxlength="1000"
            show-word-limit
            type="textarea"
            v-model="form.desc"
            placeholder="请输入课程简介"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit('form')">保 存</el-button>
          <el-button @click="$router.back()">取 消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import Upload from "../../components/Upload.vue";
const Mock = require("mockjs");
const Random = Mock.Random;
export default {
  components: { Upload },
  data() {
    return {
      form: {
        id: "",
        name: "",
        code: "",
        lecturer: "",
        category: [],
        price: "",
        desc: "",
        courseUrl: require("./../../assets/img/courseUrl.jpeg"),
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
      cascaderProps:{
        value:'id',
        label:'name',
        children:'child'
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
        desc: [
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
    // 获取课程详情
    getCourseDetail(id) {
      const data=JSON.parse(localStorage.getItem('courseData')).find(item=>item.id==id);
      this.form = data;
      console.log(this.form);
    },
    // async getCourseCategory() {
    //   const result = await this.$axios.get("/course/getCategory");
    //   if (result.data.success) {
    //    this.categoryList = result.data.data;
    //   } else {
    //     this.$message.error(result.data.message);
    //   }
    // },
    // 新增/编辑课程内容
    onSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let type=this.$route.query.id?'edit':'add';
          // 新增
          if(type=='add'){
            this.form.id = new Date().getTime();
            this.form.code = Random.string("number", 8);
            this.form.state = 0;
            this.form.lecturer = this.lecturerList.find(item=>item.id==this.form.lecturer).name;
            if(this.form.courseUrl){
              this.form.courseUrl = this.form.courseUrl.map(item=>item.url);
            }
            let newData = this.form;
            console.log(newData);
            localStorage.setItem('courseData',JSON.stringify([newData,...JSON.parse(localStorage.getItem('courseData'))]));
            this.$message.success("新增成功");
            this.$router.back();
          }else{
            // 编辑
            let newData = JSON.parse(localStorage.getItem('courseData')).map(item=>{
              if(item.id==this.form.id){
                return this.form;
              }else{
                return item;
              }
            });
            localStorage.setItem('courseData',JSON.stringify(newData));
            this.$message.success("编辑成功");
            this.$router.back();
          }
        } else {
          return false;
        }
      });
    },
    // 上传文件
    uploadFile(file) {
      this.form.courseUrl.push(file);
    },
    // 删除文件
    removeFile(id) {
      let fileIds = this.form.courseUrl;
      var index = fileIds.findIndex((item) => {
        if (item.id == id) {
          return true;
        }
      });
      if (index != -1) {
        fileIds.splice(index, 1);
      }
    },
    handleChange(value) {
      console.log(value);
      console.log(this.form.category);
    },
  },
};
</script>

<style scoped>
.el-input,
.el-select {
  width: 440px;
}
.content>>>.el-input__inner:focus{
  border-color: #4f7458;
}
.content>>>.el-textarea__inner:focus{
  border-color: #4f7458;
}
.el-button--primary{
  background-color: #4f7458;
  border-color: #4f7458;
}
.el-button.el-button--default:hover{
  color: #4f7458;
  border-color: #dcf5e1;
  background-color: #dcf5e1;
}
.content>>>.el-cascader .el-input.is-focus .el-input__inner{
  border-color: #4f7458;
}
.content>>>.el-input-number__decrease:hover,
.content>>>.el-input-number__increase:hover{
  color: #4f7458;
}
.content>>>.el-input-number__decrease:hover:not(.is-disabled)~.el-input .el-input__inner:not(.is-disabled),
.content>>>.el-input-number__increase:hover:not(.is-disabled)~.el-input .el-input__inner:not(.is-disabled){
  border-color: #4f7458;
}
</style>
