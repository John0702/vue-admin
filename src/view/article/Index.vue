<template>
  <div class="content">
    <el-card shadow="never">
      <!-- 查询 -->
      <el-row type="flex" justify="space-between">
        <el-form
          ref="searchForm"
          :model="searchForm"
          size="small"
          class="demo-form-inline"
          inline
        >
          <el-form-item label="文章名称:" prop="title">
            <el-input
              v-model.trim="searchForm.title"
              placeholder="请输入文章名称"
            />
          </el-form-item>
          <el-form-item label="文章编号:" prop="code">
            <el-input
              v-model.trim="searchForm.code"
              placeholder="请输入文章编号"
            />
          </el-form-item>
          <el-form-item label="作者:" prop="author">
            <el-input
              v-model.trim="searchForm.author"
              placeholder="请输入作者名称"
            />
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              icon="el-icon-search"
              size="small"
              @click="handleSearch()"
              >查询
            </el-button>
            <el-button
              size="small"
              icon="el-icon-refresh-right"
              @click="handleReset()"
              >重置</el-button
            >
          </el-form-item>
        </el-form>
      </el-row>
      <el-row class="rowSpace">
        <el-col :span="4">
          <el-button
            type="primary"
            size="small"
            @click="changeView('/article/add')"
            >新增文章</el-button
          ></el-col
        >
      </el-row>
      <!-- 表格 -->
      <el-table ref="table" :data="nowPageData" border stripe>
        <el-table-column type="index" label="序号" width="50" />
        <el-table-column prop="title" label="文章名称" show-overflow-tooltip />
        <el-table-column prop="code" label="文章编号" show-overflow-tooltip />
        <el-table-column prop="articleUrl" label="文章封面" width="100">
          <template slot-scope="scope">
            <div>
              <el-popover placement="right" trigger="hover">
                <el-image
                  style="height: 200px"
                  :src="scope.row.articleUrl"
                  fit="contain"
                />
                <el-image
                  slot="reference"
                  style="height: 100px"
                  :src="scope.row.articleUrl"
                  fit="contain"
                />
              </el-popover>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="author" label="作者" show-overflow-tooltip />
        <el-table-column prop="pv" label="浏览数" show-overflow-tooltip />
        <el-table-column label="操作" width="360">
          <template slot-scope="scope">
            <el-button size="small" @click="openDetail(scope.row.id)"
              >详情</el-button
            >
            <el-button
              type="success"
              size="small"
              @click="changeView('/article/edit', { id: scope.row.id })"
              >编辑</el-button
            >
            <el-button
              type="danger"
              size="small"
              @click="deleteArticle(scope.row.id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        class="pagination"
        layout="->,total, sizes, prev, pager, next, jumper"
        :page-sizes="[10, 20, 30, 40]"
        :current-page="searchForm.current"
        :page-size="searchForm.size"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        popper-class="my-pagination-ctr"
      />
      <!-- 详情--->
      <ArticleDet ref="article_detail" />
    </el-card>
  </div>
</template>

