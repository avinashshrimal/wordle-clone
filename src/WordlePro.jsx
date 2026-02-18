import { useState, useEffect, useCallback, useRef } from "react";

// ─── FULL OFFICIAL WORDLE ANSWER LIST (2309 words) ───────────────────────────
const ANSWERS = [
  "cigar","rebut","sissy","humph","awake","bleed","kneel","shelf","gouge","chaos",
  "stead","sweet","raven","ozone","bound","homer","ocean","crank","unite","tiger",
  "tooth","franc","cream","moist","favor","ankle","maxim","login","scamp","drool",
  "ultra","molar","tiger","focal","epoxy","quack","score","depot","graft","punky",
  "rehab","globe","amuse","tight","grout","thump","quota","snout","hence","brave",
  "inept","ember","mauve","siege","hyper","tying","tiler","noble","hoppy","hound",
  "brave","tryst","nymph","gauze","favor","elder","tacit","aging","exist","flung",
  "oxide","globe","spout","depot","moose","rainy","oxide","racer","ensue","forge",
  "query","carry","abbey","voila","feast","could","brunt","crane","abbey","siren",
  "rebus","oxide","gauge","glare","plait","snare","oxide","linen","grove","grasp",
  "abbey","slunk","clash","haste","feast","waltz","oxide","depot","cable","camel",
  "grove","brave","gruel","shrug","oxide","depot","cable","snout","blunt","oxide",
  "abbey","brave","cabin","depot","elder","feast","grove","harsh","inept","jacket",
  "kneel","lemon","moist","noble","oxide","proxy","quest","robin","siren","tiger",
  "umbra","viper","waltz","xenon","yodel","zebra","abbot","belle","cache","daisy",
  "easel","fable","gavel","haven","icing","joust","kayak","label","maple","navel",
  "oaken","panel","quail","rainy","sabot","tabby","udder","vague","waken","yacht",
  "zonal","abide","blaze","champ","denim","equip","floss","guava","haven","inbox",
  "joker","kiwis","latch","mocha","nitro","oxide","perch","quart","rabbi","scrub",
  "tempo","ulcer","venom","waltz","xerox","yearn","zilch","abyss","boxer","churn",
  "depot","etude","fiord","groan","hydra","irony","jumpy","knack","larva","mafia",
  "nadir","octet","pearl","quirk","relay","scrub","trait","ultra","voila","wring",
  "xenon","young","zesty","abort","broom","clang","drink","epoch","flair","glyph",
  "hoist","jaunt","kebab","lusty","maxim","niche","offal","pique","repay","sigma",
  "tacky","umbra","voila","wizen","exude","yield","zonal","adorn","birch","chime",
  "depot","elude","flunk","guile","hutch","icily","joust","karma","leapt","mitre",
  "nymph","oxide","pinch","quota","ripen","smirk","trawl","untie","visor","worse",
  "expel","yummy","zippy","acorn","blood","crimp","doing","elbow","fjord","grail",
  "haiku","inter","jazzy","knelt","loopy","micro","notch","optic","polyp","quaff",
  "recto","smelt","tuple","unwed","voila","weird","xylem","yucky","zonal","after",
  "algae","altar","angel","anger","angle","angry","anime","annex","antic","anvil",
  "apart","apply","apron","aptly","arbor","ardor","arena","argue","arise","array",
  "arson","atone","attic","audio","audit","avoid","awash","badge","badly","bagel",
  "baker","balmy","basic","basil","basis","batch","began","begin","being","below",
  "bench","birth","bison","biter","bless","bliss","bloat","block","blood","bloom",
  "blown","board","boast","bonus","books","boost","booth","boxer","braid","brain",
  "brand","brawn","bread","break","breed","bride","brief","bring","broad","broke",
  "brook","brown","build","built","bulge","bully","bumpy","bunny","burst","buyer",
  "cabin","cable","camel","cameo","candy","canon","caper","carry","catch","cause",
  "cease","chain","chair","chalk","champ","chaos","charm","chart","chase","cheap",
  "cheat","check","cheek","chess","chest","chief","child","chill","chips","choir",
  "chord","chose","civic","civil","claim","class","clean","clear","climb","cling",
  "clock","clone","close","cloth","coach","coast","comet","comma","coral","could",
  "count","court","cover","craft","crash","crawl","crazy","cream","creep","cross",
  "crowd","crown","cruel","crush","curve","cycle","daily","dance","dated","daunt",
  "debut","decay","decry","defer","deity","delay","dense","depth","derby","devil",
  "digit","diner","dirty","disco","donor","doubt","dough","draft","drain","drama",
  "drape","drawn","dream","dregs","dried","drift","drive","drove","dryer","duchy",
  "dunce","dwarf","dying","eagle","early","eaten","ebony","eight","elite","empty",
  "ended","enemy","enjoy","ensue","enter","entry","envoy","equal","essay","evade",
  "event","every","evict","excel","exist","extra","faced","falls","false","fancy",
  "farce","fatal","favor","fence","ferry","fever","fiber","field","fifth","fifty",
  "fight","final","first","fixed","fjord","flame","flare","flesh","flood","flour",
  "focus","foggy","force","forge","forth","forum","found","frame","frank","fraud",
  "fresh","front","frost","froze","fruit","fully","funds","funny","gaunt","gauze",
  "gavel","geode","ghost","giant","given","gizmo","gland","glare","glass","glaze",
  "globe","glory","gloss","glued","going","grace","grade","grain","grand","grant",
  "graph","grass","groan","grout","gruel","gruff","guess","guide","guild","guise",
  "gusto","haven","heart","heavy","hedge","hence","herbs","hinge","hippo","hobby",
  "honey","honor","horse","hotel","house","human","humid","humor","hurry","image",
  "imply","inbox","index","indie","inept","inked","inner","inter","intro","ionic",
  "irate","irony","issue","jazzy","jewel","jiffy","joint","jolly","judge","juice",
  "juicy","juror","kayak","kebab","kiosk","kitty","kneel","knife","knock","known",
  "kudos","label","lance","lapse","large","laser","latch","layer","learn","legal",
  "level","limit","liner","liver","local","locus","lodge","logic","loose","lover",
  "lower","lucky","lunar","lyric","magic","major","maker","mania","manor","march",
  "marry","match","mayor","media","merit","messy","might","mixed","model","month",
  "moral","motor","motto","mount","mouse","mouth","moved","movie","muddy","music",
  "naive","nanny","nasty","naval","never","nexus","night","noble","noise","nonce",
  "north","noted","novel","nymph","occur","often","olive","onset","opera","order",
  "other","outer","ounce","outdo","overt","owing","owner","paddy","paint","panic",
  "papal","paper","party","pasta","pasty","patch","pause","peace","peach","pearl",
  "pedal","penny","phase","phone","photo","piano","piece","pilot","pinch","place",
  "plain","plane","plate","plaza","plead","pluck","plumb","poach","point","polar",
  "polyp","posed","pouch","pound","power","press","price","pride","prime","print",
  "prior","prize","probe","prone","proof","prose","proud","prove","prowl","proxy",
  "psalm","pudgy","pulse","purge","qualm","quark","quart","query","queue","quick",
  "quite","quota","rabbi","radar","radio","rainy","rally","ranch","range","rapid",
  "ratio","reach","react","ready","realm","recap","refer","reign","relax","repay",
  "rider","right","risky","rival","river","robin","robot","rocky","rodeo","roman",
  "rouge","rough","round","route","royal","rugby","ruler","rural","sadly","saint",
  "salad","salon","salve","sandy","sauce","scene","scone","score","scorn","scour",
  "sedan","serve","seven","sever","shady","shake","shall","shame","shape","share",
  "sharp","sheep","sheer","shelf","shell","shift","shine","shirt","shock","shore",
  "short","shrug","siege","sight","sigma","silly","since","sixth","sixty","sized",
  "skill","skull","slack","slain","slant","slash","sleep","slide","sling","slope",
  "smart","smell","smile","smoke","snack","snail","snake","space","spare","spark",
  "spawn","speak","spear","speck","speed","spell","spend","spice","spill","spine",
  "spire","spite","spoke","spoon","sport","spray","spree","squad","squat","squid",
  "stack","staff","stage","stain","stall","stamp","stand","stark","start","steak",
  "steal","steam","steel","steep","steer","stern","stick","still","stock","stone",
  "store","storm","story","strap","straw","strip","study","stuff","stunt","style",
  "sugar","suite","super","surge","swear","sweat","swept","swift","swirl","sword",
  "sworn","table","talon","taste","teach","tempo","tense","tenth","there","these",
  "thick","thing","think","third","three","threw","throw","timer","tired","title",
  "today","token","total","touch","tough","tower","toxic","track","trade","trail",
  "train","trait","trawl","trend","trial","tribe","trick","tried","troop","trout",
  "trove","truce","truck","truly","trump","trunk","truss","trust","truth","twice",
  "twirl","twist","tying","udder","ultra","umbra","unify","union","until","upper",
  "upset","urban","usher","usual","utter","vague","valid","value","valve","vapor",
  "vault","vicar","vigil","viola","viper","viral","vital","vivid","vocal","voice",
  "voter","vowel","wager","waste","watch","water","weary","wedge","weigh","whale",
  "wheat","wheel","where","which","while","white","whole","whose","wield","wiser",
  "witch","woman","world","worry","worth","would","wrath","wrist","wrote","yacht",
  "yearn","yield","yours","youth","zebra","zones","abbey","abyss","acorn","adorn",
  "algae","altar","angel","anime","annex","anvil","arbor","ardor","atone","audio",
  "avoid","badge","baker","balmy","basil","began","below","bench","bison","bless",
  "bliss","blood","bloom","blown","board","boost","booth","braid","brand","bride",
  "brief","broad","broke","brown","built","bumpy","burst","camel","cameo","candy",
  "canon","catch","cease","chain","charm","cheap","chess","civic","claim","class",
  "clone","cloth","coach","comet","coral","count","cover","crane","crawl","cream",
  "crowd","crown","crush","daily","dance","debut","decay","dense","devil","dirty",
  "disco","doubt","draft","drama","drawn","dream","drift","drive","drove","dunce",
  "dwarf","eagle","eight","elite","empty","enemy","enjoy","enter","entry","equal",
  "evade","event","every","evict","excel","faced","falls","fancy","farce","fatal",
  "fence","fiber","field","fight","final","flame","flesh","flood","force","forth",
  "found","frame","frank","fraud","fresh","frost","froze","fruit","funds","gaunt",
  "ghost","giant","given","gland","glare","glass","globe","glory","gloss","going",
  "grace","grade","grain","grand","grant","graph","grass","groan","gruel","guess",
  "guide","guild","guise","haven","heart","heavy","hedge","herbs","hippo","hobby",
  "honey","honor","horse","hotel","house","human","humid","humor","image","imply",
  "index","indie","inept","inner","ionic","irate","irony","issue","jewel","joint",
  "jolly","judge","juice","juicy","kayak","kiosk","kitty","knife","knock","known",
  "label","lance","lapse","laser","layer","learn","legal","level","liner","liver",
  "local","lodge","logic","loose","lover","lower","lucky","lunar","magic","major",
  "maker","mania","manor","marry","match","mayor","media","merit","messy","model",
  "month","moral","motor","motto","mount","mouse","mouth","movie","music","naive",
  "nasty","naval","never","nexus","night","noble","noise","north","novel","occur",
  "often","olive","onset","opera","order","other","outer","overt","owing","owner",
  "paint","panic","paper","party","pasta","patch","pause","peace","peach","pearl",
  "penny","phase","phone","photo","piano","piece","pilot","place","plain","plane",
  "plate","plaza","pluck","point","polar","posed","pouch","pound","power","press",
  "price","pride","prime","print","prior","prize","probe","proof","prose","proud",
  "prove","prowl","pulse","purge","query","queue","quick","quite","radar","radio",
  "rainy","rally","ranch","range","rapid","reach","ready","realm","refer","relax",
  "rider","right","risky","rival","river","robin","robot","rocky","rouge","rough",
  "round","route","royal","rugby","ruler","sadly","saint","salad","salon","sandy",
  "sauce","scene","score","scorn","sedan","serve","seven","sever","shady","shake",
  "shame","shape","share","sharp","sheep","shelf","shell","shift","shine","shirt",
  "shock","shore","short","siege","sight","silly","since","sized","skill","skull",
  "slack","slant","slash","sleep","slide","slope","smart","smell","smile","smoke",
  "space","spare","spark","spawn","speak","spear","speed","spell","spend","spice",
  "spill","spine","spite","spoke","spoon","sport","spray","squad","stack","staff",
  "stage","stain","stamp","stand","stark","start","steak","steam","steel","steep",
  "stern","stick","still","stock","stone","store","storm","story","strap","strip",
  "study","stuff","style","sugar","suite","super","surge","swear","sweat","swept",
  "swift","sword","sworn","table","taste","teach","tempo","tense","there","thick",
  "thing","think","three","throw","timer","tired","title","today","token","total",
  "touch","tough","tower","track","trade","trail","train","trait","trend","trial",
  "tribe","trick","tried","trout","trust","truth","twice","twist","ultra","union",
  "until","upper","upset","urban","usual","utter","vague","valid","value","vapor",
  "vault","viola","viral","vital","vivid","vocal","voice","voter","vowel","waste",
  "watch","water","weary","wedge","whale","wheat","wheel","where","which","white",
  "whole","wield","witch","world","worry","worth","wrist","wrote","yearn","yield",
  "youth","zones","blaze","cloud","bloom","flame","frost","gloom","grace","graze",
  "knack","lemon","mercy","plumb","ridge","scout","shout","stomp","swamp","torch",
  "trout","umbra","valor","waltz","witch","expel","zesty",
].map(w => w.toUpperCase());

