import Mock from "mockjs";
import md5 from "js-md5";
const uuid = require("uuid");
const Random = Mock.Random;

//mock登录
Mock.mock("/open-book/login", "post", req => {
  const data = JSON.parse(req.body);
  if (localStorage.getItem(data.username) === null) {
    return {
      code: 400,
      msg: "用户尚未注册，请先注册！"
    };
  }
  if (
    JSON.parse(localStorage.getItem(data.username)).password === data.password
  ) {
    sessionStorage.setItem("token", uuid.v4());
    sessionStorage.setItem("nowUser", data.username); //设置当前用户，防止用户使用此名字注册
    sessionStorage.setItem("activePath", "/index");
    return {
      code: 200,
      msg: "登录成功,正在前往首页..."
    };
  } else {
    return {
      code: 400,
      msg: "密码错误！"
    };
  }
});
//mock注册
Mock.mock("/open-book/register", "post", req => {
  const data = JSON.parse(req.body);
  if (
    localStorage.getItem(data.username) !== null ||
    data.username === "admin"
  ) {
    return {
      code: 400,
      msg: "用户名已存在！"
    };
  } else {
    localStorage.setItem(
      data.username,
      JSON.stringify({
        password: data.password,
        permission: "user"
      })
    );
    sessionStorage.setItem("token", uuid.v4());
    sessionStorage.setItem("nowUser", data.username); //设置当前用户，防止用户使用此名字注册
    return {
      code: 200,
      msg: "注册成功，正在前往首页..."
    };
  }
});
//mock修改密码
Mock.mock("/open-book/editPassword", "post", req => {
  const data = JSON.parse(req.body);
  if (
    JSON.parse(localStorage.getItem(data.username)).password === data.oldPassword
  ) {
    localStorage.setItem(
      data.username,
      JSON.stringify({
        ...JSON.parse(localStorage.getItem(data.username)),
        password: data.newPassword,
      })
    );
    return {
      code: 200,
      msg: "密码修改成功，请重新登录！"
    };
  } else {
    return {
      code: 400,
      msg: "原密码错误，请重新输入！"
    };
  }
});
// mock登录后用户的数据
Mock.mock("/open-book/home/init", "get", {
  code: 200,
  data: {
    "totalUser|101-2000": 1,
    "totalCourse|10-100": 1,
    "totalOrder|50-200": 1,
    "totalIncome|9999-99999": 1
  },
  message: "ok"
});
// mock用户列表
Mock.mock("/open-book/user/list", "get", {
  code: 200,
  data: {
    total: 50,
    "records|50": [
      {
        "id|+1": 1,
        userName: "@cname",
        "sex|1": ["男", "女"],
        EnglishName: "@first",
        "age|18-30": 1,
        phone: /^1[385][1-9]\d{8}/,
        "state|1": [0, 1],
        "courseNum|1-10": 1,
        "courseOrder|1-10": 1,
        address: "@county(true)",
        avatar: require("@/assets/img/open-book.svg"),
        "tag|1": ["Java", "Python", "Vue", "React", "C++", "C#", "Go", "PHP"],
        "permission|1": ["admin", "user"]
      }
    ]
  },
  message: "ok"
});
// mock课程列表
Mock.mock("/open-book/course/list", "get", {
  code: 200,
  data: {
    total: 50,
    "records|50": [
      {
        courseName: "@ctitle(3,4)",
        "category|1": [
          ["1", "1-1"],
          ["1", "1-2"],
          ["1", "1-3"],
          ["1", "1-4"],
          ["1", "1-5"],
          ["2", "2-1"],
          ["2", "2-2"],
          ["2", "2-3"],
          ["3", "3-1"],
          ["3", "3-2"],
          ["3", "3-3"]
        ],
        "price|1": [99, 199, 299, 399, 499],
        id: "@id",
        "lecturer|1": [
          {
            id: 123123,
            name: "尤雨溪",
            desc:
              "尤雨溪（Evan You），毕业于科尔盖特大学，前端框架Vue.js的作者、HTML5版Clear的打造人、独立开源开发者。曾就职于Google Creative Labs和Meteor Development Group。由于工作中大量接触开源的JavaScript项目，最后自己也走上了开源之路，现全职开发和维护Vue.js。"
          },
          {
            id: 123124,
            name: "OB最强讲师",
            desc: "十年一线大厂经验，中科院研究院技术专家，全栈开发。"
          },
          {
            id: 123125,
            name: "J神讲JS",
            desc:
              "J神，前端开发工程师，专注于前端技术研究，对前端技术有着浓厚的兴趣，热衷于分享前端技术。"
          }
        ],
        courseUrl: require("@/assets/img/courseurl.jpeg"),
        "state|1": ["on", "off"],
        courseDesc: "@cparagraph(3,5)"
      }
    ]
  },
  message: "ok"
});
// 订单列表
Mock.mock("/open-book/order/list", "get", {
  code: 200,
  data: {
    total: 50,
    "records|50": [
      {
        id: "@id",
        userName: "@cname",
        courseName: "@ctitle(3,4)",
        "coursePrice|1": [99, 199, 299, 399, 499],
        courseUrl: Random.image("200x100", "#50B347", "#FFF", "Cover"),
        "sex|1": ["男", "女"],
        phone: /^1[385][1-9]\d{8}/,
        address: "@county(true)",
        "payment|1": [
          {
            payState: "1",
            payTime: "@datetime",
            "payType|1": ["alipay", "wechat"]
          },
          { payState: "0" }
        ]
      }
    ]
  },
  message: "ok"
});
// 文章数据
Mock.mock("/open-book/article/list", "get", {
  code: 200,
  data: {
    total: 50,
    "records|50": [
      {
        id: "@id",
        title: "@ctitle(3,4)",
        articleUrl: require("@/assets/img/articleUrl.jpg"),
        author: "@cname",
        pv: "@integer(10000,999999)",
        updateTime: "@datetime",
        articleDesc: "@cparagraph(3,5)",
        authorDesc: "@cparagraph(3,5)"
      }
    ]
  },
  message: "ok"
});
// 上传课程封面
Mock.mock("/open-book/course/upload", "post", req => {
  return {
    code: 200,
    message: "ok"
  };
});
// 上传用户头像
Mock.mock("/open-book/user/upload", "post", req => {
  return {
    code: 200,
    message: "ok"
  };
});
// 上传文章封面
Mock.mock("/open-book/article/upload", "post", req => {
  return {
    code: 200,
    message: "ok"
  };
});
