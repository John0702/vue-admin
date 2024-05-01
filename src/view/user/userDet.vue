<template>
  <div class="content">
    <el-card>
      <div class="basic-info">
        用户详情
        <el-button style="float: right" size="small" @click="$router.go(-1)">
          返回</el-button
        >
        <el-button
          style="float: right;margin-right: 10px"
          size="small"
          type="primary"
          v-show="userInfo.state===0"
          @click="$router.push(`/user/edit?id=${userInfo.id}`)"
          >编辑</el-button>
      </div>
      <el-divider></el-divider>
      <div style="text-align: center">
        <el-avatar
          :size="150"
          :src="userInfo.avatar"
        ></el-avatar>
        <h2 style="margin: 10px 0px">{{ userInfo.userName ? userInfo.userName : "空" }}</h2>
        <span
          style="
            border-right: 2px solid #d2d2d2;
            padding-right: 10px;
            color: #999999;
          "
          >在学课程 {{ userInfo.courseNum ? userInfo.courseNum : "2" }}</span
        >
        <span style="padding-left: 5px; color: #999999"
          >已下订单
          {{ userInfo.courseOrder ? userInfo.courseOrder : "2" }}</span
        >
        <p style="margin-top: 10px">
          <el-tag size="small" :style="{background: userInfo.state?'rgb(255 181 181)':'#dcf5e1', color: userInfo.state?'#ff0000':'#4f7458',borderColor:userInfo.state?'rgb(255 204 204)':'dcf5e1'}">
            <i class="fa fa-circle"></i>
            {{ userInfo.status ? userInfo.status : "正常" }}</el-tag
          >
        </p>
      </div>
    </el-card>
    <el-card class="rowStyle">
      <div class="basic-info">基础信息</div>
      <el-divider></el-divider>
      <el-descriptions class="margin-top" :column="3">
        <el-descriptions-item>
          <template slot="label"> 姓名 </template>
          {{ userInfo.userName ? userInfo.userName : "无" }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label"> 英文名 </template>
          {{ userInfo.EnglishName ? userInfo.EnglishName : "none" }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label"> 手机号 </template>
          {{ userInfo.phone ? userInfo.phone : 'empty' }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label"> 性别 </template>
          {{ userInfo.sex ? userInfo.sex : '男' }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label"> 年龄 </template>
          {{ userInfo.age ? userInfo.age : 22 }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label"> 联系地址 </template>
          {{ userInfo.address ? userInfo.address : '华南理工大学' }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label"> 擅长语言 </template>
          <el-tag size="mini" type="primary">{{ userInfo.tag }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label"> 权限 </template>
          <el-tag size="mini" :type="userInfo.permission=='admin'?'danger':'primary'">{{ userInfo.permission=='admin'?'管理者':'普通用户' }}</el-tag>
        </el-descriptions-item>
      </el-descriptions>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userInfo: {
        id: "",
      },
    };
  },
  created() {
    this.userInfo.id = this.$route.query.id;
    this.getUserDetail();
  },
  methods: {
    getUserDetail() {
      this.userInfo=JSON.parse(localStorage.getItem('userData')).find(item=>item.id==this.userInfo.id);
    },
  },
};
</script>

<style scoped>
.basic-info {
  border-left: 5px solid #4f7458;
  padding-left: 10px;
  font-weight: bold;
}
.rowStyle {
  margin-top: 10px;
}
.el-tag {
  margin-left: 5px;
}
.el-button.el-button--default.el-button--small:hover{
  color: #4f7458;
  background-color: #dcf5e1;
}
.el-button.el-button--primary.el-button--small{
  color: white;
  border-color: #3f6949;
  background-color: #3f6949;
}
</style>
