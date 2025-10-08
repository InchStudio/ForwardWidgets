WidgetMetadata = {
  id: "forward.tmdb",
  title: "TMDB",
  version: "1.0.3",
  requiredVersion: "0.0.1",
  description: "获取 TMDB 的榜单数据",
  author: "Forward",
  site: "https://github.com/InchStudio/ForwardWidgets",
  modules: [
    {
      id: "nowPlaying",
      title: "正在热映",
      functionName: "nowPlaying",
      params: [
        {
          name: "type",
          title: "接口",
          type: "enumeration",
          enumOptions: [
            {
              title: "电影",
              value: "movie",
            },
            {
              title: "剧集",
              value: "tv",
            },
          ],
        },
        {
          name: "page",
          title: "页码",
          type: "page"
        },
        {
          name: "language",
          title: "语言",
          type: "language",
          value: "zh-CN",
        },
      ],
    },
    {
      id: "trending",
      title: "趋势",
      functionName: "trending",
      params: [
        {
          name: "time_window",
          title: "时间窗口",
          type: "enumeration",
          enumOptions: [
            {
              title: "今日",
              value: "day",
            },
            {
              title: "本周",
              value: "week",
            },
          ],
        },
        {
          name: "language",
          title: "语言",
          type: "language",
          value: "zh-CN",
        },
      ],
    },
    {
      id: "popular",
      title: "备受欢迎",
      functionName: "popular",
      params: [
        {
          name: "type",
          title: "类型",
          type: "enumeration",
          enumOptions: [
            {
              title: "电影",
              value: "movie",
            },
            {
              title: "剧集",
              value: "tv",
            },
          ],
        },
        {
          name: "language",
          title: "语言",
          type: "language",
          value: "zh-CN",
        },
        {
          name: "page",
          title: "页码",
          type: "page",
        },
      ],
    },
    {
      id: "topRated",
      title: "高分内容",
      functionName: "topRated",
      params: [
        {
          name: "type",
          title: "接口",
          type: "enumeration",
          enumOptions: [
            {
              title: "电影",
              value: "movie",
            },
            {
              title: "剧集",
              value: "tv",
            },
          ],
        },
        {
          name: "page",
          title: "页码",
          type: "page"
        },
        {
          name: "language",
          title: "语言",
          type: "language",
          value: "zh-CN",
        },
      ],
    },
    {
      id: "categories",
      title: "分类",
      functionName: "categories",
      params: [
        {
          name: "with_genres",
          title: "分类",
          type: "enumeration",
          enumOptions: [
            {
              title: "合家欢",
              value: "10751",
            },
            {
              title: "动画",
              value: "16",
            },
            {
              title: "喜剧",
              value: "35",
            },
            {
              title: "犯罪",
              value: "80",
            },
            {
              title: "纪录",
              value: "99",
            },
            {
              title: "剧情",
              value: "18",
            },
            {
              title: "悬疑",
              value: "9648",
            },
            {
              title: "西部",
              value: "37",
            },
            {
              title: "儿童",
              value: "10762",
            },
            {
              title: "科幻",
              value: "878",
            },
            {
              title: "动作",
              value: "28",
            },
            {
              title: "惊悚",
              value: "53",
            },
            {
              title: "真人秀",
              value: "10764",
            },
          ],
        },
        {
          name: "type",
          title: "类型",
          type: "enumeration",
          belongTo: {
            paramName: "with_genres",
            value: ["16", "35", "80", "99", "18", "878", "9648", "37", "10751"],
          },
          enumOptions: [
            {
              title: "电影",
              value: "movie",
            },
            {
              title: "剧集",
              value: "tv",
            },
          ],
        },
        {
          name: "with_origin_country",
          title: "国家",
          type: "input",
          belongTo: {
            paramName: "with_genres",
            value: ["10764"],
          },
          value: "CN",
          placeholders: [
            {
              title: "中国",
              value: "CN",
            },
            {
              title: "美国",
              value: "US",
            },
            {
              title: "英国",
              value: "GB",
            },
            {
              title: "日本",
              value: "JP",
            },
            {
              title: "韩国",
              value: "KR",
            },
          ],
        },
        {
          name: "page",
          title: "页码",
          type: "page"
        },
        {
          name: "language",
          title: "语言",
          type: "language",
          value: "zh-CN",
        },
      ],
    },
    {
      id: "networks",
      title: "播出平台",
      functionName: "networks",
      params: [
        {
          name: "with_networks",
          title: "播出平台",
          type: "enumeration",
          enumOptions: [
            {
              title: "Netflix",
              value: "213",
            },
            {
              title: "Disney+",
              value: "2739",
            },
            {
              title: "Apple TV+",
              value: "2552",
            },
            {
              title: "HBO Max",
              value: "3186",
            },
            {
              title: "Hulu",
              value: "453",
            },
          ],
        },
        {
          name: "page",
          title: "页码",
          type: "page"
        },
        {
          name: "language",
          title: "语言",
          type: "language",
          value: "zh-CN",
        },
      ],
    },
    {
      id: "companies",
      title: "出品公司",
      functionName: "companies",
      params: [
        {
          name: "with_companies",
          title: "出品公司",
          type: "enumeration",
          enumOptions: [
            {
              title: "迪士尼",
              value: "2",
            },
            {
              title: "华纳兄弟",
              value: "174",
            },
            {
              title: "哥伦比亚影业",
              value: "5",
            },
            {
              title: "索尼影业",
              value: "34",
            },
            {
              title: "环球影业",
              value: "33",
            },
            {
              title: "派拉蒙影业",
              value: "4",
            },
            {
              title: "二十世纪影业",
              value: "25",
            },
            {
              title: "Marvel",
              value: "420",
            },
          ]
        },
        {
          name: "page",
          title: "页码",
          type: "page"
        },
        {
          name: "language",
          title: "语言",
          type: "language",
          value: "zh-CN",
        },
      ]
    },
    {
      id: "list",
      title: "片单",
      functionName: "list",
      params: [
        {
          name: "url",
          title: "列表地址",
          type: "input",
          description: "TMDB 片单地址",
          placeholders: [
            {
              title: "奥斯卡金像奖",
              value: "https://www.themoviedb.org/list/8512095-2025-oscar-nominations-for-best-picture-97th-academy-awards",
            }
          ],
        }
      ],
    }
  ],
};

