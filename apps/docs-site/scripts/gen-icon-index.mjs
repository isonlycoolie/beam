// Writes public/ui/icons.json: every icon in the free Hugeicons set (Stroke Rounded, MIT) with its SVG elements
// and a category, fetched only by the Icons page so the rest of the docs never load it.
import { mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import * as icons from "@hugeicons/core-free-icons";

/** Attributes almost every path repeats. Kept in sync with components/ui-docs/icon-svg.ts. */
const DEFAULTS = { stroke: "currentColor", strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "1.5" };

// The free package has no categories, so icons are sorted by the words in their names. First match wins,
// so the most specific groups (brands, AI, crypto) come first.
const CATEGORIES = [
  ["Brands", "facebook figma github gitlab google instagram linkedin youtube twitter tiktok whatsapp telegram slack discord spotify amazon microsoft apple android dribbble behance adobe reddit pinterest snapchat paypal visa mastercard stripe dropbox notion medium twitch vimeo wechat skype zoom chrome firefox safari opera edge npm yarn react vue angular svelte nextjs tailwind wordpress shopify messenger threads siri chrysler gameboy mario"],
  ["AI", "ai robot brain magic sparkles artificial intelligence chatbot neural"],
  ["Crypto", "bitcoin ethereum crypto blockchain nft binance dogecoin litecoin solana mining"],
  ["Gestures", "swipe touch pointing drag tap hold thumbs clapping shaka gesture touchpad pinch"],
  ["Add + Remove", "add plus minus remove cancel delete multiplication insert"],
  ["Alert + Check", "alert warning notification notifications bell check tick checkmark error information info help question unavailable exclamation done task tasks badge"],
  ["Arrows", "arrow arrows chevron chevrons direction move expand collapse maximize minimize undo redo refresh reload rotate swap sort sorting turn navigation corner forward backward unfold flip repeat exchange transition"],
  ["Interface", "cursor list panel menu sidebar table rows row column columns border toggle search filter share link unlink bookmark setting settings view eye loading progress scroll more ellipsis select selection login logout screen window tab tabs slider distribute arrange align heading split dashboard home"],
  ["Business", "money dollar euro pound yen coin coins wallet bank credit card invoice receipt payment cash tax discount sale shopping cart bag store shop price tag briefcase business package delivery truck percent coupon customer agreement office job legal license ticket"],
  ["Charts", "chart charts graph pie analytics analysis presentation diagram activity pulse tally"],
  ["Communication", "mail message messages chat call phone comment comments send inbox contact mention megaphone bubble reply quote conversation conversations"],
  ["Development", "code terminal git bug api server database cpu chip developer html css javascript typescript jsx cpp python java plugin puzzle source command bracket brackets structure keyframe peer network internet web global rss software root system drive structure"],
  ["Devices", "laptop computer mobile smartphone tablet watch keyboard mouse printer monitor tv headphones headset usb battery wifi bluetooth signal router device devices airpod cd floppy webcam joystick simcard antenna scan"],
  ["Editing", "edit pen pencil text font align bold italic underline paragraph crop cut copy paste eraser brush paint colors color layers layer layout grid resize sticker lasso pathfinder stroke type alphabet character"],
  ["Shapes", "shape shapes square squares circle triangle rectangle ellipse cone cylinder pyramid angle dashed line parabola cosine spline trapezoid polygon hexagon star"],
  ["Files", "file files folder folders document documents archive attachment clip zip pdf doc note notes book books clipboard download upload save cloud raw library"],
  ["Media", "play pause stop music video film image images photo picture gallery mic microphone volume radio album playlist record camera movie vinyl speaker audio mp live streaming theater disc vr reality rewind guitar"],
  ["People", "user users account profile person team man woman baby child face smile sad hand finger body ear tongue bone identification id passport"],
  ["Clothing", "dress dressing hat cap tie pants underpants jogger glove shoe shoes shirt jacket backpack helmet wardrobe clothes"],
  ["Security", "lock locked unlock key shield security password fingerprint privacy secure firewall access safe handcuffs"],
  ["Time", "calendar clock time alarm timer hourglass date schedule appointment"],
  ["Travel + Places", "map maps location pin globe earth compass car bus train plane airplane bike bicycle ship taxi travel hotel building buildings house route road flag parking airport city church gps scooter traffic luggage tower"],
  ["Home", "lamp chair sofa bed desk door wardrobe cabinet stairs bookshelf napkins pot pan knife dish bowl"],
  ["Energy", "power energy solar plug socket electric fuel eco recycle"],
  ["Nature + Weather", "sun moon rain snow wind weather leaf tree flower plant fire water drop mountain cloudy sunrise sunset thunder storm tropical soil waterfall ice uv thermometer rabbit horse dog cat bird fish bat alien"],
  ["Science + Education", "atom physics chemistry lab test quiz learning knowledge school mathematics math formula tube saturn planet satellite radar galaxy notebook graduation"],
  ["Health", "medical hospital health heart pill medicine doctor stethoscope virus dna injection blood dental mask"],
  ["Food", "food coffee drink pizza burger cake bread wine beer fruit vegetable restaurant kitchen milk cream candy cupcake sushi"],
  ["Sports + Games", "game games ball football basketball trophy award medal sport gym dumbbell chess dice target workout yoga weight sword fencing rocking"],
  ["Culture", "zodiac laurel wreath quran ramadhan mosque halal religion"],
].map(([name, words]) => [name, new Set(words.split(" "))]);
const OTHER = CATEGORIES.length;
const DIRECTIONS = new Set("left right up down top bottom vertical horizontal diagonal go".split(" "));

const words = (name) =>
  name
    .replace(/Icon$/, "")
    .replace(/([a-z])([A-Z0-9])/g, "$1 $2")
    .toLowerCase()
    .split(/[\s\d]+/)
    .filter(Boolean);
const categoryOf = (name) => {
  const w = words(name);
  const i = CATEGORIES.findIndex(([, set]) => w.some((word) => set.has(word)));
  if (i !== -1) return i;
  return w.some((word) => DIRECTIONS.has(word)) ? CATEGORIES.findIndex(([name]) => name === "Arrows") : OTHER;
};

const entries = Object.entries(icons)
  .filter(([name, value]) => name.endsWith("Icon") && Array.isArray(value))
  .sort(([a], [b]) => a.localeCompare(b))
  // Drop React's "key" and every attribute equal to the set's defaults (DEFAULTS); the page adds them back.
  .map(([name, elements]) => [
    name,
    elements.map(([tag, attrs]) => [tag, Object.fromEntries(Object.entries(attrs).filter(([k, v]) => k !== "key" && DEFAULTS[k] !== v))]),
    categoryOf(name),
  ]);
const dir = fileURLToPath(new URL("../public/ui/", import.meta.url));
mkdirSync(dir, { recursive: true });
writeFileSync(`${dir}icons.json`, JSON.stringify({ categories: [...CATEGORIES.map(([name]) => name), "Other"], icons: entries }));
const counts = entries.reduce((acc, [, , c]) => ((acc[c] = (acc[c] ?? 0) + 1), acc), {});
console.log(`icons: ${entries.length}, uncategorised: ${counts[OTHER] ?? 0}`);