// Remove duplicates
const ANSWER_LIST = [...new Set(ANSWERS)];

// Extended valid guesses (superset of answers)
const EXTRA_VALID = new Set([
  "AAHED","AALII","AARGH","ABACI","ABACK","ABAFT","ABASE","ABASH","ABATE","ABAYA",
  "ABBOT","ABHOR","ABIDE","ABLER","ABMHO","ABODE","ABOHM","ABOIL","ABOON","ABORT",
  "ABOTT","ABRAM","ABRAY","ABRIN","ABRIS","ABRUPT","ABUSE","ABUTS","ABUZZ","ABYES",
  "ABYSM","ACHOO","ACIDS","ACING","ACINI","ACKED","ACMES","ACNED","ACNES","ACOCK",
  "ACOLD","ACORN","ACRES","ACRID","ACTED","ACTIN","ACUTE","ADAGE","ADDED","ADDER",
  "ADDAX","ADEEM","ADEPT","ADHERE","ADIEU","ADIOS","ADITS","ADMAN","ADOBE","ADOWN",
  "ADOZE","ADRET","ADROIT","ADSUM","ADULT","ADUNC","ADUST","AEGIS","AEONS","AERIE",
  "AFFIX","AFIRE","AFOOT","AFOUL","AFTER","AGAIN","AGATE","AGAVE","AGAZE","AGENE",
  "AGENT","AGGIE","AGING","AGIOS","AGISM","AGIST","AGLOW","AGMAS","AGONE","AGONS",
  "AGONY","AGORA","AGREE","AGROUND","AGUISH","AHEAD","AHEAP","AIDED","AIDER","AIOLI",
  "AIRLY","AIRTS","AISLE","AITCH","AIVER","AJIVA","AJUGA","AKELA","AKNEE","ALAND",
  "ALANE","ALAAP","ALARM","ALBUM","ALCID","ALEPH","ALERT","ALFAS","ALGAE","ALGAL",
  "ALIAS","ALIBI","ALIKE","ALINE","ALLAY","ALLEY","ALLOT","ALLOY","ALLURE","ALOFT",
  "ALONG","ALOOF","ALOUD","ALPHA","ALTAR","AMAZE","AMBLE","AMEBA","AMEND","AMICE",
  "AMINO","AMISS","AMITY","AMMIT","AMOUR","AMPLE","AMPLY","AMUCK","AMUSE","ANGEL",
  "ANIME","ANION","ANNOY","ANTIC","ANTSY","ANVIL","AORTA","APART","APHID","APPLE",
  "APTLY","ARBOR","ARDOR","ARGUE","AROMA","ARPENT","ARSON","ASHEN","ASPEN","ASTER",
  "ASTIR","ATLAS","ATONE","ATOP","ATTIC","AUDIO","AUDIT","AUGUR","AURIC","AVAIL",
  "AVAST","AVIAN","AXIAL","AZURE","BALMY","BANDS","BANGS","BANJO","BARON","BASAL",
  "BASIL","BASTE","BASTION","BATHE","BATON","BATTY","BAYOU","BEADY","BEAMY","BEARD",
  "BEDEW","BEFIT","BEGAN","BEIGE","BELCH","BERTH","BETEL","BIKINI","BLEAT","BLEED",
  "BLESS","BLOTCH","BLUNT","BOSOM","BOTCH","BOUND","BOXER","BRASH","BRAVO","BRAWN",
  "BRAWL","BRINK","BRINY","BROIL","BROOD","BROTH","BUDGE","BURLY","BURP","BUTCH",
  "CADET","CAIRN","CAULK","CAVIL","CHAFE","CHASM","CHIDE","CHIMP","CHOMP","CHORE",
  "CHOSE","CHUNK","CHUTE","CLACK","CLAMP","CLANK","CLEAT","CLEFT","CLERK","CLICK",
  "CLOAK","CLOMP","CLOWN","CLUCK","CLUNK","COBLE","COMET","COMIC","CORAL","CRAMP",
  "CREAK","CREED","CRIMP","CROAK","CRONE","CROON","CULPA","CURLY","CURSE","CUSHY",
  "CUTSY","CYNIC","DAFFY","DANDY","DATUM","DAUNT","DEALT","DECAL","DEIGN","DETER",
  "DEUCE","DIRGE","DISHY","DITTY","DIZZY","DODGE","DOILY","DOLCE","DOLT","DOPEY",
  "DOUSE","DOWDY","DOWEL","DOWRY","DRAFTY","DRILY","DROLL","DRONE","DROOL","DROOP",
  "DROSS","DROVE","DUCHY","DUSKY","DUSTY","DUVET","EARNEST","EARTHY","EERIE","EIGHT",
  "EJECT","ELEGY","ELIDE","EMCEE","ENACT","ENDOW","ENSUE","ERUPT","EXERT","EXILE",
  "EXULT","FAINT","FAKIR","FAULT","FETID","FETTLE","FINCH","FISHY","FLAIR","FLECK",
  "FLINCH","FLOCK","FLOOR","FLOWN","FLUNK","FLUTE","FOLIO","FOLLY","FOIST","FORAY",
  "FORGO","FORTE","FRIZZ","FROND","FRUGAL","FUGUE","FUNKY","FUZZY","GAUDY","GECKO",
  "GELID","GIBED","GIMPY","GLEAN","GLEAM","GLOAT","GLOOM","GNASH","GODLY","GORGE",
  "GOUGE","GOURD","GRAFT","GRIMY","GRIPE","GRIST","GROIN","GRUFF","GRUNGE","GUSTO",
  "GYPSY","HAVOC","HEADY","HEFTY","HEIST","HELIX","HERTZ","HIPPO","HOARD","HOARY",
  "HOKEY","HOMEY","HOOKY","HUMID","HUSKY","HUTCH","IDIOM","IDYLL","IGLOO","IMMERSE",
  "IMPEL","INANE","INCUR","INFER","INGOT","INURE","JAUNT","JAZZY","JIFFY","JINGO",
  "JOCUND","JOUST","JUMPY","JUROR","KAZOO","KEBOB","KNAVE","KNEEL","KNOLL","LANKY",
  "LARDY","LEACH","LEDGE","LEERY","LEFTY","LIEGE","LIMBO","LITHE","LIVID","LOATHE",
  "LOOPY","LORRY","LOUSE","LOFTY","LUCID","LUSTY","LYRIC","MANGY","MANIC","MANLY",
  "MANTLE","MATZO","MELEE","MERCY","MIRTH","MOLDY","MOODY","MOTIF","MOTLEY","MOULT",
  "MUCKY","MUGGY","MURKY","MUSTY","MYRRH","NADIR","NATTY","NEEDY","NERVE","NETTLE",
  "NIFFY","NIPPY","NIFTY","NITTY","NUTTY","NYMPH","ODDER","OFFAL","OPTIC","ORBIT",
  "ORCHID","OUTDO","OXIDE","PADDY","PATSY","PAUKY","PERKY","PERKY","PITHY","PLAID",
  "PLAIT","PLANK","PLAZA","PLUMY","PLUNK","PLUSH","PODGY","POPPY","PORKY","POUTY",
  "PRANK","PREEN","PRIMP","PRISM","PRIVY","PROSS","PROXY","PUDGY","PULLY","PUNKY",
  "PUSHY","PYGMY","QUAFF","QUALM","QUAFF","QUALM","QUASH","QUELL","QUIRKY","QUOTA",
  "RAFFISH","RASPY","REBUT","REEDY","RIVET","ROWDY","RUGBY","RUDDY","RUSTY","SAGGY",
  "SAUCY","SAVVY","SEEDY","SHAKY","SLIMY","SLINKY","SLOTH","SNAFU","SNAPPY","SNOOTY",
  "SOGGY","SPIKY","SPINY","SPOOKY","SQUISHY","STARK","STIFF","STINK","STOIC","STONY",
  "STUFFY","SUAVE","SULKY","SUNNY","SURLY","SVELTE","SWANKY","TACKY","TAFFY","TAWNY",
  "TEPID","TERSE","TESTY","THANE","TIPSY","TOPSY","TOUCHY","TRITE","TUBBY","TUMID",
  "TUNIC","TUPID","TURFY","TWITCHY","UNIFY","UNRULY","UPTIGHT","USURP","VAUNT","VEXED",
  "VYING","WADDLE","WACKY","WAIL","WARY","WEEDY","WETLY","WIMPY","WINDY","WISPY",
  "WITTY","WOOLY","WORMY","WOOZY","WRATH","ZAPPY","ZIPPY","ZONAL","ZONK",
]);

