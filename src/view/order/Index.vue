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
          <el-form-item label="下单人名称:" prop="userName">
            <el-input
              v-model.trim="searchForm.userName"
              placeholder="请输入下单人名称"
            />
          </el-form-item>
          <el-form-item label="性别:" prop="sex">
            <el-select v-model="searchForm.sex" placeholder="请选择下单人性别">
              <el-option label="女" value="女"></el-option>
              <el-option label="男" value="男"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="订单号:" prop="id">
            <el-input v-model.trim="searchForm.id" placeholder="请输入订单号" />
          </el-form-item>
          <el-form-item label="下单人电话:" prop="phone">
            <el-input
              v-model.trim="searchForm.phone"
              placeholder="请输入下单人电话"
            />
          </el-form-item>
          <el-form-item label="课程名称:" prop="courseName">
            <el-input
              v-model.trim="searchForm.courseName"
              placeholder="请输入课程名称"
            />
          </el-form-item>
          <el-form-item label="课程价格:">
            <el-input
              v-model.trim.number="searchForm.priceRange.start"
              placeholder="最低价格"
              style="width: 85px"
            />
            <span> - </span>
            <el-input
              v-model.trim.number="searchForm.priceRange.end"
              placeholder="最高价格"
              style="width: 85px"
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
      <el-row>
        <el-col :span="4">
          <el-button
            type="primary"
            size="small"
            @click="changeView('/order/add')"
            >新增订单</el-button
          ></el-col
        >
      </el-row>

      <!-- 表格 -->
      <el-table ref="table" :data="nowPageData" border stripe>
        <el-table-column type="index" label="序号" width="50" />
        <el-table-column prop="userName" label="下单人" show-overflow-tooltip />
        <el-table-column prop="sex" label="性别" show-overflow-tooltip />
        <el-table-column prop="id" label="订单号" show-overflow-tooltip />
        <el-table-column
          prop="phone"
          label="手机号"
          show-overflow-tooltip
          width="150"
        />
        <el-table-column
          prop="courseName"
          label="课程名称"
          show-overflow-tooltip
        />
        <el-table-column
          prop="coursePrice"
          label="课程价格"
          show-overflow-tooltip
        />
        <el-table-column label="操作" width="250">
          <template slot-scope="scope">
            <el-button
              size="small"
              @click="$router.push(`/order/detail?id=${scope.row.id}`)"
              >详情</el-button
            >
            <el-button
              type="primary"
              size="small"
              @click="$router.push(`/order/edit?id=${scope.row.id}`)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              size="small"
              @click="deleteOrder(scope.row.id)"
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
        courseName: "",
        sex: "",
        phone: "",
        priceRange: {
          start: null,
          end: null,
        },
      },
      total: 0,
      orderData: [],
      nowPageData: [],
    };
  },
  created() {
    if (!localStorage.getItem("orderData")) {
      this.getPageList();
    } else {
      this.orderData = JSON.parse(localStorage.getItem("orderData"));
      // 初始化总条数
      this.total = this.orderData.length;
      // 初始化当前页数据
      this.nowPageData = this.orderData.slice(0, this.searchForm.size);
    }
  },
  mounted() {
    document.onkeydown = (e) => {
      if (e.code == 'Enter') {
        this.handleSearch();
      }
    };
    if(sessionStorage.getItem("orderSearch")) {
      this.searchForm = JSON.parse(sessionStorage.getItem("orderSearch"));
      this.handleSearch();
    }
  },
  destroyed() {
    document.onkeydown = null;
  },
  methods: {
    updateSearch(){
      sessionStorage.setItem("orderSearch", JSON.stringify(this.searchForm));
    },
    async getPageList() {
      const result = await this.$axios.get("/order/list");
      if (result.data.code === 200) {
        this.orderData = result.data.data.records;
        localStorage.setItem("orderData", JSON.stringify(this.orderData));
        this.total = this.orderData.length;
        this.nowPageData = this.orderData.slice(0, this.searchForm.size);
      } else {
        this.$message.error(result.data.message);
      }
    },
    //搜索
    handleSearch() {
      // 校验价格范围是否合理
      if (
        this.searchForm.priceRange.start &&
        this.searchForm.priceRange.end &&
        this.searchForm.priceRange.start > this.searchForm.priceRange.end
      ) {
        this.$message.error("价格范围输入有误！");
        this.searchForm.priceRange.start = null;
        this.searchForm.priceRange.end = null;
        return;
      }
      const {
        userName = "",
        sex = "",
        id = "",
        phone = "",
        courseName = "",
      } = this.searchForm;
      // 过滤数据
      this.orderData = JSON.parse(localStorage.getItem("orderData")).filter(
        (item) => {
          return (
            item.userName.includes(userName) &&
            item.sex.includes(sex) &&
            item.id.includes(id) &&
            item.phone.includes(phone) &&
            item.courseName.includes(courseName) &&
            (this.searchForm.priceRange.start
              ? item.coursePrice >= this.searchForm.priceRange.start
              : true) &&
            (this.searchForm.priceRange.end
              ? item.coursePrice <= this.searchForm.priceRange.end
              : true)
          );
        }
      );
      this.searchForm.current = 1;
      this.total = this.orderData.length;
      this.nowPageData = this.orderData.slice(0, this.searchForm.size);
      this.updateSearch();
    },
    //重置
    handleReset() {
      this.$refs["searchForm"].resetFields();
      this.orderData = JSON.parse(localStorage.getItem("orderData"));
      this.total = this.orderData.length;
      this.searchForm.current = 1;
      this.nowPageData = this.orderData.slice(0, this.searchForm.size);
      this.searchForm.priceRange.start = null;
      this.searchForm.priceRange.end = null;
      this.updateSearch();
    },
    // 切换每页显示条数
    handleSizeChange(val) {
      this.searchForm.size = val;
      this.searchForm.current = 1;
      this.nowPageData = this.orderData.slice(0, val);

    },
    // 点击某一页，跳转某一页
    handleCurrentChange(val) {
      this.searchForm.current = val;
      this.nowPageData = this.orderData.slice(
        (val - 1) * this.searchForm.size,
        val * this.searchForm.size
      );
    },
    // 删除
    deleteOrder(id) {
      this.$confirm("确认要删除该课程吗, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          // 删除逻辑
          let newData = JSON.parse(localStorage.getItem("orderData")).filter(
            (item) => item.id != id
          );
          localStorage.setItem("orderData", JSON.stringify(newData));
          this.orderData = newData;
          this.total = this.orderData.length;
          this.nowPageData = this.orderData.slice(
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

