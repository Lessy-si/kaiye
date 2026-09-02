import { G5 } from "./pack-g5.js?v=39";

export const PACKS = {
  ielts: {
    id: "ielts",
    family: "adult",
    theme: "ielts",
    learner: "IELTS",
    examShort: "IELTS",
    exam: "IELTS Academic",
    accent: "ielts",
    today: {
      due: 20,
      main: "speak",
      mainLabel: "口语",
      mainWhy: "预习先会 20 个搭配。会了的进入间隔复习，不要一天刷完词书。",
      minutes: "45 分钟",
      weekSpeak: 1,
      weekRead: 0,
      weekVocabOnly: false
    },
    copy: {
      brand: "开页",
      due: "预习",
      startReview: "开始预习",
      startMain: "开始口语",
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
      speakHint: "根据自身经历作答，不要写成稿。",
      speakPlaceholder: "Last year I tried to\u2026",
      readHint: "先读完全文，再判断。",
      grammarTitle: "语法",
      emptyReview: "到期词已过完。会了的按遗忘曲线，快忘时再出现。"
    },
    cards: [
      {
        id: "i1",
        lemma: "awareness",
        pos: "n.",
        sense: "意识、察觉",
        collocation: "raise awareness of",
        collocationZh: "提高对……的意识",
        sentence: "I want to raise awareness of why adults forget new words.",
        sentenceZh: "我想让更多人意识到：成年人为什么会忘掉新单词。",
        prompt: "提高对\u2026的意识",
        ipaUk: "/əˈweə.nəs/",
        ipaUs: "/əˈwer.nəs/",
        formula: "aware（察觉）+ -ness（名词后缀）→ 一种状态。不是动词。",
        chunks: [
          { g: "a", ipa: "ə", tip: "弱读音节", stress: false },
          { g: "ware", ipa: "weə", tip: "词根 · 察觉", stress: true },
          { g: "ness", ipa: "nəs", tip: "后缀 · 变成名词", stress: false }
        ]
      },
      {
        id: "i2",
        lemma: "recall",
        pos: "v.",
        sense: "回想、提取记忆",
        collocation: "struggle to recall",
        collocationZh: "难以回想",
        sentence: "I struggle to recall English words when I speak.",
        sentenceZh: "我开口说话时，很难回想出英语单词。",
        prompt: "难以回想",
        ipaUk: "/rɪˈkɔːl/",
        ipaUs: "/rɪˈkɑːl/",
        formula: "re-（回）+ call（叫）→ 回想。动词重音在后；名词 recall 才是 /ˈriː.kɔːl/。",
        chunks: [
          { g: "re", ipa: "rɪ", tip: "前缀 · 再、回", stress: false },
          { g: "call", ipa: "kɔːl", tip: "词根 · 叫回来", stress: true }
        ]
      },
      {
        id: "i3",
        lemma: "routine",
        pos: "n.",
        sense: "常规、日常安排",
        collocation: "daily routine",
        collocationZh: "日常安排",
        sentence: "My daily routine is one or two hours of English.",
        sentenceZh: "我每天的安排是学一到两个小时英语。",
        prompt: "日常安排",
        ipaUk: "/ruːˈtiːn/",
        ipaUs: "/ruːˈtiːn/",
        formula: "法语借词，按音节拼。重音在第二拍。不要读成 route（/ruːt/ 路）。",
        chunks: [
          { g: "rou", ipa: "ruː", tip: "音节 1", stress: false },
          { g: "tine", ipa: "tiːn", tip: "音节 2 · 重音", stress: true }
        ]
      },
      {
        id: "i4",
        lemma: "successful",
        pos: "adj.",
        sense: "成功的",
        collocation: "a successful attempt",
        collocationZh: "一次成功的尝试",
        sentence: "A successful attempt is one I can still use tomorrow.",
        sentenceZh: "一次成功的尝试，是我明天还能用得上的那种。",
        prompt: "成功的（形容词，不是 success）",
        ipaUk: "/səkˈses.fəl/",
        ipaUs: "/səkˈses.fəl/",
        formula: "success（名词）+ -ful（……的）→ 形容词。不能说 I successful。",
        chunks: [
          { g: "suc", ipa: "sək", tip: "弱读", stress: false },
          { g: "cess", ipa: "ses", tip: "词根 · 成功", stress: true },
          { g: "ful", ipa: "fəl", tip: "后缀 · 变成形容词", stress: false }
        ]
      },
      {
        id: "i5",
        lemma: "hesitate",
        pos: "v.",
        sense: "犹豫、迟疑",
        collocation: "hesitate to speak",
        collocationZh: "开口时犹豫",
        sentence: "I still hesitate to speak English in a shop.",
        sentenceZh: "我在店里说英语时还是会犹豫。",
        prompt: "开口时犹豫",
        ipaUk: "/ˈhez.ɪ.teɪt/",
        ipaUs: "/ˈhez.ə.teɪt/",
        formula: "动词。名词 hesitation。不要说 I hesitation。",
        chunks: [
          { g: "hes", ipa: "hez", tip: "重音", stress: true },
          { g: "i", ipa: "ɪ", tip: "弱读", stress: false },
          { g: "tate", ipa: "teɪt", tip: "动词尾巴", stress: false }
        ]
      },
      {
        id: "i6",
        lemma: "fluent",
        pos: "adj.",
        sense: "流利的",
        collocation: "become fluent in",
        collocationZh: "变得流利",
        sentence: "I want to become fluent in daily English, not just exam English.",
        sentenceZh: "我想把日常英语说流利，不只是考试英语。",
        prompt: "变得流利",
        ipaUk: "/ˈfluː.ənt/",
        ipaUs: "/ˈfluː.ənt/",
        formula: "形容词。名词 fluency。说 become fluent in English，不是 fluent English 当动词。",
        chunks: [
          { g: "flu", ipa: "fluː", tip: "重音 · 流", stress: true },
          { g: "ent", ipa: "ənt", tip: "形容词尾巴", stress: false }
        ]
      },
      {
        id: "i7",
        lemma: "retain",
        pos: "v.",
        sense: "记住、保留",
        collocation: "retain new words",
        collocationZh: "留住新词",
        sentence: "I can recognise a word today, but I cannot retain it until next week.",
        sentenceZh: "我今天能认出一个词，但留不到下周。",
        prompt: "留住新词",
        ipaUk: "/rɪˈteɪn/",
        ipaUs: "/rɪˈteɪn/",
        formula: "re-（回）+ tain（拿住）。比 remember 更偏「留得住」。",
        chunks: [
          { g: "re", ipa: "rɪ", tip: "前缀 · 回", stress: false },
          { g: "tain", ipa: "teɪn", tip: "词根 · 拿住", stress: true }
        ]
      },
      {
        id: "i8",
        lemma: "commute",
        pos: "n.",
        sense: "通勤（也可作动词）",
        collocation: "daily commute",
        collocationZh: "日常通勤",
        sentence: "My daily commute in Shenzhen is a good time for listening practice.",
        sentenceZh: "我在深圳通勤时，正好练听力。",
        prompt: "日常通勤",
        ipaUk: "/kəˈmjuːt/",
        ipaUs: "/kəˈmjuːt/",
        formula: "名词：my commute。动词：commute to work。不要说 go commute。",
        chunks: [
          { g: "com", ipa: "kə", tip: "弱读", stress: false },
          { g: "mute", ipa: "mjuːt", tip: "重音", stress: true }
        ]
      },
      {
        id: "i9",
        lemma: "destination",
        pos: "n.",
        sense: "目的地",
        collocation: "a popular destination",
        collocationZh: "热门目的地",
        sentence: "Hong Kong is a popular destination for a short trip from Shenzhen.",
        sentenceZh: "从深圳出发，香港是热门的短途目的地。",
        prompt: "热门目的地",
        ipaUk: "/ˌdes.tɪˈneɪ.ʃən/",
        ipaUs: "/ˌdes.təˈneɪ.ʃən/",
        formula: "名词。动词 destine 很少用。问去哪：What's your destination?",
        chunks: [
          { g: "des", ipa: "des", tip: "次重音", stress: false },
          { g: "ti", ipa: "tɪ", tip: "弱读", stress: false },
          { g: "na", ipa: "neɪ", tip: "主重音", stress: true },
          { g: "tion", ipa: "ʃən", tip: "名词尾巴", stress: false }
        ]
      },
      {
        id: "i10",
        lemma: "accommodation",
        pos: "n.",
        sense: "住宿",
        collocation: "book accommodation",
        collocationZh: "预订住宿",
        sentence: "Before I travel, I book accommodation near a metro station.",
        sentenceZh: "出门前我会订地铁站附近的住宿。",
        prompt: "预订住宿",
        ipaUk: "/əˌkɒm.əˈdeɪ.ʃən/",
        ipaUs: "/əˌkɑː.məˈdeɪ.ʃən/",
        formula: "英式常用不可数。不要说 an accommodation。双写 c、m。",
        chunks: [
          { g: "a", ipa: "ə", tip: "弱读", stress: false },
          { g: "com", ipa: "kɒm", tip: "次重音", stress: false },
          { g: "mo", ipa: "ə", tip: "弱读", stress: false },
          { g: "da", ipa: "deɪ", tip: "主重音", stress: true },
          { g: "tion", ipa: "ʃən", tip: "名词尾巴", stress: false }
        ]
      },
      {
        id: "i11",
        lemma: "evidence",
        pos: "n.",
        sense: "证据",
        collocation: "provide evidence",
        collocationZh: "提供证据",
        sentence: "In Task 2 I need to provide evidence, not only my feeling.",
        sentenceZh: "写 Task 2 时我要给证据，不能只写感觉。",
        prompt: "提供证据",
        ipaUk: "/ˈev.ɪ.dəns/",
        ipaUs: "/ˈev.ə.dəns/",
        formula: "不可数。a piece of evidence。动词是 prove / show，不是 evidence 当动词（美式口语才有）。",
        chunks: [
          { g: "ev", ipa: "ev", tip: "重音", stress: true },
          { g: "i", ipa: "ɪ", tip: "弱读", stress: false },
          { g: "dence", ipa: "dəns", tip: "尾音", stress: false }
        ]
      },
      {
        id: "i12",
        lemma: "significant",
        pos: "adj.",
        sense: "显著的、重要的",
        collocation: "a significant change",
        collocationZh: "显著变化",
        sentence: "One hour a day can make a significant change if I keep it.",
        sentenceZh: "如果坚持，每天一小时也会有显著变化。",
        prompt: "显著变化",
        ipaUk: "/sɪɡˈnɪf.ɪ.kənt/",
        ipaUs: "/sɪɡˈnɪf.ə.kənt/",
        formula: "形容词。名词 significance。副词 significantly。比 big / very important 更学术。",
        chunks: [
          { g: "sig", ipa: "sɪɡ", tip: "弱读", stress: false },
          { g: "nif", ipa: "nɪf", tip: "重音", stress: true },
          { g: "i", ipa: "ɪ", tip: "弱读", stress: false },
          { g: "cant", ipa: "kənt", tip: "尾巴", stress: false }
        ]
      },
      {
        id: "i13",
        lemma: "tend",
        pos: "v.",
        sense: "往往会、倾向于",
        collocation: "tend to forget",
        collocationZh: "往往会忘掉",
        sentence: "Adults tend to forget new words if they only read them once.",
        sentenceZh: "成年人如果只看一遍，往往会忘掉新词。",
        prompt: "往往会忘掉",
        ipaUk: "/tend/",
        ipaUs: "/tend/",
        formula: "tend to + 动词原形。名词 tendency。不要写成 tend forget。",
        chunks: [{ g: "tend", ipa: "tend", tip: "单音节", stress: true }]
      },
      {
        id: "i14",
        lemma: "benefit",
        pos: "v.",
        sense: "受益（也可作名词）",
        collocation: "benefit from",
        collocationZh: "从……中受益",
        sentence: "I benefit from short speaking practice more than from long word lists.",
        sentenceZh: "短的开口练习，比长词表更让我受益。",
        prompt: "从……中受益",
        ipaUk: "/ˈben.ɪ.fɪt/",
        ipaUs: "/ˈben.ə.fɪt/",
        formula: "动词：benefit from。名词：a benefit / the benefits of。不要说 benefit to me 当动词结构。",
        chunks: [
          { g: "ben", ipa: "ben", tip: "重音", stress: true },
          { g: "e", ipa: "ɪ", tip: "弱读", stress: false },
          { g: "fit", ipa: "fɪt", tip: "尾音", stress: false }
        ]
      },
      {
        id: "i15",
        lemma: "challenge",
        pos: "n.",
        sense: "挑战（也可作动词）",
        collocation: "face a challenge",
        collocationZh: "面对挑战",
        sentence: "My main challenge is speaking, not recognising words on a page.",
        sentenceZh: "我最大的挑战是开口，不是在纸上认出单词。",
        prompt: "面对挑战",
        ipaUk: "/ˈtʃæl.ɪndʒ/",
        ipaUs: "/ˈtʃæl.əndʒ/",
        formula: "名词：a challenge。动词：challenge myself。ch 读 /tʃ/。",
        chunks: [
          { g: "chal", ipa: "tʃæl", tip: "重音", stress: true },
          { g: "lenge", ipa: "ɪndʒ", tip: "第二拍", stress: false }
        ]
      },
      {
        id: "i16",
        lemma: "efficient",
        pos: "adj.",
        sense: "高效的",
        collocation: "an efficient method",
        collocationZh: "高效的方法",
        sentence: "Spaced review is an efficient method for adults who forget quickly.",
        sentenceZh: "对忘得快的成年人来说，间隔复习是高效方法。",
        prompt: "高效的方法",
        ipaUk: "/ɪˈfɪʃ.ənt/",
        ipaUs: "/ɪˈfɪʃ.ənt/",
        formula: "形容词。名词 efficiency。副词 efficiently。不要和 effective（有效）混成一个词。",
        chunks: [
          { g: "e", ipa: "ɪ", tip: "弱读", stress: false },
          { g: "ffi", ipa: "fɪʃ", tip: "重音", stress: true },
          { g: "cient", ipa: "ənt", tip: "形容词尾巴", stress: false }
        ]
      },
      {
        id: "i17",
        lemma: "compare",
        pos: "v.",
        sense: "比较",
        collocation: "compared with",
        collocationZh: "与……相比",
        sentence: "Compared with last month, I can say a longer answer now.",
        sentenceZh: "和上个月比，我现在能说更长的回答。",
        prompt: "与……相比",
        ipaUk: "/kəmˈpeə/",
        ipaUs: "/kəmˈper/",
        formula: "compared with / compared to 都常见。名词 comparison。不要写 compare to 漏 -ed 当句首状语。",
        chunks: [
          { g: "com", ipa: "kəm", tip: "弱读", stress: false },
          { g: "pare", ipa: "peə", tip: "重音", stress: true }
        ]
      },
      {
        id: "i18",
        lemma: "environment",
        pos: "n.",
        sense: "环境",
        collocation: "urban environment",
        collocationZh: "城市环境",
        sentence: "The urban environment in Shenzhen is noisy, so I practise with earphones.",
        sentenceZh: "深圳的城市环境很吵，所以我戴耳机练。",
        prompt: "城市环境",
        ipaUk: "/ɪnˈvaɪ.rən.mənt/",
        ipaUs: "/ɪnˈvaɪ.rən.mənt/",
        formula: "名词。形容词 environmental。n 在 -nm- 里仍要读出来。",
        chunks: [
          { g: "en", ipa: "ɪn", tip: "弱读", stress: false },
          { g: "vi", ipa: "vaɪ", tip: "重音", stress: true },
          { g: "ron", ipa: "rən", tip: "弱读", stress: false },
          { g: "ment", ipa: "mənt", tip: "名词尾巴", stress: false }
        ]
      },
      {
        id: "i19",
        lemma: "opportunity",
        pos: "n.",
        sense: "机会",
        collocation: "take the opportunity",
        collocationZh: "抓住机会",
        sentence: "I take the opportunity to order food in English when I travel.",
        sentenceZh: "旅行时我会抓住机会用英语点餐。",
        prompt: "抓住机会",
        ipaUk: "/ˌɒp.əˈtʃuː.nə.ti/",
        ipaUs: "/ˌɑː.pɚˈtuː.nə.t̬i/",
        formula: "可数。an opportunity to do。比 chance 更正式。动词是不存在的 opportune 当「抓住」。",
        chunks: [
          { g: "op", ipa: "ɒp", tip: "次重音", stress: false },
          { g: "por", ipa: "ə", tip: "弱读", stress: false },
          { g: "tu", ipa: "tʃuː", tip: "主重音", stress: true },
          { g: "ni", ipa: "nə", tip: "弱读", stress: false },
          { g: "ty", ipa: "ti", tip: "尾巴", stress: false }
        ]
      },
      {
        id: "i20",
        lemma: "extract",
        pos: "v.",
        sense: "提取、摘出",
        collocation: "extract information",
        collocationZh: "提取信息",
        sentence: "In Reading I extract information from the paragraph, not from my memory.",
        sentenceZh: "阅读时我从段落里提取信息，不靠自己瞎记。",
        prompt: "提取信息",
        ipaUk: "/ɪkˈstrækt/",
        ipaUs: "/ɪkˈstrækt/",
        formula: "动词重音在后 /ɪkˈstrækt/。名词 extract（摘录）重音在前。考试里多用动词。",
        chunks: [
          { g: "ex", ipa: "ɪk", tip: "弱读", stress: false },
          { g: "tract", ipa: "strækt", tip: "重音 · 抽出", stress: true }
        ]
      },
      {
        id: "i21",
        lemma: "reliable",
        pos: "adj.",
        sense: "可靠的",
        collocation: "a reliable source",
        collocationZh: "可靠来源",
        sentence: "I need a reliable source, not a random post about band scores.",
        sentenceZh: "我需要可靠来源，不是随便一条分数帖。",
        prompt: "可靠来源",
        ipaUk: "/rɪˈlaɪ.ə.bəl/",
        ipaUs: "/rɪˈlaɪ.ə.bəl/",
        formula: "rely → reliable。名词 reliability。rely on，不是 rely in。",
        chunks: [
          { g: "re", ipa: "rɪ", tip: "弱读", stress: false },
          { g: "li", ipa: "laɪ", tip: "重音", stress: true },
          { g: "a", ipa: "ə", tip: "弱读", stress: false },
          { g: "ble", ipa: "bəl", tip: "形容词尾巴", stress: false }
        ]
      },
      {
        id: "i22",
        lemma: "access",
        pos: "n.",
        sense: "使用机会、通路",
        collocation: "have access to",
        collocationZh: "能够使用",
        sentence: "I have access to English videos, but I rarely speak.",
        sentenceZh: "我能看到英语视频，但很少开口。",
        prompt: "能够使用",
        ipaUk: "/ˈæk.ses/",
        ipaUs: "/ˈæk.ses/",
        formula: "名词：access to。动词：access the website。双写 c。",
        chunks: [
          { g: "ac", ipa: "æk", tip: "重音", stress: true },
          { g: "cess", ipa: "ses", tip: "第二拍", stress: false }
        ]
      },
      {
        id: "i23",
        lemma: "priority",
        pos: "n.",
        sense: "优先事项",
        collocation: "give priority to",
        collocationZh: "优先做……",
        sentence: "I give priority to speaking this week, not to extra word lists.",
        sentenceZh: "这周我优先开口，不加额外词表。",
        prompt: "优先做……",
        ipaUk: "/praɪˈɒr.ə.ti/",
        ipaUs: "/praɪˈɔːr.ə.t̬i/",
        formula: "名词。形容词 prior。give priority to + 名词。不要说 give priority doing。",
        chunks: [
          { g: "pri", ipa: "praɪ", tip: "弱读", stress: false },
          { g: "or", ipa: "ɒr", tip: "重音", stress: true },
          { g: "i", ipa: "ə", tip: "弱读", stress: false },
          { g: "ty", ipa: "ti", tip: "尾巴", stress: false }
        ]
      },
      {
        id: "i24",
        lemma: "accurate",
        pos: "adj.",
        sense: "准确的",
        collocation: "an accurate answer",
        collocationZh: "准确的答案",
        sentence: "An accurate answer in Listening is the exact word, not a similar one.",
        sentenceZh: "听力里准确答案是原词，不是差不多的词。",
        prompt: "准确的答案",
        ipaUk: "/ˈæk.jə.rət/",
        ipaUs: "/ˈæk.jɚ.ət/",
        formula: "形容词。名词 accuracy。副词 accurately。动词是 correct，不是 accurate。",
        chunks: [
          { g: "ac", ipa: "æk", tip: "重音", stress: true },
          { g: "cu", ipa: "jə", tip: "弱读", stress: false },
          { g: "rate", ipa: "rət", tip: "尾音弱读", stress: false }
        ]
      },
      {
        id: "i25",
        lemma: "improve",
        pos: "v.",
        sense: "提高、改善",
        collocation: "improve my speaking",
        collocationZh: "提高口语",
        sentence: "I improve my speaking by recording one answer, not by reading model essays.",
        sentenceZh: "我靠录一条回答提高口语，不靠读范文。",
        prompt: "提高口语",
        ipaUk: "/ɪmˈpruːv/",
        ipaUs: "/ɪmˈpruːv/",
        formula: "动词。名词 improvement。improve 不接 in 当「提高某技能」的必须结构；improve my speaking 即可。",
        chunks: [
          { g: "im", ipa: "ɪm", tip: "弱读", stress: false },
          { g: "prove", ipa: "pruːv", tip: "重音", stress: true }
        ]
      },
      {
        id: "i26",
        lemma: "pressure",
        pos: "n.",
        sense: "压力",
        collocation: "under pressure",
        collocationZh: "在压力下",
        sentence: "Under pressure in the computer test, I type slower than at home.",
        sentenceZh: "机考一紧张，我打字比在家慢。",
        prompt: "在压力下",
        ipaUk: "/ˈpreʃ.ə/",
        ipaUs: "/ˈpreʃ.ɚ/",
        formula: "不可数为主。under pressure。动词 pressurise / pressure someone。ss 读 /ʃ/。",
        chunks: [
          { g: "pres", ipa: "preʃ", tip: "重音", stress: true },
          { g: "sure", ipa: "ə", tip: "弱读", stress: false }
        ]
      },
      {
        id: "i27",
        lemma: "flexible",
        pos: "adj.",
        sense: "灵活的",
        collocation: "a flexible schedule",
        collocationZh: "灵活的时间安排",
        sentence: "A flexible schedule helps me study after work in Shenzhen.",
        sentenceZh: "灵活安排时间，我才能下班后学。",
        prompt: "灵活的时间安排",
        ipaUk: "/ˈflek.sə.bəl/",
        ipaUs: "/ˈflek.sə.bəl/",
        formula: "形容词。名词 flexibility。动词 flex。不要写成 flexable。",
        chunks: [
          { g: "flex", ipa: "fleks", tip: "重音", stress: true },
          { g: "i", ipa: "ə", tip: "弱读", stress: false },
          { g: "ble", ipa: "bəl", tip: "形容词尾巴", stress: false }
        ]
      },
      {
        id: "i28",
        lemma: "essential",
        pos: "adj.",
        sense: "必不可少的",
        collocation: "it is essential to",
        collocationZh: "必须……",
        sentence: "It is essential to review due cards before I add new ones.",
        sentenceZh: "加新词之前，必须先过到期卡。",
        prompt: "必须……",
        ipaUk: "/ɪˈsen.ʃəl/",
        ipaUs: "/ɪˈsen.ʃəl/",
        formula: "it is essential to do。名词 essence。比 important 更强、更书面。",
        chunks: [
          { g: "e", ipa: "ɪ", tip: "弱读", stress: false },
          { g: "ssen", ipa: "sen", tip: "重音", stress: true },
          { g: "tial", ipa: "ʃəl", tip: "形容词尾巴", stress: false }
        ]
      },
      {
        id: "i29",
        lemma: "overcome",
        pos: "v.",
        sense: "克服",
        collocation: "overcome the fear of",
        collocationZh: "克服对……的恐惧",
        sentence: "I need to overcome the fear of making mistakes when I speak.",
        sentenceZh: "开口时我得克服怕说错的恐惧。",
        prompt: "克服对……的恐惧",
        ipaUk: "/ˌəʊ.vəˈkʌm/",
        ipaUs: "/ˌoʊ.vɚˈkʌm/",
        formula: "不规则：overcome - overcame - overcome。overcome the fear of + 名词 / doing。",
        chunks: [
          { g: "over", ipa: "əʊ.və", tip: "次重音", stress: false },
          { g: "come", ipa: "kʌm", tip: "主重音", stress: true }
        ]
      },
      {
        id: "i30",
        lemma: "concentrate",
        pos: "v.",
        sense: "集中注意力",
        collocation: "concentrate on",
        collocationZh: "把注意力放在……上",
        sentence: "I concentrate on one skill each evening so I do not switch every five minutes.",
        sentenceZh: "我每晚只盯一项，免得五分钟换一次。",
        prompt: "把注意力放在……上",
        ipaUk: "/ˈkɒn.sən.treɪt/",
        ipaUs: "/ˈkɑːn.sən.treɪt/",
        formula: "concentrate on + 名词 / doing。名词 concentration。不要写成 concentrate in。",
        chunks: [
          { g: "con", ipa: "kɒn", tip: "重音", stress: true },
          { g: "cen", ipa: "sən", tip: "弱读", stress: false },
          { g: "trate", ipa: "treɪt", tip: "动词尾巴", stress: false }
        ]
      }
    ],
    grammar: [
      {
        id: "ig1",
        tag: "词性家族",
        task: "改错",
        wrong: "I success in the test.",
        correct: "I succeeded in the test.",
        error: "success",
        fix: "succeeded",
        correctZh: "我考试成功了。",
        rule: "success 是名词。succeeded 才是动词过去式。"
      },
      {
        id: "ig2",
        tag: "连词冲突",
        task: "改错",
        wrong: "Although I was tired, but I studied.",
        correct: "Although I was tired, I studied.",
        error: "but ",
        fix: "I studied",
        correctZh: "虽然我很累，我还是学习了。",
        rule: "although 与 but 只留一个。"
      }
    ],
    speak: {
      title: "Speaking Part 2",
      prompt: "Describe a time you tried to learn something as an adult. You should say: what it was, why you started, and how you felt when you forgot it.",
      cue: ["what", "why", "how you felt"],
      sampleCheck: ["learn", "forget", "adult", "english", "time"],
      model: "Last year I tried to learn English again. I started because I forgot almost every word. I felt frustrated, but I kept going."
    },
    read: {
      title: "Reading · True / False / Not Given",
      kind: "passage",
      passage:
        "Many adults believe they cannot learn a language after forty because they forget new words overnight. Research on retrieval practice suggests a different problem: people reread lists instead of trying to use the words. Forgetting is fastest in the first day. A short test the next morning, even if it feels uncomfortable, does more than another hour of highlighting.",
      question: "Adults forget new words mainly because the brain can no longer learn after forty.",
      options: ["TRUE", "FALSE", "NOT GIVEN"],
      answer: "FALSE",
      why: "原文将原因指向方法（只重读、不提取），并未说明四十岁后大脑无法学习。与原文相反，故为 FALSE。"
    }
  },
  ket: {
    id: "ket",
    family: "child",
    theme: "ket",
    learner: "KET",
    examShort: "KET",
    exam: "A2 Key",
    accent: "ket",
    today: {
      due: 4,
      main: "speak",
      mainLabel: "口语",
      mainWhy: "先完成卡片复习，再练习 Part 1 简短问答。",
      minutes: "15 分钟",
      weekSpeak: 2,
      weekRead: 1,
      weekVocabOnly: false
    },
    copy: {
      brand: "开页",
      due: "预习",
      startReview: "开始预习",
      startMain: "开始口语",
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
      speakHint: "用完整短句作答，并回问一句。",
      speakPlaceholder: "I like drawing at the weekend because\u2026 What about you?",
      readHint: "先读告示，再选择意思。",
      grammarTitle: "语法",
      emptyReview: "到期词已过完。会了的按遗忘曲线，快忘时再出现。"
    },
    cards: [
      {
        id: "k1",
        lemma: "hobby",
        pos: "n.",
        sense: "爱好",
        collocation: "my favourite hobby",
        collocationZh: "我最喜欢的爱好",
        sentence: "My favourite hobby is drawing.",
        sentenceZh: "我最喜欢的爱好是画画。",
        prompt: "爱好（名词）",
        ipaUk: "/ˈhɒb.i/",
        ipaUs: "/ˈhɑː.bi/",
        formula: "两个音节。bb 只是拼写，/b/ 只发一次。",
        chunks: [
          { g: "hob", ipa: "hɒb", tip: "重音", stress: true },
          { g: "by", ipa: "i", tip: "y 发 /i/", stress: false }
        ]
      },
      {
        id: "k2",
        lemma: "favourite",
        pos: "adj.",
        sense: "最喜欢的（英式拼写）",
        collocation: "favourite subject",
        collocationZh: "最喜欢的科目",
        sentence: "My favourite subject is art.",
        sentenceZh: "我最喜欢的科目是美术。",
        prompt: "最喜欢的（形容词）",
        ipaUk: "/ˈfeɪ.vər.ɪt/",
        ipaUs: "/ˈfeɪ.vər.ɪt/",
        formula: "favour + -ite。英式拼 our；美式 favorite 少一个 u，读音几乎一样。",
        chunks: [
          { g: "fav", ipa: "feɪ", tip: "重音", stress: true },
          { g: "our", ipa: "və", tip: "英式 our", stress: false },
          { g: "ite", ipa: "rɪt", tip: "形容词尾巴", stress: false }
        ]
      },
      {
        id: "k3",
        lemma: "because",
        pos: "conj.",
        sense: "因为",
        collocation: "because I like\u2026",
        collocationZh: "因为我喜欢……",
        sentence: "I like art because I can draw animals.",
        sentenceZh: "我喜欢美术，因为我可以画动物。",
        prompt: "因为（连词）",
        ipaUk: "/bɪˈkɒz/",
        ipaUs: "/bɪˈkɔːz/",
        formula: "重音在第二拍。cause 单独读 /kɔːz/，because 里英音是 /kɒz/。",
        chunks: [
          { g: "be", ipa: "bɪ", tip: "轻读", stress: false },
          { g: "cause", ipa: "kɒz", tip: "重音", stress: true }
        ]
      },
      {
        id: "k4",
        lemma: "weekend",
        pos: "n.",
        sense: "周末",
        collocation: "at the weekend",
        collocationZh: "在周末（英式）",
        sentence: "I play football at the weekend.",
        sentenceZh: "我周末踢足球。",
        prompt: "周末",
        ipaUk: "/ˌwiːkˈend/",
        ipaUs: "/ˈwiːk.end/",
        formula: "week（周）+ end（末）。英式常说 at the weekend，美式常说 on the weekend。",
        chunks: [
          { g: "week", ipa: "wiːk", tip: "周", stress: false },
          { g: "end", ipa: "end", tip: "末 · 英音主重音", stress: true }
        ]
      }
    ],
    grammar: [
      {
        id: "kg1",
        tag: "一般现在时 -s",
        task: "改错",
        wrong: "She play football on Sundays.",
        correct: "She plays football on Sundays.",
        error: "play",
        fix: "plays",
        correctZh: "她星期天踢足球。",
        rule: "he / she / it 后面的动词要加 -s。"
      },
      {
        id: "kg2",
        tag: "a / an",
        task: "填空",
        wrong: "I have ___ orange.",
        correct: "I have an orange.",
        error: "___",
        fix: "an",
        correctZh: "我有一个橙子。",
        rule: "元音音素开头用 an。"
      }
    ],
    speak: {
      title: "Speaking Part 1",
      prompt: "Answer: What do you like doing at the weekend? Then ask: What about you?",
      cue: ["I like\u2026", "because\u2026", "What about you?"],
      sampleCheck: ["like", "weekend", "because", "play", "draw", "football"],
      askBack: true,
      model: "I like drawing at the weekend because I can draw animals. What about you?"
    },
    read: {
      title: "Reading Part 1",
      kind: "sign",
      passage: "PLEASE DO NOT FEED THE ANIMALS\nThank you for helping us keep them healthy.",
      question: "What does this sign mean?",
      options: [
        "You can give food to the animals.",
        "You must not give food to the animals.",
        "The animals are not healthy today."
      ],
      answer: "You must not give food to the animals.",
      why: "Do not feed 表示禁止投喂。告示感谢访客协助保持动物健康，并非指动物今日生病。"
    }
  },
  g5: G5
};

export const PACK_ORDER = ["ielts", "ket", "g5"];

export const SHELF = [
  { type: "pack", id: "ielts" },
  {
    type: "menu",
    id: "child",
    packs: ["ket", "g5"],
    coming: [{ id: "pet", label: "PET" }]
  }
];

export function packTheme(id) {
  return PACKS[id]?.theme || id;
}

export function isChildPack(id) {
  return PACKS[id]?.family === "child";
}
