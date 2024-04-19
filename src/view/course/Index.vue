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
            @click="changeView('/course/add')"
            >新增课程</el-button
          ></el-col
        >
        <el-col :span="8">
          <div>
            <el-radio-group
              size="small"
              @change="handleSearch()"
              v-model="searchForm.state"
            >
              <el-radio-button label="">全部</el-radio-button>
              <el-radio-button label="on">已上架</el-radio-button>
              <el-radio-button label="off">已下架</el-radio-button>
            </el-radio-group>
          </div>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <el-table ref="table" :data="nowPageData" border stripe>
        <el-table-column type="index" label="序号" width="50" />
        <el-table-column prop="name" label="课程名称" show-overflow-tooltip />
        <el-table-column prop="code" label="课程编号" show-overflow-tooltip />
        <el-table-column prop="courseUrl" label="课程封面" width="100">
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
        <el-table-column prop="lecturer.name" label="讲师" show-overflow-tooltip />
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
              v-show="scope.row.state == 'on'"
              @click="changeCourseStatus(scope.row.id)"
              >下架</el-button
            >
            <el-button
              type="primary"
              size="small"
              v-show="scope.row.state == 'off'"
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
      <CourseDet ref="course_detail" />
    </el-card>
  </div>
</template>

<script>
import CourseDet from "./CourseDet.vue";
export default {
  name: "courseManage",
  components: { CourseDet },
  data() {
    return {
      searchForm: {
        // 当前页
        current: 1,
        // 每页显示条数
        size: 10,
        name: "",
        lecturer: "",
        state: "",
        code: "",
      },
      // 总条数
      total: 0,
      // 待展示的课程数据，不一定是所有课程数据
      courseData: [],
      // 当前页数据
      nowPageData: [
        {
          id: '',
          name: "",
          code: "",
          courseUrl: "",
          phone: "",
          state: "",
          stateName: "",
          lecturer: "",
        },
      ],
      lecturerList:[
        { id: 123123, name: "尤雨溪" },
        { id: 123124, name: "OB最强讲师" },
        { id: 123125, name: "J神讲JS" },
      ],
    };
  },
  created() {
    // 初始化表格数据,拿到所有课程数据
    if(!localStorage.getItem('courseData')){
      this.getPageList();
    }
    else{
      this.courseData = JSON.parse(localStorage.getItem("courseData"));
      // 初始化总条数
      this.total = this.courseData.length;
      // 初始化当前页数据
      this.nowPageData = this.courseData.slice(0, this.searchForm.size);
    }
    window.addEventListener("keydown", (e) => {
      if (e.key === 'Enter') {
        this.handleSearch();
      }
    });
  },
  methods: {
    async getPageList() {
      const result = await this.$axios.get('/course/list');
      if (result.data.code == 200) {
        this.courseData = result.data.data.records;
        this.courseData.forEach((item) => {
          item.stateName = item.state=="off" ? "已下架" : "已上架";
        });
        localStorage.setItem("courseData", JSON.stringify(this.courseData));
        // 初始化总条数
        this.total = this.courseData.length;
        // 初始化当前页数据
        this.nowPageData = this.courseData.slice(0, this.searchForm.size);
      } else {
        this.$message.error(result.data.message);
      }
    },
    //搜索
    handleSearch() {
      const { name='', code='', lecturer='', state="" } = this.searchForm;
      // 过滤数据
      this.courseData = JSON.parse(localStorage.getItem("courseData")).filter(
        (item) => {
          if(state!==""){
            return item.name.includes(name) && item.code.includes(code) && (item.lecturer.id == (lecturer==''?item.lecturer.id:lecturer)) && item.state == state;
          }else{
            return item.name.includes(name) && item.code.includes(code) && (item.lecturer.id == (lecturer==''?item.lecturer.id:lecturer));
          }
        }
      );
      this.searchForm.current = 1;
      this.total = this.courseData.length;
      this.nowPageData = this.courseData.slice(0, this.searchForm.size);
    },
    //重置
    handleReset() {
      this.$refs["searchForm"].resetFields();
      this.courseData = JSON.parse(localStorage.getItem("courseData"));
      this.total = this.courseData.length;
      this.searchForm.current = 1;
      this.nowPageData = this.courseData.slice(0, this.searchForm.size);
    },
    // 切换每页显示条数
    handleSizeChange(val) {
      this.searchForm.size = val;
      this.searchForm.current = 1;
      this.nowPageData = this.courseData.slice(0, val);
    },
    // 点击某一页，跳转某一页
    handleCurrentChange(val) {
      this.searchForm.current = val;
      this.nowPageData = this.courseData.slice(
        (val - 1) * this.searchForm.size,
        val * this.searchForm.size
      );
    },
    changeCourseStatus(id) {
      let nowData = JSON.parse(localStorage.getItem("courseData")).find(item=>item.id==id);
      let title =  nowData.state == "on" ? "下架" : "上架";
      this.$confirm("确认要【" + title + "】该课程吗, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
          // 业务操作
          nowData.state = nowData.state == "on" ? "off" : "on";
          nowData.stateName = nowData.state=="off" ? "已下架" : "已上架";
          let newData = JSON.parse(localStorage.getItem('courseData')).map(item=>{
            if(item.id==nowData.id){
              return nowData;
            }else{
              return item;
            }
          });
          localStorage.setItem('courseData',JSON.stringify(newData));
          this.courseData = newData;
          this.handleSearch();
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
          let newData = JSON.parse(localStorage.getItem('courseData')).filter(item=>item.id!=id);
          localStorage.setItem('courseData',JSON.stringify(newData));
          this.courseData = newData;
          this.total = this.courseData.length;
          this.nowPageData = this.courseData.slice((this.searchForm.current-1)*this.searchForm.size, this.searchForm.current*this.searchForm.size);
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
.el-table .el-button--primary{
  background: #455974;
  color: white;
  border-color: #455974;
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
  font-weight: 700;
  font-size: large;
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
