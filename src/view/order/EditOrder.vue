<template>
  <!-- 编写一个编辑用户信息表单 -->
  <div class="content">
    <el-card class="box-card">
      <el-form label-width="100px" ref="form" :model="order" :rules="rules" >
        <el-form-item label="下单人:" prop="userName">
          <el-input v-model="order.userName"></el-input>
        </el-form-item>
        <el-form-item label="性别:" prop="sex">
          <el-radio-group v-model="order.sex">
            <el-radio label="女">女</el-radio>
            <el-radio label="男">男</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="手机号:" prop="phone">
          <el-input v-model="order.phone"></el-input>
        </el-form-item>
        <el-form-item label="课程名称:" prop="courseName">
          <el-input v-model="order.courseName"></el-input>
        </el-form-item>
        <el-form-item label="课程价格:">
          <el-input-number
            v-model="order.coursePrice"
            :min="1"
            :max="9999"
            :step="1"
            :precision="2"
            ></el-input-number>
        </el-form-item>
        <el-form-item label="联系地址:">
          <el-input v-model="order.address"></el-input>
        </el-form-item>
        <el-form-item label="支付时间:" prop="payTime">
          <el-date-picker
            v-model="order.payTime"
            type="datetime"
            placeholder="选择日期时间"
            popper-class="datePicker"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="支付方式:" prop="payType">
          <el-radio-group v-model="order.payType">
            <el-radio label="alipay">支付宝</el-radio>
            <el-radio label="wechat">微信支付</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- 保存和取消按钮 -->
        <el-form-item>
          <el-button type="primary" @click="onSubmit('form')">保 存</el-button>
          <el-button @click="$router.go(-1)">取 消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

  <script>
  import  dateTransform  from "@/utils/dateTransform";
export default {
  data() {
    return {
      order: {
        id: "",
        userName: "",
        phone: "",
        courseName: "",
        coursePrice: "",
        address: "",
        payTime: "",
        payType: "",
      },
      rules: {
        sex: [{ required: true, message: "请选择性别", trigger: "blur" }],
        userName: [
          { required: true, message: "请输入下单人", trigger: "blur" },
        ],
        phone: [{ required: true, message: "请输入手机号", trigger: "blur" }],
        courseName: [
          { required: true, message: "请输入课程名称", trigger: "blur" },
        ],
        payTime: [
          { required: true, message: "请选择支付时间", trigger: "blur" },
        ],
        payType: [
          { required: true, message: "请选择支付方式", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    if(this.$route.query.id){
      this.getOrderDetail(this.$route.query.id);
    }
  },
  methods: {

    getOrderDetail(id) {
      // 通过id获取用户信息
      this.order = JSON.parse(localStorage.getItem("orderData")).find(
        (item) => item.id == id
      );
    },
    onSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let type = this.$route.query.id ? "edit" : "add";
          // 新增
          if (type == "add") {
            this.order.id = new Date().getTime();
            this.order.payTime = dateTransform(this.order.payTime);

            let newData = this.order;
            localStorage.setItem(
              "orderData",
              JSON.stringify([
                newData,
                ...JSON.parse(localStorage.getItem("orderData")),
              ])
            );
            this.$message.success("新增成功");
            this.$router.back();
          } else {
            this.order.payTime = dateTransform(this.order.payTime);
            // 编辑
            let newData = JSON.parse(localStorage.getItem("orderData")).map(
              (item) => {
                if (item.id == this.order.id) {
                  return this.order;
                } else {
                  return item;
                }
              }
            );
            localStorage.setItem("orderData", JSON.stringify(newData));
            this.$message.success("编辑成功");
            this.$router.back();
          }
        } else {
          return false;
        }
      });
    },
  },
};
</script>

  <style scoped>
.content {
  margin: 20px 0px;
}
.el-button.el-button--primary {
  color: white;
  border-color: #4f7458;
  background-color: #4f7458;
  opacity: 0.95;
  box-shadow: none;
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
.content >>> .el-radio__input.is-checked .el-radio__inner {
  background-color: #4f7458;
  border-color: #4f7458;
}
.content >>> .el-radio__input.is-checked + .el-radio__label {
  color: #4f7458;
}
.content >>> .el-radio__inner:hover {
  border-color: #4f7458;
}
</style>
