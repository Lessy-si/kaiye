/** 沪教牛津五年级上册。课内词 ID 保持 g5u1-1… 以免旧 SRS 失效。 */

function g5u1(id, lemma, pos, sense, core, extra) {
  const zh = String(sense).replace(/^\*+\s*/, "");
  return {
    id: `g5u1-${id}`,
    unit: "u1",
    track: extra.track || "core",
    lemma,
    pos,
    sense: zh,
    core: extra.track === "extra" ? false : Boolean(core),
    say: extra.say || lemma.replace(/\s*\.\.\.\s*/g, " "),
    collocation: extra.collocation || lemma,
    collocationZh: extra.collocationZh || zh,
    sentence: extra.sentence,
    sentenceZh: extra.sentenceZh,
    prompt: extra.prompt || zh,
    ipaUk: extra.ipaUk,
    ipaUs: extra.ipaUs || extra.ipaUk,
    formula: extra.formula,
    chunks: extra.chunks
  };
}

function g5(unit, id, lemma, pos, sense, extra = {}) {
  const zh = String(sense).replace(/^\*+\s*/, "");
  const parts = lemma.split(/\s+/);
  return {
    id: `g5${unit}-${id}`,
    unit,
    track: extra.track || "core",
    lemma,
    pos,
    sense: zh,
    core: extra.track !== "extra",
    say: extra.say || lemma.replace(/\s*\.\.\.\s*/g, " "),
    collocation: extra.collocation || lemma,
    collocationZh: extra.collocationZh || zh,
    sentence: extra.sentence,
    sentenceZh: extra.sentenceZh,
    prompt: extra.prompt || zh,
    ipaUk: extra.ipaUk || "",
    ipaUs: extra.ipaUs || extra.ipaUk || "",
    formula: extra.formula || "",
    chunks: extra.chunks || parts.map((g, i) => ({ g, ipa: "", tip: i === 0 ? "词" : "", stress: i === 0 }))
  };
}

