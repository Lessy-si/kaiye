export const PACKS = {
  ielts: {
    id: "ielts",
    learner: "IELTS",
    examShort: "IELTS",
    exam: "IELTS Academic",
    accent: "ielts",
    today: {
      due: 4,
      main: "speak",
      mainLabel: "口语",
      mainWhy: "先完成到期复习，再做 90 秒 Part 2。",
      minutes: "20 分钟",
      weekSpeak: 1,
      weekRead: 0,
      weekVocabOnly: false
    },
    copy: {
      brand: "开页",
      due: "复习",
      startReview: "开始复习",
      startMain: "开始口语",
      navToday: "今天",
      navReview: "复习",
      navSpeak: "口语",
      navRead: "阅读",
      navMemory: "词汇",
      navProgress: "进度",
      posAsk: "选择词性",
      reveal: "查看答案",
      listenAgain: "再听英音",
      next: "下一题",
      speakHint: "根据自身经历作答，不要写成稿。",
      readHint: "先读完全文，再判断。",
      grammarTitle: "语法",
      emptyReview: "复习已完成。"
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
      sampleCheck: ["learn", "forget", "adult", "english", "time"]
    },
    read: {
      title: "Reading · True / False / Not Given",
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
      due: "复习",
      startReview: "开始复习",
      startMain: "开始口语",
      navToday: "今天",
      navReview: "复习",
      navSpeak: "口语",
      navRead: "阅读",
      navMemory: "词汇",
      navProgress: "进度",
      posAsk: "选择词性",
      reveal: "查看答案",
      listenAgain: "再听英音",
      next: "下一题",
      speakHint: "用完整短句作答，并回问一句。",
      readHint: "先读告示，再选择意思。",
      grammarTitle: "语法",
      emptyReview: "复习已完成。"
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
      sampleCheck: ["like", "weekend", "because", "play", "draw", "football"]
    },
    read: {
      title: "Reading Part 1",
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
  }
};

export const PACK_ORDER = ["ielts", "ket"];
