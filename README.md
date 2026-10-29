# 衣装集 · COSTUME-DB-01

中文参考衣装图库。界面为简体中文，纯静态实现，无需构建、无第三方运行时依赖。

> 1,407 套衣装 · 每套含缩略图、网页图与原尺寸 PNG · 无人衣装图（2:3）

内容整理自 [ai-costume-gallery.pages.dev](https://ai-costume-gallery.pages.dev/)。

## 功能

- 按分类筛选：春 / 夏 / 秋 / 冬 / 内衣 / 派对 / 泳装 / 性感
- 按 ID、服饰关键词搜索，支持中、日、英常见服饰词（如 denim、lace、白）
- 点击卡片在灯箱内查看大图，并可下载原尺寸 PNG
- 键盘操作：`←` `→` 切换衣装，`Esc` 关闭
- 分页加载（每页 120 套，「加载更多」继续），响应式布局

## 使用

### 直接打开

用浏览器打开根目录的 `index.html` 即可，无需服务器。

### 本地服务器（可选）

个别浏览器对 `file://` 下的资源加载较严格，可启动一个静态服务器：

```powershell
# Python
python -m http.server 8000

# 或 Node.js
npx serve .
```

然后访问 <http://localhost:8000>。

### Docker

仓库根目录提供 `Dockerfile`，基于 `nginx:alpine` 托管静态页面：

```powershell
docker build -t ai-costume-gallery-zh .
docker run --rm -p 8080:80 ai-costume-gallery-zh
```

然后访问 <http://localhost:8080>。也可用 Docker Compose：

```powershell
docker compose up -d --build
```

镜像只包含页面与图片；`.git`、`data/` 等维护文件不会进入构建上下文，镜像体积主要来自 `png/` 原尺寸图（约 1.4 GB）。

### 其他静态托管

本仓库为纯静态页面，无需构建。发布目录为仓库根目录，可部署到 GitHub Pages、Cloudflare Pages、Vercel 或任意静态托管服务。

## 目录结构

```text
.
├── index.html          # 页面入口
├── styles.css          # 样式
├── app.js              # 筛选、搜索、灯箱等交互
├── costumes-data.js    # 前端数据（META + D）
├── data/
│   └── costumes.json   # 元数据（与 costumes-data.js 内容一致）
├── thumbs/             # 1,407 张缩略图 WebP（约 13 MB）
├── img/                # 1,407 张网页图 WebP（约 117 MB）
├── png/                # 1,407 张原尺寸 PNG（约 1.4 GB）
├── Dockerfile          # nginx:alpine 镜像定义
├── nginx.conf          # 容器内 nginx 站点配置
├── docker-compose.yml  # 可选：一条命令构建并运行
├── .dockerignore       # 构建上下文排除项
├── README.md
├── .gitattributes
├── .editorconfig
└── .gitignore
```

仓库包含完整图像资源，合计约 1.5 GB，首次克隆会较慢。

## 数据格式

`costumes-data.js` 以两个全局常量提供数据：

```js
const META = { total: 1407, cats: ['春', '夏', '秋', '冬', 'ランジェリー', 'パーティ', '水着', 'セクシー'],
               counts: { '春': 215, '夏': 254, '秋': 244, '冬': 253, 'ランジェリー': 199, 'パーティ': 48, '水着': 54, 'セクシー': 140 } };
const D = [
  {
    id: 'SPR-0001',
    'カテゴリ': '春',
    'キーワード': 'ivory frill knit denim mini skirt coat socks white sneakers',
    'サムネ': 'thumbs/SPR-0001.webp',
    '画像': 'img/SPR-0001.webp',
    '原寸': 'png/SPR-0001.png'
  }
  // ...
];
```

| 字段 | 说明 |
| --- | --- |
| `id` | 衣装唯一 ID（前缀对应分类，如 SPR = 春） |
| `カテゴリ` | 分类原始值（部分为日文，界面经 `app.js` 中的映射显示为中文） |
| `キーワード` | 英文服饰关键词，空格分隔，供搜索使用 |
| `サムネ` | 缩略图相对路径（`thumbs/`） |
| `画像` | 网页图相对路径（`img/`） |
| `原寸` | 原尺寸图相对路径（`png/`） |

如修改元数据，请同步更新 `data/costumes.json` 与 `costumes-data.js`。

## 内容统计

| 分类 | 衣装数 |
| --- | ---: |
| 春 | 215 |
| 夏 | 254 |
| 秋 | 244 |
| 冬 | 253 |
| 内衣 | 199 |
| 派对 | 48 |
| 泳装 | 54 |
| 性感 | 140 |
| **合计** | **1,407** |

每套衣装含 `thumbs`、`img`、`png` 三张图，图像文件共 4,221 个。

## 已做处理

- 界面翻译为简体中文
- 去除推广、社群引流、开放聊天室等广告向内容
- 图片使用相对路径，可直接部署到任意静态托管服务

## 许可与使用注意（摘自原站说明）

- 可免费用于作品创作（含商用、编辑、参考）
- 图像数据本身（含原尺寸与加工后）禁止再分发、转载、转售
- 无需署名（自愿）；按原样提供，不附带保证
- 为 AI 生成的虚构衣装，并非实拍商品照片；请勿用于指代真人 / 未成年人，或违反公序良俗的用途
