import actions from "./actions.js"
import api from "./api.js"
import help from "./help.js"
import priv from "./conf.priv.js"
import util from "./util.js"

const { categories } = help

const { Clipboard, Front } = api

// Remove undesired default mappings
const unmaps = {
  mappings: [
    "sb",
    "sw",
    "ob",
    "oe",
    "ow",
    "oy",
    "cp",
    ";cp",
    ";ap",
    "spa",
    "spb",
    "spd",
    "sps",
    "spc",
    "spi",
    "sfr",
    "zQ",
    "zz",
    "zR",
    "ab",
    "Q",
    "q",
    "ag",
    "af",
    ";s",
    "yp",
    "p",
    "<Ctrl-j>",
    "<Ctrl-h>",
  ],
  searchAliases: {
    s: ["g", "d", "b", "e", "w", "s", "h", "y"],
  },
}

const maps = {}

maps.global = [
  {
    alias: "F",
    map: "gf",
    category: categories.mouseClick,
    description: "在非活动的新选项卡中打开链接",
  },
  {
    alias: "zf",
    category: categories.mouseClick,
    description: "在vim编辑器中打开链接URL",
    callback: actions.previewLink,
  },
  // HACK :
  // ╭──────────────────────────────────────────────────────────╮
  // │                          Custom                          │
  // ╰──────────────────────────────────────────────────────────╯
  // FIXME :this not working
  {
    alias: "h",
    map: "i",
    category: categories.mouseClick,
    description: "寻找输入框",
  },
  {
    alias: "i",
    map: "k",
    category: categories.scroll,
    description: "向上滚动",
  },
  {
    alias: "k",
    map: "j",
    category: categories.scroll,
    description: "向下滚动",
  },
  {
    alias: "j",
    map: "S",
    category: categories.scroll,
    description: "后退",
  },
  {
    alias: "l",
    map: "D",
    category: categories.scroll,
    description: "前进",
  },
  {
    alias: "I",
    map: "e",
    category: categories.scroll,
    description: "向上滚动半页",
  },
  {
    alias: "K",
    map: "d",
    category: categories.scroll,
    description: "向下滚动半页",
  },
  {
    alias: "u",
    map: "X",
    category: categories.pageNav,
    description: "向下滚动",
  },
  {
    alias: "J",
    map: "E",
    category: categories.pageNav,
    description: "跳转到左边的标签页",
  },
  {
    alias: "L",
    map: "R",
    category: categories.pageNav,
    description: "跳转到右边的标签页",
  },
  // HACK :
  // ╭──────────────────────────────────────────────────────────╮
  // │                           End                            │
  // ╰──────────────────────────────────────────────────────────╯
  {
    alias: "gh",
    category: categories.scroll,
    description: "滚动到URL哈希指向的元素",
    callback: actions.scrollToHash,
  },
  {
    alias: "gi",
    category: categories.pageNav,
    description: "使用vim编辑器编辑当前URL",
    callback: actions.vimEditURL,
  },
  {
    alias: "gI",
    category: categories.pageNav,
    description: "在新选项卡中查看图像",
    callback: () => util.createHints("img", (i) => actions.openLink(i.src)),
  },
  {
    alias: "gj",
    category: categories.pageNav,
    description: "进入上一级域名",
    callback: () => {
      const subdomains = window.location.host.split(".")
      const parentDomain = (
        subdomains.length > 2 ? subdomains.slice(1) : subdomains
      ).join(".")
      actions.openLink(`${window.location.protocol}//${parentDomain}`)
    },
  },
  {
    alias: "yi",
    category: categories.clipboard,
    description: "复制当前页面的URL路径",
    callback: () => Clipboard.write(window.location.href),
  },
  {
    alias: "yI",
    category: categories.clipboard,
    description: "复制图片URL",
    callback: () => util.createHints("img", (i) => Clipboard.write(i.src)),
  },
  {
    alias: "yA",
    category: categories.clipboard,
    description: "复制链接作为Markdown",
    callback: () =>
      util.createHints("a[href]", (a) =>
        Clipboard.write(`[${a.innerText}](${a.href})`)
      ),
  },
  {
    alias: "yO",
    category: categories.clipboard,
    description: "复制页面URL/标题为组织模式链接",
    callback: () => Clipboard.write(actions.getOrgLink()),
  },
  {
    alias: "yM",
    category: categories.clipboard,
    description: "复制页面URL/标题为组织模式链接",
    callback: () => Clipboard.write(actions.getMarkdownLink()),
  },
  {
    alias: "yT",
    category: categories.tabs,
    description: "重复当前选项卡(非活动的新选项卡)",
    callback: () =>
      actions.openLink(window.location.href, { newTab: true, active: false }),
  },
  // TODO
  // {
  //   alias:       "yx",
  //   category:    categories.tabs,
  //   description: "Cut current tab",
  //   callback:    () => actions.cutTab(),
  // },
  // {
  //   alias:       "px",
  //   category:    categories.tabs,
  //   description: "Paste tab",
  //   callback:    () => actions.pasteTab(),
  // },
  {
    alias: ";se",
    category: categories.settings,
    description: "编辑设置",
    callback: actions.editSettings,
  },
  {
    alias: "gS",
    category: categories.chromeURLs,
    description: "打开Chrome设置",
  },
  {
    alias: "=W",
    category: categories.misc,
    description: "查找域的whois信息",
    callback: () => actions.openLink(actions.getWhoisUrl(), { newTab: true }),
  },
  {
    alias: "=d",
    category: categories.misc,
    description: "查找域的whois信息",
    callback: () => actions.openLink(actions.getDnsInfoUrl(), { newTab: true }),
  },
  {
    alias: "=D",
    category: categories.misc,
    description: "查找域的所有信息",
    callback: () =>
      actions.openLink(actions.getDnsInfoUrl({ all: true }), { newTab: true }),
  },
  {
    alias: "=c",
    category: categories.misc,
    description: "显示谷歌的页面缓存版本",
    callback: () =>
      actions.openLink(actions.getGoogleCacheUrl(), { newTab: true }),
  },
  {
    alias: "=a",
    category: categories.misc,
    description: "显示Archive.org Wayback Machine页",
    callback: () => actions.openLink(actions.getWaybackUrl(), { newTab: true }),
  },
  {
    alias: "=A",
    category: categories.misc,
    description: "显示域的Alexa.com信息",
    callback: () => actions.openLink(actions.getAlexaUrl(), { newTab: true }),
  },
  {
    alias: "=s",
    category: categories.misc,
    description: "查看社会讨论页",
    callback: () =>
      actions.openLink(actions.getDiscussionsUrl(), { newTab: true }),
  },
  {
    alias: "=o",
    category: categories.misc,
    description: "显示outline.com版本的页面",
    callback: () => actions.openLink(actions.getOutlineUrl(), { newTab: true }),
  },
  {
    alias: "=bw",
    category: categories.misc,
    description: "显示页面的BuiltWith报告",
    callback: () =>
      actions.openLink(actions.getBuiltWithUrl(), { newTab: true }),
  },
  {
    alias: "=wa",
    category: categories.misc,
    description: "显示Wappalyzer报告页",
    callback: () =>
      actions.openLink(actions.getWappalyzerUrl(), { newTab: true }),
  },
  {
    alias: ";pd",
    category: categories.misc,
    description: "从SurfingKeys切换PDF查看器",
    callback: actions.togglePdfViewer,
  },
  {
    alias: "gxE",
    map: "gxt",
    category: categories.tabs,
    description: "关闭左标签",
  },
  {
    alias: "gxR",
    map: "gxT",
    category: categories.tabs,
    description: "向右关闭标签",
  },
  {
    alias: "\\cgh",
    category: categories.clipboard,
    description: "打开剪贴板字符串作为GitHub路径(例如:torvalds / linux)",
    callback: async () => {
      const { url } = actions.gh.parseRepo(await navigator.clipboard.readText())
      Front.showBanner(`Open ${url}`)
      actions.openLink(url, { newTab: true })
    },
  },
  {
    alias: "oh",
    category: categories.omnibar,
    description: "从历史记录打开URL",
    callback: () => Front.openOmnibar({ type: "History" }),
  },
]

