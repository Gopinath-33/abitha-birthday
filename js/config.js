/* ============================================================
   CONFIG — everything you're likely to want to personalize
   lives in this one file. No countdown logic here.
   ============================================================ */

const CONFIG = {
  // ---- Names ----
  herName: "Abitha",

  // ---- Campaign dates (year is separate so this works for any year) ----
  year: 2026,          // change this if you reuse the site next year
  startMonth: 8,        // August  → countdown begins (Day 42)
  startDay: 4,
  birthdayMonth: 9,      // September → celebration page
  birthdayDay: 16,
  totalDays: 42,         // Aug 4 (42) counting down to Sep 15 (0), Sep 16 = birthday

  // ---- EmailJS (never hardcode real keys in a public repo — use env/config
  //      injection at deploy time, or a server-side proxy, if this ever goes
  //      fully public). Fill these three in before the reply form will work. ----
  emailjs: {
    publicKey: "2iS38PPjdmpdsYczl",
    serviceId: "service_luxflfe",
    templateId: "template_kf4ywsh",
    toEmail: "gopinath04160@gmail.com" // where her replies land — change if needed
  },

  // ---- Daily romantic quotes (index 0 = Day 42, index 42 = Day 0) ----
  quotes: [
    "Forty-two days feels like forever, but I'd wait way longer than that for you.",
    "Somewhere out there, a calendar is quietly counting down to the best day of my year.",
    "Every one of these days is just me finding new ways to miss you before I even do.",
    "The countdown just started, and I'm already this excited — that should tell you something.",
    "Weeks from now, I'll be watching you blow out candles, and I already can't wait.",
    "It's early days on this countdown, but my excitement is already running way ahead of schedule.",
    "A whole season of days between now and your birthday, and I plan to enjoy every one.",
    "This countdown is really just a long love letter, written one day at a time.",
    "I started counting the moment I remembered how lucky I am to celebrate you.",
    "Somewhere between today and your birthday, I'm going to fall for you all over again — probably daily.",
    "This is the part where the excitement is quiet, but it's there, every single day.",
    "Six weeks out, and my heart already knows exactly where it's headed.",
    "Every sunrise between now and your birthday is just me getting closer to celebrating you.",
    "Thirty days feels long, until I remember I get to spend all of them thinking of you.",
    "Somewhere between missing you and counting down, I found the sweetest kind of waiting.",
    "You are the reason my calendar suddenly looks like the most exciting place in the world.",
    "If love had a countdown timer, it would look exactly like this.",
    "The days are shrinking, but my excitement for you keeps growing.",
    "Every number on this screen is really just another way of saying 'I can't wait for you.'",
    "You don't need a special day to be celebrated — but I'm so glad one is finally coming.",
    "Counting down to your birthday is my favorite kind of homework.",
    "One day closer to spoiling you the way you deserve.",
    "My heart already knows the date. It's been circling it for weeks.",
    "Halfway through the countdown, and still all the way in love with you.",
    "Some people count sheep to fall asleep. I count the days until your birthday.",
    "You make ordinary days feel like they're building up to something magical — because they are.",
    "Twenty days, and my smile already knows why.",
    "Every day I don't say it enough: you're the best part of my everyday.",
    "The countdown is ticking, but my love for you was never on a timer.",
    "Somewhere in these numbers is a girl who changed my whole world.",
    "This is your season, my love — the whole month is just the opening act.",
    "Ten-something days left, and I'm already planning how to make you smile.",
    "The closer the date, the louder my heart gets about you.",
    "You're not just getting older, you're getting more loved — every single year.",
    "I hope these days remind you how much space you take up in my heart.",
    "Single digits now. My excitement, however, has no digits left to count.",
    "Every day of this countdown, I fall for you all over again.",
    "Almost there, my love — and so is the celebration you deserve.",
    "Five days of pretending I'm not this excited. It's not working.",
    "You're about to be celebrated the way you've always celebrated everyone else.",
    "Tomorrow is close enough to taste, and so is the sweetest birthday for you.",
    "Last day of counting. Tomorrow, the celebrating finally begins.",
    "The countdown ends tonight — tomorrow, it's all celebration."
  ],

  // ---- Birthday page content ----

loveLetter: `My Dearest Abitha,

For the past thirty days, every sunrise has reminded me that your special day was getting closer. Every passing moment made me realize just how lucky I am to have someone as beautiful, kind, and wonderful as you in my life.

You are the reason my ordinary days feel extraordinary. Your smile brightens my darkest moments, your laughter is my favorite melody, and your love gives my heart a place to call home.

This little website is only a tiny piece of what I feel for you. No words, no surprise, and no gift could ever truly express how much you mean to me. I simply wanted to create something that would remind you how deeply you are loved.

Today is not just your birthday—it's the day the most precious person in my world was born. And I thank life every single day for bringing you into mine.

As you begin another beautiful year, I promise to stand beside you, support your dreams, protect your smile, and create countless memories together. No matter where life takes us, my heart will always choose you.

Happy Birthday, My Love.

May your heart always be filled with happiness, your dreams come true, and your smile never fade. Thank you for being the most beautiful chapter of my life.

I love you more than words can ever describe.`,

loveLetterSignoff: "Forever Yours, Gopinath ❤️",



  // ---- Memories timeline (edit freely) ----

  timeline: [
    {
      date: "The First Glance",
      text: "Every evening, our eyes met as I walked past your house. A simple glance slowly became the beginning of our forever."
    },
    {
      date: "The First Conversation",
      text: "A Hindi notebook brought us together. That small conversation turned strangers into best friends."
    },
    {
      date: "Our Love Story",
      text: "On March 19, 2016, our friendship became love. From that day, every moment with you became my favorite memory."
    },
    {
      date: "Forever Together",
      text: "From school days to college journeys, bus rides, train stations, and countless adventures, every step has been more beautiful because of you. Happy Birthday, My Love. ❤️"
    }
  ],
  // ---- Final surprise message shown at the very bottom of the birthday page ----
  finalSurprise: "GA— this whole countdown was just me practicing how to make every year of yours feel this special. ✦",

  // ---- Secret easter egg (tap the countdown number 7 times to unlock) ----
  secretMessage: "You found the secret. 🤫 Just so you know — out of every day on this countdown, today is still my favorite, because it's the one where you found this.",

  // ---- WhatsApp share message (link is added automatically) ----
  shareText: "I made you something for your birthday countdown 💕 Open this:",

  // ---- Love quiz — no wrong answers, every path ends sweet.
  //      Add/remove questions freely; each needs 3 short options. ----
  quiz: [
    {
      question: "What's your favorite way to spend time with me? ❤️",
      options: ["Long late-night calls 📞", "Going on cute dates 🌸", "Just being with you 🥹"]
    },
    {
      question: "If you could hug me right now, how long would it last? 🤗",
      options: ["30 Seconds ❤️", "5 Minutes 🥰", "I'd Never Let Go 💖"]
    },
    {
      question: "Which moment do you dream about the most? ✨",
      options: ["Holding hands forever 🤝", "Our first trip together ✈️", "Growing old together 👩‍❤️‍👨"]
    },
    {
      question: "What do you love most about me? 💕",
      options: ["My smile 😊", "My care ❤️", "Everything 💖"]
    },
    {
      question: "One wish for our future? 💍",
      options: ["Forever together ❤️", "A lifetime of happiness 🥰", "A beautiful family someday 👨‍👩‍👧"]
    }
  ],
  quizResultMessage: "No matter what you chose... my favorite answer will always be 'You.' ❤️ Forever & Always.",

  // ---- Milestone badges — shown as a little banner on these specific days.
  //      Key = day number, value = the message shown. Add/remove freely. ----
  milestones: {
    42: "The countdown begins! 🎉",
    30: "30 days of anticipation ahead ✨",
    20: "20 days and counting 💫",
    10: "Just 10 days left! 🎊",
    5: "5 days... so close 💗",
    1: "Tomorrow's the day! 🎂"
  },

  // ---- Balloon pop game (birthday page) — one short sweet line per balloon.
  //      Add/remove freely; each pop reveals one message. ----
  balloonMessages: [
    "You make every ordinary day feel like a celebration.",
    "Here's to another year of your beautiful laugh.",
    "I'm so proud of the person you are.",
    "You're my favorite notification. 😄",
    "Every year with you keeps getting better.",
    "Thank you for choosing me, every single day.",
    "You deserve every good thing coming your way this year.",
    "This is just one of many birthdays I plan to celebrate with you."
  ],

  // ---- Relationship stat shown on the birthday page (leave startDate as null to hide it) ----
  relationship: {
    startDate: null, // e.g. "2024-02-14" — set this to show "X years, Y months of us"
    label: "of loving you"
  },

  // ---- Guestbook (shared notes page — uses jsonblob.com, a free JSON
  //      store with no signup needed). Leave blobId blank the first time —
  //      the site auto-creates one and shows you the ID to save here so
  //      the notes persist across visits instead of resetting each time. ----
  guestbook: {
    blobId: "019f9d78-ba86-7e2c-98eb-f89051e79c95"
  },

  // ---- Virtual gift box (birthday page) — what she finds when she unwraps it ----
  giftReveal: {
    title: "You just unwrapped a promise:",
    message: "This year, I promise more adventures, more laughter, more us. Consider this your first gift — the rest are coming. 🎁❤️"
  },

  // ---- Just-for-fun zodiac section (birthday page) — set both signs and
  //      edit the blurb/stats however you like; the percentages are just
  //      for fun, not real astrology. ----
  zodiac: {
    yourSign: "Leo",
    herSign: "Aquarius",
    blurb: "A fire sign and an air sign — one brings the spark, the other fans it into something unstoppable. Unfair advantage, honestly.",
    stats: [
      { label: "Love", pct: 96 },
      { label: "Trust", pct: 92 },
      { label: "Fun", pct: 98 }
    ]
  },

  // ---- AI chatbot ("Chat with Cupid") — needs a free Cloudflare Worker.
  //      See README.md "Set up the AI Chatbot" for the setup steps. ----
  chatbot: {
    workerUrl: "https://cupid-chatbot.gopinath04160.workers.dev",
    botName: "Cupid"
  },

  // ---- Our Bucket List (shared checklist page — uses jsonblob.com,
  //      same no-signup setup as the guestbook). Leave blobId blank the
  //      first time; the site auto-creates one and shows the ID to save. ----
  bucketList: {
    blobId: "019fa18e-372f-791f-bb7a-8ff9ac0b71a9",
    starterItems: [
      "Watch the sunrise together",
      "Try a new restaurant neither of us has been to",
      "Take a spontaneous day trip",
      "Cook a meal together from scratch",
      "Watch our favorite movie again, together this time"
    ]
  },

  // ---- Rose Garden — one rose blooms per countdown day (uses totalDays
  //      automatically, so it always matches the real countdown length). ----
  roseGarden: {
    fullBloomMessage: "Your garden is in full bloom! Every rose bloomed just for you. 🌹✨"
  },

  // ---- Heart Catch mini-game ----
  heartCatch: {
    goal: 30,
    surpriseTitle: "You caught them all! 💕",
    surpriseMessage: "Every heart you just caught is a little piece of how much I adore you. Happy almost-birthday. 🎉"
  },

  // ---- Wheel of Love — spin to land on a surprise ----
  wheelOptions: [
    "Free Hug 🤗",
    "Chocolate 🍫",
    "Date 🌸",
    "Movie 🎬",
    "Surprise Gift 🎁"
  ],

  // ---- Surprise video (birthday page) — add your video file at
  //      assets/video/surprise.mp4 (see the README there). ----
  surpriseVideo: {
    caption: "A little something I recorded just for you. 🎥"
  }
};
