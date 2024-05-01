<template>
  <div class="content">
    <el-drawer
      title="文章详情"
      :visible.sync="drawer"
      :before-close="handleClose"
      size="40%"
    >
      <!-- 文章名称 -->
      <el-divider>文章名称</el-divider>
      <el-card class="article_info">
        {{ formData.title ? formData.title : "Open-Book" }}
      </el-card>
      <!-- 作者简介 -->
      <el-divider>作者简介</el-divider>

      <el-card class="article_info">
        <el-row type="flex" justify="space-between">
          <el-col :span="6">
            <img
              style="width: 80px; height: 80px; margin-top: 20px"
              src="../../assets/img/open-book.svg"
            />
          </el-col>
          <el-col :span="16">
            <h3 style="margin-bottom: -10px">
              {{ formData.author ? formData.author : "Open-Book" }}
              <i
                style="color: #67c23a; font-size: 25px"
                class="el-icon-success"
              ></i>
            </h3>
            <p class="desc">
              {{
                formData.authorDesc
                  ? formData.authorDesc
                  : "这位作者的身世很神秘，什么都没有留下。"
              }}
            </p>
            <p class="desc">
              浏览量 {{ formData.pv ? formData.pv : 20010702 }}
            </p>
          </el-col>
        </el-row>
      </el-card>
      <!-- 文章封面 -->
      <el-divider>文章封面</el-divider>
      <el-card class="article_info">
        <div style="width: 100%; margin: 0px auto">
          <el-image :src="formData.articleUrl" fit="contain" />
        </div>
      </el-card>
      <!-- 文章简介 -->
      <el-divider>文章简介</el-divider>
      <el-card class="article_info">
        <p>
          {{ formData.articleDesc ? formData.articleDesc : "暂无简介" }}
        </p>
      </el-card>
      <!-- 文章地址 -->
      <el-divider>文章地址</el-divider>
      <el-card class="article_info">
        <a :href="address" target="blank">Vue2文档</a>
      </el-card>
      <div class="updateTime">更新时间：{{ formData.updateTime }}</div>
    </el-drawer>
  </div>
</template>

<script>
export default {
  data() {
    return {
      address: "https://v2.cn.vuejs.org/v2/guide/",
      drawer: false,
      formData: {
        id: "",
      },
    };
  },
  created() {},
  methods: {
    getArticleDetail() {
      const det = JSON.parse(localStorage.getItem("articleData")).find(
        (item) => item.id === this.formData.id
      );
      this.formData = det;
    },
    handleClose() {
      this.drawer = false;
    },
  },
};
</script>

<style scoped>
.article_info {
  margin: 0px 10px 10px;
}
.desc {
  color: gray;
  font-size: 14px;
}
.content >>> .el-drawer__header {
  margin-bottom: 15px;
}
.updateTime {
  text-align: right;
  color: gray;
  font-size: small;
  padding: 5px;
}
</style>
