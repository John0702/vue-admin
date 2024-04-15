import Mock from 'mockjs'

const Random = Mock.Random
// mock登录后用户的数据
Mock.mock("/open-book/manage/init","get",{
  code: 200,
  data: {
    "totalUser|101-2000": 1,
    "totalCourse|10-100": 1,
    "totalOrder|50-200": 1,
    "totalIncome|9999-99999": 1,
  },
  message:"ok",
});
// mock用户列表
Mock.mock("/open-book/manage/userList","get",{
  code: 200,
  data: {
    "total": 50,
    "records|50": [
      {
        "id|+1": 1,
        "name": "@cname",
        "sex|1": ["男", "女"],
        "EnglishName": "@first",
        "phone": /^1[385][1-9]\d{8}/,
        "state|1":[0,1],
        "courseNum|1-10": 1,
        "courseOrder|1-10": 1,
        "age|18-30": 1,
        "address": "@county(true)",
        "tag|1": [
          "Java",
          "Python",
          "Vue",
          "React",
          "C++",
          "C#",
          "Go",
          "PHP",
        ],
        "permission|1": ['admin','user'],
      }
    ]
  },
  message:"ok",
})
// 删除用户
Mock.mock("/open-book/manage/deleteUser","delete",{
  code: 200,
  message:"ok",
})
// mock课程列表
Mock.mock("/open-book/course/list","get",{
  code: 200,
  data: {
    "total": 50,
    "records|50": [
      {
        "id|+1": 1,
        "name": "@ctitle(3,4)",
        "category|1": [
          ['1','1-1'],
          ['1','1-2'],
          ['1','1-3'],
          ['1','1-4'],
          ['1','1-5'],
          ['2','2-1'],
          ['2','2-2'],
          ['2','2-3'],
          ['3','3-1'],
          ['3','3-2'],
          ['3','3-3'],
        ],
        "price|1": [99, 199, 299, 399, 499],
        "code": "@string(5)",
        "lecturer|1":[
          { id: 123123, name: "尤雨溪", desc: '尤雨溪（Evan You），毕业于科尔盖特大学，前端框架Vue.js的作者、HTML5版Clear的打造人、独立开源开发者。曾就职于Google Creative Labs和Meteor Development Group。由于工作中大量接触开源的JavaScript项目，最后自己也走上了开源之路，现全职开发和维护Vue.js。' },
          { id: 123124, name: "OB最强讲师", desc: '十年一线大厂经验，中科院研究院技术专家，全栈开发。' },
          { id: 123125, name: "J神讲JS",desc: 'J神，前端开发工程师，专注于前端技术研究，对前端技术有着浓厚的兴趣，热衷于分享前端技术。' },
        ],
        "courseUrl":require("@/assets/img/courseurl.jpeg"),
        "state|1":["on","off"],
        "courseDesc": "@cparagraph(3,5)",
      }
    ]
  },
  message:"ok",
})
