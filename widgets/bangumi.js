WidgetMetadata = {
  id: "forward.bangumi",
  title: "动漫数据",
  version: "1.0.0",
  requiredVersion: "0.0.1",
  description: "获取时下热门动漫数据和播出日历",
  author: "Forward",
  site: "https://github.com/InchStudio/ForwardWidgets",
  modules: [
    {
      id: "dailySchedule",
      title: "每日播出",
      functionName: "dailySchedule",
      params: [
        {
          name: "day",
          title: "星期",
          type: "enumeration",
          enumOptions: [
            {
              title: "今天",
              value: "today",
            },
            {
              title: "星期一",
              value: "星期一",
            },
            {
              title: "星期二",
              value: "星期二",
            },
            {
              title: "星期三",
              value: "星期三",
            },
            {
              title: "星期四",
              value: "星期四",
            },
            {
              title: "星期五",
              value: "星期五",
            },
            {
              title: "星期六",
              value: "星期六",
            },
            {
              title: "星期日",
              value: "星期日",
            },
          ],
        },
      ],
    },
    {
      id: "trending",
      title: "近期注目",
      functionName: "trending",
      params: [
      ],
    },
  ],
};

// 基础获取 Bangumi 数据方法
async function fetchBangumiData() {
  try {
    // 首先尝试获取最新的数据
    const latestUrl = "https://assets.vvebo.vip/scripts/datas/latest.json";
    
    console.log("正在获取最新 Bangumi 数据:", latestUrl);
    const response = await Widget.http.get(latestUrl);
    
    if (response && response.data) {
      console.log("Bangumi 数据获取成功 (latest.json)");
      return response.data;
    }
  } catch (error) {
    console.log("获取 latest.json 失败，尝试按日期获取:", error.message);
  }
  
  // 如果 latest.json 获取失败，尝试按日期获取
  const maxRetries = 7; // 最多尝试7天
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      // 计算日期，从今天开始往前推
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() - i);
      
      const dateStr = targetDate.getFullYear().toString() + 
                     (targetDate.getMonth() + 1).toString().padStart(2, '0') + 
                     targetDate.getDate().toString().padStart(2, '0');
      
      // 尝试从 OSS 获取 bangumi 数据
      const dataUrl = `https://assets.vvebo.vip/scripts/datas/bangumi_enriched_${dateStr}.json`;
      
      console.log(`正在获取 Bangumi 数据 (尝试第${i + 1}次):`, dataUrl);
      const response = await Widget.http.get(dataUrl);
      
      if (response && response.data) {
        console.log(`Bangumi 数据获取成功，使用日期: ${dateStr}`);
        return response.data;
      }
    } catch (error) {
      console.log(`获取 ${dateStr} 的数据失败:`, error.message);
      // 继续尝试下一天
    }
  }
  
  console.error("所有日期的数据都无法获取，返回空数据结构");
  // 如果所有日期都获取失败，返回空数据结构
  return {
    "星期一": [],
    "星期二": [],
    "星期三": [],
    "星期四": [],
    "星期五": [],
    "星期六": [],
    "星期日": []
  };
}

// 获取 Bangumi 热度数据方法
async function fetchTrendingData() {
  try {
    // 首先尝试获取最新的热度数据
    const latestUrl = "https://assets.vvebo.vip/scripts/datas/latest_bangumi_trending.json";
    
    console.log("正在获取最新 Bangumi 热度数据:", latestUrl);
    const response = await Widget.http.get(latestUrl);
    
    if (response && response.data) {
      console.log("Bangumi 热度数据获取成功 (latest_bangumi_trending.json)");
      return response.data;
    }
  } catch (error) {
    console.log("获取 latest_bangumi_trending.json 失败，尝试按日期获取:", error.message);
  }
  
  // 如果所有日期都获取失败，返回空数组
  return [];
}