const googleSearchResultSelector = [
  "a h3",
  "h3 a",
  "a[href^='/search']:not(.fl):not(#pnnext,#pnprev):not([role]):not(.hide-focus-ring)",
  "g-scrolling-carousel a",
  ".rc > div:nth-child(2) a",
  ".kno-rdesc a",
  ".kno-fv a",
  ".isv-r > a:first-child",
  ".dbsr > a:first-child",
  ".X5OiLe",
  ".WlydOe",
  ".fl",
].join(",")

maps["www.google.com"] = [
  {
    alias: "a",
    description: "打开搜索结果",
    callback: () => util.createHints(googleSearchResultSelector),
  },
  {
    alias: "A",
    description: "打开搜索结果(新标签)",
    callback: () =>
      util.createHints(
        googleSearchResultSelector,
        actions.openAnchor({ newTab: true, active: false })
      ),
  },
  {
    alias: "d",
    description: "在DuckDuckGo打开搜索",
    callback: actions.go.ddg,
  },
]

maps["algolia.com"] = [
  {
    alias: "a",
    description: "打开搜索结果",
    callback: () => util.createHints(".item-main h2>a:first-child"),
  },
]

const ddgSelector = [
  "a[rel=noopener][target=_self]:not([data-testid=result-extras-url-link])",
  ".js-images-show-more",
  ".module--images__thumbnails__link",
  ".tile--img__sub",
].join(",")

