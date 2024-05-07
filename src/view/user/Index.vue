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
          <el-form-item label="用户名称:" prop="userName">
            <el-input
              v-model.trim="searchForm.userName"
              placeholder="请输入用户名称"
            />
          </el-form-item>
          <el-form-item label="用户英文名:" prop="EnglishName">
            <el-input
              v-model.trim="searchForm.EnglishName"
              placeholder="请输入用户英文名"
            />
          </el-form-item>
          <el-form-item label="性别:" prop="sex">
            <el-select v-model="searchForm.sex" placeholder="请选择用户性别">
              <el-option label="女" value="女"></el-option>
              <el-option label="男" value="男"></el-option>
            </el-select>
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
      <el-row>
        <el-col>
          <div>
            <el-radio-group
              size="small"
              @change="handleSearch()"
              v-model="searchForm.state"
            >
              <el-radio-button label="">全部</el-radio-button>
              <el-radio-button label="0">正常</el-radio-button>
              <el-radio-button label="1">已注销</el-radio-button>
            </el-radio-group>
          </div>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <el-table
        ref="table"
        :data="nowPageData"
        border
        stripe
        @sort-change="onSortChange"
      >
        <el-table-column type="index" label="序号" width="50" />
        <el-table-column prop="userName" label="姓名" show-overflow-tooltip />
        <el-table-column prop="sex" label="性别" show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="EnglishName"
          label="英文名"
          show-overflow-tooltip
          width="100"
        />
        <el-table-column
          prop="phone"
          label="手机号"
          sortable="custom"
          show-overflow-tooltip
          width="150"
        />
        <el-table-column
          prop="age"
          label="年龄"
          sortable="custom"
          show-overflow-tooltip
        />
        <el-table-column prop="state" label="状态" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-tag v-if="scope.row.state" type="danger" size="small"
              >已注销</el-tag
            >
            <el-tag v-else type="success" size="small">正常</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="250">
          <template slot-scope="scope">
            <el-button
              size="small"
              @click="$router.push(`/user/detail?id=${scope.row.id}`)"
              >详情</el-button
            >
            <el-button
              type="primary"
              size="small"
              v-show="scope.row.state == 0"
              @click="$router.push(`/user/edit?id=${scope.row.id}`)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              size="small"
              @click="deleteUser(scope.row.id)"
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
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchForm: {
        current: 1,
        size: 10,
        userName: "",
        EnglishName: "",
        sex: "",
        state: "",
      },
      total: 0,
      userData: [],
      nowPageData: [],
    };
  },
  created() {
    if (!localStorage.getItem("userData")) {
      this.getPageList();
    } else {
      this.userData = JSON.parse(localStorage.getItem("userData"));
      // 初始化总条数
      this.total = this.userData.length;
      // 初始化当前页数据
      this.nowPageData = this.userData.slice(0, this.searchForm.size);
    }
  },
  mounted() {
    document.onkeydown = (e) => {
      if (e.code == "Enter") {
        this.handleSearch();
      }
    };
    // 判断是否有搜索条件
    if (sessionStorage.getItem("userSearch")) {
      this.searchForm = JSON.parse(sessionStorage.getItem("userSearch"));
      this.handleSearch();
    }
  },
  destroyed() {
    document.onkeydown = null;
  },
  methods: {
    onSortChange({ prop, order }) {
      let tmpData = JSON.parse(localStorage.getItem("userData"));
      if (order === "ascending") {
        this.userData.sort((a, b) => a[prop] - b[prop]);
      } else if (order === "descending") {
        this.userData.sort((a, b) => b[prop] - a[prop]);
      } else {
        this.userData = tmpData;
      }
      this.nowPageData = this.userData.slice(
        (this.searchForm.current - 1) * this.searchForm.size,
        this.searchForm.current * this.searchForm.size
      );
    },
    updateSearch() {
      sessionStorage.setItem("userSearch", JSON.stringify(this.searchForm));
    },
    async getPageList() {
      const result = await this.$axios.get("/user/list");
      if (result.data.code === 200) {
        this.userData = result.data.data.records;
        localStorage.setItem("userData", JSON.stringify(this.userData));
        this.total = this.userData.length;
        this.nowPageData = this.userData.slice(0, this.searchForm.size);
      } else {
        this.$message.error(result.data.message);
      }
    },
    //搜索
    handleSearch() {
      const {
        userName = "",
        sex = "",
        state = "",
        EnglishName = "",
      } = this.searchForm;
      // 过滤数据
      this.userData = JSON.parse(localStorage.getItem("userData")).filter(
        (item) => {
          const filter =
            item.userName.includes(userName) &&
            item.sex.includes(sex) &&
            item.EnglishName.includes(EnglishName);
          if (state !== "") {
            return filter && item.state == state;
          } else {
            return filter;
          }
        }
      );
      this.searchForm.current = 1;
      this.total = this.userData.length;
      this.nowPageData = this.userData.slice(0, this.searchForm.size);
      this.updateSearch();
    },
    //重置
    handleReset() {
      this.$refs["searchForm"].resetFields();
      this.userData = JSON.parse(localStorage.getItem("userData"));
      this.total = this.userData.length;
      this.searchForm.current = 1;
      this.nowPageData = this.userData.slice(0, this.searchForm.size);
      this.updateSearch();
    },
    // 切换每页显示条数
    handleSizeChange(val) {
      this.searchForm.size = val;
      this.searchForm.current = 1;
      this.nowPageData = this.userData.slice(0, val);
    },
    // 点击某一页，跳转某一页
    handleCurrentChange(val) {
      this.searchForm.current = val;
      this.nowPageData = this.userData.slice(
        (val - 1) * this.searchForm.size,
        val * this.searchForm.size
      );
    },
    // 删除
    deleteUser(id) {
      this.$confirm("确认要删除该用户吗, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          // 删除逻辑
          let newData = JSON.parse(localStorage.getItem("userData")).filter(
            (item) => item.id != id
          );
          localStorage.setItem("userData", JSON.stringify(newData));
          this.userData = newData;
          this.total = this.userData.length;
          this.nowPageData = this.userData.slice(
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
.number.active {
  color: #455974 !important;
}
.content >>> .el-input.is-active .el-input__inner,
.content >>> .el-input.is-focus .el-input__inner,
.content >>> .el-input__inner:focus,
.content >>> .el-input__inner:hover {
  border-color: #3f6949;
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
</style>

