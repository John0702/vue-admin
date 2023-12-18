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
            style="background: #75bde7; color: white"
            @click="submitForm('ruleForm')"
            >登录</el-button
          >
        </el-form-item>
      </el-form>
    </el-card>
    <!-- 外部logo展示 -->
    <div>
      <div class="wechat_logo">
        <el-image
          style="margin: 7px 5px"
          :src="wechat_logo"
          fit="cover"
        ></el-image>
      </div>
      <div class="official_img">
        <el-image
          style="margin: 5px"
          :src="official_img"
          fit="cover"
        ></el-image>
      </div>
      <div class="github_link">
        <a :href="account_url" target="_blank">
          <el-image style="margin: 4px" :src="github_logo" fit="cover">
          </el-image
        ></a>
      </div>
    </div>
    <p class="footer">华南理工大学软件工程2020级毕业设计</p>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      logo_url: require("@/assets/img/vue.svg"),
      wechat_logo: require("@/assets/img/wechat.svg"),
      github_logo: require("@/assets/img/github.svg"),
      official_img: require("@/assets/img/official.jpg"),
      account_url: "https://github.com/John0702/vue-admin",
      form: {
        username: "",
        password: "",
      },
      loginLoading: false,
      rules: {
        username: [
          { required: true, message: "请输入管理员账号", trigger: "blur" },
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
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
.login >>> .el-form-item__content {
  margin-left: 0px !important;
}

.wechat_logo {
  position: absolute;
  right: 0;
  bottom: 0;
  margin: 20px 20px 80px;
  background-color: white;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  animation: rightToleft 0.3s ease-in-out;
}
.github_link {
  position: absolute;
  right: 0;
  bottom: 0;
  margin: 20px 20px 40px;
  background-color: white;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  animation: rightToleft 0.5s ease-in-out;
}
.official_img {
  position: absolute;
  display: none;
  right: 0;
  bottom: 0;
  margin: 20px 60px 20px;
  background-color: white;
  width: 100px;
  height: 100px;
  border-radius: 10px;
}
.wechat_logo:hover,
.github_link:hover {
  cursor: pointer;
  border-radius: 50%;
  box-shadow: 0 0 10px #999;
}
.wechat_logo:hover + .official_img {
  display: block;
  box-shadow: 0 0 10px #999;
  animation: rightToleft 0.3s ease 1;
}
@keyframes rightToleft {
  0% {
    transform: translateX(7px);
  }
  100% {
    transform: translateX(0px);
  }
}

.footer {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  text-align: center;
  color: #999;
  font-size: 12px;
  letter-spacing: 1px;
  margin-bottom: 10px;
}
</style>