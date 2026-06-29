/**
 * 示例模块
 * 给 module 指定 type 为 stream 或 subtitle 后，默认会携带以下参数：
 * tmdbId: TMDB ID，Optional
 * imdbId: IMDB ID，Optional
 * id: Media ID，Optional
 * type: 类型，tv | movie
 * seriesName：剧名，Optional
 * episodeName：集名，Optional
 * season: 季，电影时为空，Optional
 * episode: 集，电影时为空，Optional
 * link: 链接，Optional
 */

/**
 * 图片字段与展示位置（App 按「展示位置」取图，带回退链，从左到右取第一个非空值）：
 *   横图位（详情页顶部大图 / 横向列表缩略图）: backdropPath → coverUrl → posterPath
 *   竖图位（纵向海报墙 / 海报样式列表）:        posterPath → backdropPath → coverUrl
 *   详情页海报位:                              detailPoster（缺省回退到竖图位）
 *   详情页剧照横滑:                            backdropPaths（数组，独立字段，不参与上面回退）
 *   预告片封面:                                trailers[].coverUrl → coverUrl → backdropPath → posterPath
 * 说明：
 *   - coverUrl 是「通用兜底封面」：只填它，横图位（排第二）和竖图位（排最后）都能出图。
 *     "详情页顶部没设 backdropPath 却有图" 就是回退到了 coverUrl。
 *   - 别名：posterPath 也识别 posterUrl / poster_url；backdropPaths 也识别 backdropImageUrls。
 *   - tmdb / douban / imdb 类型走内置详情页，不走这套回退；tmdb 的 poster/backdrop 传 TMDB 原始路径（/abc.jpg）。
 *   - 经验：横图位填 backdropPath、竖图位填 posterPath；只有一张图、不分横竖时填 coverUrl 即可全位置兜底。
 */
WidgetMetadata = {
  id: "forward.meta.demo",
  title: "DEMO",
  icon: "https://assets.vvebo.vip/scripts/icon.png",
  version: "1.0.4",
  requiredVersion: "0.0.1",
  description: "演示模块",
  author: "Forward",
  site: "https://github.com/InchStudio/ForwardWidgets",
  modules: [
    {
      // id 需固定为 loadResource
      id: "loadResource",
      title: "加载资源",
      functionName: "loadResource",
      type: "stream",
      params: [],
    },
    {
      // id 需固定为 loadSubtitle
      id: "loadSubtitle",
      title: "加载字幕",
      functionName: "loadSubtitle",
      type: "subtitle",
      params: [],
    },
    {
      id: "loadList",
      title: "获取列表",
      functionName: "loadList",
      params: [
        {
          name: "page",
          title: "页码",
          type: "page",
        },
        {
          name: "count",
          title: "数量",
          type: "count",
          value: "12",
        },
      ],
    },
  ],
};

var SKIP_REDIRECT_PROBE_HEADER = "X-Forward-Skip-Redirect-Probe";
var DEMO_SHARED_CACHE_NAMESPACE = "forward.meta.demo";

function buildLiveFlvResource(url, name, description) {
  return {
    name: name || "HTTP-FLV 直播",
    description: description || "一次性/长连接直播流示例",
    url: url,
    customHeaders: {
      "User-Agent": "Mozilla/5.0 (ForwardWidget Demo)",
      Referer: "https://example.com/",
      // 仅用于 HTTP-FLV 直播、一次性签名 URL 等不能被起播前 GET 探测消耗的资源。
      // App 会识别并过滤这个内部 header，不会把它发送给真实 CDN。
      [SKIP_REDIRECT_PROBE_HEADER]: "1",
    },
    playerType: "app",
  };
}

function buildSharedCacheKey(parts) {
  return parts.map(function (part) {
    return encodeURIComponent(String(part || ""));
  }).join(":");
}

function readDemoSharedCache(key) {
  if (!Widget.sharedCache || typeof Widget.sharedCache.get !== "function") {
    return null;
  }
  return Widget.sharedCache.get(DEMO_SHARED_CACHE_NAMESPACE, key);
}

function writeDemoSharedCache(key, value) {
  if (!Widget.sharedCache || typeof Widget.sharedCache.set !== "function") {
    return;
  }
  Widget.sharedCache.set(DEMO_SHARED_CACHE_NAMESPACE, key, value);
}

