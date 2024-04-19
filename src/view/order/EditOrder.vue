<template>
  <!-- 编写一个编辑用户信息表单 -->
  <div class="content">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>编辑订单</span>
      </div>
      <el-form label-width="80px">
        <el-form-item label="下单人">
          <el-input v-model="order.userName"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-radio-group v-model="order.sex">
            <el-radio label="女">女</el-radio>
            <el-radio label="男">男</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="order.phone"></el-input>
        </el-form-item>
        <el-form-item label="课程名称">
          <el-input v-model="order.courseName"></el-input>
        </el-form-item>
        <el-form-item label="课程价格">
          <el-input-number v-model="order.coursePrice"></el-input-number>
        </el-form-item>
        <el-form-item label="联系地址">
          <el-input v-model="order.address"></el-input>
        </el-form-item>
        <el-form-item label="支付时间">
          <el-date-picker
            v-model="order.payTime"
            type="datetime"
            placeholder="选择日期时间"
            style="width: 100%"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="支付方式">
          <el-radio-group v-model="order.payType">
            <el-radio label="alipay">支付宝</el-radio>
            <el-radio label="wechat">微信支付</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- 保存和取消按钮 -->
        <el-form-item>
          <el-button type="primary" @click="editOrder(order.id)">保 存</el-button>
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
        order:{}
      }
    },
    created(){
      this.order.id = this.$route.query.id;
      this.getOrderDetail(this.order.id);
    },
    methods:{
      getOrderDetail(id){
        // 通过id获取用户信息
        this.order = JSON.parse(localStorage.getItem('orderData')).find(item=>item.id==id);
      },
      editOrder(id){
        // 编辑用户信息
        let orderData = JSON.parse(localStorage.getItem('orderData'));
        orderData = orderData.map(item=>{
          if(item.id == id){
            return this.order;
          }
          return item;
        });
        localStorage.setItem('orderData',JSON.stringify(orderData));
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
