<template>
  <div class="content">
    <el-card class="info">
      <div class="error-page">
        <i class="el-icon-warning"></i>
        <p>抱歉，您目前没有查看该页面的权限！如需开通权限，请联系管理员</p>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "ForbiddenPage",
};
</script>

<style scoped>
.error-page {
  text-align: center;
  height:100vh;
  font-size: 24px;
  color: #333;
}
.info {
  margin: 0px 10px 10px;
}
.content {
  margin: 20px 0px;
}
.el-icon-warning:before{
  font-size: 100px;
  color: #f56c6c;
}
</style>