// 获取指定日期的动画列表
function getAnimeByDay(data, day, maxItems = 50) {
  let animeList = [];
  
  if (day === "today") {
    // 获取今天是星期几
    const today = new Date();
    const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    const todayWeekday = weekdays[today.getDay()];
    
    console.log(`今天是星期: ${todayWeekday} (getDay() = ${today.getDay()})`);
    animeList = data[todayWeekday] || [];
    
    if (!data[todayWeekday]) {
      console.warn(`数据中没有找到 ${todayWeekday} 的数据`);
    }
  } else {
    animeList = data[day] || [];
    console.log(`获取 ${day} 的数据: ${animeList.length} 部动画`);
  }
  
  return animeList.slice(0, maxItems);
}

// 格式化动画数据
function formatAnimeData(animeList) {
  // 过滤掉无效数据
  const validAnimeList = animeList.filter(anime => {
    return anime && 
           anime.bangumi_name && 
           anime.bangumi_url && 
           anime.tmdb_info && 
           anime.tmdb_info.id;
  });
  
  console.log(`过滤前: ${animeList.length} 部动画, 过滤后: ${validAnimeList.length} 部动画`);
  
  return validAnimeList.map(anime => {
    const hasTmdb = !!anime.tmdb_info;
    return {
      id: anime.tmdb_info?.id || anime.bangumi_url?.split('/').pop() || Math.random().toString(36),
      type: "bangumi",
      title: anime.bangumi_name,
      description: anime.tmdb_info?.description || "",
      releaseDate: anime.tmdb_info?.releaseDate || "",
      backdropPath: anime.tmdb_info?.backdropPath || "",
      posterPath: anime.tmdb_info?.posterPath || "",
      rating: anime.tmdb_info?.rating || 0,
      mediaType: anime.tmdb_info?.mediaType || "tv",
      genreTitle: anime.tmdb_info?.genreTitle || "",
      bangumiUrl: anime.bangumi_url,
      tmdbInfo: anime.tmdb_info,
      hasTmdb: hasTmdb,
      seasonInfo: anime.tmdb_info?.seasonInfo || "",
      originalTitle: anime.tmdb_info?.originalTitle || "",
      popularity: anime.tmdb_info?.popularity || 0,
      voteCount: anime.tmdb_info?.voteCount || 0,
    };
  });
}

// 格式化热度动画数据
function formatTrendingData(trendingList) {
  // 过滤掉无效数据
  const validTrendingList = trendingList.filter(anime => {
    return anime && 
           anime.bangumi_name && 
           anime.bangumi_url && 
           anime.tmdb_info && 
           anime.tmdb_info.id;
  });
  
  console.log(`过滤前: ${trendingList.length} 部热度动画, 过滤后: ${validTrendingList.length} 部热度动画`);
  
  return validTrendingList.map(anime => {
    const hasTmdb = !!anime.tmdb_info;
    return {
      id: anime.tmdb_info?.id || anime.bangumi_url?.split('/').pop() || Math.random().toString(36),
      type: "bangumi",
      title: anime.bangumi_name,
      description: anime.tmdb_info?.description || "",
      releaseDate: anime.tmdb_info?.releaseDate || "",
      backdropPath: anime.tmdb_info?.backdropPath || "",
      posterPath: anime.tmdb_info?.posterPath || "",
      rating: anime.tmdb_info?.rating || 0,
      mediaType: anime.tmdb_info?.mediaType || "tv",
      genreTitle: anime.tmdb_info?.genreTitle || "",
      bangumiUrl: anime.bangumi_url,
      tmdbInfo: anime.tmdb_info,
      hasTmdb: hasTmdb,
      seasonInfo: anime.tmdb_info?.seasonInfo || "",
      originalTitle: anime.tmdb_info?.originalTitle || "",
      popularity: anime.tmdb_info?.popularity || 0,
      voteCount: anime.tmdb_info?.voteCount || 0,
      // 热度数据特有字段
      bangumiRating: anime.bangumi_rating || 0,
      bangumiRank: anime.bangumi_rank || 0,
    };
  });
}

// 每日播出
async function dailySchedule(params) {
  const data = await fetchBangumiData();
  const day = params.day || "today";
  const maxItems = params.maxItems || 50;
  
  const animeList = getAnimeByDay(data, day, maxItems);
  return formatAnimeData(animeList);
}

// 近期注目
async function trending(params) {
  const data = await fetchTrendingData();
  return formatTrendingData(data);
}
