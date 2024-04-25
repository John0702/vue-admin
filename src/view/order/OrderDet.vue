<template>
  <div class="content">
    <el-card>
      <div class="basic-info">
        订单详情
        <el-button style="float: right" size="small" @click="$router.go(-1)">
          返回</el-button
        >
        <el-button
          style="float: right; margin-right: 10px"
          size="small"
          type="primary"
          @click="$router.push(`/order/edit?id=${orderInfo.id}`)"
          >编辑</el-button
        >
      </div>
      <el-divider></el-divider>
      <el-descriptions class="margin-top" :column="3">
        <el-descriptions-item>
          <template slot="label"> 下单人 </template>
          {{ orderInfo.userName ? orderInfo.userName : "无" }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label"> 性别 </template>
          {{ orderInfo.sex ? orderInfo.sex : "none" }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label"> 下单手机号 </template>
          {{ orderInfo.phone ? orderInfo.phone : "empty" }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label"> 订单号 </template>
          {{ orderInfo.id ? orderInfo.id : "暂无" }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label"> 联系地址 </template>
          {{ orderInfo.address ? orderInfo.address : "暂无" }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label"> 课程名称 </template>
          {{ orderInfo.courseName ? orderInfo.courseName : 22 }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label"> 课程封面 </template>
          <el-popover placement="right" trigger="hover">
            <el-image :src="orderInfo.courseUrl" fit="contain" />
            <el-image
              slot="reference"
              :src="orderInfo.courseUrl"
              fit="contain"
            />
          </el-popover>
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label"> 课程价格 </template>
          {{ orderInfo.coursePrice ? orderInfo.coursePrice : 0 }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label"> 支付时间 </template>
          <el-tag size="mini" type="primary">{{ orderInfo.payTime }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label"> 支付方式 </template>
          <el-tag
            size="mini"
            :type="orderInfo.payType == 'wechat' ? 'default' : 'primary'"
            >{{ orderInfo.payType == "alipay" ? "支付宝" : "微信支付" }}</el-tag
          >
        </el-descriptions-item>
      </el-descriptions>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      orderInfo: {
        id: "",
      },
    };
  },
  created() {
    this.orderInfo.id = this.$route.query.id;
    this.getUserDetail();
  },
  methods: {
    getUserDetail() {
      this.orderInfo = JSON.parse(localStorage.getItem("orderData")).find(
        (item) => item.id == this.orderInfo.id
      );
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
.el-button.el-button--default.el-button--small:hover {
  color: #4f7458;
  background-color: #dcf5e1;
}
.el-button.el-button--primary.el-button--small {
  color: white;
  border-color: #3f6949;
  background-color: #3f6949;
}
</style>
