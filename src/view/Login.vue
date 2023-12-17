<template>
  <div class="login">
    <el-card class="login_card">
      <el-image class="logo_image" :src="logo_url" fit="cover"></el-image>
      <p class="login_title">登录</p>
      <p class="login_desc">欢迎登录Vue-admin后台管理系统</p>

      <el-form ref="ruleForm" :model="form" :rules="rules" label-width="80px">
        <el-form-item prop="username">
          <el-input
            v-model="form.username"
            placeholder="请输入管理员账号"
            prefix-icon="el-icon-user"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            type="password"
            v-model="form.password"
            placeholder="请输入密码"
            prefix-icon="el-icon-lock"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            :loading="loginLoading"
            style="background: #999a9a; color: white"
            @click="submitForm('ruleForm')"
            >登录</el-button
          >
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      logo_url: require("@/assets/img/logo.svg"),
      form: {
        username: "",
        password: "",
      },
      loginLoading: false,
      rules: {
        username: [
          { required: true, message: "请输入管理员账号", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 20,
            message: "长度在 6 到 20 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  // created：在实例创建完成后被立即调用
  created() {},
  // mounted：在挂载开始之前被调用：相关的render函数首次被调用
  mounted() {},
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loginLoading = true;
          this.$axios
            .post("/auth/login", this.form)
            .then((res) => {
              if (res.data.success) {
                sessionStorage.setItem("user", JSON.stringify(res.data.user));
                sessionStorage.setItem("token", res.data.token);
                this.$router.push({ path: "/home" });
              } else {
                this.$message.error(res.data.msg);
                this.loginLoading = false;
              }
            })
            .catch((err) => {
              this.$message.error("服务器连接失败，请稍后重试......");
              this.loginLoading = false;
            });
        } else {
          return false;
        }
      });
    },
  },
};
</script>

<style scoped>
.login {
  background-image: url(../assets/img/login.jpg);
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  background-size: 100% 100%;
}
.login_card {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  width: 20%;
  min-width: 300px;
  height: 500px;
  min-height: 500px;
  border-radius: 10px;
  text-align: center;
  background-color: rgba(255, 255, 255, 0.7);
}
.logo_image {
  width: 100px;
  height: 50px;
  margin-top: 20px;
}
.login_title {
  font-size: 25px;
  font-weight: bold;
}
.login_desc {
  letter-spacing: 2px;
  color: #999a9a;
}
.el-button {
  width: 100%;
}
.el-form-item__content {
  margin-left: 0px;
}
</style>