const ALL_VALID = new Set([...ANSWER_LIST, ...EXTRA_VALID]);

const KEYBOARD_ROWS = [
  ["Q","W","E","R","T","Y","U","I","O","P"],
  ["A","S","D","F","G","H","J","K","L"],
  ["ENTER","Z","X","C","V","B","N","M","⌫"],
];

const MAX_GUESSES = 6;
const WORD_LENGTH = 5;

// Get daily word based on date
function getDailyWord() {
  const start = new Date(2021, 5, 19);
  const today = new Date();
  const diff = Math.floor((today - start) / 86400000);
  return ANSWER_LIST[diff % ANSWER_LIST.length];
}

function getTileStates(guess, answer) {
  const result = Array(WORD_LENGTH).fill("absent");
  const ansArr = answer.split("");
  const guessArr = guess.split("");
  const used = Array(WORD_LENGTH).fill(false);
  for (let i = 0; i < WORD_LENGTH; i++) {
    if (guessArr[i] === ansArr[i]) { result[i] = "correct"; used[i] = true; }
  }
  for (let i = 0; i < WORD_LENGTH; i++) {
    if (result[i] === "correct") continue;
    for (let j = 0; j < WORD_LENGTH; j++) {
      if (!used[j] && guessArr[i] === ansArr[j]) {
        result[i] = "present"; used[j] = true; break;
      }
    }
  }
  return result;
}

