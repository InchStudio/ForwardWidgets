WidgetMetadata = {
  id: "forward.trendingmedia",
  title: "影视数据",
  version: "1.0.0",
  requiredVersion: "0.0.1",
  description: "获取时下热门电影、电视剧和综艺数据",
  author: "Forward",
  site: "https://github.com/InchStudio/ForwardWidgets",
  modules: [
    {
      id: "trendingMovies",
      title: "热门电影",
      functionName: "trendingMovies",
      params: [
      ],
    },
    {
      id: "latestMovies",
      title: "最新电影",
      functionName: "latestMovies",
      params: [
      ],
    },
    {
      id: "trendingTV",
      title: "热门电视剧",
      functionName: "trendingTV",
      params: [
      ],
    },
    {
      id: "trendingVariety",
      title: "热门综艺",
      functionName: "trendingVariety",
      params: [
      ],
    },
  ],
};

// 基础获取影视数据方法
async function fetchMediaData(category) {
  try {
    // 首先尝试获取最新的数据
    const latestUrl = `https://assets.vvebo.vip/scripts/datas/latest_${category}.json`;
    
    console.log(`正在获取最新 ${category} 数据:`, latestUrl);
    const response = await Widget.http.get(latestUrl);
    
    if (response && response.data) {
      console.log(`${category} 数据获取成功 (latest_${category}.json)`);
      return response.data;
    }
  } catch (error) {
    console.log(`获取 latest_${category}.json 失败，尝试按日期获取:`, error.message);
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
      
      // 尝试从 OSS 获取数据
      const dataUrl = `https://assets.vvebo.vip/scripts/datas/trending_${category}_enriched_${dateStr}.json`;
      
      console.log(`正在获取 ${category} 数据 (尝试第${i + 1}次):`, dataUrl);
      const response = await Widget.http.get(dataUrl);
      
      if (response && response.data) {
        console.log(`${category} 数据获取成功，使用日期: ${dateStr}`);
        return response.data;
      }
    } catch (error) {
      console.log(`获取 ${dateStr} 的 ${category} 数据失败:`, error.message);
      // 继续尝试下一天
    }
  }
  
  console.error(`所有日期的 ${category} 数据都无法获取，返回空数组`);
  return [];
}

// 格式化影视数据
function formatMediaData(mediaList) {
  // 过滤掉无效数据
  const validMediaList = mediaList.filter(media => {
    return media && 
           media.title && 
           media.tmdb_info && 
           media.tmdb_info.id;
  });
  
  console.log(`过滤前: ${mediaList.length} 部影视, 过滤后: ${validMediaList.length} 部影视`);
  
  return validMediaList.map(media => {
    const tmdbInfo = media.tmdb_info;
    
    return {
      id: tmdbInfo?.id || media?.id || Math.random().toString(36),
      type: "tmdb",
      title: media?.title || "",
      originalTitle: tmdbInfo?.originalTitle || media?.original_title || "",
      description: tmdbInfo?.description || media?.summary || "",
      releaseDate: tmdbInfo?.releaseDate || media?.release_date || "",
      backdropPath: tmdbInfo?.backdropPath || "",
      posterPath: tmdbInfo?.posterPath || media?.poster_url || "",
      rating: tmdbInfo?.rating || media?.rating || 0,
      mediaType: tmdbInfo?.mediaType || (media?.is_tv ? "tv" : "movie"),
      genreTitle: tmdbInfo?.genreTitle || (media?.genres ? media.genres.join(", ") : ""),
      tmdbInfo: tmdbInfo,
      year: media?.year || "",
      countries: media?.countries || [],
      directors: media?.directors || [],
      actors: media?.actors || [],
      popularity: tmdbInfo?.popularity || 0,
      voteCount: tmdbInfo?.voteCount || 0,
      isNew: media?.is_new || false,
      playable: media?.playable || false,
      episodeCount: media?.episode_count || "",
    };
  });
}

// 热门电影
async function trendingMovies(params) {
  const data = await fetchMediaData("trending");
  return formatMediaData(data);
}

// 最新电影
async function latestMovies(params) {
  const data = await fetchMediaData("latest");
  return formatMediaData(data);
}

// 热门电视剧
async function trendingTV(params) {
  const data = await fetchMediaData("tv");
  return formatMediaData(data);
}

// 热门综艺
async function trendingVariety(params) {
  const data = await fetchMediaData("variety");
  return formatMediaData(data);
}