// 基础获取TMDB数据方法
async function fetchData(api, params, forceMediaType) {
  try {
    const response = await Widget.tmdb.get(api, { params: params });

    if (!response) {
      throw new Error("获取数据失败");
    }

    console.log(response);
    let data = response.results;
    
    // 如果没有 forceMediaType，先过滤只保留 movie 和 tv 的数据
    if (!forceMediaType) {
      data = data.filter((item) => {
        let mediaType = item.media_type;
        if (mediaType == null) {
          if (item.title) {
            mediaType = "movie";
          } else {
            mediaType = "tv";
          }
        }
        return mediaType === "movie" || mediaType === "tv";
      });
    }
    
    const result = data.map((item) => {
      let mediaType = item.media_type;
      if (forceMediaType) {
        mediaType = forceMediaType;
      } else if (mediaType == null) {
        if (item.title) {
          mediaType = "movie";
        } else {
          mediaType = "tv";
        }
      } 
      return {
        id: item.id,
        type: "tmdb",
        title: item.title ?? item.name,
        description: item.overview,
        releaseDate: item.release_date ?? item.first_air_date,
        backdropPath: item.backdrop_path,
        posterPath: item.poster_path,
        rating: item.vote_average,
        mediaType: mediaType,
        genreTitle: genreTitleWith(item.genre_ids),
      };
    });
    
    return result;
  } catch (error) {
    console.error("调用 TMDB API 失败:", error);
    throw error;
  }
}

async function nowPlaying(params) {
  const type = params.type;
  let api = "tv/on_the_air";
  if (type === "movie") {
    api = "movie/now_playing";
  }
  return await fetchData(api, params, type);
}

async function trending(params) {
  const timeWindow = params.time_window;
  const api = `trending/all/${timeWindow}`;
  delete params.time_window;
  return await fetchData(api, params);
}

async function popular(params) {
  const type = params.type;
  let api = `movie/popular`;
  if (type === "tv") {
    api = `tv/popular`;
  }
  delete params.type;
  return await fetchData(api, params, type);
}

async function topRated(params) {
  const type = params.type;
  let api = `movie/top_rated`;
  if (type === "tv") {
    api = `tv/top_rated`;
  }
  delete params.type;
  return await fetchData(api, params, type);
}