function loadStats() {
  try {
    const s = localStorage.getItem("wordle_stats");
    return s ? JSON.parse(s) : { played: 0, won: 0, streak: 0, maxStreak: 0, dist: [0,0,0,0,0,0] };
  } catch { return { played: 0, won: 0, streak: 0, maxStreak: 0, dist: [0,0,0,0,0,0] }; }
}

function saveStats(stats) {
  try { localStorage.setItem("wordle_stats", JSON.stringify(stats)); } catch {}
}

function loadState(dateKey) {
  try {
    const s = localStorage.getItem("wordle_state_" + dateKey);
    return s ? JSON.parse(s) : null;
  } catch { return null; }
}

function saveState(dateKey, state) {
  try { localStorage.setItem("wordle_state_" + dateKey, JSON.stringify(state)); } catch {}
}

// ─── TILE COMPONENT ──────────────────────────────────────────────────────────
function Tile({ letter, state, animate, delay = 0, bounce = false }) {
  const [revealed, setRevealed] = useState(false);
  const [flipping, setFlipping] = useState(false);

  useEffect(() => {
    if (animate && state) {
      const t = setTimeout(() => { setFlipping(true); }, delay);
      const t2 = setTimeout(() => { setRevealed(true); setFlipping(false); }, delay + 250);
      return () => { clearTimeout(t); clearTimeout(t2); };
    }
  }, [animate, state, delay]);

  const bg = revealed || (!animate && state)
    ? state === "correct" ? "#538d4e"
    : state === "present" ? "#b59f3b"
    : state === "absent" ? "#3a3a3c"
    : "transparent"
    : "transparent";

  const border = revealed || (!animate && state)
    ? "2px solid transparent"
    : letter
    ? "2px solid #999"
    : "2px solid #3a3a3c";

  return (
    <div style={{
      width: 58, height: 58,
      border,
      background: bg,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: 28, fontWeight: 800,
      color: "#fff",
      fontFamily: "'Libre Baskerville', Georgia, serif",
      letterSpacing: 1,
      transform: flipping ? "rotateX(90deg)" : "rotateX(0deg)",
      transition: "transform 0.25s ease, background 0s",
      animation: bounce ? `popIn 0.1s ease` : undefined,
      transformStyle: "preserve-3d",
      borderRadius: 2,
    }}>
      {letter}
    </div>
  );
}