var DEMO_VIDEO_ITEMS = [
  {
    id: "demo-movie-1",
    type: "url",
    title: "演示电影 - 带详情数据",
    description: "列表项可以带分类和演员；点击详情后可通过 loadDetail 补全剧照、预告片和相关推荐。",
    posterPath: "https://picsum.photos/seed/forward-demo-poster-1/600/900", // 竖图位优先用它
    backdropPath: "https://picsum.photos/seed/forward-demo-backdrop-1/1280/720", // 横图位（详情页顶部/横向列表）优先用它
    mediaType: "movie",
    genreItems: [
      { id: "action", title: "动作" },
      { id: "sci-fi", title: "科幻" },
    ],
    peoples: [
      {
        id: "person-1",
        title: "演示演员",
        avatar: "https://picsum.photos/seed/forward-demo-person-1/400/400",
        role: "主演",
      },
      {
        id: "person-2",
        title: "演示导演",
        avatar: "https://picsum.photos/seed/forward-demo-person-2/400/400",
        role: "导演",
      },
    ],
    link: "demo-detail-1",
  },
  {
    id: "550",
    type: "forward",
    title: "网盘资源匹配测试",
    description: "Forward 类型会把 id/link 自动归一为 fw-550，并在详情页资源模式中按需匹配网盘文件。",
    mediaType: "movie",
    link: "550",
  },
  {
    id: 550,
    type: "tmdb",
    title: "Fight Club",
    mediaType: "movie",
  },
  {
    id: 27205,
    type: "tmdb",
    title: "Inception",
    mediaType: "movie",
  },
  {
    id: 603,
    type: "tmdb",
    title: "The Matrix",
    mediaType: "movie",
  },
  {
    id: 1399,
    type: "tmdb",
    title: "Game of Thrones",
    mediaType: "tv",
  },
  {
    id: 1396,
    type: "tmdb",
    title: "Breaking Bad",
    mediaType: "tv",
  },
  {
    id: 66732,
    type: "tmdb",
    title: "Stranger Things",
    mediaType: "tv",
  },
];

async function loadResource(params) {
  const { tmdbId, imdbId, id, type, seriesName, episodeName, season, episode, link } = params;

  // 如果这里动态签名后拿到 HTTP-FLV 直播/一次性 URL，可返回：
  // buildLiveFlvResource("https://example.com/live/stream.flv?token=...", "直播线路")
  // 普通 mp4、m3u8、稳定直链不需要设置 X-Forward-Skip-Redirect-Probe。

  return [
    {
        name: "测试资源",
        description: "资源介绍，可以包含分辨率、编码、音频等信息\n4k|DV|dts|atmos|7.1", 
        url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    },
    {
        name: "测试资源2",
        description: "资源介绍，可以包含分辨率、编码、音频等信息\n4k|HDR|5.1", 
        url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    },
    {
        name: "测试资源3",
        description: "资源介绍，可以包含分辨率、编码、音频等信息\n1080p|HDR|aac", 
        url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    },
  ] 
  
}

async function loadSubtitle(params) {
  const { tmdbId, imdbId, id, type, seriesName, episodeName, season, episode, link } = params;

  return [
    {
        id: "test-subtitle",
        title: "测试字幕",
        lang: "en",
        count: 100,
        url: "https://dl.subhd.tv/2025/08/1754195078288.srt",
    },
  ]
}

function parseArchiveFileList(value) {
  try {
    var files = JSON.parse(value || "[]");
    return Array.isArray(files) ? files : [];
  } catch (error) {
    return [];
  }
}

function archiveSubtitleScore(file, params) {
  var name = String(file.name || file.path || "").toLowerCase();
  var score = 0;
  if (params.season && params.episode) {
    var season = String(params.season);
    var episode = String(params.episode);
    var seasonPadded = season.padStart(2, "0");
    var episodePadded = episode.padStart(2, "0");
    var patterns = [
      "s" + seasonPadded + "e" + episodePadded,
      "s" + season + "e" + episode,
      season + "x" + episodePadded,
      season + "x" + episode,
    ];
    for (var i = 0; i < patterns.length; i++) {
      if (name.indexOf(patterns[i]) >= 0) {
        score += 100;
        break;
      }
    }
  }
  if (name.indexOf("zh") >= 0 || name.indexOf("简体") >= 0 || name.indexOf("中文") >= 0) {
    score += 10;
  }
  return score;
}