async function categories(params) {
  let genreId = params.with_genres;
  let type = params.type;
  const onlyMovieGenreIds = ["28", "53"];//动作，惊悚
  const onlyTvGenreIds = ["10762", "10764", "10766"];//儿童，真人秀，肥皂剧
  if (genreId == "878" && type == "tv") {
    genreId = "10765";
  }
  if (onlyMovieGenreIds.includes(genreId)) {
    type = "movie";
  }
  if (onlyTvGenreIds.includes(genreId)) {
    type = "tv";
  }
  const api = `discover/${type}`;
  params.with_genres = genreId;
  delete params.type;
  return await fetchData(api, params, type);
}

async function networks(params) {
  let api = `discover/tv`;
  delete params.type;
  return await fetchData(api, params);
}

async function companies(params) {
  let api = `discover/movie`;
  delete params.type;
  return await fetchData(api, params, "movie");
}

async function list(params = {}) {
  let url = params.url;

  // append ?view=grid
  if (!url.includes("view=grid")) {
    if (url.includes("?")) {
      url = url + "&view=grid";
    } else {
      url = url + "?view=grid";
    }
  }

  console.log("请求片单页面:", url);
  // 发送请求获取片单页面
  const response = await Widget.http.get(url, {
    headers: {
      Referer: `https://www.themoviedb.org/`,
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    },
  });

  if (!response || !response.data) {
    throw new Error("获取片单数据失败");
  }


  console.log("片单页面数据长度:", response.data.length);
  console.log("开始解析");

  // 解析 HTML 得到文档 ID
  const $ = Widget.html.load(response.data);
  if (!$ || $ === null) {
    throw new Error("解析 HTML 失败");
  }

  //        // 获取所有视频项，得到元素ID数组
  const coverElements = $(".block.aspect-poster");

  console.log("items:", coverElements);

  let tmdbIds = [];
  for (const itemId of coverElements) {
    const $item = $(itemId);
    const link = $item.attr("href");
    if (!link) {
      continue;
    }
    const match = link.match(/^\/(movie|tv)\/([^\/-]+)-/)
    const type = match?.[1];
    const id = match?.[2];
    if (id && type) {
      tmdbIds.push({ id: `${type}.${id}`, type: 'tmdb' });
    }
  }

  return tmdbIds;
}

function genreTitleWith(genre_ids) {
  if (!genre_ids) {
    return "";
  }
  const genreDict = [
    {"id": 10759, "name": "动作冒险"},
    {"id": 16, "name": "动画"},
    {"id": 35, "name": "喜剧"},
    {"id": 80, "name": "犯罪"},
    {"id": 99, "name": "纪录"},
    {"id": 18, "name": "剧情"},
    {"id": 10751, "name": "家庭"},
    {"id": 10762, "name": "儿童"},
    {"id": 9648, "name": "悬疑"},
    {"id": 10763, "name": "新闻"},
    {"id": 10764, "name": "真人秀"},
    {"id": 10765, "name": "Sci-Fi & Fantasy"},
    {"id": 10766, "name": "肥皂剧"},
    {"id": 10767, "name": "脱口秀"},
    {"id": 10768, "name": "War & Politics"},
    {"id": 37, "name": "西部"},
    {"id": 28, "name": "动作"},
    {"id": 12, "name": "冒险"},
    {"id": 16, "name": "动画"},
    {"id": 35, "name": "喜剧"},
    {"id": 80, "name": "犯罪"},
    {"id": 99, "name": "纪录"},
    {"id": 18, "name": "剧情"},
    {"id": 10751, "name": "家庭"},
    {"id": 14, "name": "奇幻"},
    {"id": 36, "name": "历史"},
    {"id": 27, "name": "恐怖"},
    {"id": 10402, "name": "音乐"},
    {"id": 9648, "name": "悬疑"},
    {"id": 10749, "name": "爱情"},
    {"id": 878, "name": "科幻"},
    {"id": 10770, "name": "电视电影"},
    {"id": 53, "name": "惊悚"},
    {"id": 10752, "name": "战争"},
    {"id": 37, "name": "西部"},
  ]
  if (genre_ids.length > 2) {
    genre_ids = genre_ids.slice(0, 2);
  }
  const result = genre_ids.map(id => {
    const genre = genreDict.find(genre => genre.id == id);
    if (genre) {
      return genre.name;
    }
    return null;
  }).filter(genre => genre !== null).join(", ");
  return result;
}