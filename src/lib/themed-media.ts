const DEMO_CIRCLES = new Set([
  "UI Design",
  "Travel Photos",
  "Foodie",
  "Minimalist Design",
  "Cozy Homes",
  "Golden Hour",
  "Brunch Club",
  "Workspace Goals",
]);

type ArtworkTheme = {
  background: string;
  accent: string;
  accentSoft: string;
  text: string;
  label: string;
  pattern: "desk" | "interior" | "plant" | "food" | "landscape" | "sunset" | "gradient";
};

type SceneType =
  | "dashboard"
  | "pasta"
  | "reading-nook"
  | "minimal-living"
  | "workspace"
  | "office"
  | "plants"
  | "coffee"
  | "brunch"
  | "recipe"
  | "street-food"
  | "travel-lake"
  | "mountain"
  | "sunset"
  | "nature"
  | "tokens"
  | "typography"
  | "gradient";

const THEMES: Record<string, ArtworkTheme> = {
  "UI Design": {
    background: "#0f172a",
    accent: "#7c3aed",
    accentSoft: "#22d3ee",
    text: "#f8fafc",
    label: "UI",
    pattern: "gradient",
  },
  "Travel Photos": {
    background: "#0f172a",
    accent: "#0ea5e9",
    accentSoft: "#38bdf8",
    text: "#f8fafc",
    label: "Travel",
    pattern: "landscape",
  },
  "Foodie": {
    background: "#451a03",
    accent: "#f97316",
    accentSoft: "#facc15",
    text: "#fff7ed",
    label: "Food",
    pattern: "food",
  },
  "Minimalist Design": {
    background: "#172554",
    accent: "#6366f1",
    accentSoft: "#22d3ee",
    text: "#eff6ff",
    label: "Minimal",
    pattern: "gradient",
  },
  "Cozy Homes": {
    background: "#1f2937",
    accent: "#a16207",
    accentSoft: "#f59e0b",
    text: "#fefce8",
    label: "Home",
    pattern: "interior",
  },
  "Golden Hour": {
    background: "#3f1d2e",
    accent: "#fb7185",
    accentSoft: "#f59e0b",
    text: "#fff7ed",
    label: "Light",
    pattern: "sunset",
  },
  "Brunch Club": {
    background: "#4c1d95",
    accent: "#f97316",
    accentSoft: "#fde047",
    text: "#fff7ed",
    label: "Brunch",
    pattern: "food",
  },
  "Workspace Goals": {
    background: "#111827",
    accent: "#10b981",
    accentSoft: "#60a5fa",
    text: "#f8fafc",
    label: "Desk",
    pattern: "desk",
  },
};

function encodeSvg(svg: string) {
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function splitLines(text: string, maxLineLength = 16) {
  const words = text.split(" ");
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length <= maxLineLength) {
      current = next;
    } else {
      if (current) lines.push(current);
      current = word;
    }
  }

  if (current) lines.push(current);
  return lines.slice(0, 3);
}

