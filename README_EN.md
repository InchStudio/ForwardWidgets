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

ForwardWidget is a JS component for building modules that provides rich web-related functionality and data models.

## Developing Custom Widgets

ForwardWidget supports extending functionality through JavaScript scripts. Each Widget is an independent JavaScript file that must follow specific structure and specifications.

### Scaffold

Running `node scaffold/create-widget.js` with no options instantly writes a default widget template (id `forward.meta.demo`, module `loadResource`) under `widgets/` and validates the resulting `WidgetMetadata`—no prompts required. Use `--interactive` or pass options such as `--id`, `--title`, `--modules '[...]'`, and `--output widgets` when you need custom values. See `scaffold/README.md` for the full option list.

### Widget Metadata Configuration

Each Widget script must start with a `WidgetMetadata` object that defines the basic information and functional modules:

```javascript
var WidgetMetadata = {
    id: "unique_id",                            // Widget unique identifier
    title: "Widget Title",                      // Widget display title
    description: "Description",                 // Widget description
    author: "Author Name",                      // Author
    site: "https://example.com",                // Website URL
    version: "1.0.0",                           // Widget version
    requiredVersion: "0.0.1",                   // Required ForwardWidget version
    detailCacheDuration: 60,                    // Duration of detail data cache, unit: seconds. default: 60.
    modules: [                                  // List of functional modules
        {
            title: "Module Title",              // Module title
            description: "Description",         // Module description
            requiresWebView: false,             // Whether WebView is required
            functionName: "functionName",       // Handler function name
            sectionMode: false,                 // Whether section mode is supported
            cacheDuration: 3600,                  // module api cache duration, unit: seconds. default: 3600.
            params: [                           // Parameter configuration
                {
                    name: "paramName",          // Parameter name
                    title: "Param Title",       // Parameter display title
                    type: "input",              // Parameter type input | constant | enumeration | count | page | offset
                    description: "Description", // Parameter description
                    value: "defaultValue",      // Default value
                    belongTo: {                 // Triggered only when this condition is met
                        paramName: "param name" // Sub-parameter of the parent parameter
                        value: ["value"]        // Values contained in the parent parameter
                    }
                    placeholders: [             // Placeholder options
                        {
                            title: "Option Title",
                            value: "optionValue"
                        }
                    ],
                    enumOptions: [              // Enumeration options
                        {
                            title: "Option Title",
                            value: "optionValue"
                        }
                    ]
                }
            ]
        }
    ],
    search: {                   // Search function configuration (optional)
        title: "Search",
          functionName: "search",
        params: [/* Search parameter configuration */]
    }
};
```

### Parameter Type Description

Widget supports the following parameter types:

- `input`: Text input field
- `count`: Number counter
- `constant`: Constant value
- `enumeration`: Enumeration selector
- `page`: Page number selector
- `offset`: Current Offset

### Handler Function Specification

Each module needs to implement a corresponding handler function with the same name as `functionName`. The handler function receives a `params` object as a parameter containing all configured parameter values.

```javascript
async function functionName(params = {}) {
    try {
        // 1. Parameter validation
        if (!params.requiredParam) {
            throw new Error("Missing required parameter");
        }

        // 2. Send request
        const response = await Widget.http.get(url, {
            headers: {
                "User-Agent": "Mozilla/5.0 ...",
                "Referer": "https://example.com"
            }
        });

        // 3. Parse response
        const docId = Widget.dom.parse(response.data);
        const elements = Widget.dom.select(docId, "selector");

        // 4. Return results
        return elements.map(element => ({
            id: "unique_id",
            type: "type",
            title: "title",
            coverUrl: "url",
            // ... other properties
        }));
    } catch (error) {
        console.error("Processing failed:", error);
        throw error;
    }
}
```

### DOM Operation API

Widget has built-in cheerio for DOM parsing.

```javascript
// Get cheerio handle
const $ = Widget.html.load(htmlContent);
```

### HTTP Request API

Widget provides HTTP request API:

```javascript
// options example
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

let data = response.data
```

### Storage And Shared Cache API

`Widget.storage` is private key-value storage for the current Widget script. Modules in the same script can share it, but other scripts cannot read it. Use it for lightweight script-local state, cursors, or the last selected option.

```javascript
Widget.storage.set("lastCategory", "movie");
const lastCategory = Widget.storage.get("lastCategory");
Widget.storage.remove("lastCategory");
```