<script>
import ArticleDet from "./ArticleDet.vue";
export default {
  name: "articleManage",
  components: { ArticleDet },
  data() {
    return {
      searchForm: {
        // 当前页
        current: 1,
        // 每页显示条数
        size: 10,
        title: "",
        author: "",
        code: "",
      },
      // 总条数
      total: 0,
      // 待展示的文章数据，不一定是所有文章数据
      articleData: [],
      // 当前页数据
      nowPageData: [],
    };
  },
  created() {
    // 初始化表格数据,拿到所有文章数据
    if (!localStorage.getItem("articleData")) {
      this.getPageList();
    } else {
      this.articleData = JSON.parse(localStorage.getItem("articleData"));
      // 初始化总条数
      this.total = this.articleData.length;
      // 初始化当前页数据
      this.nowPageData = this.articleData.slice(0, this.searchForm.size);
    }
  },
  mounted() {
    document.onkeydown = (e) => {
      if (e.code == 'Enter') {
        this.handleSearch();
      }
    };
    // 判断是否有搜索条件
    if (sessionStorage.getItem("articleSearch")) {
      this.searchForm = JSON.parse(sessionStorage.getItem("articleSearch"));
      this.handleSearch();
    }
  },
  destroyed() {
    document.onkeydown = null;
  },
  methods: {
    updateSearch(){
      sessionStorage.setItem("articleSearch", JSON.stringify(this.searchForm));
    },
    async getPageList() {
      const result = await this.$axios.get("/article/list");
      if (result.data.code == 200) {
        this.articleData = result.data.data.records;
        localStorage.setItem("articleData", JSON.stringify(this.articleData));
        // 初始化总条数
        this.total = this.articleData.length;
        // 初始化当前页数据
        this.nowPageData = this.articleData.slice(0, this.searchForm.size);
      } else {
        this.$message.error(result.data.message);
      }
    },
    //搜索
    handleSearch() {
      const { title = "", code = "", author = "" } = this.searchForm;
      // 过滤数据
      this.articleData = JSON.parse(localStorage.getItem("articleData")).filter(
        (item) => {
          return (
            item.title.includes(title) &&
            item.code.includes(code) &&
            item.author.includes(author)
          );
        }
      );
      this.searchForm.current = 1;
      this.total = this.articleData.length;
      this.nowPageData = this.articleData.slice(0, this.searchForm.size);
      this.updateSearch();
    },
    //重置
    handleReset() {
      this.$refs["searchForm"].resetFields();
      this.articleData = JSON.parse(localStorage.getItem("articleData"));
      this.total = this.articleData.length;
      this.searchForm.current = 1;
      this.nowPageData = this.articleData.slice(0, this.searchForm.size);
      this.updateSearch();
    },
    // 切换每页显示条数
    handleSizeChange(val) {
      this.searchForm.size = val;
      this.searchForm.current = 1;
      this.nowPageData = this.articleData.slice(0, val);
    },
    // 点击某一页，跳转某一页
    handleCurrentChange(val) {
      this.searchForm.current = val;
      this.nowPageData = this.articleData.slice(
        (val - 1) * this.searchForm.size,
        val * this.searchForm.size
      );
    },
    // 删除
    deleteArticle(id) {
      this.$confirm("确认要删除该文章吗, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          // 删除逻辑
          let newData = JSON.parse(localStorage.getItem("articleData")).filter(
            (item) => item.id != id
          );
          localStorage.setItem("articleData", JSON.stringify(newData));
          this.articleData = newData;
          this.total = this.articleData.length;
          this.nowPageData = this.articleData.slice(
            (this.searchForm.current - 1) * this.searchForm.size,
            this.searchForm.current * this.searchForm.size
          );
          this.$message({ message: "删除成功！", type: "success" });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    openDetail(id) {
      this.$refs.article_detail.drawer = true;
      this.$refs.article_detail.formData.id = id;
      this.$refs.article_detail.getArticleDetail();
    },
    // 路由跳转
    changeView(url, queryParams) {
      this.$router.push({
        path: url,
        query: queryParams,
      });
    },
  },
};
</script>

<style scoped>
.content {
  margin: 20px 0px;
}

.el-table {
  margin: 20px 0px;
}
.el-button--primary {
  background: linear-gradient(0.25turn, #4f7458, #455974);
  color: white;
  border-color: #4f7458;
  opacity: 0.95;
}
.el-table .el-button--primary {
  background: #455974;
  color: white;
  border-color: #455974;
  opacity: 0.95;
}
.el-radio-button.el-radio-button--small.is-active >>> .el-radio-button__inner {
  background: linear-gradient(0.25turn, #4f7458, #455974);
  color: white;
  border-color: #4f7458;
  opacity: 0.95;
  box-shadow: none;
}

.el-radio-button--small >>> .el-radio-button__inner:hover {
  color: #4f7458;
  background-color: #dcf5e1;
}
.el-button.el-button--default.el-button--small:hover {
  color: #4f7458;
  border-color: #dcf5e1;
  background-color: #dcf5e1;
}
.el-button.el-button--success.el-button--small {
  background: #4f7458;
  color: white;
  border-color: #4f7458;
  opacity: 0.95;
}
.pagination.el-pagination >>> .el-pager li.active,
.pagination.el-pagination >>> .el-pager li:hover {
  color: #3f6949;
  font-weight: 700;
  font-size: large;
}
.pagination.el-pagination >>> .btn-prev:hover,
.pagination.el-pagination >>> .btn-next:hover {
  color: #3f6949;
}
.content >>> .el-button.el-button--default.el-button--small:focus {
  color: #4f7458;
  border-color: #dcf5e1;
  background-color: #dcf5e1;
}
.content >>> .el-input.is-active .el-input__inner,
.content >>> .el-input.is-focus .el-input__inner,
.content >>> .el-input__inner:focus,
.content >>> .el-input__inner:hover {
  border-color: #3f6949;
}
</style>
