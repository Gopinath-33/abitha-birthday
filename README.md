# Abitha's Advance Birthday Countdown 💗

A premium, mobile-first countdown site. Auto-detects the visitor's date,
reveals **only today's content**, and switches to a full birthday
celebration page on the day itself — no code edits needed once it's set up.

## Folder structure

```
abitha-birthday/
├── index.html          → daily countdown page (share this link)
├── birthday.html        → celebration page (auto-redirected to on Sep 16)
├── css/style.css        → all styling (tokens at the top)
├── js/
│   ├── config.js         → EDIT ME — names, dates, quotes, letter, keys
│   ├── countdown.js       → date logic + rendering (no need to touch)
│   ├── birthday.js        → populates the birthday page from config.js
│   ├── effects.js         → hearts, sparkles, cursor, confetti, fireworks
│   └── reply.js           → "Reply to Me" popup + EmailJS send
├── assets/
│   ├── images/days/       → day-1.svg … day-30.svg (placeholders — swap in real photos)
│   ├── images/gallery/    → memory-1.svg … memory-6.svg (placeholders)
│   ├── audio/              → drop bg-music.mp3 and birthday-music.mp3 here
│   └── icons/favicon.svg
└── README.md
```

## 1. Swap in your own photos

Each day currently shows a generated placeholder (`assets/images/days/day-N.svg`).
Replace them with real photos — easiest is to keep the same filenames and just
change the extension in `countdown.js` if you switch to `.jpg`/`.png`
(search for `day-${dayNumber}.svg` in `js/countdown.js`, or simply save your
photos as `day-1.svg` … no — save them as e.g. `day-1.jpg` and update that one
line to `.jpg`). Do the same for the gallery images in `birthday.html`.

## 1b. Add the surprise video (birthday page)

Drop a video file at `assets/video/surprise.mp4`. Keep it reasonably small
(under ~30-50MB) so it loads quickly on mobile data — compress it first if
needed. If no file is added, the page shows a friendly placeholder instead
of a broken player.

## 1c. Add Abitha's photo to the Birthday Portal

The gift-shaped portal on the birthday page reveals a photo when tapped
open. Replace `assets/images/portal-photo.svg` with a real photo — easiest
is to save your photo as `assets/images/portal-photo.jpg` and update the
`src` in `birthday.html` (search for `portal-photo`) to match.

## 2. Add music

Drop an MP3 at:
- `assets/audio/bg-music.mp3` — plays on the countdown page
- `assets/audio/birthday-music.mp3` — plays on the birthday page

Use something you have the rights to use (your own recording, or a
royalty-free/licensed track). The 🔈 button toggles playback; browsers block
autoplay with sound, so it starts muted/paused until she taps it.

## 3. Set up EmailJS (for "Reply to Me")

1. Create a free account at emailjs.com.
2. Add an Email Service (e.g. Gmail) → copy the **Service ID**.
3. Create an Email Template with variables `{{from_name}}`, `{{message}}`,
   `{{to_email}}` → copy the **Template ID**.
4. Copy your **Public Key** from Account → API Keys.
5. Paste all three into `js/config.js` under `CONFIG.emailjs`.

The public key is safe to ship in client-side code (that's how EmailJS is
designed to work) — just never paste your *private* API key anywhere in this
project.

## 3b. Set up the Guestbook (shared notes page)

No signup needed — the guestbook uses [jsonblob.com](https://jsonblob.com),
a free JSON store you can use anonymously.

1. Just open `guestbook.html` in a browser. The first time it runs, it
   automatically creates a storage "blob" for you.
2. A banner appears on the page showing something like:
   `guestbook: { blobId: "abcd1234-5678-..." }`
3. Copy that into `js/config.js` under `CONFIG.guestbook`.
4. Reload the page — from now on, notes are saved permanently and both of
   you will see the same list from any device.

If you skip step 3, the guestbook still works for that one visit, but a
new (empty) blob gets created next time the page loads instead of reusing
the old one — so don't skip it once you're happy with the setup.

## 3c. Set up the AI Chatbot ("Chat with Cupid")

This one needs a tiny free backend (a Cloudflare Worker) so your AI API key
stays hidden from anyone viewing the page source. The code for it is in
`cloudflare-worker/worker.js`.

1. Get a free API key from [console.groq.com](https://console.groq.com)
   (Groq gives a generous free tier — no credit card needed).
2. Create a free account at [dash.cloudflare.com](https://dash.cloudflare.com).
3. Go to **Workers & Pages → Create → Create Worker**, give it any name,
   and deploy the default template first (just to create it).
4. Open the new Worker → **Edit Code**, delete everything, and paste in
   the full contents of `cloudflare-worker/worker.js` from this project.
   Click **Deploy**.
5. Back on the Worker's page, go to **Settings → Variables and Secrets**,
   add a secret named `GROQ_API_KEY` with the key from step 1, and save.
6. Copy the Worker's URL (shown at the top of its page, looks like
   `https://your-worker-name.your-subdomain.workers.dev`).
7. Paste it into `js/config.js` under `CONFIG.chatbot.workerUrl`.

That's it — `chatbot.html` will now talk to a real AI. The bot is designed
to always identify itself as an AI feature of the site (see the system
prompt in `worker.js`), not as a stand-in for you — feel free to edit its
personality there.

## 4. Edit dates, quotes, and the letter

Everything editable lives in `js/config.js`: her name, the countdown year,
start date, birthday date, all 30 daily quotes, the love letter, the
memories timeline, and the final surprise message.

## 5. Test before sharing

Open `index.html?preview=17` in a browser to preview Day 17 without waiting.
Open `birthday.html?preview=birthday` to preview the celebration page.
**Remove `?preview=...` from the link you actually send her** — without it,
the site always shows the real, current day only.

## 6. Host it

Any static host works: GitHub Pages, Netlify, Vercel, or your own server.
Just upload the whole `abitha-birthday/` folder as-is.

## A note on the "hide future days" requirement

This site is a pure static site (no backend/database), so the gating works
by only ever writing *today's* day number and image path into the page —
tomorrow's content is never generated or inserted into the DOM, so there's
nothing to "peek at" in the page itself. That said, because all 30 image
files still live in the same `assets/images/days/` folder, someone who knows
your naming pattern could directly open `day-5.svg` by guessing the URL —
static hosting can't fully prevent that. If you want it airtight, the fix is
a small backend/serverless function that only serves the current day's image
file server-side; happy to help you build that as a next step if you want it.