const U1_CORE = [
  g5u1(1, "go jogging", "phr.", "去慢跑", false, {
    ipaUk: "/ɡəʊ ˈdʒɒɡ.ɪŋ/",
    ipaUs: "/ɡoʊ ˈdʒɑː.ɡɪŋ/",
    sentence: "I go jogging in the park at the weekend.",
    sentenceZh: "我周末去公园慢跑。",
    formula: "go + v-ing。going to 后面仍要加 go：going to go jogging。",
    chunks: [
      { g: "go", ipa: "ɡəʊ", tip: "去", stress: false },
      { g: "jog", ipa: "dʒɒɡ", tip: "慢跑", stress: true },
      { g: "ging", ipa: "ɪŋ", tip: "-ing", stress: false }
    ]
  }),
  g5u1(2, "go fishing", "phr.", "去钓鱼", false, {
    ipaUk: "/ɡəʊ ˈfɪʃ.ɪŋ/",
    ipaUs: "/ɡoʊ ˈfɪʃ.ɪŋ/",
    sentence: "Dad and I are going to go fishing at the lake.",
    sentenceZh: "爸爸和我打算去湖边钓鱼。",
    formula: "go fishing = 去钓鱼。不是 go to fishing。",
    chunks: [
      { g: "go", ipa: "ɡəʊ", tip: "去", stress: false },
      { g: "fish", ipa: "fɪʃ", tip: "鱼", stress: true },
      { g: "ing", ipa: "ɪŋ", tip: "-ing", stress: false }
    ]
  }),
  g5u1(3, "do chores", "phr.", "做家务", false, {
    ipaUk: "/duː tʃɔːz/",
    ipaUs: "/duː tʃɔːrz/",
    sentence: "I do chores with my family on Saturday morning.",
    sentenceZh: "星期六早上我和家人一起做家务。",
    formula: "chore 是名词。搭配 do chores，不要说 make chores。",
    chunks: [
      { g: "do", ipa: "duː", tip: "做", stress: false },
      { g: "chores", ipa: "tʃɔːz", tip: "家务（复数）", stress: true }
    ]
  }),
  g5u1(4, "watch TV", "phr.", "看电视", false, {
    ipaUk: "/wɒtʃ tiː ˈviː/",
    ipaUs: "/wɑːtʃ tiː ˈviː/",
    sentence: "Mum is going to watch TV this evening.",
    sentenceZh: "妈妈今晚打算看电视。",
    formula: "watch TV。TV 两个字母都要读出来。",
    chunks: [
      { g: "watch", ipa: "wɒtʃ", tip: "看", stress: true },
      { g: "TV", ipa: "tiː viː", tip: "电视", stress: true }
    ]
  }),
  g5u1(5, "play with friends", "phr.", "和朋友一起玩", false, {
    ipaUk: "/pleɪ wɪð frendz/",
    sentence: "She is going to play with friends after school.",
    sentenceZh: "她打算放学后和朋友玩。",
    formula: "play with + 人。play football 才不加 with。",
    chunks: [
      { g: "play", ipa: "pleɪ", tip: "玩", stress: true },
      { g: "with", ipa: "wɪð", tip: "和", stress: false },
      { g: "friends", ipa: "frendz", tip: "朋友们", stress: true }
    ]
  }),
  g5u1(6, "have a picnic", "phr.", "野餐", false, {
    ipaUk: "/hæv ə ˈpɪk.nɪk/",
    sentence: "We are going to have a picnic in the park on Sunday.",
    sentenceZh: "星期天我们打算在公园野餐。",
    formula: "have a picnic，不是 do a picnic。",
    chunks: [
      { g: "have", ipa: "hæv", tip: "进行", stress: false },
      { g: "a", ipa: "ə", tip: "一个", stress: false },
      { g: "pic", ipa: "pɪk", tip: "重音", stress: true },
      { g: "nic", ipa: "nɪk", tip: "第二拍", stress: false }
    ]
  }),
  g5u1(7, "busy", "adj.", "忙碌的", true, {
    ipaUk: "/ˈbɪz.i/",
    sentence: "I have a busy day at the weekend.",
    sentenceZh: "我周末过得很忙。",
    formula: "形容词。a busy day。名词是 business。",
    chunks: [
      { g: "bus", ipa: "bɪz", tip: "重音 · 不是公共汽车", stress: true },
      { g: "y", ipa: "i", tip: "形容词尾巴", stress: false }
    ]
  }),
  g5u1(8, "weekend", "n.", "周末", false, {
    ipaUk: "/ˌwiːkˈend/",
    ipaUs: "/ˈwiːk.end/",
    sentence: "What do you usually do at the weekend?",
    sentenceZh: "你周末通常做什么？",
    formula: "英式常说 at the weekend。week + end。",
    chunks: [
      { g: "week", ipa: "wiːk", tip: "周", stress: false },
      { g: "end", ipa: "end", tip: "末 · 英音主重音", stress: true }
    ]
  }),
  g5u1(9, "plan", "n.", "计划", false, {
    ipaUk: "/plæn/",
    collocation: "weekend plan",
    collocationZh: "周末计划",
    sentence: "Do you have any plans for the weekend?",
    sentenceZh: "这个周末你有什么计划吗？",
    formula: "可作名词或动词。问计划：Do you have any plans?",
    chunks: [{ g: "plan", ipa: "plæn", tip: "单音节", stress: true }]
  }),
  g5u1(10, "early", "adj.", "早的", true, {
    ipaUk: "/ˈɜː.li/",
    ipaUs: "/ˈɝː.li/",
    collocation: "get up early",
    collocationZh: "早起",
    sentence: "We must get up early and warm up.",
    sentenceZh: "我们必须早起，再做热身。",
    formula: "ear 在 early 里读 /ɜː/。反义 late。",
    chunks: [
      { g: "ear", ipa: "ɜː", tip: "重音", stress: true },
      { g: "ly", ipa: "li", tip: "形容词尾巴", stress: false }
    ]
  }),
  g5u1(11, "catch", "v.", "抓住", true, {
    ipaUk: "/kætʃ/",
    collocation: "catch a fish",
    collocationZh: "抓住一条鱼",
    sentence: "I can't wait to catch more fish than my dad.",
    sentenceZh: "我等不及要钓到比爸爸更多的鱼。",
    formula: "动词。catch - caught - caught。ch 读 /tʃ/。",
    chunks: [{ g: "catch", ipa: "kætʃ", tip: "单音节", stress: true }]
  }),
  g5u1(12, "any", "det.", "任何", true, {
    ipaUk: "/ˈen.i/",
    collocation: "any plans",
    collocationZh: "任何计划",
    sentence: "Do you have any plans for the weekend?",
    sentenceZh: "这个周末你有什么计划吗？",
    formula: "疑问句、否定句里常用 any。不是 a / an。",
    chunks: [
      { g: "an", ipa: "en", tip: "重音", stress: true },
      { g: "y", ipa: "i", tip: "弱读", stress: false }
    ]
  }),
  g5u1(13, "robot", "n.", "机器人", true, {
    ipaUk: "/ˈrəʊ.bɒt/",
    ipaUs: "/ˈroʊ.bɑːt/",
    sentence: "The robot can do chores at home.",
    sentenceZh: "这个机器人能在家做家务。",
    formula: "两个音节，重音在前。o 读 /əʊ/。",
    chunks: [
      { g: "ro", ipa: "rəʊ", tip: "重音", stress: true },
      { g: "bot", ipa: "bɒt", tip: "第二拍", stress: false }
    ]
  }),
  g5u1(14, "sock", "n.", "袜子", true, {
    ipaUk: "/sɒk/",
    ipaUs: "/sɑːk/",
    sentence: "I can't find any socks in my room.",
    sentenceZh: "我房间里找不到袜子。",
    formula: "可数。复数 socks。o 英音 /ɒ/。",
    chunks: [{ g: "sock", ipa: "sɒk", tip: "单音节", stress: true }]
  }),
  g5u1(15, "sweep", "v.", "打扫；清扫", true, {
    ipaUk: "/swiːp/",
    collocation: "sweep the floor",
    collocationZh: "扫地",
    sentence: "I sweep the floor when I do chores.",
    sentenceZh: "我做家务时扫地。",
    formula: "动词。ee 读 /iː/。sweep - swept - swept。",
    chunks: [{ g: "sweep", ipa: "swiːp", tip: "单音节", stress: true }]
  }),
  g5u1(16, "warm up", "phr.", "热身", false, {
    ipaUk: "/wɔːm ʌp/",
    ipaUs: "/wɔːrm ʌp/",
    sentence: "We must warm up before we go jogging.",
    sentenceZh: "慢跑前我们必须热身。",
    formula: "动词短语。warm up，不要写成一个词。",
    chunks: [
      { g: "warm", ipa: "wɔːm", tip: "热", stress: true },
      { g: "up", ipa: "ʌp", tip: "起来", stress: false }
    ]
  }),
  g5u1(17, "more ... than", "phr.", "超过；比……更……", false, {
    say: "more than",
    ipaUk: "/mɔː ðæn/",
    ipaUs: "/mɔːr ðæn/",
    collocation: "more fish than",
    collocationZh: "比……更多的鱼",
    sentence: "I want to catch more fish than my dad.",
    sentenceZh: "我想钓到比爸爸更多的鱼。",
    formula: "比较：more + 名词 + than。more 不是 most。",
    chunks: [
      { g: "more", ipa: "mɔː", tip: "更多", stress: true },
      { g: "than", ipa: "ðæn", tip: "比", stress: false }
    ]
  })
];