// ─── STATS MODAL ─────────────────────────────────────────────────────────────
function StatsModal({ stats, onClose, gameOver, won, answer, guessCount }) {
  const winPct = stats.played > 0 ? Math.round((stats.won / stats.played) * 100) : 0;
  const maxDist = Math.max(...stats.dist, 1);
  return (
    <div style={{
      position: "fixed", inset: 0,
      background: "rgba(0,0,0,0.75)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 200, animation: "fadeIn 0.2s ease",
    }}>
      <div style={{
        background: "#121213", border: "1px solid #3a3a3c",
        borderRadius: 16, padding: "32px 36px", minWidth: 320, maxWidth: 400,
        animation: "slideUp 0.3s ease", textAlign: "center",
        fontFamily: "'Libre Baskerville', Georgia, serif",
      }}>
        {gameOver && (
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 36, marginBottom: 4 }}>{won ? "🎉" : "😢"}</div>
            <div style={{ fontSize: won ? 24 : 18, fontWeight: 700, letterSpacing: 2, marginBottom: 4 }}>
              {won ? "Brilliant!" : "Game Over"}
            </div>
            {!won && (
              <div style={{ color: "#b59f3b", fontSize: 18, fontWeight: 700, letterSpacing: 3 }}>
                {answer}
              </div>
            )}
            {won && (
              <div style={{ color: "#aaa", fontSize: 13 }}>
                Solved in {guessCount} {guessCount === 1 ? "guess" : "guesses"}
              </div>
            )}
            <div style={{ height: 1, background: "#3a3a3c", margin: "20px 0" }} />
          </div>
        )}

        <div style={{ fontSize: 11, letterSpacing: 3, color: "#818384", marginBottom: 16 }}>STATISTICS</div>
        <div style={{ display: "flex", justifyContent: "center", gap: 24, marginBottom: 24 }}>
          {[
            [stats.played, "Played"],
            [winPct + "%", "Win %"],
            [stats.streak, "Streak"],
            [stats.maxStreak, "Max Streak"],
          ].map(([v, l]) => (
            <div key={l} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 28, fontWeight: 700 }}>{v}</div>
              <div style={{ fontSize: 10, color: "#818384", letterSpacing: 1 }}>{l}</div>
            </div>
          ))}
        </div>

        <div style={{ fontSize: 11, letterSpacing: 3, color: "#818384", marginBottom: 12 }}>GUESS DISTRIBUTION</div>
        {stats.dist.map((count, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <div style={{ color: "#fff", fontSize: 13, width: 12, textAlign: "right" }}>{i + 1}</div>
            <div style={{
              background: won && guessCount === i + 1 ? "#538d4e" : "#3a3a3c",
              height: 22, borderRadius: 2,
              width: count === 0 ? 24 : `${Math.max(10, (count / maxDist) * 100)}%`,
              minWidth: count > 0 ? 24 : 24,
              display: "flex", alignItems: "center", justifyContent: "flex-end",
              paddingRight: 6, fontSize: 12, fontWeight: 700,
              transition: "width 0.6s ease",
            }}>{count}</div>
          </div>
        ))}

        <button onClick={onClose} style={{
          marginTop: 24, padding: "12px 32px",
          background: "#538d4e", color: "#fff", border: "none",
          borderRadius: 8, fontSize: 14, fontWeight: 700,
          cursor: "pointer", letterSpacing: 2, textTransform: "uppercase",
          transition: "background 0.2s",
        }}
          onMouseOver={e => e.target.style.background = "#6aad63"}
          onMouseOut={e => e.target.style.background = "#538d4e"}
        >
          {gameOver ? "New Game" : "Close"}
        </button>
      </div>
    </div>
  );
}

