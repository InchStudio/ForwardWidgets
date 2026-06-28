<p align="center">
  <br>
  <img width="150" src="./icon.png">
  <br>
  <br>
</p>

<div align=center>
    
[**简体中文 🇨🇳**](README.md) / [**English 🇺🇸**](README_EN.md)

</div>

# ForwardWidget

ForwardWidget 是一个用于构建模块的 JS 组件，提供了丰富的网页相关功能和数据模型。

## 开发自定义 Widget

ForwardWidget 支持通过 JavaScript 脚本扩展功能。每个 Widget 都是一个独立的 JavaScript 文件，需要遵循特定的结构和规范。

### 🤖 用 AI 编写模块（推荐）

不想啃文档、记一堆字段和约定？现在可以直接让 AI 帮你写模块。

本仓库内置了一份给 [Claude Code](https://claude.com/claude-code) 用的「模块编写技能」（位于 `.claude/skills/writing-forward-widgets/`）。它把写 ForwardWidget 模块要懂的全部规则——元数据结构、列表 / 详情 / 搜索 / 弹幕各类模块、数据模型、网络与缓存 API、以及本地测试方法——都教给了 AI。

用起来很简单：用 Claude Code 打开本仓库，然后用大白话描述你想做什么，比如：

> 「帮我做一个抓 XX 网站热门电影的列表模块，支持翻页，再加上点开详情看剧照，以及弹幕。」

AI 会自动读取这份技能，直接产出一个**结构正确、能跑、还自带测试脚本**的模块，省去反复查文档和试错。写完你照着下面的文档微调即可。

> 适合第一次写模块、懒得记约定、想快速出原型的场景。想完全手写也没问题，继续往下看。

### 配套脚手架

直接执行 `node scaffold/create-widget.js` 会立即在 `widgets/` 目录生成一份默认模板（含 `forward.meta.demo` 元数据和 `loadResource` 模块），并自动校验返回结构，无需任何额外参数。如果需要逐项自定义，可添加 `--interactive` 或传入 `--id --title --modules '[...]' --output widgets` 等参数，详细见 `scaffold/README.md`。

### Widget 元数据配置

每个 Widget 脚本必须以 `WidgetMetadata` 对象开始，定义 Widget 的基本信息和功能模块：

```javascript
var WidgetMetadata = {
    id: "unique_id",                        // Widget 唯一标识符
    title: "Widget Title",                  // Widget 显示标题
    description: "Description",             // Widget 描述
    author: "Author Name",                  // 作者
    site: "https://example.com",            // 网站地址
    version: "1.0.0",                       // Widget 版本
    requiredVersion: "0.0.1",               // 所需 ForwardWidget 版本
    detailCacheDuration: 60,                // 详情数据缓存时长，单位：秒，默认 60 秒
    modules: [                              // 功能模块列表
        {
            title: "Module Title",          // 模块标题
            description: "Description",     // 模块描述
            requiresWebView: false,         // 是否需要 WebView
            functionName: "functionName",   // 处理函数名
            sectionMode: false,             // 是否支持分段模式
            cacheDuration: 3600,              //缓存时长，单位：秒，默认 3600 秒
            params: [                       // 参数配置
                {
                    name: "paramName",      // 参数名
                    title: "Param Title",   // 参数显示标题
                    type: "input",          // 参数类型 input | constant | enumeration | count | page | offset
                    description: "Description", // 参数描述
                    value: "defaultValue",  // 默认值
                    belongTo: {             // 当符合该条件时才会触发该参数
                        paramName: "param name" // 所属参数的子参数
                        value: ["value"]    // 所属参数包含的值
                    }
                    placeholders: [         // 占位符选项
                        {
                            title: "Option Title",
                            value: "optionValue"
                        }
                    ],
                    enumOptions: [         // 枚举选项
                        {
                            title: "Option Title",
                            value: "optionValue"
                        }
                    ]
                }
            ]
        }
    ],
    search: {                   // 搜索功能配置（可选）
        title: "Search",
          functionName: "search",
        params: [/* 搜索参数配置 */]
    }
};
```

### 参数类型说明

Widget 支持以下参数类型：

- `input`: 文本输入框
- `count`: 数字计数器
- `constant`: 常量值
- `enumeration`: 枚举选择器
- `page`: 页码选择器
- `offset`: 当前位置

### 处理函数规范

每个模块都需要实现对应的处理函数，函数名与 `functionName` 一致。处理函数接收一个 `params` 对象作为参数，包含所有配置的参数值。

```javascript
async function functionName(params = {}) {
  try {
    // 1. 参数验证
    if (!params.requiredParam) {
      throw new Error("缺少必要参数");
    }

    // 2. 发送请求
    const response = await Widget.http.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 ...",
        Referer: "https://example.com",
      },
    });

    // 3. 解析响应
    const docId = Widget.dom.parse(response.data);
    const elements = Widget.dom.select(docId, "selector");

    // 4. 返回结果
    return elements.map((element) => ({
      id: "unique_id",
      type: "type",
      title: "title",
      coverUrl: "url",
      // ... 其他属性
    }));
  } catch (error) {
    console.error("处理失败:", error);
    throw error;
  }
}
```

### DOM 操作 API

Widget 内置了 cheerio 进行 dom 解析。

```javascript
// 获得 cheerio 句柄
const $ = Widget.html.load(htmlContent);
```

### HTTP 请求 API

Widget 提供了 HTTP 请求 API：

```javascript

// options 可以设置一些自定义的内容
// 比如：
// {
//   allow_redirects: false
//   headers: {
//     "User-Agent": "Mozilla/5.0 ...",
//     Referer: "https://example.com",
//   },
//   params: {
//   }
// }

// GET 请求
const response = await Widget.http.get(url, options);

// POST 请求
const response = await Widget.http.post(url, body, options);

let data = response.data;
```

### 存储与共享缓存 API

`Widget.storage` 是当前 Widget 脚本自己的键值存储，同一个脚本里的多个模块可以共享，但不会和其他脚本共享。适合保存当前模块内部的轻量状态、分页游标、上次选择等数据。

```javascript
Widget.storage.set("lastCategory", "movie");
const lastCategory = Widget.storage.get("lastCategory");
Widget.storage.remove("lastCategory");
```

`Widget.sharedCache` 是显式共享缓存，适合多个官方模块或多个脚本复用同一份稳定数据，例如公共分类表、站点配置、临时解析结果。它必须带 `namespace`，避免不同模块互相覆盖。

```javascript
const SHARED_CACHE_NAMESPACE = "forward.demo.catalog";
const cached = Widget.sharedCache.get(SHARED_CACHE_NAMESPACE, "featured");
if (cached) {
  return cached;
}

const items = await loadFeaturedItems();
Widget.sharedCache.set(SHARED_CACHE_NAMESPACE, "featured", items);
return items;
```

共享缓存不会自动过期，也不提供脚本侧全量清理。需要失效时可以写入带版本号的 key，或用 `Widget.sharedCache.remove(namespace, key)` 删除指定项。App 设置里的「模块缓存」清理会一并清除共享缓存。

如果模块需要兼容旧版客户端，调用前先判断 `Widget.sharedCache` 是否存在；`widgets/demo.js` 里提供了兼容写法。

### 列表模块 API

普通视频列表模块需要在 `WidgetMetadata.modules` 中声明一个模块，并由 `functionName` 指向实际函数。函数返回 `VideoItem[]`。

```javascript
async function loadList(params) {
  return [
    {
      id: 550,
      type: "tmdb",
      title: "Fight Club",
      mediaType: "movie",
    },
  ];
}
```

当用户从详情页点击分类或演员打开列表时，客户端会回到当前条目所属的列表模块，并把对应 id 传回 `params`：

```javascript
// 分类 id，对应 genreItems[].id
params.genreId

// 演员/人物 id
params.peopleId
```

列表条目里的分类和演员需要带 `id`，否则详情页无法通过它们打开对应列表。

### 详情数据的 type 为 link 时，加载对应 link 的 API

```javascript
async function loadDetail(link) {
  // 返回 VideoItem 或 VideoItem[]，模型与 loadList 返回项一致
}
```

`loadDetail` 是 Widget 顶层函数，不属于某个 `modules` 配置。详情页会用列表条目的 `link` 调用它，用于补充剧照、预告片、分类、演员、相关推荐、播放地址等详情数据。

### 播放资源模块 API

当播放地址需要在**真正起播时**动态生成时（例如直播签名、短期 token、多 CDN 线路），不要把一次性 URL 固定写在 `loadDetail` 的 `videoUrl` 中。应在 `WidgetMetadata.modules` 中声明 `id: "loadResource"` 且 `type: "stream"` 的模块，客户端会在起播、切换线路或刷新资源时调用它。

```javascript
modules: [
  {
    id: "loadResource",
    title: "加载资源",
    functionName: "loadResource",
    type: "stream",
    cacheDuration: 0,
    params: []
  }
]

async function loadResource(params) {
  // params 会携带 tmdbId / imdbId / id / type / season / episode / link / videoUrl 等上下文
  const liveUrl = await getFreshPlaybackUrl(params.link);
  return [
    {
      name: "直播线路",
      description: "HTTP-FLV",
      url: liveUrl,
      customHeaders: {
        "User-Agent": "Mozilla/5.0 ...",
        Referer: "https://example.com/",
        "X-Forward-Skip-Redirect-Probe": "1"
      },
      playerType: "app"
    }
  ];
}
```

`loadResource` 返回 `VideoResource[]`：

- `name`: 线路名称，会显示在资源列表中。
- `description`: 可选，线路说明，可写分辨率、编码、音频、来源等信息。
- `url`: 必填，最终播放地址。
- `customHeaders` / `headers`: 可选，播放请求头。
- `playerType`: 可选，`system` 或 `app`。

#### 跳过起播前重定向探测

`X-Forward-Skip-Redirect-Probe: "1"` 是给播放器的内部控制 header。它适用于 HTTP-FLV 直播、一次性签名 URL、长连接直播流等**不能被起播前 GET 探测消耗**的资源。客户端识别后会跳过重定向探测，并在真正播放请求前过滤掉这个 header，不会把它发送给 CDN。

不要给所有资源都加这个 header：普通 mp4、稳定直链、m3u8/HLS 通常应保持默认重定向探测；m3u8 的播放列表刷新由播放器处理，不需要用这个 header 做轮询或持续刷新。

### 字幕压缩包选择 API

`loadSubtitle` 可以返回 `.zip` 字幕压缩包 URL。客户端下载后会解压；如果脚本定义了顶层函数 `resolveSubtitleArchive(params)`，客户端会在使用字幕前把解压后的文件列表传给它，由脚本返回真正要使用的文件相对路径。这个函数不需要写进 `WidgetMetadata.modules`。

```javascript
async function resolveSubtitleArchive(params) {
  const subtitleFiles = JSON.parse(params.subtitleFiles || "[]");
  const best = subtitleFiles.find(file => file.name.includes("简体")) || subtitleFiles[0];
  return best ? best.path : null;
}
```

新增参数：

- `archiveName`: 压缩包文件名。
- `archiveUrl`: 压缩包下载 URL。
- `subtitleId` / `subtitleName` / `subtitleLanguage`: 当前字幕候选信息。
- `files`: JSON 字符串，所有解压后的普通文件。
- `subtitleFiles`: JSON 字符串，仅包含客户端支持的字幕文件。

`files` 和 `subtitleFiles` 的每个元素都包含：

- `path`: 解压目录内的真实相对路径，例如 `Season 1/E02.zh.ass`。返回时应使用这个值；不要构造绝对路径。
- `name`: 文件名。
- `extension`: 小写扩展名。
- `size`: 文件大小，可能为空。

返回值可以是相对路径字符串、字符串数组、`{ path: "..." }`，或 `{ files: ["..."] }`。如果函数不存在、返回空、或返回的路径不在解压目录内，客户端会回退到默认自动选择逻辑。

### 返回数据格式

处理函数需要返回符合 ForwardWidget 数据模型的对象数组：

```javascript
// 视频列表项
{
    id: "unique_id",            // 根据不同类型的主要值，type 为 url 时，为对应 url，type 为 douban、imdb、tmdb 时，id 为对应 id 值。如果为 tmdb 的 id，需要由 type.id 组成，如：tv.123 movie.234。
    type: "type",               // 类型标识 url, douban, imdb, tmdb
    title: "title",             // 标题
    coverUrl: "url",            // 通用封面（兜底）：横图位排在 backdropPath 之后、竖图位排在最后。只填它就能在所有位置显示
    posterPath: "url",          // 纵向海报，竖图位（海报墙）优先用它；也识别别名 posterUrl / poster_url
    detailPoster: "url",        // 可选，详情页海报位专用，覆盖 posterPath
    backdropPath: "url",        // 横向封面，横图位（详情页顶部、横向列表）优先用它
    releaseDate: "date",        //发布时间
    mediaType: "tv|movie",      //媒体类型
    rating: "5",                //评分
    genreTitle: "genre",        //分类
    genreItems: [               // 可点击分类，详情页会用 id 打开列表
      {
        id: "action",
        title: "动作"
      }
    ],
    peoples: [                  // 演员/人物，详情页会用 id 打开列表
      {
        id: "person_id",
        title: "演员名",
        avatar: "url",
        role: "角色"
      }
    ],
    duration: 123,              //时长数字
    durationText: "00:00",      // 时长文本
    previewUrl: "url",          // 预览视频地址
    trailers: [                 // 预告片，推荐使用对象格式
      {
        coverUrl: "url",        // 预告片封面
        url: "videoUrl"         // 预告片地址
      }
    ],
    videoUrl: "videoUrl",       // 视频播放地址
    link: "link",               //详情页打开地址
    episode: 0,                 // 集数
    description: "description", // 描述
    playerType: "system",       // 播放器类型 system | app
    backdropPaths: ["url"],     // 剧照/截图列表，详情页展示
    childItems: [VideoItem],    // 当前对象的嵌套，最多一层
    episodeItems: [VideoItem],  // 剧集列表
    relatedItems: [VideoItem]   // 相关推荐
}
```

`loadList` 和 `loadDetail` 应保持同一套 `VideoItem` 模型。`loadDetail` 可只返回详情页需要补充的字段，但字段名和结构不要另起一套。

#### 图片字段与展示位置（重要）

App 按「展示位置」决定用哪个图片字段，并带**回退链**：同一个 item 只填其中一两个即可，缺失的位置会按下表自动回退（从左到右取第一个非空值）。

| 展示位置 | 取图回退链 |
|---------|-----------|
| 详情页顶部大图、横向列表缩略图（横图位） | `backdropPath` → `coverUrl` → `posterPath` |
| 纵向海报墙（竖图位，海报样式列表） | `posterPath` → `backdropPath` → `coverUrl` |
| 详情页海报位 | `detailPoster`（缺省回退到竖图位） |
| 详情页剧照横滑 | `backdropPaths`（数组，独立字段，不参与上面的回退） |
| 预告片封面 | `trailers[].coverUrl` → `coverUrl` → `backdropPath` → `posterPath` |

- **`coverUrl` 是「通用兜底封面」**：只填它，横图位（排第二）和竖图位（排最后）都能出图。「详情页顶部没设 `backdropPath` 却有图」就是因为回退到了 `coverUrl`。
- **字段别名**：`posterPath` 也识别 `posterUrl` / `poster_url`；`backdropPaths` 也识别 `backdropImageUrls`。
- **`tmdb` / `douban` / `imdb` 类型不走这套**：它们走内置详情页，图片由对应平台数据决定；对 `tmdb` 的 `posterPath`/`backdropPath` 传 TMDB 原始路径（如 `/abc.jpg`）即可。
- **经验法则**：横图位（详情页顶部、横向列表）填 `backdropPath`，竖图位（海报）填 `posterPath`；只有一张图、不想区分横竖时，填 `coverUrl` 即可全位置兜底。

### 最佳实践

1. **错误处理**
   - 使用 try-catch 捕获异常
   - 提供有意义的错误信息
   - 在控制台输出调试信息

2. **参数验证**
   - 验证必要参数是否存在
   - 验证参数值是否有效
   - 提供默认值处理

3. **性能优化**
   - 使用适当的请求头
   - 缓存重复使用的数据
   - 优化 DOM 选择器

4. **代码组织**
   - 使用清晰的函数命名
   - 添加必要的注释
   - 模块化处理逻辑

### 弹幕分片加载流程

ForwardWidget 支持弹幕分片加载功能，适用于长视频（如动漫、剧集）的弹幕系统。弹幕按时间段组织，支持按需加载，提高性能和用户体验。

#### 弹幕模块配置

在 `WidgetMetadata` 中配置弹幕模块时，需要指定 `type: "danmu"`：

```javascript
modules: [
  {
    id: "searchDanmu",           // 搜索弹幕模块，id 必须固定
    title: "搜索弹幕",
    functionName: "searchDanmu",
    type: "danmu",               // 指定为弹幕类型
    params: []
  },
  {
    id: "getComments",           // 获取弹幕模块，id 必须固定
    title: "获取弹幕",
    functionName: "getCommentsById",
    type: "danmu",
    params: []
  },
  {
    id: "getDanmuWithSegmentTime", // 获取指定时刻弹幕模块
    title: "获取指定时刻弹幕",
    functionName: "getDanmuWithSegmentTime",
    type: "danmu",
    params: []
  }
]
```

#### 弹幕参数说明

弹幕模块会自动携带以下参数：

- **基础参数**：
  - `tmdbId`: TMDB ID，用于本地存储标识
  - `type`: 视频类型（tv | movie）
  - `title`: 搜索关键词
  - `commentId`: 弹幕ID，搜索到弹幕列表后实际加载时携带
  - `animeId`: 动漫ID，搜索到动漫列表后实际加载时携带

- **视频信息参数**：
  - `seriesName`: 剧名
  - `episodeName`: 集名
  - `airDate`: 播出日期
  - `runtime`: 时长
  - `premiereDate`: 首播日期
  - `season`: 季数（电影时为空）
  - `episode`: 集数（电影时为空）
  - `link`: 链接
  - `videoUrl`: 视频链接

- **时间参数**：
  - `segmentTime`: 指定时刻，用于获取对应时间点的弹幕

#### 弹幕

#### 弹幕加载流程

弹幕加载流程：

1. **搜索弹幕** (`searchDanmu`) - 根据视频标题搜索弹幕资源
2. **获取弹幕数据** (`getCommentsById`) - 从服务器获取弹幕分段信息或使用本地缓存
3. **时间点匹配** (`getDanmuWithSegmentTime`) - 根据播放时间找到对应的弹幕。可选。

具体实现代码详见 `widgets/segmentDanmuExample.js` 文件。

#### 弹幕响应格式

内置已支持主流弹幕数据格式，包括json、xml。你也可以自定义返回的弹幕格式，但要遵循如下规范：

格式 1：
```javascript
[
  {
    p: "",// 时间，位置，颜色，等其他
    m: "",
    cid: "",
  }
]
```

格式 2：
```javascript
[
  [
    0,// 时间
    "0",// 位置
    "#fff",// 颜色
    "",
    "内容" // 弹幕内容
  ]
]
```

#### 最佳实践

1. **本地缓存**：使用 `Widget.storage` 缓存弹幕分段信息，避免重复请求
2. **分段加载**：根据播放进度按需加载对应时间段的弹幕
3. **错误处理**：处理网络请求失败和弹幕解析异常
4. **格式支持**：内置支持 XML 和 JSON 格式，支持 zlib 压缩
5. **性能优化**：避免一次性加载所有弹幕，减少内存占用

### 调试

App 内置了模块测试工具

1. 使用 `console.log()` 输出调试信息
2. 检查网络请求和响应
3. 验证 DOM 解析结果
4. 测试不同参数组合

### 模块加密

ForwardWidget 支持对 JS 模块进行加密。加密是可选的，加密后的模块在 App 导入时会自动解密，未加密的模块仍然正常工作。

#### 在线工具

访问 [加密工具](https://forward.vvebo.vip/encrypt/) 在浏览器中完成加密。

#### API

```bash
curl -X POST https://widgetencrypt.inchmade.ai --data-binary @widgets/tmdb.js -o widgets/tmdb.js
```

#### Claude Code

在本仓库中使用 Claude Code 时，可通过内置命令加密：

```
/fw-encrypt widgets/tmdb.js
```