const U1_EXTRA = [
  ["e1", "fly a kite", "phr.", "放风筝", "We are going to fly a kite in the park.", "我们打算在公园放风筝。", "fly a kite。kite 是名词。"],
  ["e2", "play basketball", "phr.", "打篮球", "She is going to play basketball after school.", "她打算放学后打篮球。", "球类用 play，不加 the。"],
  ["e3", "clean my bedroom", "phr.", "打扫卧室", "I usually clean my bedroom at the weekend.", "我周末通常打扫卧室。", "clean + 房间。"],
  ["e4", "walk my dog", "phr.", "遛狗", "He is going to walk his dog after dinner.", "他打算晚饭后遛狗。", "walk the/my dog。"],
  ["e5", "have a painting class", "phr.", "上绘画课", "I have a painting class on Sunday morning.", "星期天早上我有绘画课。", "have a … class。"],
  ["e6", "read a story", "phr.", "读故事", "Li Sha is going to read a story to her brother.", "丽莎打算给弟弟读故事。", "read a story，不是 look a story。"],
  ["e7", "wash the dishes", "phr.", "洗碗", "You are going to wash the dishes.", "你将要洗碗。", "dishes 常用复数。"],
  ["e8", "dust the shelves", "phr.", "给架子掸灰", "I dust the shelves when I do chores.", "我做家务时给架子掸灰。", "dust 这里是动词。"],
  ["e9", "clean the windows", "phr.", "擦窗户", "Mum is going to clean the windows this morning.", "妈妈今早打算擦窗户。", "clean the windows。"],
  ["e10", "water the plants", "phr.", "给植物浇水", "We water the plants every Sunday.", "我们每个星期天给植物浇水。", "water 可作动词「浇水」。"]
].map(([id, lemma, pos, zh, sentence, sentenceZh, formula]) =>
  g5u1(id, lemma, pos, zh, false, { track: "extra", sentence, sentenceZh, formula, chunks: lemma.split(" ").map((g, i) => ({ g, ipa: "", tip: "", stress: i === 0 })) })
);