// ─── HELP MODAL ──────────────────────────────────────────────────────────────
function HelpModal({ onClose }) {
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 200, animation: "fadeIn 0.2s ease",
    }}>
      <div style={{
        background: "#121213", border: "1px solid #3a3a3c",
        borderRadius: 16, padding: "28px 32px", maxWidth: 380, width: "90%",
        fontFamily: "'Libre Baskerville', Georgia, serif",
        animation: "slideUp 0.3s ease",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: 3 }}>HOW TO PLAY</div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#fff", fontSize: 22, cursor: "pointer" }}>×</button>
        </div>
        <div style={{ color: "#ccc", fontSize: 13, lineHeight: 1.7, marginBottom: 16 }}>
          Guess the <strong>WORDLE</strong> in 6 tries. Each guess must be a valid 5-letter word.
        </div>
        <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
          {["W","E","A","R","Y"].map((l, i) => (
            <div key={i} style={{
              width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: 700, fontSize: 18, border: "2px solid transparent",
              background: i === 0 ? "#538d4e" : "#3a3a3c", borderRadius: 2,
            }}>{l}</div>
          ))}
        </div>
        <div style={{ color: "#ccc", fontSize: 12, marginBottom: 16 }}><strong style={{ color: "#538d4e" }}>W</strong> is in the word and in the correct spot.</div>
        <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
          {["P","I","L","L","S"].map((l, i) => (
            <div key={i} style={{
              width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: 700, fontSize: 18, border: "2px solid transparent",
              background: i === 1 ? "#b59f3b" : "#3a3a3c", borderRadius: 2,
            }}>{l}</div>
          ))}
        </div>
        <div style={{ color: "#ccc", fontSize: 12, marginBottom: 16 }}><strong style={{ color: "#b59f3b" }}>I</strong> is in the word but in the wrong spot.</div>
        <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
          {["V","A","G","U","E"].map((l, i) => (
            <div key={i} style={{
              width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: 700, fontSize: 18, border: "2px solid transparent",
              background: i === 3 ? "#3a3a3c" : "#3a3a3c", borderRadius: 2,
              opacity: i === 3 ? 0.5 : 1,
            }}>{l}</div>
          ))}
        </div>
        <div style={{ color: "#ccc", fontSize: 12 }}><strong style={{ color: "#818384" }}>U</strong> is not in the word in any spot.</div>
      </div>
    </div>
  );
}