maps["duckduckgo.com"] = [
  {
    alias: "a",
    description: "打开搜索结果",
    callback: () => util.createHints(ddgSelector),
  },
  {
    alias: "A",
    description: "打开搜索结果(非活动的新选项卡)",
    callback: () =>
      util.createHints(
        ddgSelector,
        actions.openAnchor({ newTab: true, active: false })
      ),
  },
  {
    leader: "",
    alias: "]]",
    description: "展示更多成果",
    callback: () => document.querySelector(".result--more__btn").click(),
  },
  {
    alias: "g",
    description: "在谷歌打开搜索",
    callback: actions.dg.goog,
  },
  {
    alias: "sgh",
    description: "搜索网站:github.com",
    callback: () => actions.dg.siteSearch("github.com"),
  },
  {
    alias: "sre",
    description: "搜索网站:reddit.com",
    callback: () => actions.dg.siteSearch("reddit.com"),
  },
]

maps["youtube.com"] = [
  {
    leader: "",
    alias: "A",
    description: "打开视频",
    callback: () =>
      util.createHints(
        "*[id='video-title']",
        actions.openAnchor({ newTab: true })
      ),
  },
  {
    leader: "",
    alias: "C",
    description: "打开通道",
    callback: () => util.createHints("*[id='byline']"),
  },
  {
    leader: "",
    alias: "gH",
    description: "转到主页",
    callback: () =>
      actions.openLink("https://www.youtube.com/feed/subscriptions?flow=2"),
  },
  {
    leader: "",
    alias: "F",
    description: "切换全屏",
    callback: () =>
      actions.dispatchMouseEvents(
        document.querySelector("#movie_player.ytp-fullscreen-button"),
        "mousedown",
        "click"
      ),
  },
  {
    leader: "",
    alias: "Yt",
    description: "复制YouTube视频链接为当前时间",
    callback: () => Clipboard.write(actions.yt.getCurrentTimestampLink()),
  },
  {
    leader: "",
    alias: "Ym",
    description: "复制YouTube视频markdown链接为当前时间",
    callback: () =>
      Clipboard.write(actions.yt.getCurrentTimestampMarkdownLink()),
  },
]

maps["vimeo.com"] = [
  {
    alias: "F",
    description: "切换全屏",
    callback: () => document.querySelector(".fullscreen-icon").click(),
  },
]

