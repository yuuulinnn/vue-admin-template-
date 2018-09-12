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

## 状态码
| 代码        | 描述   |
| --------   | -----: |
| 200        | 正常    |
| 401        | 非法的token  |
| 402        | 其他客户端登录了    |
| 403        | token过期    |
| 501        | 没有数据     |
| 502        | 没有此接口   |