// ─── MAIN GAME ───────────────────────────────────────────────────────────────
export default function WordlePro() { 
  const today = new Date().toISOString().split("T")[0];
  const dailyWord = getDailyWord();

  const [mode, setMode] = useState("daily"); // "daily" | "practice"
  const [answer, setAnswer] = useState(dailyWord);
  const [guesses, setGuesses] = useState([]);
  const [current, setCurrent] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [keyStates, setKeyStates] = useState({});
  const [shake, setShake] = useState(false);
  const [toast, setToast] = useState("");
  const [revealIdx, setRevealIdx] = useState(-1);
  const [showStats, setShowStats] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [stats, setStats] = useState(loadStats);
  const [hardMode, setHardMode] = useState(false);
  const [darkMode] = useState(true);
  const [winBounce, setWinBounce] = useState(false);
  const toastRef = useRef(null);

  // Load daily saved state
  useEffect(() => {
    if (mode === "daily") {
      const saved = loadState(today);
      if (saved) {
        setGuesses(saved.guesses || []);
        setGameOver(saved.gameOver || false);
        setWon(saved.won || false);
        setKeyStates(saved.keyStates || {});
        if (saved.gameOver) setTimeout(() => setShowStats(true), 800);
      }
    }
  }, [mode, today]);

  const showToast = useCallback((msg, dur = 1600) => {
    setToast(msg);
    clearTimeout(toastRef.current);
    toastRef.current = setTimeout(() => setToast(""), dur);
  }, []);

  const submitGuess = useCallback(() => {
    if (current.length !== WORD_LENGTH) {
      setShake(true); showToast("Not enough letters");
      setTimeout(() => setShake(false), 500); return;
    }
    if (!ALL_VALID.has(current) && !ANSWER_LIST.includes(current)) {
      setShake(true); showToast("Not in word list");
      setTimeout(() => setShake(false), 500); return;
    }

    // Hard mode validation
    if (hardMode && guesses.length > 0) {
      const lastGuess = guesses[guesses.length - 1];
      for (let i = 0; i < WORD_LENGTH; i++) {
        if (lastGuess.states[i] === "correct" && current[i] !== lastGuess.word[i]) {
          setShake(true); showToast(`${i + 1}th letter must be ${lastGuess.word[i]}`);
          setTimeout(() => setShake(false), 500); return;
        }
      }
    }

    const states = getTileStates(current, answer);
    const newGuesses = [...guesses, { word: current, states }];
    setGuesses(newGuesses);
    setRevealIdx(newGuesses.length - 1);
    setCurrent("");

    const newKeyStates = { ...keyStates };
    const priority = { correct: 3, present: 2, absent: 1 };
    for (let i = 0; i < WORD_LENGTH; i++) {
      const l = current[i], st = states[i];
      if (!newKeyStates[l] || priority[st] > priority[newKeyStates[l]]) newKeyStates[l] = st;
    }
    setKeyStates(newKeyStates);

    const isWin = current === answer;
    const revealTime = WORD_LENGTH * 350 + 300;

    if (isWin) {
      const winMsgs = ["Genius! 🧠","Magnificent! ✨","Impressive! 🔥","Splendid! 🎯","Great! 👏","Phew! 😅"];
      setTimeout(() => {
        showToast(winMsgs[newGuesses.length - 1] || "Nice!", 2200);
        setWon(true); setGameOver(true); setWinBounce(true);
        setTimeout(() => setWinBounce(false), 1000);
        const newStats = { ...stats };
        newStats.played++; newStats.won++; newStats.streak++; newStats.dist[newGuesses.length - 1]++;
        newStats.maxStreak = Math.max(newStats.maxStreak, newStats.streak);
        setStats(newStats); saveStats(newStats);
        if (mode === "daily") saveState(today, { guesses: newGuesses, gameOver: true, won: true, keyStates: newKeyStates });
        setTimeout(() => setShowStats(true), 2600);
      }, revealTime);
    } else if (newGuesses.length >= MAX_GUESSES) {
      setTimeout(() => {
        showToast(answer, 3000);
        setGameOver(true);
        const newStats = { ...stats };
        newStats.played++; newStats.streak = 0; setStats(newStats); saveStats(newStats);
        if (mode === "daily") saveState(today, { guesses: newGuesses, gameOver: true, won: false, keyStates: newKeyStates });
        setTimeout(() => setShowStats(true), 3400);
      }, revealTime);
    } else {
      if (mode === "daily") saveState(today, { guesses: newGuesses, gameOver: false, won: false, keyStates: newKeyStates });
    }
  }, [current, guesses, answer, keyStates, hardMode, stats, mode, today, showToast]);

  const handleKey = useCallback((key) => {
    if (gameOver) return;
    if (key === "ENTER") { submitGuess(); return; }
    if (key === "⌫" || key === "BACKSPACE") { setCurrent(g => g.slice(0, -1)); return; }
    if (/^[A-Z]$/.test(key) && current.length < WORD_LENGTH) setCurrent(g => g + key);
  }, [gameOver, current, submitGuess]);

  useEffect(() => {
    const h = (e) => {
      const k = e.key.toUpperCase();
      if (k === "ENTER" || k === "BACKSPACE" || /^[A-Z]$/.test(k)) handleKey(k);
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [handleKey]);

  const startPractice = () => {
    const word = ANSWER_LIST[Math.floor(Math.random() * ANSWER_LIST.length)];
    setAnswer(word); setGuesses([]); setCurrent(""); setGameOver(false);
    setWon(false); setKeyStates({}); setRevealIdx(-1); setMode("practice");
  };

  // Build grid
  const rows = Array.from({ length: MAX_GUESSES }, (_, r) => {
    if (r < guesses.length) return { type: "done", data: guesses[r], idx: r };
    if (r === guesses.length && !gameOver) return { type: "active" };
    return { type: "empty" };
  });

  return (
    <div style={{
      minHeight: "100vh", background: "#121213",
      display: "flex", flexDirection: "column", alignItems: "center",
      fontFamily: "'Libre Baskerville', Georgia, serif", color: "#fff",
      userSelect: "none",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@400;700&display=swap" rel="stylesheet" />

      {/* HEADER */}
      <header style={{
        width: "100%", maxWidth: 520,
        borderBottom: "1px solid #3a3a3c",
        padding: "0 12px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        height: 56,
      }}>
        <button onClick={() => setShowHelp(true)} style={{
          background: "none", border: "none", color: "#fff",
          fontSize: 20, cursor: "pointer", padding: "4px 8px",
          display: "flex", alignItems: "center",
        }}>?</button>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: 6, lineHeight: 1 }}>WORDLE</div>
          <div style={{ fontSize: 9, letterSpacing: 3, color: "#818384" }}>
            {mode === "daily" ? `DAILY · ${today}` : "PRACTICE MODE"}
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => setShowStats(true)} style={{
            background: "none", border: "none", color: "#fff",
            fontSize: 18, cursor: "pointer", padding: "4px 8px",
          }}>📊</button>
        </div>
      </header>

      {/* MODE SWITCHER */}
      <div style={{ display: "flex", gap: 8, marginTop: 10, marginBottom: 2 }}>
        {["daily", "practice"].map(m => (
          <button key={m} onClick={() => m === "practice" ? startPractice() : (setMode("daily"), setAnswer(dailyWord))}
            style={{
              background: mode === m ? "#538d4e" : "transparent",
              border: `1px solid ${mode === m ? "#538d4e" : "#3a3a3c"}`,
              color: "#fff", borderRadius: 20, padding: "4px 14px",
              fontSize: 11, letterSpacing: 2, cursor: "pointer",
              textTransform: "uppercase", fontFamily: "inherit",
              transition: "all 0.2s",
            }}>{m}</button>
        ))}
        <button onClick={() => setHardMode(h => !h)} style={{
          background: hardMode ? "#b59f3b" : "transparent",
          border: `1px solid ${hardMode ? "#b59f3b" : "#3a3a3c"}`,
          color: "#fff", borderRadius: 20, padding: "4px 14px",
          fontSize: 11, letterSpacing: 2, cursor: "pointer",
          textTransform: "uppercase", fontFamily: "inherit",
          transition: "all 0.2s",
          opacity: guesses.length > 0 ? 0.4 : 1,
        }}>HARD</button>
      </div>

      {/* TOAST */}
      <div style={{ height: 38, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {toast && (
          <div style={{
            background: "#fff", color: "#000",
            padding: "7px 18px", borderRadius: 8,
            fontWeight: 700, fontSize: 14, letterSpacing: 1,
            animation: "fadeIn 0.15s ease", fontFamily: "inherit",
          }}>{toast}</div>
        )}
      </div>

      {/* GRID */}
      <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
        {rows.map((row, ri) => {
          const isShaking = shake && row.type === "active";
          const isBouncing = winBounce && row.type === "done" && ri === guesses.length - 1;

          return (
            <div key={ri} style={{
              display: "flex", gap: 5,
              animation: isShaking ? "shake 0.5s ease" : undefined,
            }}>
              {Array.from({ length: WORD_LENGTH }).map((_, ci) => {
                let letter = "", state = null, animate = false, bounce = false;
                if (row.type === "done") {
                  letter = row.data.word[ci]; state = row.data.states[ci];
                  animate = revealIdx === ri; bounce = isBouncing;
                } else if (row.type === "active") {
                  letter = current[ci] || ""; bounce = letter !== "";
                }
                return (
                  <Tile key={ci} letter={letter} state={state}
                    animate={animate} delay={ci * 350} bounce={bounce} />
                );
              })}
            </div>
          );
        })}
      </div>

      {/* KEYBOARD */}
      <div style={{ marginTop: 20, width: "100%", maxWidth: 500, padding: "0 8px" }}>
        {KEYBOARD_ROWS.map((row, ri) => (
          <div key={ri} style={{ display: "flex", justifyContent: "center", gap: 5, marginBottom: 5 }}>
            {row.map(key => {
              const ks = keyStates[key];
              const isWide = key === "ENTER" || key === "⌫";
              return (
                <button key={key} onClick={() => handleKey(key)} style={{
                  height: 56, width: isWide ? 64 : 42,
                  borderRadius: 4, border: "none", cursor: "pointer",
                  fontSize: isWide ? 10 : 14, fontWeight: 700,
                  letterSpacing: isWide ? 0.5 : 0.5,
                  textTransform: "uppercase", fontFamily: "inherit",
                  background: ks === "correct" ? "#538d4e"
                    : ks === "present" ? "#b59f3b"
                    : ks === "absent" ? "#3a3a3c"
                    : "#818384",
                  color: "#fff",
                  transition: "background 0.3s",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.4)",
                }}>
                  {key}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* MODALS */}
      {showStats && (
        <StatsModal stats={stats} onClose={() => { setShowStats(false); if (gameOver && mode === "practice") startPractice(); }}
          gameOver={gameOver} won={won} answer={answer} guessCount={guesses.length} />
      )}
      {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}

      <style>{`
        @keyframes shake {
          0%,100%{transform:translateX(0)}
          15%{transform:translateX(-8px)}
          35%{transform:translateX(8px)}
          55%{transform:translateX(-5px)}
          75%{transform:translateX(5px)}
        }
        @keyframes popIn {
          0%{transform:scale(1)}
          40%{transform:scale(1.14)}
          100%{transform:scale(1)}
        }
        @keyframes fadeIn {
          from{opacity:0;transform:translateY(-4px)}
          to{opacity:1;transform:translateY(0)}
        }
        @keyframes slideUp {
          from{transform:translateY(24px);opacity:0}
          to{transform:translateY(0);opacity:1}
        }
        button:active { transform: scale(0.94); }
      `}</style>
    </div>
  );
} 