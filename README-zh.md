### **项目相关**
本项目基于以下项目完成
1. vue https://cn.vuejs.org/ 
2. vue-element-admin  https://panjiachen.gitee.io/vue-element-admin-site/zh/
3. element http://element-cn.eleme.io/#/zh-CN/component/input 
4. mock.js http://mockjs.com/examples.html 本地数据模拟
5. esay-mock https://easy-mock.com/   远端数据模拟  
6. sweet alert https://sweetalert.js.org/guides/ 弹窗模态框
7. printjs http://printjs.crabbly.com/  打印插件
8. 


## Build Setup

```bash
# Clone project
git clone https://gitee.com/wuxianghao/transino-vue-admin.git

# Install dependencies
npm install

# 建议不要用cnpm  安装有各种诡异的bug 可以通过如下操作解决npm速度慢的问题
npm install --registry=https://registry.npm.taobao.org

# Serve with hot reload at localhost:9528
npm run dev

# Build for production with minification
npm run build

# Build for production and view the bundle analyzer report
npm run build --report
```

##### 状态码
| 代码        | 描述                | Description |
| --------   | ----------           | ------------|
| 200        | 正常                 |             |
| 301        | 用户不存在           | No User |
| 302        | 密码错误             | Password Error |
| 303        | 未知错误             | Unknown error Try again later. |
| 304        | 账户已登出           | The account has already been logged out |
| 305        | 用户名与Token 不匹配 | The name does not match the token. Please check the data. |
| 306        | 登录超时             | Login timeout. |
| 307        | 没有文件             | No file. | 
| 401        | 非法的token          | Invalid Token  | 
| 402        | 其他客户端登录了     | The other clients have already logged in. |
| 403        | token过期           | Token expired.  |
| 405        | 没有查询结果         | No query results |
| 406        | 没有登录             | 没有登录 | 
| 501        | 没有数据             | No Post/Get Data  |
| 502        | 没有此接口           | No Api |
| 503        | 数据格式错误         | Data method error! |
| 504	     | 缺少必要参数         | Missing required parameters! |
| 602        | 文件上传失败         | File upload exception, please check! |
| 901        | 没有权限            | No Permission! |
| 902        | 没有权限记录，联系管理员 | No permission record, please contact Api administrator! |