maps["bilibili.com"] = [
  {
    leader: "",
    alias: "F",
    description: "切换全屏",
    callback: () =>
      document
        .querySelector(
          "#bilibili-player > div > div > div.bpx-player-primary-area > div.bpx-player-video-area > div.bpx-player-control-wrap > div.bpx-player-control-entity > div.bpx-player-control-bottom > div.bpx-player-control-bottom-right > div.bpx-player-ctrl-btn.bpx-player-ctrl-full"
        )
        .click(),
  },
]
maps["github.com"] = [
  {
    alias: "A",
    description: "打开存储库操作页面",
    callback: () => actions.gh.openRepoPage("/actions"),
  },
  {
    alias: "C",
    description: "打开存储库提交页面",
    callback: () => actions.gh.openRepoPage("/commits"),
  },
  {
    alias: "I",
    description: "打开存储库问题页面",
    callback: () => actions.gh.openRepoPage("/issues"),
  },
  {
    alias: "N",
    description: "打开通知页面",
    callback: () => actions.gh.openPage("/notifications"),
  },
  {
    alias: "P",
    description: "打开存储库Pull Requests页面",
    callback: () => actions.gh.openRepoPage("/pulls"),
  },
  {
    alias: "R",
    description: "打开存储库页面",
    callback: () => actions.gh.openRepoPage("/"),
  },
  {
    alias: "S",
    description: "打开存储库设置页面",
    callback: () => actions.gh.openRepoPage("/settings"),
  },
  {
    alias: "W",
    description: "打开存储库Wiki页面",
    callback: () => actions.gh.openRepoPage("/wiki"),
  },
  {
    alias: "X",
    description: "打开存储库安全页面",
    callback: () => actions.gh.openRepoPage("/security"),
  },
  {
    alias: "O",
    description: "打开存储库所有者的配置文件页面",
    callback: actions.gh.openRepoOwner,
  },
  {
    alias: "M",
    description: "打开个人资料页面(“我”)",
    callback: actions.gh.openProfile,
  },
  {
    alias: "a",
    description: "查看存储库",
    callback: actions.gh.openRepo,
  },
  {
    alias: "u",
    description: "查看用户",
    callback: actions.gh.openUser,
  },
  {
    alias: "f",
    description: "视图文件",
    callback: actions.gh.openFile,
  },
  {
    alias: "c",
    description: "查看提交",
    callback: actions.gh.openCommit,
  },
  {
    alias: "i",
    description: "查看问题",
    callback: actions.gh.openIssue,
  },
  {
    alias: "p",
    description: "视图拉请求",
    callback: actions.gh.openPull,
  },
  {
    alias: "e",
    description: "查看外部链接",
    callback: () => util.createHints("a[rel=nofollow]"),
  },
  {
    // TODO: Add repetition support: 3gu
    leader: "",
    alias: "gu",
    description: "在URL的一个路径(GitHub)",
    callback: actions.gh.goParent,
  },
  {
    alias: "s",
    description: "切换star",
    callback: actions.gh.star({ toggle: true }),
  },
  {
    alias: "yy",
    description: "复制工程路径",
    callback: async () => Clipboard.write(util.getURLPath({ count: 2 })),
  },
  {
    alias: "Y",
    description: "复制项目路径(含域)",
    callback: () =>
      Clipboard.write(util.getURLPath({ count: 2, domain: true })),
  },
  {
    alias: "l",
    description: "切换回购语言统计信息",
    callback: actions.gh.toggleLangStats,
  },
  {
    alias: "D",
    description: "查看GoDoc项目",
    callback: actions.viewGodoc,
  },
  {
    alias: "G",
    description: "查看SourceGraph",
    callback: actions.gh.viewSourceGraph,
  },
  {
    alias: "r",
    description: "查看实时原始版本的文件",
    callback: () =>
      actions.gh
        .selectFile({ directories: false })
        .then((file) => actions.openLink(file.rawUrl, { newTab: true })),
  },
  {
    alias: "yr",
    description: "复制原始链接到文件",
    callback: () =>
      actions.gh
        .selectFile({ directories: false })
        .then((file) => Clipboard.write(file.rawUrl)),
  },
  {
    alias: "yf",
    description: "复制链接到文件",
    callback: () =>
      actions.gh.selectFile().then((file) => Clipboard.write(file.url)),
  },
  {
    alias: "gcp",
    description: "在repo中打开剪贴板字符串作为文件路径",
    callback: actions.gh.openFileFromClipboard,
  },
]

