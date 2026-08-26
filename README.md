# 🛠️ Admin System — 纯静态管理后台模板

一个**零依赖、零构建**的现代化管理后台前端模板，**纯 HTML + CSS + 原生 JavaScript** 实现，
开箱即用、单页应用（SPA）体验，可直接部署到任何静态托管（GitHub Pages / Nginx / CDN / OSS）。

> 🎯 适合作为内部系统、运营后台、CMS 管理系统、Saas 控制台的前端骨架，所有数据基于 `localStorage` 模拟，方便演示与原型开发。

---

## ✨ 特性一览

| 类别 | 能力 |
| --- | --- |
| 🏗️ 架构 | 单页应用（SPA，hash 路由）+ 兼容多页面跳转 |
| 🎨 UI | 响应式布局、侧边栏可折叠、暗色主题、主色可定制 |
| 🔐 鉴权 | 模拟登录、记住账号、自动登录（8h / 7天） |
| 📊 看板 | KPI 卡片、柱状图、环形图、活动流、快捷入口 |
| 📋 列表 | 通用 ListPage：搜索/筛选/分页/新增/编辑/删除/批量/CSV 导出 |
| 🧰 通用 | Toast 提示、Modal 对话框、内联 SVG 图标库 |
| 💾 数据 | 6 套模拟数据集（用户/订单/商品/文章/消息/活动）持久化到 localStorage |
| ⚙️ 设置 | 个人资料、修改密码、主题切换、通知开关、数据清空 |
| 📦 体积 | 整个项目 < 100 KB（gzip 前），单页 < 60 KB |
| 🚀 部署 | 任意静态托管；**无需 Node.js、无需打包工具** |

---

## 🚀 快速开始

### 方式一：直接打开（最简单）

```bash
# 双击 index.html 即可在浏览器中运行
open index.html        # macOS
start index.html       # Windows
xdg-open index.html    # Linux
```

### 方式二：本地起一个静态服务（推荐，避免某些浏览器 CORS 限制）

```bash
# Python 3
python3 -m http.server 8080

# Node.js (需要全局安装 http-server)
npx http-server -p 8080

# 然后访问 http://localhost:8080
```

### 方式三：部署到生产

把整个 `admin-system/` 目录上传到任何静态托管即可：

- **GitHub Pages**：推送到仓库，`Settings → Pages → 选择分支`
- **Nginx**：把目录放到 `/usr/share/nginx/html/admin/`
- **Vercel / Netlify**：直接拖入目录即可

---

## 🔑 演示账号

| 账号 | 密码 | 角色 | 权限 |
| --- | --- | --- | --- |
| `admin` | `123456` | 超级管理员 | 全部功能 |
| `editor` | `123456` | 内容编辑 | 内容/文章相关 |
| `guest` | `guest` | 只读访客 | 仅查看 |

> 💡 在登录页勾选「记住我」可保持 7 天免登录；不勾选则是 8 小时会话级登录。

---

## 📂 目录结构

```
admin-system/
├── index.html               # SPA 入口（hash 路由）
├── login.html               # 登录页
├── README.md                # 本文件
│
├── pages/                   # 多页面备份（无需使用，仅参考）
│   ├── dashboard.html
│   └── list.html
│
├── css/                     # 样式
│   ├── common.css           # 变量、reset、按钮、表单、徽章、Toast、Modal
│   ├── layout.css           # 侧边栏、顶栏、布局
│   ├── dashboard.css        # 数据看板
│   ├── list.css             # 列表/搜索/筛选/分页
│   ├── settings.css         # 设置页
│   └── login.css            # 登录页
│
└── js/                      # 脚本（无任何依赖）
    ├── icons.js             # 内联 SVG 图标库（30+）
    ├── auth.js              # 登录/会话/记住账号
    ├── storage.js           # localStorage 封装 + 6 套模拟数据
    ├── feedback.js          # Toast + Modal
    ├── layout.js            # 布局组件（侧边栏 + 顶栏，兼容 SPA/多页）
    ├── list.js              # 通用 ListPage（搜索/筛选/分页/CRUD/CSV）
    ├── dashboard.js         # 数据看板
    └── settings.js          # 系统设置
```

---

## 🗺️ 功能地图

| 路由 | 页面 | 主要能力 |
| --- | --- | --- |
| `#/dashboard` | 数据看板 | 欢迎卡片、4 项 KPI、用户/订单柱状图、流量环形图、活动流、6 个快捷入口 |
| `#/users` | 用户管理 | 36 个模拟用户，按部门/角色/状态筛选，CRUD + 批量删除 + CSV |
| `#/orders` | 订单管理 | 50 个订单，6 种状态，按状态筛选 |
| `#/products` | 商品管理 | 30 个商品，4 种状态，价格/库存展示 |
| `#/articles` | 内容管理 | 25 篇文章，4 种状态（已发布/草稿/待审核/已驳回） |
| `#/messages` | 消息中心 | 40 条消息，4 种类型，已读/未读筛选 |
| `#/settings` | 系统设置 | 个人资料、改密码、主题色（7 色）、明暗主题、通知开关、清空数据 |