function renderPattern(theme: ArtworkTheme) {
  switch (theme.pattern) {
    case "desk":
      return `
        <rect x="90" y="660" width="720" height="120" rx="26" fill="rgba(255,255,255,0.14)" />
        <rect x="190" y="360" width="360" height="240" rx="22" fill="rgba(255,255,255,0.20)" />
        <rect x="225" y="395" width="290" height="165" rx="14" fill="rgba(96,165,250,0.42)" />
        <rect x="595" y="405" width="90" height="180" rx="18" fill="rgba(16,185,129,0.36)" />
        <circle cx="680" cy="350" r="58" fill="rgba(255,255,255,0.12)" />
      `;
    case "interior":
      return `
        <rect x="0" y="0" width="900" height="760" fill="rgba(255,255,255,0.06)" />
        <rect x="95" y="110" width="210" height="280" rx="18" fill="rgba(255,255,255,0.16)" />
        <rect x="360" y="520" width="360" height="150" rx="30" fill="rgba(255,255,255,0.15)" />
        <rect x="420" y="400" width="110" height="155" rx="18" fill="rgba(245,158,11,0.35)" />
        <circle cx="702" cy="308" r="72" fill="rgba(255,255,255,0.12)" />
      `;
    case "plant":
      return `
        <circle cx="230" cy="330" r="150" fill="rgba(255,255,255,0.08)" />
        <path d="M240 620 C180 500 180 320 260 190 C315 285 315 455 240 620 Z" fill="rgba(74,222,128,0.45)" />
        <path d="M425 650 C350 500 380 280 475 150 C545 275 530 490 425 650 Z" fill="rgba(34,197,94,0.42)" />
        <path d="M610 620 C560 500 565 355 650 225 C725 350 710 515 610 620 Z" fill="rgba(134,239,172,0.32)" />
      `;
    case "food":
      return `
        <circle cx="450" cy="390" r="205" fill="#fff7ed" opacity="0.92" />
        <circle cx="450" cy="390" r="165" fill="rgba(249,115,22,0.24)" />
        <circle cx="390" cy="332" r="56" fill="rgba(249,115,22,0.72)" />
        <circle cx="520" cy="338" r="60" fill="rgba(253,224,71,0.82)" />
        <circle cx="370" cy="455" r="52" fill="rgba(16,185,129,0.74)" />
        <circle cx="515" cy="455" r="64" fill="rgba(239,68,68,0.72)" />
        <circle cx="455" cy="402" r="38" fill="rgba(255,255,255,0.86)" />
      `;
    case "landscape":
      return `
        <rect x="0" y="0" width="900" height="440" fill="rgba(56,189,248,0.24)" />
        <path d="M0 500 Q160 360 330 455 T900 415 L900 760 L0 760 Z" fill="rgba(15,23,42,0.48)" />
        <path d="M0 575 Q160 465 340 555 T900 525 L900 760 L0 760 Z" fill="rgba(255,255,255,0.16)" />
        <circle cx="710" cy="155" r="84" fill="rgba(255,255,255,0.26)" />
      `;
    case "sunset":
      return `
        <defs>
          <linearGradient id="sunsetGlow" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="rgba(251,113,133,0.82)" />
            <stop offset="100%" stop-color="rgba(245,158,11,0.22)" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="900" height="760" fill="url(#sunsetGlow)" />
        <circle cx="610" cy="240" r="110" fill="rgba(255,255,255,0.32)" />
        <path d="M0 560 Q200 490 420 545 T900 520 L900 760 L0 760 Z" fill="rgba(63,29,46,0.60)" />
      `;
    case "gradient":
    default:
      return `
        <defs>
          <radialGradient id="orbA" cx="20%" cy="25%" r="75%">
            <stop offset="0%" stop-color="${theme.accentSoft}" stop-opacity="0.95" />
            <stop offset="100%" stop-color="${theme.accent}" stop-opacity="0.18" />
          </radialGradient>
          <radialGradient id="orbB" cx="72%" cy="18%" r="75%">
            <stop offset="0%" stop-color="${theme.accent}" stop-opacity="0.85" />
            <stop offset="100%" stop-color="#0f172a" stop-opacity="0.20" />
          </radialGradient>
        </defs>
        <rect x="0" y="0" width="900" height="760" fill="url(#orbA)" />
        <rect x="0" y="0" width="900" height="760" fill="url(#orbB)" />
        <circle cx="680" cy="170" r="140" fill="rgba(255,255,255,0.12)" />
      `;
  }
}