maps["raw.githubusercontent.com"] = [
  {
    alias: "R",
    description: "打开存储库页面",
    callback: () => actions.gh.openRepoPage("/"),
  },
  {
    alias: "F",
    description: "打开源文件",
    callback: actions.gh.openSourceFile,
  },
]

maps["github.io"] = [
  {
    alias: "R",
    description: "打开存储库页面",
    callback: () => actions.gh.openGithubPagesRepo(),
  },
]

maps["gitlab.com"] = [
  {
    alias: "s",
    description: "切换star",
    callback: actions.gl.star,
  },
  {
    alias: "y",
    description: "复制工程路径",
    callback: () => Clipboard.write(util.getURLPath({ count: 2 })),
  },
  {
    alias: "Y",
    description: "复制项目路径(含域)",
    callback: () =>
      Clipboard.write(util.getURLPath({ count: 2, domain: true })),
  },
  {
    alias: "D",
    description: "查看GoDoc项目",
    callback: actions.viewGodoc,
  },
]

maps["twitter.com"] = [
  {
    alias: "f",
    description: "遵循用户",
    callback: () =>
      util.createHints("div[role='button'][data-testid$='follow']"),
  },
  {
    alias: "s",
    description: "就像推特",
    callback: () => util.createHints("div[role='button'][data-testid$='like']"),
  },
  {
    alias: "R",
    description: "vt. 转发推特（在社交网站Twitter上转发他人的推特信息）",
    callback: () =>
      util.createHints("div[role='button'][data-testid$='retweet']"),
  },
  {
    alias: "c",
    description: "评论/答复",
    callback: () => util.createHints("div[role='button'][data-testid='reply']"),
  },
  {
    alias: "T",
    description: "新推特",
    callback: () =>
      document
        .querySelector(
          "a[role='button'][data-testid='SideNav_NewTweet_Button']"
        )
        .click(),
  },
  {
    alias: "u",
    description: "跳转至用户",
    callback: actions.tw.openUser,
  },
  {
    alias: "t",
    description: "Goto tweet",
    callback: () =>
      util.createHints(
        "article, article div[data-focusable='true'][role='link'][tabindex='0']"
      ),
  },
]

maps["reddit.com"] = [
  {
    alias: "x",
    description: "崩溃的评论",
    callback: () => util.createHints(".expand"),
  },
  {
    alias: "X",
    description: "折叠下一个注释",
    callback: actions.re.collapseNextComment,
  },
  {
    alias: "s",
    description: "Upvote",
    callback: () => util.createHints(".arrow.up"),
  },
  {
    alias: "S",
    description: "Downvote",
    callback: () => util.createHints(".arrow.down"),
  },
  {
    alias: "e",
    description: "扩大expando",
    callback: () => util.createHints(".expando-button"),
  },
  {
    alias: "a",
    description: "查看帖子(链接)",
    callback: () => util.createHints(".title"),
  },
  {
    alias: "A",
    description: "查看帖子(链接)(非活动的新标签)",
    callback: () =>
      util.createHints(
        ".title",
        actions.openAnchor({ newTab: true, active: false })
      ),
  },
  {
    alias: "c",
    description: "查看帖子(评论)",
    callback: () => util.createHints(".comments"),
  },
  {
    alias: "C",
    description: "查看帖子(评论)(非活动的新标签)",
    callback: () =>
      util.createHints(
        ".comments",
        actions.openAnchor({ newTab: true, active: false })
      ),
  },
]

maps["producthunt.com"] = [
  {
    alias: "a",
    description: "查看产品(外部)",
    callback: actions.ph.openExternal,
  },
  {
    alias: "v",
    description: "查看产品",
    callback: () =>
      util.createHints(
        "ul[class^='postsList_'] > li > div[class^='item_'] > a"
      ),
  },
  {
    alias: "s",
    description: "Upvote产品",
    callback: () => util.createHints("button[data-test='vote-button']"),
  },
]