---

## 🎨 主题定制

### 修改主色（任选一种方式）

**方式 1**：在 `系统设置 → 外观主题` 页面点选 7 种预设色。

**方式 2**：修改 `css/common.css` 第 7 行：

```css
:root {
    --primary: #4f46e5;        /* 改这里即可全站生效 */
    --primary-hover: #4338ca;
    --primary-light: #eef2ff;
}
```

### 切换暗色主题

`系统设置 → 外观主题 → 深色` 即可。当前为浅色预设。

如需扩展真正的暗色主题，可在 `common.css` 末尾追加：

```css
[data-theme-mode="dark"] {
    --bg-1: #1f2937;
    --bg-2: #111827;
    --text-1: #f9fafb;
    --text-2: #d1d5db;
    --text-3: #9ca3af;
    --border: #374151;
}
```

---

## 🧩 扩展开发

### 新增一个列表页（如「角色管理」）

只需两步：

**1.** 在 `js/list.js` 的 `configs` 中追加配置：

```js
roles: {
    menuId: 'roles',
    title: '角色管理',
    storageKey: 'roles',
    searchFields: ['name', 'code'],
    filters: [
        { key: 'status', label: '全部状态', options: [
            { value: 'enabled',  label: '启用' },
            { value: 'disabled', label: '禁用' }
        ]}
    ],
    columns: [
        { key: 'id',   label: 'ID' },
        { key: 'name', label: '角色名' },
        { key: 'code', label: '标识' },
        { key: 'status', label: '状态', render: r => `<span class="badge">${r.status}</span>` }
    ],
    formFields: [
        { key: 'name',   label: '角色名', type: 'text',   required: true },
        { key: 'code',   label: '标识',   type: 'text',   required: true },
        { key: 'status', label: '状态',   type: 'select', required: true, options: [
            { value: 'enabled',  label: '启用' },
            { value: 'disabled', label: '禁用' }
        ]}
    ]
}
```

**2.** 在 `js/storage.js` 的 `MockData.init` 中加入生成函数 + `Mock` 接口：

```js
generateRoles() { /* ... */ },
// Mock 中追加：
roles: () => Storage.get('roles', []),
```

**3.** 在 `index.html` 路由表加入：

```js
'roles': () => go('roles')
```

**4.** （可选）在 `js/layout.js` 的 `MENU` 中加菜单项。

### 自定义弹窗

```js
Modal.open({
    title: '批量导入',
    body: '<input type="file" class="form-control">',
    width: 480,
    confirmText: '开始导入',
    onConfirm: () => {
        // 返回 false 可阻止关闭
    }
});
```

### 自定义 Toast

```js
Toast.success('保存成功');
Toast.error('网络错误');
Toast.warning('请注意');
Toast.info('提示信息');
```

---

## 🛠️ 技术栈

| 层 | 技术 |
| --- | --- |
| 结构 | HTML5 语义化标签 |
| 样式 | CSS3 变量 / Grid / Flexbox / `@media` 响应式 |
| 脚本 | 原生 ES6+（无 jQuery / Vue / React） |
| 存储 | `localStorage` / `sessionStorage` |
| 图标 | 内联 SVG（避免图标字体依赖） |
| 图表 | 纯 CSS + SVG 绘制（无 Chart.js 等） |

**总代码量**：HTML+CSS+JS ≈ 3500 行（不含 SVG）。

---

## ❓ 常见问题

**Q: 双击 `index.html` 打开后页面空白？**
A: 某些浏览器（Chrome）对 `file://` 协议下的 `localStorage` 有限制，建议用 `python3 -m http.server` 起一个本地服务。

**Q: 怎么把数据换成真实后端？**
A: 替换 `js/storage.js` 里的 `Storage.get/set/remove` 为 `fetch` 调用即可，其他模块都通过 `Storage` 访问，**解耦良好**。

**Q: 怎么加新菜单？**
A: 修改 `js/layout.js` 的 `MENU` 数组，加 `{ id, text, icon, hash }` 项即可。

**Q: 怎么打包成生产版本？**
A: 本项目没有构建步骤，「生产版」就是「源文件」。如果需要压缩可执行：
```bash
npx terser js/*.js -o dist/
npx clean-css-cli css/*.css -o dist/
```

**Q: 支持 IE 吗？**
A: 不支持。本项目使用了 ES6+ 语法（`const/let/箭头函数/模板字符串/Spread`），目标浏览器为 Chrome 80+、Edge 80+、Firefox 78+、Safari 14+。

---

## 📜 许可证

MIT License - 自由用于个人和商业项目。

---

## 🙏 致谢

- 设计灵感来自 Ant Design Pro / Element Plus / Naive UI
- SVG 图标参考 Feather Icons
- 配色参考 Tailwind CSS

如果对你有帮助，欢迎 ⭐ Star！
