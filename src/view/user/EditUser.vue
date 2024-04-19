<template>
<!-- 编写一个编辑用户信息表单 -->
<div class="content">
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>编辑用户</span>
    </div>
    <el-form label-width="80px">
      <el-form-item label="姓名">
        <el-input v-model="user.name"></el-input>
      </el-form-item>
      <el-form-item label="英文名">
        <el-input v-model="user.EnglishName"></el-input>
      </el-form-item>
      <el-form-item label="手机号">
        <el-input v-model="user.phone"></el-input>
      </el-form-item>
      <el-form-item label="性别">
        <el-radio-group v-model="user.sex">
          <el-radio label="女">女</el-radio>
          <el-radio label="男">男</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="年龄">
        <el-input v-model="user.age"></el-input>
      </el-form-item>
      <el-form-item label="联系地址">
        <el-input v-model="user.address"></el-input>
      </el-form-item>
      <el-form-item label="擅长语言">
        <el-tag size="mini" type="primary">{{ user.tag }}</el-tag>
      </el-form-item>
      <el-form-item label="身份">
        <el-tag size="mini" :type="user.permission=='admin'?'danger':'primary'">{{ user.permission=='admin'?'管理员':'普通用户' }}</el-tag>
      </el-form-item>
      <!-- 保存和取消按钮 -->
      <el-form-item>
        <el-button type="primary" @click="editUser(user.id)">保 存</el-button>
        <el-button @click="$router.go(-1)">取 消</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</div>
</template>

<script>
export default {
  data(){
    return {
      user:{}
    }
  },
  created(){
    this.user.id = this.$route.query.id;
    this.getUserDetail(this.user.id);
  },
  methods:{
    getUserDetail(id){
      // 通过id获取用户信息
      this.user = JSON.parse(localStorage.getItem('userData')).find(item=>item.id==id);
    },
    editUser(id){
      // 编辑用户信息
      let userData = JSON.parse(localStorage.getItem('userData'));
      userData = userData.map(item=>{
        if(item.id == id){
          return this.user;
        }
        return item;
      });
      localStorage.setItem('userData',JSON.stringify(userData));
      this.$message({
        message: '编辑成功',
        type: 'success'
      });
      this.$router.go(-1);
    }
  }
}
</script>

<style scoped>
.content {
  margin: 20px 0px;
}
.el-button.el-button--primary{
  color: white;
  border-color: #4f7458;
  background-color: #4f7458;
  opacity: 0.95;
  box-shadow: none;
}
.el-button.el-button--default:hover{
  color: #4f7458;
  border-color: #dcf5e1;
  background-color: #dcf5e1;
}
</style>