maps["behance.net"] = [
  {
    alias: "s",
    description: "感谢项目",
    callback: () => util.createHints(".appreciation-button"),
  },
  {
    alias: "b",
    description: "将项目添加到集合",
    callback: () => document.querySelector(".qa-action-collection").click(),
  },
  {
    alias: "a",
    description: "查看项目",
    callback: () => util.createHints(".rf-project-cover__title"),
  },
  {
    alias: "A",
    description: "查看项目(非活动的新选项卡)",
    callback: () =>
      util.createHints(
        ".rf-project-cover__title",
        actions.openAnchor({ newTab: true, active: false })
      ),
  },
]

maps["wikipedia.org"] = [
  {
    alias: "s",
    description: "切换当前文章的简单版本",
    callback: actions.wp.toggleSimple,
  },
  {
    alias: "a",
    description: "视图页面",
    callback: () =>
      util.createHints(
        "#bodyContent :not(sup):not(.mw-editsection) > a:not([rel=nofollow])"
      ),
  },
  {
    alias: "e",
    description: "查看外部链接",
    callback: () => util.createHints("a[rel=nofollow]"),
  },
  {
    alias: "ys",
    description: "将文章摘要复制为Markdown",
    callback: () => Clipboard.write(actions.wp.markdownSummary()),
  },
  {
    alias: "R",
    description: "查看WikiRank当前文章",
    callback: actions.wp.viewWikiRank,
  },
]

maps["stackoverflow.com"] = [
  {
    alias: "a",
    description: "查看问题",
    callback: () => util.createHints("a.question-hyperlink"),
  },
]

const rescriptMeta = {
  docsPat: "/docs(/.*)?",
}

maps["rescript-lang.org"] = [
  // Links / elements
  {
    leader: "",
    alias: "i",
    description: "焦点搜索域",
    path: `(${rescriptMeta.docsPat})?$`,
    callback: actions.re.focusSearch,
  },
  {
    alias: "a",
    description: "打开文档link",
    path: rescriptMeta.docsPat,
    callback: () => util.createHints("a[href^='/docs/']"),
  },

  // Shorcuts
  {
    alias: "L",
    description: "打开语言手册",
    callback: () => actions.openLink("/docs/manual/latest/introduction"),
  },
  {
    alias: "R",
    description: "打开ReScript + React文档",
    callback: () => actions.openLink("/docs/react/latest/introduction"),
  },
  {
    alias: "G",
    description: "打开GenType文档",
    callback: () => actions.openLink("/docs/gentype/latest/introduction"),
  },
  {
    alias: "P",
    description: "打开包索引",
    callback: () => actions.openLink("/packages"),
  },
  {
    alias: "Y",
    description: "打开的操场",
    callback: () => actions.openLink("/try"),
  },
  {
    alias: "S",
    description: "打开语法查找",
    callback: () => actions.openLink("/syntax-lookup"),
  },
  {
    alias: "F",
    description: "打开社区论坛",
    callback: () => actions.openLink("https://forum.rescript-lang.org/"),
  },
  {
    alias: "A",
    description: "打开API文档",
    callback: () => actions.openLink("/docs/manual/latest/api"),
  },
  {
    alias: "J",
    description: "打开JS API文档",
    callback: () => actions.openLink("/docs/manual/latest/api/js"),
  },
  {
    alias: "B",
    description: "打开 Belt API文档",
    callback: () => actions.openLink("/docs/manual/latest/api/belt"),
  },
  {
    alias: "D",
    description: "打开DOM API文档",
    callback: () => actions.openLink("/docs/manual/latest/api/dom"),
  },

  // Scroll
  {
    leader: "",
    alias: "w",
    description: "向上滚动侧栏",
    path: rescriptMeta.docsPat,
    callback: () => actions.re.scrollSidebar("up"),
  },
  {
    leader: "",
    alias: "s",
    description: "向下滚动侧栏",
    path: rescriptMeta.docsPat,
    callback: () => actions.re.scrollSidebar("down"),
  },
  {
    leader: "",
    alias: "e",
    description: "向上滚动侧栏页面",
    path: rescriptMeta.docsPat,
    callback: () => actions.re.scrollSidebar("pageUp"),
  },
  {
    leader: "",
    alias: "d",
    description: "向下滚动侧栏页面",
    path: rescriptMeta.docsPat,
    callback: () => actions.re.scrollSidebar("pageDown"),
  },
  {
    leader: "",
    alias: "k",
    description: "滚动主体向上",
    path: rescriptMeta.docsPat,
    callback: () => actions.re.scrollContent("up"),
  },
  {
    leader: "",
    alias: "j",
    description: "滚动主体向下",
    path: rescriptMeta.docsPat,
    callback: () => actions.re.scrollContent("down"),
  },
  {
    leader: "",
    alias: "K",
    description: "滚动主体页面向上",
    path: rescriptMeta.docsPat,
    callback: () => actions.re.scrollContent("pageUp"),
  },
  {
    leader: "",
    alias: "J",
    description: "滚动正文页面向下",
    path: rescriptMeta.docsPat,
    callback: () => actions.re.scrollContent("pageDown"),
  },
]