async function resolveSubtitleArchive(params) {
  // 客户端传入的是解压目录内的相对 path，返回时也必须返回同一个相对 path。
  // 不要缓存或拼接本机绝对路径；不同设备、不同下载批次的绝对路径都会变化。
  var subtitleFiles = parseArchiveFileList(params.subtitleFiles || params.files);
  if (subtitleFiles.length === 0) {
    return null;
  }

  var best = subtitleFiles[0];
  var bestScore = archiveSubtitleScore(best, params);
  for (var i = 1; i < subtitleFiles.length; i++) {
    var file = subtitleFiles[i];
    var score = archiveSubtitleScore(file, params);
    if (score > bestScore) {
      best = file;
      bestScore = score;
    }
  }
  return best.path;
}

async function loadList(params) {
  var page = Number(params.page || 1);
  var count = Number(params.count || 12);
  var start = (page - 1) * count;
  var genreId = String(params.genreId || "");
  var peopleId = String(params.peopleId || "");
  var cacheKey = buildSharedCacheKey(["loadList", "v2", page, count, genreId, peopleId]);
  var cachedItems = readDemoSharedCache(cacheKey);
  if (Array.isArray(cachedItems)) {
    return cachedItems;
  }

  var result = [];
  for (var i = 0; i < DEMO_VIDEO_ITEMS.length; i++) {
    var item = DEMO_VIDEO_ITEMS[i];
    if (genreId && !hasGenre(item, genreId)) {
      continue;
    }
    if (peopleId && !hasPeople(item, peopleId)) {
      continue;
    }
    result.push(item);
  }

  var items = result.slice(start, start + count);
  writeDemoSharedCache(cacheKey, items);
  return items;
}

function hasGenre(item, genreId) {
  if (!item.genreItems) {
    return false;
  }
  for (var i = 0; i < item.genreItems.length; i++) {
    if (String(item.genreItems[i].id) === genreId) {
      return true;
    }
  }
  return false;
}

function hasPeople(item, peopleId) {
  if (!item.peoples) {
    return false;
  }
  for (var i = 0; i < item.peoples.length; i++) {
    if (String(item.peoples[i].id) === peopleId) {
      return true;
    }
  }
  return false;
}

async function loadDetail(link) {
  if (link === "550") {
    return {
      id: "550",
      type: "forward",
      title: "网盘资源匹配测试",
      description: "用于测试 Forward 类型资源 ID 自动匹配网盘文件；客户端会将 550 归一为 fw-550。",
      mediaType: "movie",
      link: "550",
    };
  }

  if (link !== "demo-detail-1") {
    return null;
  }

  return {
    id: "demo-movie-1",
    type: "url",
    title: "演示电影 - 带详情数据",
    description: "loadDetail 返回和 loadList 一致的 VideoItem 模型，可补充详情页展示数据。",
    posterPath: "https://picsum.photos/seed/forward-demo-poster-1/600/900", // 竖图位优先；未设 detailPoster 时详情页海报位也用它
    detailPoster: "https://picsum.photos/seed/forward-demo-detail-poster-1/600/900", // 详情页海报位专用，覆盖 posterPath
    backdropPath: "https://picsum.photos/seed/forward-demo-backdrop-1/1280/720", // 详情页顶部大图（横图位）优先用它；未设时回退 coverUrl
    backdropPaths: [ // 详情页剧照横滑（数组，独立字段，不参与上面的回退）
      "https://picsum.photos/seed/forward-demo-still-1/1280/720",
      "https://picsum.photos/seed/forward-demo-still-2/1280/720",
      "https://picsum.photos/seed/forward-demo-still-3/1280/720",
    ],
    trailers: [
      {
        coverUrl: "https://picsum.photos/seed/forward-demo-trailer-1/640/360", // 预告片封面
        url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      },
    ],
    videoUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    releaseDate: "2025-01-01",
    mediaType: "movie",
    rating: 8.4,
    genreItems: [
      { id: "action", title: "动作" },
      { id: "sci-fi", title: "科幻" },
    ],
    peoples: [
      {
        id: "person-1",
        title: "演示演员",
        avatar: "https://picsum.photos/seed/forward-demo-person-1/400/400",
        role: "主演",
      },
      {
        id: "person-2",
        title: "演示导演",
        avatar: "https://picsum.photos/seed/forward-demo-person-2/400/400",
        role: "导演",
      },
    ],
    relatedItems: [
      {
        id: "demo-related-1",
        type: "url",
        title: "相关推荐 - 模块条目",
        posterPath: "https://picsum.photos/seed/forward-demo-related-1/600/900",
        backdropPath: "https://picsum.photos/seed/forward-demo-related-backdrop-1/1280/720",
        mediaType: "movie",
        videoUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
      },
      {
        id: 27205,
        type: "tmdb",
        title: "Inception",
        mediaType: "movie",
      },
    ],
    link: "demo-detail-1",
  };
}