export const G5 = {
  id: "g5",
  family: "child",
  theme: "ket",
  learner: "五年级",
  examShort: "五年级",
  exam: "沪教英语 · 五年级上册",
  accent: "ket",
  today: {
    due: 8,
    main: "speak",
    mainLabel: "开口",
    mainWhy: "一课一课来：先课内词，再会说、会读。拓展词要课内都见过才出现。",
    minutes: "25 分钟",
    weekSpeak: 0,
    weekRead: 0,
    weekVocabOnly: false
  },
  activeUnit: "u1",
  copy: {
    brand: "开页",
    due: "预习",
    startReview: "开始预习",
    startMain: "说周末计划",
    navToday: "今天",
    navReview: "预习",
    navSpeak: "口语",
    navRead: "阅读",
    navMemory: "词汇",
    navProgress: "进度",
    posAsk: "选择词性",
    reveal: "查看答案",
    listenAgain: "再听英音",
    next: "下一题",
    speakHint: "用完整句子说，并回问一句。",
    speakPlaceholder: "This weekend I am going to… What about you?",
    readHint: "先读完全文，再判断。",
    grammarTitle: "语法",
    emptyReview: "本课到期词已过完。会了的不会天天刷，快忘时再叫你。"
  },
  units: [
    {
      id: "u1",
      n: 1,
      title: "Weekend plans",
      ask: "What do we do at the weekend?",
      can: "用 be going to 说周末计划",
      words: 17,
      extra: 10,
      phonics: "wh 多数读 /w/（what, when）；who / whose 读 /h/。",
      path: ["课内词", "开口句", "短阅读", "拓展短语", "语法钉"],
      ready: true,
      grammar: [
        {
          id: "g5u1g1",
          tag: "be going to",
          task: "改错",
          wrong: "I going to go fishing this weekend.",
          correct: "I am going to go fishing this weekend.",
          error: "I going",
          fix: "I am going",
          correctZh: "这个周末我打算去钓鱼。",
          rule: "打算做某事：主语 + am/is/are + going to + 动词原形。"
        },
        {
          id: "g5u1g2",
          tag: "go + -ing",
          task: "改错",
          wrong: "She is going to jogging with her family.",
          correct: "She is going to go jogging with her family.",
          error: "going to jogging",
          fix: "going to go jogging",
          correctZh: "她打算和家人去慢跑。",
          rule: "go jogging 里已经有 go。be going to 后面仍要加原形 go。"
        },
        {
          id: "g5u1g3",
          tag: "be 一致",
          task: "改错",
          wrong: "They is going to have a picnic.",
          correct: "They are going to have a picnic.",
          error: "is",
          fix: "are",
          correctZh: "他们打算去野餐。",
          rule: "I 用 am，he/she 用 is，you/we/they 用 are。"
        }
      ],
      speak: {
        title: "Unit 1 · 开口",
        prompt: "What are you going to do this weekend? Then ask: What about you?",
        cue: ["I am going to…", "on Saturday / Sunday", "What about you?"],
        sampleCheck: ["going to", "weekend", "saturday", "sunday", "jogging", "picnic", "chores", "friends"],
        askBack: true,
        model: "This weekend I am going to go jogging in the park. What about you?"
      },
      read: {
        title: "Unit 1 · 短邮件",
        kind: "passage",
        passage:
          "Hello class,\nThis Saturday I am going to do chores in the morning. In the afternoon I am going to play basketball with my friends. On Sunday we are going to have a picnic in the park.\nChen Rui",
        question: "What is Chen Rui going to do on Sunday?",
        options: ["Do chores at home.", "Play basketball with friends.", "Have a picnic in the park."],
        answer: "Have a picnic in the park.",
        why: "Sunday 对应 picnic。chores 在 Saturday morning，篮球在 Saturday afternoon。"
      }
    },
    {
      id: "u2",
      n: 2,
      title: "Health",
      ask: "How do we stay healthy?",
      can: "用 should / must 给健康建议",
      words: 12,
      extra: 0,
      phonics: "ea 在 healthy 里读 /e/，不是 /iː/。",
      path: ["课内词", "开口句", "短阅读", "语法钉"],
      ready: true,
      grammar: [
        {
          id: "g5u2g1",
          tag: "should",
          task: "改错",
          wrong: "You should eating healthy food.",
          correct: "You should eat healthy food.",
          error: "eating",
          fix: "eat",
          correctZh: "你应该吃健康的食物。",
          rule: "should 后面用动词原形。shouldn't = 不应该。"
        },
        {
          id: "g5u2g2",
          tag: "must",
          task: "改错",
          wrong: "You must to drink water every day.",
          correct: "You must drink water every day.",
          error: "must to drink",
          fix: "must drink",
          correctZh: "你必须每天喝水。",
          rule: "must 后面直接加原形，不要 to。语气比 should 强。"
        },
        {
          id: "g5u2g3",
          tag: "do exercise",
          task: "改错",
          wrong: "She is going to do exercises after school.",
          correct: "She is going to do exercise after school.",
          error: "exercises",
          fix: "exercise",
          correctZh: "她打算放学后做运动。",
          rule: "做运动是 do exercise。do exercises 多指做练习题。"
        }
      ],
      speak: {
        title: "Unit 2 · 开口",
        prompt: "How do you stay healthy? Give one should and one must. Then ask: What about you?",
        cue: ["I should…", "I must…", "What about you?"],
        sampleCheck: ["should", "must", "healthy", "exercise", "sleep", "water"],
        askBack: true,
        model: "I should eat healthy food. I must get enough sleep. What about you?"
      },
      read: {
        title: "Unit 2 · 告示",
        kind: "sign",
        passage: "CLASS HEALTH TIPS\n1. Eat healthy food.\n2. Do exercise every day.\n3. Get enough sleep.\nDon't play on the computer all day.",
        question: "What should the children not do?",
        options: ["Eat fruit.", "Do exercise.", "Play on the computer all day."],
        answer: "Play on the computer all day.",
        why: "告示最后一句 Don't play on the computer all day。前三条是应该做的。"
      }
    },
    {
      id: "u3",
      n: 3,
      title: "Countries",
      ask: "What do you know about different countries?",
      can: "用 in the + 方位 介绍国家",
      words: 16,
      extra: 0,
      phonics: "ou 在 south 读 /aʊ/；在 famous 不这样读。",
      path: ["课内词", "开口句", "短阅读", "语法钉"],
      ready: true,
      grammar: [
        {
          id: "g5u3g1",
          tag: "in the east of",
          task: "改错",
          wrong: "China is in east of Asia.",
          correct: "China is in the east of Asia.",
          error: "in east",
          fix: "in the east",
          correctZh: "中国在亚洲的东部。",
          rule: "方位词前要加 the：in the north/south/east/west of…"
        },
        {
          id: "g5u3g2",
          tag: "capital",
          task: "改错",
          wrong: "Beijing is capital of China.",
          correct: "Beijing is the capital of China.",
          error: "is capital",
          fix: "is the capital",
          correctZh: "北京是中国的首都。",
          rule: "the capital of + 国家。"
        }
      ],
      speak: {
        title: "Unit 3 · 开口",
        prompt: "Tell me about China or the UK. Where is it? What is the capital? Then ask: What about you?",
        cue: ["It is in the… of…", "The capital is…", "Tourists can visit…"],
        sampleCheck: ["capital", "north", "south", "east", "west", "visit", "china", "london", "beijing"],
        askBack: true,
        model: "China is in the east of Asia. Beijing is the capital. What about you?"
      },
      read: {
        title: "Unit 3 · 短介绍",
        kind: "passage",
        passage:
          "The UK is in the northwest of Europe. London is the capital. Tourists can visit Big Ben. Fish and chips is popular there. Many people go on foot in the city.",
        question: "What is the capital of the UK?",
        options: ["Paris", "London", "Beijing"],
        answer: "London",
        why: "第二句 London is the capital。Paris 是法国，Beijing 是中国。"
      }
    },
    {
      id: "u4",
      n: 4,
      title: "Holidays",
      ask: "What's interesting about holidays?",
      can: "用 will 说假期打算",
      words: 14,
      extra: 0,
      phonics: "ai 在 train / waterfall 里常读 /eɪ/ 或拆开读。",
      path: ["课内词", "开口句", "短阅读", "语法钉"],
      ready: true,
      grammar: [
        {
          id: "g5u4g1",
          tag: "will",
          task: "改错",
          wrong: "She wills visit the waterfall.",
          correct: "She will visit the waterfall.",
          error: "wills",
          fix: "will",
          correctZh: "她将去参观瀑布。",
          rule: "will 没有人称变化，一律 will + 原形。否定 won't。"
        },
        {
          id: "g5u4g2",
          tag: "will / going to",
          task: "改错",
          wrong: "Will you going to Yan'an?",
          correct: "Will you go to Yan'an?",
          error: "going to",
          fix: "go to",
          correctZh: "你们会去延安吗？",
          rule: "Will + 主语 + 原形。不要再加 going to。"
        }
      ],
      speak: {
        title: "Unit 4 · 开口",
        prompt: "Where will you go for your holiday? What will you do? Then ask: What about you?",
        cue: ["I will go to…", "I will stay in…", "What about you?"],
        sampleCheck: ["will", "holiday", "mountain", "hotel", "explore", "waterfall"],
        askBack: true,
        model: "I will go to the mountains. I will stay in a hotel. What about you?"
      },
      read: {
        title: "Unit 4 · 短计划",
        kind: "passage",
        passage:
          "This holiday we will go to Yan'an. We will stay in a cave house. We will visit a waterfall and explore the old town. We won't stay in a big hotel.",
        question: "Where will they stay?",
        options: ["In a big hotel.", "In a cave house.", "On the mountain top."],
        answer: "In a cave house.",
        why: "第二句 stay in a cave house。最后一句说 won't stay in a big hotel。"
      }
    },
    {
      id: "u5",
      n: 5,
      title: "Living things",
      ask: "Living or non-living?",
      can: "区分生物与非生物",
      words: 0,
      extra: 0,
      ready: false,
      path: ["课内词", "开口句", "短阅读"],
      note: "课后单词表还没从课本录入。先把 Unit 1–4 钉牢。"
    },
    {
      id: "u6",
      n: 6,
      title: "The Earth",
      ask: "How do we take care of the Earth?",
      can: "说该做与不该做",
      words: 0,
      extra: 0,
      ready: false,
      path: ["课内词", "开口句", "短阅读"],
      note: "课后单词表未录入。"
    },
    {
      id: "u7",
      n: 7,
      title: "Festivals",
      ask: "How do people celebrate?",
      can: "介绍节日",
      words: 0,
      extra: 0,
      ready: false,
      path: ["课内词", "开口句", "短阅读"],
      note: "课后单词表未录入。"
    },
    {
      id: "u8",
      n: 8,
      title: "Music",
      ask: "How does music make us feel?",
      can: "说喜欢的音乐",
      words: 0,
      extra: 0,
      ready: false,
      path: ["课内词", "开口句", "短阅读"],
      note: "课后单词表未录入。"
    }
  ],
  cards: [
    ...U1_CORE,
    ...U1_EXTRA,
    g5("u2", 1, "eat healthy food", "phr.", "吃健康食物", {
      sentence: "You should eat healthy food every day.",
      sentenceZh: "你应该每天吃健康食物。",
      formula: "healthy food，不要写成 health food。"
    }),
    g5("u2", 2, "do exercise", "phr.", "做运动", {
      sentence: "She is going to do more exercise.",
      sentenceZh: "她打算多做运动。",
      formula: "do exercise（运动），不是 do exercises（练习题）。"
    }),
    g5("u2", 3, "get enough sleep", "phr.", "保证充足睡眠", {
      sentence: "We must get enough sleep at night.",
      sentenceZh: "晚上我们必须睡够。",
      formula: "get enough sleep，不要说 have enough sleep。"
    }),
    g5("u2", 4, "must", "v.", "必须", {
      collocation: "must drink water",
      collocationZh: "必须喝水",
      sentence: "You must drink a lot of water.",
      sentenceZh: "你必须多喝水。",
      formula: "情态动词。must + 原形。语气强。"
    }),
    g5("u2", 5, "should", "v.", "应该", {
      collocation: "should eat fruit",
      collocationZh: "应该吃水果",
      sentence: "You should eat more fruit and vegetables.",
      sentenceZh: "你应该多吃水果和蔬菜。",
      formula: "建议用 should，比 must 委婉。"
    }),
    g5("u2", 6, "less", "adj.", "更少的", {
      collocation: "less junk food",
      collocationZh: "更少垃圾食品",
      sentence: "I am going to eat less junk food.",
      sentenceZh: "我打算少吃垃圾食品。",
      formula: "less + 不可数名词。可数常用 fewer。"
    }),
    g5("u2", 7, "hard", "adj.", "难的", {
      sentence: "It is hard to get up early, but I must try.",
      sentenceZh: "早起很难，但我必须试试。",
      formula: "hard 可指「难」或「努力」。"
    }),
    g5("u2", 8, "try", "v.", "尝试", {
      sentence: "I will try to do exercise every day.",
      sentenceZh: "我会试着每天做运动。",
      formula: "try to + 原形。"
    }),
    g5("u2", 9, "ill", "adj.", "生病的", {
      sentence: "If you go to bed late, you may feel ill.",
      sentenceZh: "如果睡得晚，你可能会觉得不舒服。",
      formula: "be ill。名词 illness。"
    }),
    g5("u2", 10, "a glass of", "phr.", "一杯", {
      sentence: "Please drink a glass of water.",
      sentenceZh: "请喝一杯水。",
      formula: "a glass of + 不可数名词。"
    }),
    g5("u2", 11, "Me too.", "phr.", "我也是", {
      sentence: "I like ping-pong. Me too.",
      sentenceZh: "我喜欢乒乓球。我也是。",
      formula: "同意别人的肯定句时说 Me too。"
    }),
    g5("u2", 12, "junk food", "n.", "垃圾食品", {
      sentence: "We shouldn't eat too much junk food.",
      sentenceZh: "我们不应该吃太多垃圾食品。",
      formula: "不可数。eat junk food。"
    }),
    g5("u3", 1, "north", "n.", "北方", {
      collocation: "in the north of",
      collocationZh: "在……的北部",
      sentence: "Beijing is in the north of China.",
      sentenceZh: "北京在中国的北部。"
    }),
    g5("u3", 2, "south", "n.", "南方", {
      sentence: "Sanya is in the south of China.",
      sentenceZh: "三亚在中国的南部。"
    }),
    g5("u3", 3, "east", "n.", "东方", {
      sentence: "Shanghai is in the east of China.",
      sentenceZh: "上海在中国的东部。"
    }),
    g5("u3", 4, "west", "n.", "西方", {
      sentence: "France is in the west of Europe.",
      sentenceZh: "法国在欧洲的西部。"
    }),
    g5("u3", 5, "northwest", "n.", "西北", {
      sentence: "The UK is in the northwest of Europe.",
      sentenceZh: "英国在欧洲的西北部。"
    }),
    g5("u3", 6, "capital", "n.", "首都", {
      collocation: "the capital of",
      collocationZh: "……的首都",
      sentence: "London is the capital of the UK.",
      sentenceZh: "伦敦是英国的首都。"
    }),
    g5("u3", 7, "museum", "n.", "博物馆", {
      sentence: "Tourists can visit a museum in Paris.",
      sentenceZh: "游客可以在巴黎参观博物馆。"
    }),
    g5("u3", 8, "palace", "n.", "王宫、宫殿", {
      sentence: "There is a palace in the capital.",
      sentenceZh: "首都有一座宫殿。"
    }),
    g5("u3", 9, "tourist", "n.", "游客", {
      sentence: "Many tourists visit Beijing every year.",
      sentenceZh: "每年有许多游客参观北京。"
    }),
    g5("u3", 10, "visit", "v.", "参观；拜访", {
      sentence: "We can visit the Great Wall.",
      sentenceZh: "我们可以参观长城。"
    }),
    g5("u3", 11, "across", "prep.", "穿过", {
      sentence: "Go across the street to the museum.",
      sentenceZh: "穿过马路去博物馆。"
    }),
    g5("u3", 12, "fish and chips", "n.", "炸鱼薯条", {
      sentence: "Fish and chips is popular in the UK.",
      sentenceZh: "炸鱼薯条在英国很受欢迎。",
      formula: "整体常作单数，动词用 is。"
    }),
    g5("u3", 13, "popular", "adj.", "流行的；受欢迎的", {
      sentence: "Bread and wine are popular in France.",
      sentenceZh: "面包和葡萄酒在法国很受欢迎。"
    }),
    g5("u3", 14, "wine", "n.", "葡萄酒", {
      sentence: "Wine is popular in France.",
      sentenceZh: "葡萄酒在法国很受欢迎。"
    }),
    g5("u3", 15, "on foot", "phr.", "步行", {
      sentence: "We go to the palace on foot.",
      sentenceZh: "我们步行去宫殿。"
    }),
    g5("u3", 16, "country", "n.", "国家", {
      sentence: "China is a great country in the east of Asia.",
      sentenceZh: "中国是亚洲东部的一个大国。"
    }),
    g5("u4", 1, "mountain", "n.", "山", {
      sentence: "We will climb a mountain this holiday.",
      sentenceZh: "这个假期我们会去爬山。"
    }),
    g5("u4", 2, "cave", "n.", "洞穴", {
      collocation: "cave house",
      collocationZh: "窑洞",
      sentence: "They will stay in a cave house.",
      sentenceZh: "他们将住在窑洞里。"
    }),
    g5("u4", 3, "waterfall", "n.", "瀑布", {
      sentence: "We will visit a waterfall.",
      sentenceZh: "我们会去看瀑布。"
    }),
    g5("u4", 4, "hotel", "n.", "酒店", {
      sentence: "We won't stay in a hotel this time.",
      sentenceZh: "这次我们不住酒店。"
    }),
    g5("u4", 5, "holiday", "n.", "假期", {
      sentence: "Where will you go for your holiday?",
      sentenceZh: "你假期会去哪里？"
    }),
    g5("u4", 6, "explore", "v.", "探索", {
      sentence: "We will explore the old town.",
      sentenceZh: "我们会去探索古镇。"
    }),
    g5("u4", 7, "pagoda", "n.", "塔", {
      sentence: "There is a pagoda on the hill.",
      sentenceZh: "山上有一座塔。"
    }),
    g5("u4", 8, "stay", "v.", "暂住", {
      sentence: "How long will you stay there?",
      sentenceZh: "你们会在那里待多久？"
    }),
    g5("u4", 9, "famous", "adj.", "著名的", {
      sentence: "Hukou Waterfall is very famous.",
      sentenceZh: "壶口瀑布非常有名。"
    }),
    g5("u4", 10, "wonderful", "adj.", "极好的", {
      sentence: "We will have a wonderful holiday.",
      sentenceZh: "我们会有一个极好的假期。"
    }),
    g5("u4", 11, "will", "v.", "将要", {
      sentence: "I will take photos there.",
      sentenceZh: "我会在那里拍照。",
      formula: "will + 原形。没有人称变化。"
    }),
    g5("u4", 12, "high-speed train", "n.", "高铁", {
      sentence: "We'll take the high-speed train to Yan'an.",
      sentenceZh: "我们将坐高铁去延安。"
    }),
    g5("u4", 13, "cave house", "n.", "窑洞", {
      sentence: "I'll stay in a cave house.",
      sentenceZh: "我将住在窑洞里。"
    }),
    g5("u4", 14, "take photos", "phr.", "拍照", {
      sentence: "Will you take photos there?",
      sentenceZh: "你会在那里拍照吗？"
    })
  ]
};

G5.grammar = G5.units[0].grammar;
G5.speak = G5.units[0].speak;
G5.read = G5.units[0].read;
