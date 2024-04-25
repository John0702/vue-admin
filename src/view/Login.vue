<template>
  <div class="login">
    <!-- login_card -->
    <el-card class="login_card">
      <el-image class="logo_image" :src="logo_url" fit="cover"></el-image>
      <p class="login_desc">欢迎登录OB课程管理系统</p>

      <el-form ref="ruleForm" :model="form" :rules="rules" >
        <el-form-item prop="username">
          <el-input
            placeholder="请输入管理员账号"
            v-model.trim="form.username"
            prefix-icon="el-icon-user"
          />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            show-password
            placeholder="请输入管理员密码"
            v-model.trim="form.password"
            prefix-icon="el-icon-lock"
          />
        </el-form-item>
        <el-form-item v-if="isReg" prop="passwordConfirm">
          <el-input
            v-model.trim="form.passwordConfirm"
            show-password
            placeholder="请再次输入管理员密码"
            prefix-icon="el-icon-lock"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            v-if="!isReg"
            :loading="loginLoading"
            class="btn"
            style="margin-bottom: 10px;"
            @click="login('ruleForm')"
            >登录</el-button
          >
          <el-button
            v-if="!isReg"
            :loading="loginLoading"
            style="margin-left: 0px;"
            class="btn"
            @click="changeReg"
            >去注册</el-button
          >
          <el-button
            v-if="isReg"
            :loading="loginLoading"
            class="btn"
            style="margin-bottom: 10px;"
            @click="registerAndLogin"
            >注册并登陆</el-button
          >
          <el-button
            v-if="isReg"
            :loading="loginLoading"
            class="btn"
            style="margin-left: 0px;"
            @click="changeReg"
            >返回</el-button
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
    <!-- footer -->
    <p class="footer">华南理工大学软件工程2020级毕业设计</p>
  </div>
</template>
<script>
const uuid = require("uuid");
export default {
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
        passwordConfirm: "",
      },
      loginLoading: false,
      isReg:false,
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
        ],
        passwordConfirm: [
          { required: true, message: "请再次输入密码", trigger: "blur" },
        ],
      },
    };
  },
  mounted(){
    document.onkeydown = (e) => {
      if (e.key === 'Enter') {
        this.isReg?this.registerAndLogin():this.enterLogin();
      }
    };
  },
  methods: {
    changeReg(){
      this.$refs.ruleForm.resetFields();
      this.isReg=!this.isReg;
    },
    registerAndLogin(){
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          if(this.form.password!==this.form.passwordConfirm){
            this.$message.error("两次密码输入不一致");
            return;
          }
          if(localStorage.getItem(this.form.username)!==null){
            this.$message.error("用户已注册，请直接登录");
            return;
          }
          localStorage.setItem(this.form.username,this.form.password);
          sessionStorage.setItem('token',uuid.v4());
          sessionStorage.setItem("nowUser",this.form.username);//设置当前用户，防止用户使用此名字注册
          this.$message.success("注册成功，正在前往首页。。。");
          setTimeout(()=>{
            this.$router.push('/home');
          },1000);
        } else {
          return false;
        }
      });
    },
    login(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 业务逻辑
          const model=this.$refs[formName].model;
          const {username,password}=model;
          if(localStorage.getItem(username)===null){
            this.$message.error("用户尚未注册，请先注册");
            this.$refs[formName].resetFields();
            return;
          }
          if(localStorage.getItem(username)===password){
            sessionStorage.setItem('token',uuid.v4());
            this.$message.success("登录成功，正在前往首页。。。");
            sessionStorage.setItem("nowUser",username);//设置当前用户，防止用户使用此名字注册
            sessionStorage.setItem("activePath",'/index');
            setTimeout(()=>{
              this.$router.push('/home');
            },1000);
          }else{
            this.$message.error("用户名或密码错误");
          }
        } else {
          return false;
        }
      });
    },
    enterLogin(){
      this.login('ruleForm');
    }
  },
};
</script>

<style  scoped>
.login {
  background:linear-gradient(0.25turn,#3f6949, #3f5571);
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
  height: 420px;
  min-height: 420px;
  border-radius: 10px;
  text-align: center;
  box-shadow: 10px 10px 5px #4e8186

}
.logo_image {
  width: 100px;
  height: 20px;
  margin-top: 20px;
}
.login_desc {
  letter-spacing: 2px;
  font-weight: bold;
  background-image: -webkit-linear-gradient(0.25turn, #3f6949, #3f5571);
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
.el-button {
  width: 100%;
}
.wechat_logo {
  position: absolute;
  right: 0;
  bottom: 0;
  margin: 20px 20px 60px;
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
  margin: 20px 20px 20px;
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
.footer:hover {
  color: white;
}
.login>>>.el-input__inner:focus{
  border-color: #3f6949;
}
.login>>>.el-form-item.is-error .el-input__inner:focus{
  border-color: #f56c6c;
}
.el-form-item.is-required{
  margin-bottom: 18px;
}
.btn{
  background: linear-gradient(0.25turn,#4f7458,#455974);
  color: white;
  opacity: 0.95;
}
</style>