maps["devdocs.io"] = [
  {
    leader: "",
    alias: "w",
    description: "向上滚动侧栏",
    callback: () => actions.dv.scrollSidebar("up"),
  },
  {
    leader: "",
    alias: "s",
    description: "向下滚动侧栏",
    callback: () => actions.dv.scrollSidebar("down"),
  },
  {
    leader: "",
    alias: "e",
    description: "向上滚动侧栏页面",
    callback: () => actions.dv.scrollSidebar("pageUp"),
  },
  {
    leader: "",
    alias: "d",
    description: "向下滚动侧栏页面",
    callback: () => actions.dv.scrollSidebar("pageDown"),
  },
  {
    leader: "",
    alias: "k",
    description: "滚动主体向上",
    callback: () => actions.dv.scrollContent("up"),
  },
  {
    leader: "",
    alias: "j",
    description: "滚动主体向下",
    callback: () => actions.dv.scrollContent("down"),
  },
  {
    leader: "",
    alias: "K",
    description: "滚动主体页面向上",
    callback: () => actions.dv.scrollContent("pageUp"),
  },
  {
    leader: "",
    alias: "J",
    description: "滚动正文页面向下",
    callback: () => actions.dv.scrollContent("pageDown"),
  },
]

maps["ebay.com"] = [
  {
    alias: "fs",
    description: "Fakespot",
    callback: actions.fakeSpot,
  },
]

const registerDOI = (
  domain,
  provider = actions.doi.providers.meta_citation_doi
) => {
  if (!maps[domain]) {
    maps[domain] = []
  }
  maps[domain].push({
    alias: "O",
    description: "打开数字对象标识符",
    callback: () => {
      const url = actions.doi.getLink(provider)
      if (url) {
        actions.openLink(url, { newTab: true })
      }
    },
    hide: true,
  })
}