function getSceneType(title: string, circleName: string): SceneType {
  const text = `${circleName} ${title}`.toLowerCase();
  if (text.includes("pasta")) return "pasta";
  if (text.includes("reading nook")) return "reading-nook";
  if (text.includes("dashboard")) return "dashboard";
  if (text.includes("minimalist living")) return "minimal-living";
  if (text.includes("workspace setup")) return "workspace";
  if (text.includes("home office")) return "office";
  if (text.includes("plant")) return "plants";
  if (text.includes("coffee")) return "coffee";
  if (text.includes("brunch")) return "brunch";
  if (text.includes("recipe")) return "recipe";
  if (text.includes("street food")) return "street-food";
  if (text.includes("travel photography")) return "travel-lake";
  if (text.includes("mountain")) return "mountain";
  if (text.includes("sunset") || text.includes("golden hour")) return "sunset";
  if (text.includes("nature photography")) return "nature";
  if (text.includes("design system tokens")) return "tokens";
  if (text.includes("typography")) return "typography";
  return "gradient";
}

function renderScene(scene: SceneType, theme: ArtworkTheme) {
  switch (scene) {
    case "dashboard":
      return `
        <rect x="70" y="150" width="760" height="450" rx="28" fill="rgba(255,255,255,0.10)" />
        <rect x="105" y="195" width="250" height="120" rx="22" fill="rgba(255,255,255,0.22)" />
        <rect x="390" y="195" width="160" height="120" rx="22" fill="${theme.accent}" fill-opacity="0.65" />
        <rect x="585" y="195" width="210" height="120" rx="22" fill="${theme.accentSoft}" fill-opacity="0.48" />
        <rect x="105" y="350" width="470" height="215" rx="26" fill="rgba(255,255,255,0.16)" />
        <path d="M145 505 C210 425 280 470 345 410 S480 450 535 375" stroke="${theme.accentSoft}" stroke-width="16" fill="none" stroke-linecap="round" />
        <rect x="605" y="350" width="190" height="215" rx="26" fill="rgba(255,255,255,0.14)" />
        <circle cx="665" cy="430" r="34" fill="${theme.accent}" fill-opacity="0.75" />
        <circle cx="735" cy="475" r="22" fill="${theme.accentSoft}" fill-opacity="0.75" />
      `;
    case "pasta":
      return `
        <circle cx="450" cy="390" r="210" fill="#fff7ed" opacity="0.95" />
        <circle cx="450" cy="390" r="170" fill="#fde68a" opacity="0.55" />
        <path d="M330 355 C395 300 500 305 570 355" stroke="#f59e0b" stroke-width="18" fill="none" stroke-linecap="round"/>
        <path d="M320 395 C390 345 510 345 585 395" stroke="#fbbf24" stroke-width="18" fill="none" stroke-linecap="round"/>
        <path d="M325 435 C400 392 505 392 575 438" stroke="#f59e0b" stroke-width="18" fill="none" stroke-linecap="round"/>
        <circle cx="390" cy="360" r="22" fill="#ef4444" />
        <circle cx="520" cy="388" r="20" fill="#ef4444" />
        <ellipse cx="455" cy="430" rx="34" ry="18" fill="#16a34a" />
      `;
    case "reading-nook":
      return `
        <rect x="90" y="115" width="170" height="225" rx="18" fill="rgba(255,255,255,0.22)" />
        <rect x="300" y="520" width="330" height="150" rx="34" fill="rgba(255,255,255,0.16)" />
        <rect x="335" y="458" width="125" height="125" rx="26" fill="${theme.accent}" fill-opacity="0.36" />
        <rect x="448" y="458" width="125" height="125" rx="26" fill="${theme.accentSoft}" fill-opacity="0.28" />
        <rect x="650" y="225" width="20" height="310" rx="10" fill="rgba(255,255,255,0.22)" />
        <path d="M625 225 C635 170 685 170 695 225 Z" fill="#fcd34d" opacity="0.85" />
        <rect x="565" y="675" width="180" height="26" rx="13" fill="rgba(255,255,255,0.14)" />
      `;
    case "minimal-living":
      return `
        <rect x="0" y="0" width="900" height="1200" fill="#f8fafc" opacity="0.06" />
        <rect x="170" y="525" width="420" height="120" rx="26" fill="rgba(255,255,255,0.18)" />
        <rect x="230" y="470" width="130" height="85" rx="18" fill="rgba(255,255,255,0.24)" />
        <rect x="390" y="470" width="150" height="85" rx="18" fill="${theme.accentSoft}" fill-opacity="0.24" />
        <rect x="635" y="375" width="95" height="240" rx="24" fill="rgba(255,255,255,0.16)" />
        <circle cx="682" cy="312" r="54" fill="${theme.accent}" fill-opacity="0.38" />
        <rect x="148" y="700" width="615" height="20" rx="10" fill="rgba(255,255,255,0.10)" />
      `;
    case "workspace":
      return `
        <rect x="90" y="665" width="720" height="110" rx="25" fill="rgba(255,255,255,0.14)" />
        <rect x="205" y="350" width="350" height="225" rx="22" fill="rgba(255,255,255,0.20)" />
        <rect x="235" y="380" width="290" height="160" rx="14" fill="${theme.accentSoft}" fill-opacity="0.42" />
        <rect x="602" y="410" width="88" height="170" rx="18" fill="${theme.accent}" fill-opacity="0.35" />
        <circle cx="690" cy="320" r="60" fill="rgba(255,255,255,0.14)" />
      `;
    case "office":
      return `
        <rect x="90" y="105" width="210" height="290" rx="18" fill="rgba(255,255,255,0.18)" />
        <rect x="345" y="515" width="330" height="120" rx="28" fill="rgba(255,255,255,0.14)" />
        <rect x="405" y="380" width="180" height="135" rx="22" fill="${theme.accentSoft}" fill-opacity="0.30" />
        <rect x="640" y="345" width="70" height="195" rx="22" fill="${theme.accent}" fill-opacity="0.28" />
        <circle cx="720" cy="265" r="54" fill="rgba(255,255,255,0.12)" />
      `;
    case "plants":
      return `
        <circle cx="255" cy="345" r="160" fill="rgba(255,255,255,0.06)" />
        <path d="M250 655 C175 495 175 300 275 165 C350 285 340 490 250 655 Z" fill="#22c55e" fill-opacity="0.52" />
        <path d="M430 690 C350 510 382 265 490 145 C565 300 535 520 430 690 Z" fill="#16a34a" fill-opacity="0.42" />
        <path d="M625 655 C560 520 575 340 665 215 C745 360 725 535 625 655 Z" fill="#86efac" fill-opacity="0.32" />
      `;
    case "coffee":
      return `
        <circle cx="450" cy="405" r="165" fill="#fff7ed" opacity="0.92" />
        <circle cx="450" cy="405" r="112" fill="#7c2d12" opacity="0.75" />
        <path d="M560 385 C615 385 625 450 585 475 C545 500 520 455 535 410" stroke="#fff7ed" stroke-width="18" fill="none" stroke-linecap="round"/>
        <path d="M395 220 C378 175 430 165 420 112" stroke="rgba(255,255,255,0.62)" stroke-width="14" fill="none" stroke-linecap="round"/>
        <path d="M470 220 C453 175 505 165 495 112" stroke="rgba(255,255,255,0.62)" stroke-width="14" fill="none" stroke-linecap="round"/>
      `;
    case "brunch":
      return `
        <circle cx="450" cy="390" r="210" fill="#fff7ed" opacity="0.95" />
        <ellipse cx="450" cy="390" rx="170" ry="115" fill="#fde68a" opacity="0.56" />
        <circle cx="365" cy="355" r="42" fill="#fff7ed" />
        <circle cx="528" cy="350" r="44" fill="#fff7ed" />
        <rect x="350" y="430" width="210" height="40" rx="20" fill="#fb923c" />
        <circle cx="425" cy="440" r="14" fill="#22c55e" />
        <circle cx="490" cy="452" r="12" fill="#ef4444" />
      `;
    case "recipe":
      return `
        <circle cx="450" cy="390" r="212" fill="#fff7ed" opacity="0.95" />
        <circle cx="450" cy="390" r="174" fill="#fef3c7" opacity="0.5" />
        <rect x="350" y="300" width="200" height="150" rx="34" fill="#fb923c" fill-opacity="0.85" />
        <circle cx="395" cy="505" r="34" fill="#16a34a" />
        <circle cx="505" cy="505" r="30" fill="#22c55e" />
        <circle cx="430" cy="545" r="18" fill="#fff7ed" />
      `;
    case "street-food":
      return `
        <rect x="170" y="615" width="560" height="140" rx="30" fill="rgba(255,255,255,0.14)" />
        <rect x="235" y="425" width="430" height="145" rx="36" fill="#f97316" fill-opacity="0.85" />
        <circle cx="325" cy="490" r="22" fill="#22c55e" />
        <circle cx="425" cy="515" r="18" fill="#fde047" />
        <circle cx="535" cy="485" r="20" fill="#ef4444" />
      `;
    case "travel-lake":
      return `
        <rect x="0" y="0" width="900" height="480" fill="rgba(56,189,248,0.18)" />
        <path d="M0 470 Q175 290 330 430 T900 360 L900 760 L0 760 Z" fill="rgba(15,23,42,0.45)" />
        <path d="M0 585 Q180 520 360 585 T900 540 L900 760 L0 760 Z" fill="rgba(56,189,248,0.30)" />
        <path d="M385 600 L485 600 L535 655 L335 655 Z" fill="#8b5e3c" opacity="0.88" />
      `;
    case "mountain":
      return `
        <rect x="0" y="0" width="900" height="440" fill="rgba(56,189,248,0.16)" />
        <path d="M100 560 L290 235 L470 560 Z" fill="rgba(255,255,255,0.28)" />
        <path d="M360 560 L560 175 L790 560 Z" fill="rgba(255,255,255,0.18)" />
        <path d="M0 620 Q180 565 360 625 T900 600 L900 760 L0 760 Z" fill="rgba(15,23,42,0.48)" />
      `;
    case "sunset":
      return `
        <rect x="0" y="0" width="900" height="760" fill="url(#sunsetScene)" />
        <defs>
          <linearGradient id="sunsetScene" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#fb7185" stop-opacity="0.92" />
            <stop offset="56%" stop-color="#fdba74" stop-opacity="0.88" />
            <stop offset="100%" stop-color="#3f1d2e" stop-opacity="0.82" />
          </linearGradient>
        </defs>
        <circle cx="620" cy="238" r="95" fill="rgba(255,255,255,0.30)" />
        <path d="M0 560 Q200 500 420 550 T900 535 L900 760 L0 760 Z" fill="rgba(63,29,46,0.60)" />
      `;
    case "nature":
      return `
        <rect x="0" y="0" width="900" height="420" fill="rgba(255,255,255,0.08)" />
        <path d="M0 620 Q140 455 255 620" stroke="rgba(255,255,255,0.34)" stroke-width="18" fill="none" stroke-linecap="round"/>
        <path d="M225 620 Q345 420 455 620" stroke="rgba(255,255,255,0.24)" stroke-width="20" fill="none" stroke-linecap="round"/>
        <path d="M420 620 Q560 405 690 620" stroke="rgba(255,255,255,0.18)" stroke-width="22" fill="none" stroke-linecap="round"/>
        <path d="M0 680 Q190 620 420 680 T900 655 L900 760 L0 760 Z" fill="rgba(255,255,255,0.10)" />
      `;
    case "tokens":
      return `
        <rect x="105" y="205" width="220" height="95" rx="22" fill="rgba(255,255,255,0.20)" />
        <rect x="355" y="205" width="200" height="95" rx="22" fill="${theme.accentSoft}" fill-opacity="0.45" />
        <rect x="585" y="205" width="210" height="95" rx="22" fill="${theme.accent}" fill-opacity="0.55" />
        <rect x="105" y="340" width="690" height="250" rx="30" fill="rgba(255,255,255,0.10)" />
        <circle cx="200" cy="465" r="48" fill="#22d3ee" fill-opacity="0.75" />
        <circle cx="330" cy="465" r="48" fill="#7c3aed" fill-opacity="0.75" />
        <circle cx="460" cy="465" r="48" fill="#fb7185" fill-opacity="0.75" />
        <circle cx="590" cy="465" r="48" fill="#f8fafc" fill-opacity="0.75" />
      `;
    case "typography":
      return `
        <text x="120" y="350" font-family="Arial, Helvetica, sans-serif" font-size="170" font-weight="800" fill="rgba(255,255,255,0.20)">Aa</text>
        <text x="120" y="520" font-family="Georgia, serif" font-size="130" font-weight="700" fill="rgba(255,255,255,0.16)">Rg</text>
        <rect x="115" y="590" width="600" height="24" rx="12" fill="rgba(255,255,255,0.10)" />
        <rect x="115" y="640" width="510" height="24" rx="12" fill="rgba(255,255,255,0.10)" />
      `;
    case "gradient":
    default:
      return renderPattern(theme);
  }
}

