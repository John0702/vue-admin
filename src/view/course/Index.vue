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
          <el-form-item label="课程名称:" prop="name">
            <el-input
              v-model.trim="searchForm.name"
              placeholder="请输入课程名称"
            />
          </el-form-item>
          <el-form-item label="课程编号:" prop="code">
            <el-input
              v-model.trim="searchForm.code"
              placeholder="请输入课程编号"
            />
          </el-form-item>
          <el-form-item label="讲师:" prop="lecturer">
            <el-select v-model="searchForm.lecturer" placeholder="请选择讲师">
              <el-option
                v-for="item in lecturerList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
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
              @click="handleClear()"
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
            @click="changeView('/course/add')"
            >新增课程</el-button
          ></el-col
        >
        <el-col :span="8">
          <div>
            <el-radio-group
              size="small"
              @change="changeRadio($event)"
              v-model="searchForm.state"
            >
              <el-radio-button label="">全部</el-radio-button>
              <el-radio-button label="0">已上架</el-radio-button>
              <el-radio-button label="1">已下架</el-radio-button>
            </el-radio-group>
          </div>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <el-table ref="table" :data="courseData" border>
        <el-table-column type="index" label="序号" width="50" />
        <el-table-column prop="name" label="课程名" show-overflow-tooltip />
        <el-table-column prop="code" label="课程编号" show-overflow-tooltip />
        <el-table-column prop="nickname" label="课程封面" width="100">
          <template slot-scope="scope">
            <div>
              <el-popover placement="right" trigger="hover">
                <el-image
                  style="height: 200px"
                  :src="scope.row.courseUrl"
                  fit="contain"
                />
                <el-image
                  slot="reference"
                  style="height: 100px"
                  :src="scope.row.courseUrl"
                  fit="contain"
                />
              </el-popover>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="lecturer" label="讲师" show-overflow-tooltip />
        <el-table-column prop="price" label="课程售价" show-overflow-tooltip />
        <el-table-column prop="stateName" label="状态" show-overflow-tooltip />
        <el-table-column label="操作" width="360">
          <template slot-scope="scope">
            <el-button
              type="success"
              size="small"
              @click="changeView('/course/update', { id: scope.row.id })"
              >编辑</el-button
            >
            <el-button
              type="danger"
              size="small"
              @click="deletecourse(scope.row.id)"
              >删除</el-button
            >
            <el-button
              type="warning"
              size="small"
              v-show="scope.row.state == 0"
              @click="changeCourseStatus(scope.row.id)"
              >下架</el-button
            >
            <el-button
              type="primary"
              size="small"
              v-show="scope.row.state == 1"
              @click="changeCourseStatus(scope.row.id)"
              >上架</el-button
            >
            <el-button size="small" @click="openDetail(scope.row.id)"
              >详情</el-button
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
      <Detail ref="course_detail" />
    </el-card>
  </div>
</template>