`Widget.sharedCache` is an explicit shared cache for data that multiple official modules or scripts can safely reuse, such as common category lists, site configuration, or temporary parse results. Always pass a `namespace` so unrelated modules do not overwrite each other.

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

Shared cache entries do not expire automatically, and scripts do not get a global clear operation. When data should be invalidated, write a versioned key or call `Widget.sharedCache.remove(namespace, key)` for the specific item. The App's Settings > Module Cache cleanup removes shared cache data together with normal widget cache data.

If a module needs to stay compatible with older clients, check whether `Widget.sharedCache` exists before calling it; `widgets/demo.js` includes that guarded pattern.

### List Module API

A normal video list module should be declared in `WidgetMetadata.modules`, with `functionName` pointing to the handler. The handler returns `VideoItem[]`.

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

When users open a list from a category or actor on the detail page, the client goes back to the list module that produced the current item and passes the selected id in `params`:

```javascript
// Genre id, matching genreItems[].id
params.genreId

// Actor / person id
params.peopleId
```

Category and actor objects in list items must include `id`; otherwise the detail page cannot open the matching list.

### Loading Detail Data When Type is "link"

```javascript
async function loadDetail(link) {
    // Return VideoItem or VideoItem[], using the same model as loadList items
}
```

`loadDetail` is a top-level Widget function, not a module in `modules`. The detail page calls it with the list item's `link` to supplement detail data such as stills, trailers, categories, actors, related items, and playback URL.

### Playback Resource Module API

When a playback URL must be generated **at playback time** (for example live stream signatures, short-lived tokens, or multiple CDN lines), do not store the one-time URL in `videoUrl` from `loadDetail`. Declare a module with `id: "loadResource"` and `type: "stream"` in `WidgetMetadata.modules`; the client calls it when playback starts, when users switch lines, or when resources are refreshed.