function createArtwork(args: {
  title: string;
  circleName: string;
  ratio: "pin" | "cover";
}) {
  const theme = THEMES[args.circleName] ?? THEMES["UI Design"];
  const scene = getSceneType(args.title, args.circleName);
  const width = args.ratio === "cover" ? 1400 : 900;
  const height = args.ratio === "cover" ? 700 : 1200;
  const titleLines = splitLines(args.title, args.ratio === "cover" ? 22 : 16);
  const titleFontSize = args.ratio === "cover" ? 76 : 70;
  const labelY = args.ratio === "cover" ? 108 : 118;
  const titleStartY = args.ratio === "cover" ? 215 : 840;
  const lineHeight = args.ratio === "cover" ? 86 : 78;

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 900 1200">
      <rect width="900" height="1200" rx="48" fill="${theme.background}" />
      ${renderScene(scene, theme)}
      <rect x="54" y="70" width="178" height="54" rx="27" fill="rgba(255,255,255,0.14)" />
      <text x="143" y="${labelY}" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="24" font-weight="700" letter-spacing="4" fill="${theme.text}" opacity="0.88">
        ${escapeHtml(theme.label.toUpperCase())}
      </text>
      ${titleLines
        .map(
          (line, index) => `
            <text
              x="72"
              y="${titleStartY + index * lineHeight}"
              font-family="Arial, Helvetica, sans-serif"
              font-size="${titleFontSize}"
              font-weight="800"
              fill="${theme.text}"
            >
              ${escapeHtml(line)}
            </text>
          `
        )
        .join("")}
      <text x="72" y="1120" font-family="Arial, Helvetica, sans-serif" font-size="28" font-weight="600" letter-spacing="2.4" fill="${theme.text}" opacity="0.7">
        ${escapeHtml(args.circleName.toUpperCase())}
      </text>
    </svg>
  `;

  return encodeSvg(svg);
}

export function shouldUseDemoTheme(circleName?: string | null) {
  return !!circleName && DEMO_CIRCLES.has(circleName);
}

export function getThemedPinImage(input: {
  id?: string | null;
  categoryName?: string | null;
  circleName?: string | null;
  title?: string | null;
  description?: string | null;
  fallbackUrl?: string | null;
}) {
  if (!shouldUseDemoTheme(input.circleName) || !input.circleName || !input.title) {
    return input.fallbackUrl ?? createArtwork({ title: "PinCircles", circleName: "UI Design", ratio: "pin" });
  }

  return createArtwork({
    title: input.title,
    circleName: input.circleName,
    ratio: "pin",
  });
}

export function getThemedCircleCover(input: {
  id?: string | null;
  categoryName?: string | null;
  circleName?: string | null;
  description?: string | null;
  fallbackUrl?: string | null;
}) {
  if (!shouldUseDemoTheme(input.circleName) || !input.circleName) {
    return input.fallbackUrl ?? createArtwork({ title: "PinCircles", circleName: "UI Design", ratio: "cover" });
  }

  return createArtwork({
    title: input.circleName,
    circleName: input.circleName,
    ratio: "cover",
  });
}
