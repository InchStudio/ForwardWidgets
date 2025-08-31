/**
 * 分段弹幕示例模块，该模块无法直接用于项目，需要实现后使用。
 */

// 弹幕组件元数据配置
WidgetMetadata = {
  id: "forward.danmu.example",
  title: "自定义弹幕示例",
  version: "1.0.0",
  requiredVersion: "0.0.2",
  description: "从指定服务器获取弹幕示例",
  author: "Forward",
  site: "https://github.com/InchStudio/ForwardWidgets",
  // 全局参数配置
  globalParams: [
    {
      name: "server",
      title: "自定义服务器",
      type: "input",
      placeholders: [
        {
          title: "弹弹play",
          value: "https://api.dandanplay.net",
        },
      ],
    },
  ],
  // 功能模块配置
  modules: [
    {
      //id需固定为searchDanmu
      id: "searchDanmu",
      title: "搜索弹幕",
      functionName: "searchDanmu",
      type: "danmu",
      params: [],
    },
    {
      //id需固定为getComments
      id: "getComments",
      title: "获取弹幕",
      functionName: "getCommentsById",
      type: "danmu",
      params: [],
    },
    {
      id: "getDanmuWithSegmentTime",
      title: "获取指定时刻弹幕",
      functionName: "getDanmuWithSegmentTime",
      type: "danmu",
      params: [],
    }
  ],
};

/**
 * 搜索弹幕函数
 * @param {Object} params - 搜索参数
 * @param {string} params.title - 搜索关键词（视频标题）
 * @returns {Object} 返回包含动漫信息的搜索结果
 */
async function searchDanmu(params) {
  const { title } = params;
  // 返回搜索结果，这里简化处理，如果不遵循弹弹 Play的查找逻辑，可以在这里直接实现自己的逻辑去查找影片。
  return {
    animes: [
      {
        "bangumiId": "-1",
        "animeTitle": title,
      }
    ]
  };
}

/**
 * 根据弹幕ID获取弹幕数据
 * @param {Object} params - 参数对象
 * @param {string} params.server - 弹幕服务器地址
 * @param {string} params.commentId - 弹幕ID，Optional。在搜索到弹幕列表后实际加载时会携带
 * @param {string} params.link - 链接，Optional
 * @param {string} params.videoUrl - 视频链接，Optional
 * @param {string} params.season - 季，电影时为空，Optional
 * @param {string} params.episode - 集，电影时为空，Optional
 * @param {string} params.tmdbId - TMDB ID，用于本地存储标识，Optional
 * @param {string} params.type - 类型，tv | movie，Optional
 * @param {string} params.title - 搜索关键词，Optional
 * @param {string} params.seriesName - 剧名，Optional
 * @param {string} params.episodeName - 集名，Optional
 * @param {string} params.airDate - 播出日期，Optional
 * @param {string} params.runtime - 时长，Optional
 * @param {string} params.premiereDate - 首播日期，Optional
 * @param {string} params.animeId - 动漫ID，Optional。在搜索到动漫列表后实际加载时会携带
 * @param {string} params.segmentTime - 指定时刻，Optional。在搜索到弹幕列表后实际加载时会携带
 * @returns {Array|null} 返回弹幕数据数组，如果没有数据则返回null
 */
async function getCommentsById(params) {
  const { server, commentId, segmentTime, tmdbId } = params;

  // 首先检查本地存储是否已有弹幕数据
  const segmentList = Widget.storage.get(tmdbId).barrage_list;
  if (segmentList) {
    // 如果本地有数据，直接使用本地数据获取弹幕
    return await _getDanmuWith(segmentList, segmentTime);
  }

  // 本地没有数据，从服务器API获取弹幕信息
  const response = await Widget.http.get(
    `${server}/api/v2/comment/${commentId}?withRelated=true&chConvert=1`,
    {
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "ForwardWidgets/1.0.0",
      },
    }
  );
  
  const danmuInfo = response.data;
  if (danmuInfo) {
    if (danmuInfo.barrage_list) {
    // 将获取的弹幕分段数据存储到本地，避免重复请求
      Widget.storage.set(tmdbId, danmuInfo);
      // 使用获取的数据处理弹幕
      return await _getDanmuWith(danmuInfo.barrage_list, segmentTime);
    } else if (danmuInfo.comments) {
      // 如果包含完整弹幕，则直接返回
      return danmuInfo.comments;
    }
  }
  return null;
}

/**
 * 根据指定时间点获取弹幕
 * @param {Object} params - 参数对象
 * @param {string} params.server - 弹幕服务器地址
 * @param {string} params.commentId - 弹幕ID，Optional。在搜索到弹幕列表后实际加载时会携带
 * @param {string} params.link - 链接，Optional
 * @param {string} params.videoUrl - 视频链接，Optional
 * @param {string} params.season - 季，电影时为空，Optional
 * @param {string} params.episode - 集，电影时为空，Optional
 * @param {string} params.tmdbId - TMDB ID，用于本地存储标识，Optional
 * @param {string} params.type - 类型，tv | movie，Optional
 * @param {string} params.title - 搜索关键词，Optional
 * @param {string} params.seriesName - 剧名，Optional
 * @param {string} params.episodeName - 集名，Optional
 * @param {string} params.airDate - 播出日期，Optional
 * @param {string} params.runtime - 时长，Optional
 * @param {string} params.premiereDate - 首播日期，Optional
 * @param {string} params.animeId - 动漫ID，Optional。在搜索到动漫列表后实际加载时会携带
 * @param {string} params.segmentTime - 指定时刻，Optional。在搜索到弹幕列表后实际加载时会携带
 * @returns {Array|null} 返回指定时刻的弹幕数据，如果没有数据则返回null
 */
async function getDanmuWithSegmentTime(params) {
  const { segmentTime, tmdbId } = params;
  // 从本地存储获取弹幕数据
  const segmentList = Widget.storage.get(tmdbId).barrage_list;
  if (segmentList) {
    // 根据时间点获取对应的弹幕
    return await _getDanmuWith(segmentList, segmentTime);
  }
  return null;
}

/**
 * 内部方法：根据时间段列表和时间点获取对应的弹幕
 * @param {Array} segmentList - 时间段列表，每个元素包含开始时间、结束时间和弹幕URL
 * @param {number} segmentTime - 指定的时间点
 * @returns {Array|null} 返回对应时间段的弹幕数据
 */
async function _getDanmuWith(segmentList, segmentTime) {
  // 查找包含指定时间点的时间段
  const segment = segmentList.find((item) => {
    return segmentTime >= item.segment_start && segmentTime < item.segment_end;
  });
  
  if (segment) {
    // 如果找到对应时间段，获取该时间段的弹幕
    return await fetchSegmentDanmaku(segment);
  }
  return null;
}

/**
 * 获取指定时间段的弹幕数据
 * @param {Object} segment - 时间段对象，包含segment_url等属性
 * @returns {Array} 返回该时间段的弹幕数据
 */
async function fetchSegmentDanmaku(segment) {
  const url = segment.segment_url;
  // 从指定URL获取弹幕数据
  //如果是 zlib 格式，可以传递参数
  const response = await Widget.http.get(url, {
    zlibMode: false,
    headers: {
      "Content-Type": "application/json",
      "User-Agent": "ForwardWidgets/1.0.0",
    },
  });
  // 内置已经支持 xml, 通用 json 弹幕的解析。如果需要其他格式，可以在这里实现。
  return response.data;
}