if (priv.doi_handler) {
  registerDOI("aaai.org")
  registerDOI("academic.oup.com")
  registerDOI("aeaweb.org")
  registerDOI("aging-us.com")
  registerDOI("ahajournals.org", actions.doi.providers.meta_dcIdentifier_doi)
  registerDOI("ajnr.org")
  registerDOI("annualreviews.org", actions.doi.providers.meta_dcIdentifier_doi)
  registerDOI("apa.org", () =>
    document
      .querySelector(".citation a")
      ?.innerText?.replace(/^https:\/\/doi\.org\//, "")
  )
  registerDOI("ashpublications.org")
  registerDOI("asnjournals.org")
  registerDOI("biomedcentral.com")
  registerDOI("bmj.com")
  registerDOI("brill.com")
  registerDOI("cambridge.org")
  registerDOI("cell.com")
  registerDOI("cmaj.ca")
  registerDOI("cochranelibrary.com")
  registerDOI("diabetesjournals.org")
  registerDOI("direct.mit.edu")
  registerDOI("dl.acm.org", actions.doi.providers.meta_dcIdentifier_doi)
  registerDOI("elifesciences.org", () =>
    document
      .querySelector("meta[name='dc.identifier']")
      ?.content?.replace(/^doi:/, "")
  )
  registerDOI("embopress.org")
  registerDOI("emerald.com", actions.doi.providers.meta_dcIdentifier_doi)
  registerDOI("episciences.org")
  registerDOI("epubs.siam.org", actions.doi.providers.meta_dcIdentifier_doi)
  registerDOI("ersjournals.com")
  registerDOI("europepmc.org")
  registerDOI("frontiersin.org")
  registerDOI("future-science.com", actions.doi.providers.meta_dcIdentifier_doi)
  registerDOI("go.gale.com")
  registerDOI(
    "ieee.org",
    () => document.querySelector(".stats-document-abstract-doi a")?.innerText
  )
  registerDOI("ingentaconnect.com", () =>
    document
      .querySelector("meta[name='DC.identifier']")
      ?.content?.replace(/^info:doi\//, "")
  )
  registerDOI("jacc.or", actions.doi.providers.meta_dcIdentifier_doi)
  registerDOI("jamanetwork.com")
  registerDOI("jci.org")
  registerDOI("jfdc.cnic.cn")
  registerDOI("jlr.org")
  registerDOI("jneurosci.org")
  registerDOI("journals.lww.com")
  registerDOI(
    "journals.physiology.org",
    actions.doi.providers.meta_dcIdentifier_doi
  )
  registerDOI("journals.plos.org")
  registerDOI(
    "journals.sagepub.com",
    actions.doi.providers.meta_dcIdentifier_doi
  )
  registerDOI(
    "journals.uchicago.edu",
    actions.doi.providers.meta_dcIdentifier_doi
  )
  registerDOI("jst.go.jp")
  registerDOI("karger.com")
  registerDOI("koreascience.kr")
  registerDOI("koreascience.or.kr")
  registerDOI("liebertpub.com", actions.doi.providers.meta_dcIdentifier_doi)
  registerDOI("mdpi.com")
  registerDOI(
    "msp.org",
    () => document.querySelector(".paper-doi a")?.innerText
  )
  registerDOI("nature.com")
  registerDOI("nejm.org", actions.doi.providers.meta_dcIdentifier_doi)
  registerDOI("nowpublishers.com")
  registerDOI("nsf.gov")
  registerDOI("ocl-journal.org")
  registerDOI("onlinelibrary.wiley.com")
  registerDOI("pnas.org")
  registerDOI("ncbi.nlm.nih.gov")
  registerDOI("pubs.acs.org", actions.doi.providers.meta_dcIdentifier_doi)
  registerDOI("pubs.geoscienceworld.org")
  registerDOI("pubs.rsna.org", actions.doi.providers.meta_dcIdentifier_doi)
  registerDOI("research.manchester.ac.uk")
  registerDOI(
    "royalsocietypublishing.org",
    actions.doi.providers.meta_dcIdentifier_doi
  )
  registerDOI("rupress.org")
  registerDOI("science.org", actions.doi.providers.meta_dcIdentifier_doi)
  registerDOI("sciencedirect.com")
  registerDOI("scitation.org")
  registerDOI("spandidos-publications.com")
  registerDOI("spiedigitallibrary.org")
  registerDOI("springer.com")
  registerDOI("synapse.koreamed.org")
  registerDOI("tandfonline.com", actions.doi.providers.meta_dcIdentifier_doi)
  registerDOI("thelancet.com")
  registerDOI(
    "worldscientific.com",
    actions.doi.providers.meta_dcIdentifier_doi
  )
}

const aliases = {
  "wikipedia.org": [
    // Wikimedia sites
    "wiktionary.org",
    "wikiquote.org",
    "wikisource.org",
    "wikimedia.org",
    "mediawiki.org",
    "wikivoyage.org",
    "wikibooks.org",
    "wikinews.org",
    "wikiversity.org",
    "wikidata.org",

    // MediaWiki-powered sites
    "wiki.archlinux.org",
  ],

  "stackoverflow.com": [
    "stackexchange.com",
    "serverfault.com",
    "superuser.com",
    "askubuntu.com",
    "stackapps.com",
    "mathoverflow.net",
  ],
}

export default {
  unmaps,
  maps,
  aliases,
}
