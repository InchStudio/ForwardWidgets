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

### 详情数据的 type 为 link 时，加载对应 link 的 API

```javascript
async function loadDetail(link) {
  // 需返回一个带有 videoUrl 的对象
}
```

### 返回数据格式

处理函数需要返回符合 ForwardWidget 数据模型的对象数组：

```javascript
// 视频列表项
{
    id: "unique_id",            // 根据不同类型的主要值，type 为 url 时，为对应 url，type 为 douban、imdb、tmdb 时，id 为对应 id 值。如果为 tmdb 的 id，需要由 type.id 组成，如：tv.123 movie.234。
    type: "type",               // 类型标识 url, douban, imdb, tmdb
    title: "title",             // 标题
    posterPath: "url",          // 纵向封面图片地址
    backdropPath: "url",        //横向封面地址
    releaseDate: "date",        //发布时间
    mediaType: "tv|movie",      //媒体类型
    rating: "5",                //评分
    genreTitle: "genre",        //分类
    duration: 123,              //时长数字
    durationText: "00:00",      // 时长文本
    previewUrl: "url",          // 预览视频地址
    videoUrl: "videoUrl",       // 视频播放地址
    link: "link",               //详情页打开地址
    episode: 0,                 // 集数
    description: "description", // 描述
    playerType: "system",       // 播放器类型 system | app
    childItems: [VideoItem]     // 当前对象的嵌套，最多一层
}
```

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