```javascript
modules: [
  {
    id: "loadResource",
    title: "Load Resource",
    functionName: "loadResource",
    type: "stream",
    cacheDuration: 0,
    params: []
  }
]

async function loadResource(params) {
  // params may include tmdbId / imdbId / id / type / season / episode / link / videoUrl.
  const liveUrl = await getFreshPlaybackUrl(params.link);
  return [
    {
      name: "Live Line",
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

`loadResource` returns `VideoResource[]`:

- `name`: Resource line name shown in the resource list.
- `description`: Optional line description, such as resolution, codec, audio, or source.
- `url`: Required final playback URL.
- `customHeaders` / `headers`: Optional playback request headers.
- `playerType`: Optional, `system` or `app`.

#### Skipping The Pre-Playback Redirect Probe

`X-Forward-Skip-Redirect-Probe: "1"` is an internal control header for the player. Use it for HTTP-FLV live streams, one-time signed URLs, long-lived live connections, or similar resources that may be consumed by a pre-playback GET probe. The client skips redirect probing when it sees this header and filters the header before the real playback request, so it is not sent to the CDN.

Do not add this header to every resource. Normal mp4 files, stable direct links, and m3u8/HLS resources should usually keep the default redirect probing behavior. HLS playlist refresh is handled by the player; this header is not a polling or continuous-refresh mechanism.

### Subtitle Archive Selection API

`loadSubtitle` may return a `.zip` subtitle archive URL. The client downloads and extracts it. If the script defines a top-level `resolveSubtitleArchive(params)` function, the client calls it before using the subtitle so the script can return the real file path to use. This function does not need to be declared in `WidgetMetadata.modules`.

```javascript
async function resolveSubtitleArchive(params) {
  const subtitleFiles = JSON.parse(params.subtitleFiles || "[]");
  const best = subtitleFiles.find(file => file.name.includes("English")) || subtitleFiles[0];
  return best ? best.path : null;
}
```

Additional params:

- `archiveName`: Archive file name.
- `archiveUrl`: Archive download URL.
- `subtitleId` / `subtitleName` / `subtitleLanguage`: Current subtitle candidate information.
- `files`: JSON string for all extracted regular files.
- `subtitleFiles`: JSON string filtered to subtitle files supported by the client.

Each item in `files` and `subtitleFiles` includes:

- `path`: The real relative path inside the extracted directory, such as `Season 1/E02.en.ass`. Return this value as-is; do not construct absolute paths.
- `name`: File name.
- `extension`: Lowercase file extension.
- `size`: File size, possibly empty.

The return value can be a relative path string, a string array, `{ path: "..." }`, or `{ files: ["..."] }`. If the function is missing, returns nothing, or returns a path outside the extracted directory, the client falls back to its default automatic selection.

### Return Data Format

Handler functions need to return an array of objects that conform to the ForwardWidget data model:

```javascript
// Video list item
{
    id: "unique_id",            // Based on the main value of different types. When type is url, it's the corresponding url. When type is douban, imdb, or tmdb, id is the corresponding id value. For tmdb id, it needs to be composed of type.id, e.g., tv.123 movie.234.
    type: "type",               // Type identifier url, douban, imdb, tmdb
    title: "title",             // Title
    coverUrl: "url",            // Generic fallback cover: used after backdropPath in landscape slots, last in portrait slots. Filling only this works everywhere
    posterPath: "url",          // Vertical poster, preferred in portrait slots; also recognizes aliases posterUrl / poster_url
    detailPoster: "url",        // Optional, dedicated poster for the detail page, overrides posterPath
    backdropPath: "url",        // Horizontal cover, preferred in landscape slots (detail page top, horizontal lists)
    releaseDate: "date",        // Release date
    mediaType: "tv|movie",      // Media type
    rating: "5",                // Rating
    genreTitle: "genre",        // Genre
    genreItems: [               // Clickable categories; detail page uses id to open a list
      {
        id: "action",
        title: "Action"
      }
    ],
    peoples: [                  // Actors / people; detail page uses id to open a list
      {
        id: "person_id",
        title: "Actor Name",
        avatar: "url",
        role: "Role"
      }
    ],
    duration: 123,              // Duration number
    durationText: "00:00",      // Duration text
    previewUrl: "url",          // Preview video URL
    trailers: [                 // Trailers; object format is recommended
      {
        coverUrl: "url",        // Trailer cover
        url: "videoUrl"         // Trailer URL
      }
    ],
    videoUrl: "videoUrl",       // Video playback URL
    link: "link",               // Detail page URL
    episode: 1,                 // Episode number
    description: "description", // Description
    playerType: "system",       // player type system | app
    backdropPaths: ["url"],     // Stills / screenshots shown on detail page
    childItems: [VideoItem],    // Nested items of current object, maximum one level
    episodeItems: [VideoItem],  // Episode list
    relatedItems: [VideoItem]   // Related recommendations
}
```

`loadList` and `loadDetail` should use the same `VideoItem` model. `loadDetail` may return only the fields needed by the detail page, but field names and structures should stay consistent.

#### Image fields & display slots (important)

The App picks the image field by **display slot**, with a **fallback chain**: an item only needs one or two of these fields, and missing slots fall back automatically (left to right, first non-empty value wins).

| Display slot | Fallback chain |
|---|---|
| Detail page top image, horizontal list thumbnail (landscape slot) | `backdropPath` → `coverUrl` → `posterPath` |
| Vertical poster wall (portrait slot, poster-style list) | `posterPath` → `backdropPath` → `coverUrl` |
| Detail page poster slot | `detailPoster` (falls back to the portrait slot) |
| Detail page stills carousel | `backdropPaths` (array, independent field, not part of the chains above) |
| Trailer cover | `trailers[].coverUrl` → `coverUrl` → `backdropPath` → `posterPath` |

- **`coverUrl` is the "generic fallback cover"**: filling only it shows an image in both landscape (second priority) and portrait (last priority) slots. "Detail page top has an image without `backdropPath` set" is exactly the fallback to `coverUrl`.
- **Field aliases**: `posterPath` also recognizes `posterUrl` / `poster_url`; `backdropPaths` also recognizes `backdropImageUrls`.
- **`tmdb` / `douban` / `imdb` types don't use these chains**: they use the built-in detail page, where images come from the corresponding platform's data; for `tmdb`, pass raw TMDB paths (e.g. `/abc.jpg`) to `posterPath`/`backdropPath`.
- **Rule of thumb**: fill `backdropPath` for landscape slots (detail top, horizontal lists) and `posterPath` for portrait slots (posters); if you only have one image and don't want to distinguish orientation, fill `coverUrl` as the all-slot fallback.

### Best Practices

1. **Error Handling**
   - Use try-catch to catch exceptions
   - Provide meaningful error messages
   - Output debug information to console

2. **Parameter Validation**
   - Validate required parameters
   - Validate parameter values
   - Handle default values

3. **Performance Optimization**
   - Use appropriate request headers
   - Cache frequently used data
   - Optimize DOM selectors

4. **Code Organization**
   - Use clear function naming
   - Add necessary comments
   - Modularize processing logic

### Danmu Segment Loading Process

ForwardWidget supports danmu segment loading functionality, suitable for long video (such as anime, TV series) danmu systems. Danmu are organized by time segments, supporting on-demand loading to improve performance and user experience.

#### Danmu Module Configuration

When configuring danmu modules in `WidgetMetadata`, you need to specify `type: "danmu"`:

```javascript
modules: [
  {
    id: "searchDanmu",           // Search danmu module, id must be fixed
    title: "Search Danmu",
    functionName: "searchDanmu",
    type: "danmu",               // Specify as danmu type
    params: []
  },
  {
    id: "getComments",           // Get danmu module, id must be fixed
    title: "Get Danmu",
    functionName: "getCommentsById",
    type: "danmu",
    params: []
  },
  {
    id: "getDanmuWithSegmentTime", // Get danmu for specified time module
    title: "Get Danmu for Specified Time",
    functionName: "getDanmuWithSegmentTime",
    type: "danmu",
    params: []
  }
]
```

#### Danmu Parameter Description

Danmu modules automatically carry the following parameters:

- **Basic Parameters**:
  - `tmdbId`: TMDB ID, used for local storage identification
  - `type`: Video type (tv | movie)
  - `title`: Search keywords
  - `commentId`: Danmu ID, carried when actually loading after searching danmu list
  - `animeId`: Anime ID, carried when actually loading after searching anime list

- **Video Information Parameters**:
  - `seriesName`: Series name
  - `episodeName`: Episode name
  - `airDate`: Air date
  - `runtime`: Duration
  - `premiereDate`: Premiere date
  - `season`: Season number (empty for movies)
  - `episode`: Episode number (empty for movies)
  - `link`: Link
  - `videoUrl`: Video link

- **Time Parameters**:
  - `segmentTime`: Specified time, used to get danmu for corresponding time point

#### Danmu Loading Process

Danmu loading process:

1. **Search Danmu** (`searchDanmu`) - Search danmu resources based on video title
2. **Get Danmu Data** (`getCommentsById`) - Get danmu segment information from server or use local cache
3. **Time Point Matching** (`getDanmuWithSegmentTime`) - Find corresponding danmu based on playback time. Optional.

For specific implementation code, see the `widgets/segmentDanmuExample.js` file.

#### Danmu Response Format

Built-in support for mainstream danmu data formats including JSON and XML. You can also customize the returned danmu format, but must follow these specifications:

Format 1:
```javascript
[
  {
    p: "",// Time, position, color, and other attributes
    m: "",
    cid: "",
  }
]
```

Format 2:
```javascript
[
  [
    0,// Time
    "0",// Position
    "#fff",// Color
    "",
    "Content" // Danmu content
  ]
]
```

#### Best Practices

1. **Local Caching**: Use `Widget.storage` to cache danmu segment information, avoiding duplicate requests
2. **Segment Loading**: Load danmu for corresponding time segments on-demand based on playback progress
3. **Error Handling**: Handle network request failures and danmu parsing exceptions
4. **Format Support**: Built-in support for XML and JSON formats, supports zlib compression
5. **Performance Optimization**: Avoid loading all danmu at once, reduce memory usage

### Debugging

The App has built-in module testing tools

1. Use `console.log()` to output debug information
2. Check network requests and responses
3. Verify DOM parsing results
4. Test different parameter combinations

### Module Encryption

ForwardWidget supports optional encryption for JS modules. Encrypted modules are automatically decrypted on import. Unencrypted modules continue to work normally.

#### Online Tool

Visit the [Encryption Tool](https://forward.vvebo.vip/encrypt/) to encrypt in your browser.

#### API

```bash
curl -X POST https://widgetencrypt.inchmade.ai --data-binary @widgets/tmdb.js -o widgets/tmdb.js
```

#### Claude Code

When using Claude Code in this repo, use the built-in command:

```
/fw-encrypt widgets/tmdb.js
```