<script>
import Detail from "../course/Detail.vue";
export default {
  name: "courseManage",
  components: { Detail },
  data() {
    return {
      searchForm: {
        current: 1,
        size: 10,
        name: "",
        lecturer: "",
        state: "",
      },
      total: 1, // 初始化应为 0，这里只做演示效果使用
      courseData: [
        {
          id: 123123,
          name: "抽丝剥茧Vue源码",
          code: "OB00100",
          courseUrl: require("@/assets/img/courseurl.jpeg"),
          phone: "19999999999",
          state: 0,
          stateName: "已上架",
          lecturer: "John",
        },
      ],
      lecturerList: [{ id: 123123, name: "OB" }],
    };
  },
  created() {
    // 初始化表格数据
    if(!localStorage.getItem('courseData')){
      this.getPageList();
    }
    this.courseData = JSON.parse(localStorage.getItem("courseData"));
    this.total = this.courseData.length;
  },
  methods: {
    async getPageList() {
      const result = await this.$axios.get('/course/list', /*{
        params: this.searchForm,
      }*/);
      if (result.data.code == 200) {
        this.courseData = result.data.data.records;
        this.courseData.forEach((item) => {
          item.stateName = item.state ? "已下架" : "已上架";
        });
        this.total = result.data.data.total;
        localStorage.setItem("courseData", JSON.stringify(this.courseData));

      } else {
        this.$message.error(result.data.message);
      }
    },
    // 切换tab
    changeRadio(value) {
      this.searchForm.state = value;
      // this.getPageList();
      console.log(value);
      this.courseData = JSON.parse(localStorage.getItem("courseData")).filter(
        (item) => {
          if (value == "") {
            return true;
          } else {
            return item.state == value;
          }
        }
      );
    },
    //搜索
    handleSearch() {
      this.searchForm.current = 1;
      this.getPageList();
    },
    //重置
    handleClear() {
      this.$refs["searchForm"].resetFields();
      this.getPageList();
    },
    // 切换每页显示条数
    handleSizeChange(val) {
      this.searchForm.size = val;
      this.searchForm.current = 1;
      this.getPageList();
    },
    // 点击某一页，跳转某一页
    handleCurrentChange(val) {
      this.searchForm.current = val;
      this.getPageList();
    },
    changeCourseStatus(id) {
      let nowData = JSON.parse(localStorage.getItem("courseData")).find(item=>item.id==id);
      let title =  nowData.state == 0 ? "下架" : "上架";
      this.$confirm("确认要【" + title + "】该课程吗, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
          // 业务操作
          nowData.state = nowData.state == 0 ? 1 : 0;
          nowData.stateName = nowData.state ? "已下架" : "已上架";
          let newData = JSON.parse(localStorage.getItem('courseData')).map(item=>{
            if(item.id==nowData.id){
              return nowData;
            }else{
              return item;
            }
          });
          localStorage.setItem('courseData',JSON.stringify(newData));
          this.courseData = newData;
          this.$message({ message: title + "成功！", type: "success" });

        }).catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作",
          });
        });
    },
    // 删除
    deletecourse(id) {
      this.$confirm("确认要删除该课程吗, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          // 删除逻辑
          this.$axios
            .delete(url, {
              params: { id: id },
            })
            .then((res) => {
              if (res.data.success) {
                this.$message({ message: "删除成功！", type: "success" });
              } else {
                this.$message.error(res.data.message);
              }
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    openDetail(id) {
      console.log(this.$refs)
      this.$refs.course_detail.drawer = true;
      this.$refs.course_detail.formData.id = id;
      this.$refs.course_detail.getCourseDetail();
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
.el-button--primary{
  background: linear-gradient(0.25turn,#4f7458,#455974);
  color: white;
  border-color: #4f7458;
  opacity: 0.95;
}
.el-radio-button.el-radio-button--small.is-active>>>.el-radio-button__inner{
  background: linear-gradient(0.25turn,#4f7458,#455974);
  color: white;
  border-color: #4f7458;
  opacity: 0.95;
  box-shadow: none;
}
.el-radio-button--small>>>.el-radio-button__inner:hover{
  color: #4f7458;
  background-color: #dcf5e1;
}
.el-button.el-button--default.el-button--small:hover{
  color: #4f7458;
  border-color: #dcf5e1;
  background-color: #dcf5e1;
}
.el-button.el-button--success.el-button--small{
  background: #4f7458;
  color: white;
  border-color: #4f7458;
  opacity: 0.95;
}
.pagination.el-pagination>>>.el-pager li.active,
.pagination.el-pagination>>>.el-pager li:hover{
  color: #3f6949;
}
.pagination.el-pagination>>>.btn-prev:hover,
.pagination.el-pagination>>>.btn-next:hover{
  color: #3f6949;
}
.content>>>.el-button.el-button--default.el-button--small:focus{
  color: #4f7458;
  border-color: #dcf5e1;
  background-color: #dcf5e1;
}
.content>>>.el-input.is-active .el-input__inner,
.content>>>.el-input.is-focus .el-input__inner,
.content>>>.el-input__inner:focus,
.content>>>.el-input__inner:hover{
  border-color: #3f6949;
}
</style>
