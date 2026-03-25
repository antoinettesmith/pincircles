import { getThemedCircleCover, getThemedPinImage } from "@/lib/themed-media";

export interface DemoComment {
  id: string;
  content: string;
  createdAt: string;
  user: { id: string; username: string };
  replies?: DemoComment[];
}

export interface DemoCircleComment {
  id: string;
  content: string;
  createdAt: string;
  user: { id: string; username: string };
  replies?: DemoCircleComment[];
}

export interface DemoPin {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  circle: { name: string; slug: string; category?: { name: string } };
  author: { username: string };
  _count: { votes: number; comments: number };
  createdAt: string;
  comments: DemoComment[];
}

export interface DemoCircle {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  category: { name: string };
  owner: { username: string };
  _count: { memberships: number; pins: number };
  discussion: DemoCircleComment[];
}

const photo = (name: string) => `/demo/photos/${name}`;

const users = {
  alice: { id: "user-alice", username: "alice" },
  bob: { id: "user-bob", username: "bob" },
  carol: { id: "user-carol", username: "carol" },
  dave: { id: "user-dave", username: "dave" },
  eve: { id: "user-eve", username: "eve" },
  frank: { id: "user-frank", username: "frank" },
  gia: { id: "user-gia", username: "gia" },
  harper: { id: "user-harper", username: "harper" },
  ivy: { id: "user-ivy", username: "ivy" },
  jules: { id: "user-jules", username: "jules" },
  kai: { id: "user-kai", username: "kai" },
  luna: { id: "user-luna", username: "luna" },
  mia: { id: "user-mia", username: "mia" },
  noah: { id: "user-noah", username: "noah" },
};

const circleDefs = [
  {
    id: "circle-ui-design",
    name: "UI Design",
    slug: "ui-design",
    category: "Design",
    description: "Screens, systems, and interaction patterns that feel sharp, modern, and useful.",
    owner: users.alice.username,
    memberships: 14200,
  },
  {
    id: "circle-travel-photos",
    name: "Travel Photos",
    slug: "travel-photos",
    category: "Travel",
    description: "Destination inspiration, landscape shots, and journals from beautiful places.",
    owner: users.alice.username,
    memberships: 9800,
  },
  {
    id: "circle-foodie",
    name: "Foodie",
    slug: "foodie",
    category: "Food",
    description: "Crave-worthy meals, recipes, and plating ideas that feel worth saving.",
    owner: users.bob.username,
    memberships: 11700,
  },
  {
    id: "circle-cozy-homes",
    name: "Cozy Homes",
    slug: "cozy-homes",
    category: "Home",
    description: "Reading nooks, layered interiors, and warm spaces that feel actually lived in.",
    owner: users.carol.username,
    memberships: 8800,
  },
  {
    id: "circle-workspace-goals",
    name: "Workspace Goals",
    slug: "workspace-goals",
    category: "Technology",
    description: "Desk setups, studio corners, and productive environments with real personality.",
    owner: users.eve.username,
    memberships: 8100,
  },
  {
    id: "circle-job-hunting-2026",
    name: "Job Hunting 2026",
    slug: "job-hunting-2026",
    category: "Careers",
    description: "Search strategy, resume ideas, application prep, and the realities of finding work right now.",
    owner: users.gia.username,
    memberships: 6800,
  },
  {
    id: "circle-shows-to-watch",
    name: "Shows To Watch",
    slug: "shows-to-watch",
    category: "Lifestyle",
    description: "Bingeworthy series, comfort rewatches, and the shows people actually recommend to friends.",
    owner: users.dave.username,
    memberships: 6200,
  },
  {
    id: "circle-style-edit",
    name: "Style Edit",
    slug: "style-edit",
    category: "Lifestyle",
    description: "Fashion, beauty, and trend references that feel current, polished, and pin-worthy.",
    owner: users.eve.username,
    memberships: 7300,
  },
  {
    id: "circle-social-media-marketing-careers",
    name: "Social Media Marketing Careers",
    slug: "social-media-marketing-careers",
    category: "Careers",
    description: "Portfolio tips, role breakdowns, campaign thinking, and what it takes to grow in social.",
    owner: users.frank.username,
    memberships: 5400,
  },
  {
    id: "circle-budgeting",
    name: "Budgeting",
    slug: "budgeting",
    category: "Finance",
    description: "Spending plans, money systems, savings goals, and practical advice for getting organized.",
    owner: users.harper.username,
    memberships: 5900,
  },
  {
    id: "circle-mood-boarding",
    name: "Mood Boarding",
    slug: "mood-boarding",
    category: "Design",
    description: "References, textures, palettes, and visual direction for ideas that start before the final output.",
    owner: users.ivy.username,
    memberships: 7600,
  },
  {
    id: "circle-remote-careers",
    name: "Remote Careers",
    slug: "remote-careers",
    category: "Careers",
    description: "Remote job leads, home-office routines, async collaboration, and location-flexible work life.",
    owner: users.jules.username,
    memberships: 6300,
  },
  {
    id: "circle-investing",
    name: "Investing",
    slug: "investing",
    category: "Finance",
    description: "Long-term thinking, beginner-friendly resources, and conversations about building financial confidence.",
    owner: users.kai.username,
    memberships: 7100,
  },
] as const;

const pinDefs = [
  ["pin-spring-break", "Travel Photos", "Spring Break", "Palm trees, bright water, and that first-day-of-vacation energy by the beach.", "alice", 328, 5, "2026-03-24T12:30:00.000Z"],
  ["pin-spring-outfits", "Style Edit", "Spring Outfit Ideas", "A soft pink look with bold pattern play and an easy dressed-up spring silhouette.", "eve", 301, 4, "2026-03-24T12:20:00.000Z"],
  ["pin-rustic-garden", "Cozy Homes", "Rustic Garden Decor", "A flower-lined entry with terracotta pots, worn wood, and cottage garden charm.", "carol", 296, 4, "2026-03-24T12:10:00.000Z"],
  ["pin-nail-art", "Style Edit", "Nail Art", "Glossy black nails with metallic accent details and a clean, elevated beauty-editorial feel.", "bob", 314, 6, "2026-03-24T12:40:00.000Z"],
  ["pin-ui-palette", "UI Design", "Color Palette Inspiration", "Warm peach and sand swatches laid out like a tactile, product-ready palette study.", "frank", 184, 2, "2026-03-22T11:00:00.000Z"],
  ["pin-ui-type", "UI Design", "Typography Experiments", "A stark black-and-white type study pushing repetition, contrast, and rhythm.", "gia", 143, 2, "2026-03-20T09:00:00.000Z"],

  ["pin-travel-sunset", "Travel Photos", "Sunset at the Beach", "A low orange horizon, glassy shoreline, and one of those quiet end-of-day beach moments.", "harper", 201, 2, "2026-03-21T18:20:00.000Z"],
  ["pin-travel-mountain", "Travel Photos", "Mountain Adventure", "Jagged alpine peaks and a dramatic ridgeline that feels straight out of a trek journal.", "ivy", 223, 3, "2026-03-22T07:45:00.000Z"],
  ["pin-travel-tips", "Travel Photos", "Travel Photography Tips", "Using height, leading lines, and layered coastline views to make a landscape feel expansive.", "jules", 171, 4, "2026-03-23T07:30:00.000Z"],
  ["pin-travel-nature", "Travel Photos", "Nature Photography", "A close forest-floor study with soft focus, texture, and a tiny mushroom as the focal point.", "kai", 188, 2, "2026-03-22T16:10:00.000Z"],
  ["pin-travel-golden", "Travel Photos", "Golden Hour Shots", "Bare branches and low sun turning an ordinary scene into something cinematic.", "luna", 252, 2, "2026-03-24T06:15:00.000Z"],

  ["pin-food-pasta", "Foodie", "Homemade Pasta Night", "Hand-cut pasta running through the machine before dinner comes together from scratch.", "mia", 244, 3, "2026-03-23T19:10:00.000Z"],
  ["pin-food-street", "Foodie", "Street Food Adventures", "A neon-lit food stall moment with quick bites, motion, and late-night city energy.", "noah", 175, 3, "2026-03-22T12:50:00.000Z"],
  ["pin-food-brunch", "Foodie", "Brunch Goals", "Bagels, citrus, and a table spread that looks ready for a slow weekend catch-up.", "bob", 198, 4, "2026-03-23T10:25:00.000Z"],
  ["pin-food-coffee", "Foodie", "Morning Coffee Ritual", "An espresso moment at the counter with warm wood tones and a just-made cup in hand.", "dave", 120, 3, "2026-03-20T08:05:00.000Z"],
  ["pin-food-recipe", "Foodie", "Recipe Inspiration", "A creamy skillet dinner with lemon on the side and plenty of weeknight appeal.", "eve", 209, 4, "2026-03-24T09:10:00.000Z"],

  ["pin-home-nook", "Cozy Homes", "Cozy Reading Nook", "A candlelit chair, side table, and open book set up for a quiet night in.", "frank", 287, 2, "2026-03-24T10:15:00.000Z"],
  ["pin-home-interior", "Cozy Homes", "Interior Design Ideas", "A moody living room with layered lighting, clean lines, and a soft neutral palette.", "gia", 191, 2, "2026-03-22T15:00:00.000Z"],
  ["pin-home-plants", "Cozy Homes", "Plant Parenthood", "A plant-filled corner with sunlight, terracotta, and a home office that feels alive.", "harper", 163, 3, "2026-03-21T13:20:00.000Z"],

  ["pin-workspace-setup", "Workspace Goals", "Workspace Setup", "An iMac desk with stacked notebooks, plants, and an everyday setup that still feels styled.", "ivy", 203, 2, "2026-03-22T09:20:00.000Z"],
  ["pin-workspace-office", "Workspace Goals", "Home Office Tour", "A polished wood desk, shelving, and window light shaping the whole room.", "jules", 184, 2, "2026-03-21T14:00:00.000Z"],
] as const;

const pinCommentsByTitle: Record<string, DemoComment[]> = {
  "Spring Break": [
    { id: "c1", content: "The palm framing makes this feel like the first five minutes of a real trip.", createdAt: "2026-03-24T13:10:00.000Z", user: users.gia },
    { id: "c2", content: "That row of beach chairs is such a good foreground detail.", createdAt: "2026-03-24T13:18:00.000Z", user: users.noah },
  ],
  "Spring Outfit Ideas": [
    { id: "c3", content: "The monochrome pink styling is what makes this look editorial instead of random.", createdAt: "2026-03-24T12:55:00.000Z", user: users.alice },
    { id: "c4", content: "Love the print scale on this set. It feels very spring event coded.", createdAt: "2026-03-24T13:07:00.000Z", user: users.carol },
  ],
  "Rustic Garden Decor": [
    { id: "c5", content: "The doorway and climbing flowers make this feel like a whole mood board in one shot.", createdAt: "2026-03-24T12:44:00.000Z", user: users.mia },
    { id: "c6", content: "Those terracotta tones are exactly why this works.", createdAt: "2026-03-24T12:59:00.000Z", user: users.dave },
  ],
  "Cozy Reading Nook": [
    { id: "c7", content: "The candlelight and side table make this feel genuinely usable, not staged.", createdAt: "2026-03-24T11:00:00.000Z", user: users.alice },
    { id: "c8", content: "That open book and warm upholstery are doing all the work here.", createdAt: "2026-03-24T11:45:00.000Z", user: users.eve },
  ],
  "Homemade Pasta Night": [
    { id: "c9", content: "Seeing the dough run through the machine makes this feel way more authentic.", createdAt: "2026-03-23T20:05:00.000Z", user: users.alice },
    { id: "c10", content: "The flour and work surface details are such a nice touch.", createdAt: "2026-03-23T20:50:00.000Z", user: users.dave },
  ],
  "Nail Art": [
    { id: "c11", content: "The glossy black with the tortoiseshell accent is such a strong combo.", createdAt: "2026-03-24T12:50:00.000Z", user: users.carol },
    { id: "c12", content: "That oversized sweater sleeve makes the whole shot feel more editorial.", createdAt: "2026-03-24T13:05:00.000Z", user: users.eve },
  ],
  "Color Palette Inspiration": [
    { id: "c13", content: "The Pantone cards make this feel grounded instead of just aesthetic.", createdAt: "2026-03-22T11:18:00.000Z", user: users.kai },
    { id: "c14", content: "That peach and sand pairing would work beautifully for a soft brand system.", createdAt: "2026-03-22T11:40:00.000Z", user: users.luna },
  ],
  "Travel Photography Tips": [
    { id: "c15", content: "The stairway gives the whole landscape a clear focal path.", createdAt: "2026-03-23T08:02:00.000Z", user: users.ivy },
    { id: "c16", content: "This is a great example of using elevation without losing the horizon.", createdAt: "2026-03-23T08:16:00.000Z", user: users.mia },
  ],
  "Nature Photography": [
    { id: "c17", content: "The shallow depth of field makes the mushroom feel way more cinematic.", createdAt: "2026-03-22T16:35:00.000Z", user: users.jules },
    { id: "c18", content: "Love that this zooms in on texture instead of trying to be a huge landscape.", createdAt: "2026-03-22T16:52:00.000Z", user: users.bob },
  ],
  "Golden Hour Shots": [
    { id: "c19", content: "Those branches against the sun are such a good silhouette.", createdAt: "2026-03-24T06:40:00.000Z", user: users.frank },
    { id: "c20", content: "This is exactly the kind of light people chase and rarely catch.", createdAt: "2026-03-24T06:58:00.000Z", user: users.gia },
  ],
  "Workspace Setup": [
    { id: "c21", content: "The plants soften the whole desk without making it feel cluttered.", createdAt: "2026-03-22T09:42:00.000Z", user: users.kai },
    { id: "c22", content: "That stack of notebooks makes this feel actually lived in.", createdAt: "2026-03-22T09:58:00.000Z", user: users.luna },
  ],
  "Plant Parenthood": [
    { id: "c23", content: "The warm light in the doorway makes the greenery feel even richer.", createdAt: "2026-03-21T13:42:00.000Z", user: users.noah },
    { id: "c24", content: "This is such a good reference for mixing plants into a real room.", createdAt: "2026-03-21T14:02:00.000Z", user: users.ivy },
  ],
  "Recipe Inspiration": [
    { id: "c25", content: "The skillet presentation and lemon wedge make this feel super cookable.", createdAt: "2026-03-24T09:18:00.000Z", user: users.harper },
    { id: "c26", content: "This is the kind of dinner photo that actually makes me save the recipe.", createdAt: "2026-03-24T09:29:00.000Z", user: users.mia },
  ],
  "Home Office Tour": [
    { id: "c27", content: "The shelving and window line make this feel like a full space, not just a desk shot.", createdAt: "2026-03-21T14:14:00.000Z", user: users.alice },
    { id: "c28", content: "That wood tone is doing a lot to warm up the whole setup.", createdAt: "2026-03-21T14:26:00.000Z", user: users.carol },
  ],
  "Brunch Goals": [
    { id: "c29", content: "The mix of citrus, bagels, and tabletop styling makes this feel instantly saveable.", createdAt: "2026-03-23T10:41:00.000Z", user: users.eve },
    { id: "c30", content: "This looks like a brunch board I would actually try to recreate.", createdAt: "2026-03-23T10:52:00.000Z", user: users.frank },
  ],
  "Street Food Adventures": [
    { id: "c31", content: "The neon signage behind the stall gives this so much energy.", createdAt: "2026-03-22T13:10:00.000Z", user: users.gia },
    { id: "c32", content: "This feels more like being there than just looking at the food.", createdAt: "2026-03-22T13:28:00.000Z", user: users.jules },
  ],
  "Sunset at the Beach": [
    { id: "c33", content: "The tiny figures on the shoreline make the scale of this feel really calm.", createdAt: "2026-03-21T18:44:00.000Z", user: users.kai },
    { id: "c34", content: "That gradient from orange to blue is exactly why beach sunsets never get old.", createdAt: "2026-03-21T18:59:00.000Z", user: users.luna },
  ],
  "Morning Coffee Ritual": [
    { id: "c35", content: "The hand-held espresso shot makes this feel more intimate than a standard coffee flatlay.", createdAt: "2026-03-20T08:24:00.000Z", user: users.noah },
    { id: "c36", content: "Love the warm wood and soft background blur here.", createdAt: "2026-03-20T08:37:00.000Z", user: users.harper },
  ],
};

const genericComments: DemoComment[] = [
  { id: "gc1", content: "Saving this immediately.", createdAt: "2026-03-22T10:00:00.000Z", user: users.alice },
  { id: "gc2", content: "This one feels especially polished.", createdAt: "2026-03-22T12:00:00.000Z", user: users.bob },
];

const circleDiscussionBySlug: Record<string, DemoCircleComment[]> = {
  "ui-design": [
    {
      id: "d1",
      content: "PinCircles works best when the posts feel critique-able, not just save-able.",
      createdAt: "2026-03-23T09:00:00.000Z",
      user: users.alice,
      replies: [
        { id: "d1-r1", content: "Exactly. The comments are what turn a reference into a conversation.", createdAt: "2026-03-23T09:12:00.000Z", user: users.bob },
        { id: "d1-r2", content: "I’d rather see a handful of strong comments than endless low-signal saves.", createdAt: "2026-03-23T09:18:00.000Z", user: users.frank },
      ],
    },
    {
      id: "d2",
      content: "Would love a thread format for teardown posts where people pin screens and annotate what works.",
      createdAt: "2026-03-23T10:05:00.000Z",
      user: users.gia,
      replies: [
        { id: "d2-r1", content: "A side-by-side compare feature would be really strong for that.", createdAt: "2026-03-23T10:22:00.000Z", user: users.ivy },
      ],
    },
    { id: "d3", content: "Typography posts are way more useful when people explain why the pairing works.", createdAt: "2026-03-23T11:10:00.000Z", user: users.kai },
    { id: "d4", content: "This circle feels closest to what a Pinterest-native design community could be.", createdAt: "2026-03-23T11:48:00.000Z", user: users.luna },
    { id: "d5", content: "Would also love a recurring prompt like ‘best onboarding flow this week’.", createdAt: "2026-03-23T12:20:00.000Z", user: users.mia },
  ],
  "cozy-homes": [
    {
      id: "d6",
      content: "Warm, specific spaces beat generic interiors every time.",
      createdAt: "2026-03-24T08:00:00.000Z",
      user: users.carol,
      replies: [
        { id: "d6-r1", content: "Yes. The tiny details are what make a room feel lived in.", createdAt: "2026-03-24T08:12:00.000Z", user: users.alice },
        { id: "d6-r2", content: "Especially when the lighting feels natural instead of showroom-perfect.", createdAt: "2026-03-24T08:19:00.000Z", user: users.eve },
      ],
    },
    { id: "d7", content: "I want more corners like the reading nook post and fewer generic ‘neutral room’ images.", createdAt: "2026-03-24T08:44:00.000Z", user: users.harper },
    { id: "d8", content: "Rustic Garden Decor feels like a great direction for this circle too.", createdAt: "2026-03-24T09:05:00.000Z", user: users.gia },
    { id: "d9", content: "Plant-heavy spaces should probably keep showing up here because they fit the mood so well.", createdAt: "2026-03-24T09:28:00.000Z", user: users.noah },
    { id: "d10", content: "Would love a sub-theme around small apartments that still feel cozy.", createdAt: "2026-03-24T09:46:00.000Z", user: users.frank },
  ],
  "shows-to-watch": [
    {
      id: "d11",
      content: "A watchlist circle would actually be fun if people pinned scenes, costume references, and quick recs together.",
      createdAt: "2026-03-24T09:40:00.000Z",
      user: users.dave,
      replies: [
        { id: "d11-r1", content: "Exactly. It should feel more like a mood board than a text forum.", createdAt: "2026-03-24T09:52:00.000Z", user: users.luna },
      ],
    },
    { id: "d12", content: "I’d join instantly if people posted ‘watch if you liked’ visual chains.", createdAt: "2026-03-24T10:04:00.000Z", user: users.ivy },
    { id: "d13", content: "Costume design and set design posts would make this way more Pinterest-native.", createdAt: "2026-03-24T10:18:00.000Z", user: users.kai },
    { id: "d14", content: "This could be the best place in the app for fandom-adjacent content without becoming chaotic.", createdAt: "2026-03-24T10:39:00.000Z", user: users.alice },
  ],
  "style-edit": [
    {
      id: "d15",
      content: "Beauty and outfit references needed their own lane, and this circle finally gives them one.",
      createdAt: "2026-03-24T10:10:00.000Z",
      user: users.eve,
      replies: [
        { id: "d15-r1", content: "Nail Art and Spring Outfit Ideas make way more sense here than in UI Design.", createdAt: "2026-03-24T10:17:00.000Z", user: users.bob },
      ],
    },
    { id: "d16", content: "Would love to see hair references, accessory styling, and beauty editorials added too.", createdAt: "2026-03-24T10:31:00.000Z", user: users.carol },
    { id: "d17", content: "The fashion side of the app feels stronger already just by giving it its own home.", createdAt: "2026-03-24T10:49:00.000Z", user: users.gia },
    { id: "d18", content: "This circle could honestly carry a ton of seasonal trend content on its own.", createdAt: "2026-03-24T11:02:00.000Z", user: users.mia },
  ],
  "social-media-marketing-careers": [
    {
      id: "d19",
      content: "Would love a circle that actually breaks down portfolio-worthy campaign work instead of vague advice.",
      createdAt: "2026-03-24T10:32:00.000Z",
      user: users.frank,
      replies: [
        { id: "d19-r1", content: "Yes, especially if people share strategy writeups and metrics framing.", createdAt: "2026-03-24T10:45:00.000Z", user: users.eve },
      ],
    },
    { id: "d20", content: "A lot of marketing advice gets generic fast. Real examples would make this useful.", createdAt: "2026-03-24T11:06:00.000Z", user: users.jules },
    { id: "d21", content: "Would love content on community management careers too, not just growth roles.", createdAt: "2026-03-24T11:23:00.000Z", user: users.harper },
    { id: "d22", content: "This circle could be strong if people pin resume bullets and portfolio slides, not just ideas.", createdAt: "2026-03-24T11:41:00.000Z", user: users.noah },
  ],
  "job-hunting-2026": [
    {
      id: "d23",
      content: "This could be genuinely useful if people pinned resumes, outreach ideas, and application trackers.",
      createdAt: "2026-03-24T10:48:00.000Z",
      user: users.gia,
      replies: [
        { id: "d23-r1", content: "An interview prep board inside the same circle would also be huge.", createdAt: "2026-03-24T11:00:00.000Z", user: users.alice },
      ],
    },
    { id: "d24", content: "A lot of people need structure more than motivation. This could actually provide that.", createdAt: "2026-03-24T11:12:00.000Z", user: users.frank },
    { id: "d25", content: "Would love pinned examples of resumes that are getting callbacks in 2026 specifically.", createdAt: "2026-03-24T11:29:00.000Z", user: users.ivy },
    { id: "d26", content: "The best version of this circle would balance practical tools with emotional support.", createdAt: "2026-03-24T11:47:00.000Z", user: users.luna },
  ],
  budgeting: [
    {
      id: "d27",
      content: "A budgeting circle would work well if the posts stay visual and practical instead of preachy.",
      createdAt: "2026-03-24T11:04:00.000Z",
      user: users.harper,
      replies: [
        { id: "d27-r1", content: "Exactly. Template posts and spending systems would be more helpful than abstract advice.", createdAt: "2026-03-24T11:15:00.000Z", user: users.kai },
      ],
    },
    { id: "d28", content: "I’d save posts about bill calendars, sinking funds, and weekly reset routines.", createdAt: "2026-03-24T11:33:00.000Z", user: users.mia },
    { id: "d29", content: "Finance content gets overwhelming fast, so a calmer visual approach would really help.", createdAt: "2026-03-24T11:54:00.000Z", user: users.dave },
    { id: "d30", content: "Would love examples for freelancers and variable income too.", createdAt: "2026-03-24T12:06:00.000Z", user: users.noah },
  ],
  "mood-boarding": [
    {
      id: "d31",
      content: "This feels especially native to PinCircles because mood boards become conversation starters here.",
      createdAt: "2026-03-24T11:16:00.000Z",
      user: users.ivy,
      replies: [
        { id: "d31-r1", content: "Yes, the comments are where people can explain what makes a reference worth keeping.", createdAt: "2026-03-24T11:28:00.000Z", user: users.gia },
      ],
    },
    { id: "d32", content: "Would love sub-themes for interiors, branding, events, and styling boards.", createdAt: "2026-03-24T11:41:00.000Z", user: users.eve },
    { id: "d33", content: "This might be the most Pinterest-native circle idea in the whole app.", createdAt: "2026-03-24T11:58:00.000Z", user: users.alice },
    { id: "d34", content: "The right prompt posts could make this feel really active week to week.", createdAt: "2026-03-24T12:10:00.000Z", user: users.frank },
  ],
  "remote-careers": [
    {
      id: "d35",
      content: "Remote work advice gets better when people can pin their actual setups and routines.",
      createdAt: "2026-03-24T11:24:00.000Z",
      user: users.jules,
      replies: [
        { id: "d35-r1", content: "Agreed. Workspace photos plus async workflow tips would make this feel concrete.", createdAt: "2026-03-24T11:34:00.000Z", user: users.ivy },
      ],
    },
    { id: "d36", content: "I’d love to see posts about remote-friendly portfolios and what recruiters actually look for.", createdAt: "2026-03-24T11:52:00.000Z", user: users.harper },
    { id: "d37", content: "Time zone management and meeting hygiene would be super useful topics here.", createdAt: "2026-03-24T12:08:00.000Z", user: users.kai },
    { id: "d38", content: "This feels like a natural bridge between career content and workspace content.", createdAt: "2026-03-24T12:19:00.000Z", user: users.luna },
  ],
  investing: [
    {
      id: "d39",
      content: "A calmer investing circle with beginner-friendly visuals would stand out from the usual finance noise.",
      createdAt: "2026-03-24T11:36:00.000Z",
      user: users.kai,
      replies: [
        { id: "d39-r1", content: "Especially if people explain terms visually instead of assuming everyone is already fluent.", createdAt: "2026-03-24T11:49:00.000Z", user: users.mia },
      ],
    },
    { id: "d40", content: "Would love long-term strategy explainers that don’t feel like hustle content.", createdAt: "2026-03-24T12:03:00.000Z", user: users.dave },
    { id: "d41", content: "This circle could be a really approachable entry point for younger users.", createdAt: "2026-03-24T12:18:00.000Z", user: users.noah },
    { id: "d42", content: "Posts about basic account setup and risk vocabulary would probably get saved a lot.", createdAt: "2026-03-24T12:31:00.000Z", user: users.eve },
  ],
};

export const demoPins: DemoPin[] = pinDefs.map(([id, circleName, title, description, authorKey, votes, comments, createdAt]) => {
  const circle = circleDefs.find((item) => item.name === circleName)!;
  const author = users[authorKey as keyof typeof users];
  const commentList =
    pinCommentsByTitle[title] ??
    genericComments.slice(0, Math.max(2, Math.min(comments, genericComments.length)));

  const pinImageMap: Record<string, string> = {
    "Nail Art": photo("nail-art.avif"),
    "Spring Outfit Ideas": photo("spring-outfit-ideas.avif"),
    "Rustic Garden Decor": photo("rustic-garden-decor.avif"),
    "Spring Break": photo("spring-break.avif"),
    "Color Palette Inspiration": photo("color-palette.avif"),
    "Typography Experiments": photo("typography.avif"),
    "Sunset at the Beach": photo("sunset-at-the-beach.avif"),
    "Mountain Adventure": photo("mountain-adventure.avif"),
    "Travel Photography Tips": photo("travel-photography-tips.avif"),
    "Nature Photography": photo("nature-photography.avif"),
    "Golden Hour Shots": photo("golden-hour-shots.avif"),
    "Homemade Pasta Night": photo("homemade-pasta-night.avif"),
    "Street Food Adventures": photo("street-food-adventures.avif"),
    "Brunch Goals": photo("brunch-goals.avif"),
    "Morning Coffee Ritual": photo("morning-coffee-ritual.avif"),
    "Recipe Inspiration": photo("recipe-inspiration.avif"),
    "Cozy Reading Nook": photo("cozy-reading-nook.avif"),
    "Interior Design Ideas": photo("interior-design-ideas.avif"),
    "Plant Parenthood": photo("plant-parenthood.avif"),
    "Workspace Setup": photo("workspace-setup.avif"),
    "Home Office Tour": photo("home-office.avif"),
  };

  return {
    id,
    title,
    description,
    imageUrl: pinImageMap[title] ?? getThemedPinImage({
      id,
      circleName,
      categoryName: circle.category,
      title,
      description,
      fallbackUrl: "",
    }),
    circle: {
      name: circle.name,
      slug: circle.slug,
      category: { name: circle.category },
    },
    author: { username: author.username },
    _count: { votes, comments },
    createdAt,
    comments: commentList,
  };
});

export const demoCircles: DemoCircle[] = circleDefs.map((circle) => {
  const circlePins = demoPins.filter((pin) => pin.circle.slug === circle.slug);
  const circleCoverMap: Record<string, string> = {
    "UI Design": photo("UI-design.avif"),
    "Travel Photos": photo("travel-photos.avif"),
    "Foodie": photo("foodie.avif"),
    "Cozy Homes": photo("cozy-homes.avif"),
    "Workspace Goals": photo("workplace-goals.avif"),
    "Shows To Watch": photo("shows-to-watch.avif"),
    "Style Edit": photo("spring-outfit-ideas.avif"),
    "Social Media Marketing Careers": photo("social-media-marketing.avif"),
    "Job Hunting 2026": photo("job-hunting.avif"),
    Budgeting: photo("budgeting.avif"),
    "Mood Boarding": photo("mood-boarding.avif"),
    "Remote Careers": photo("remote-careers.avif"),
    Investing: photo("investing.avif"),
  };
  return {
    id: circle.id,
    name: circle.name,
    slug: circle.slug,
    description: circle.description,
    imageUrl: circleCoverMap[circle.name] ?? getThemedCircleCover({
      id: circle.id,
      circleName: circle.name,
      categoryName: circle.category,
      description: circle.description,
      fallbackUrl: "",
    }),
    category: { name: circle.category },
    owner: { username: circle.owner },
    _count: { memberships: circle.memberships, pins: circlePins.length },
    discussion: circleDiscussionBySlug[circle.slug] ?? [
      { id: `disc-${circle.slug}`, content: `People are using ${circle.name} to trade references, feedback, and ideas in one place.`, createdAt: "2026-03-22T09:00:00.000Z", user: users.alice },
    ],
  };
});

export function getDemoCircle(slug: string) {
  return demoCircles.find((circle) => circle.slug === slug) ?? null;
}

export function getDemoPin(id: string) {
  return demoPins.find((pin) => pin.id === id) ?? null;
}

export function getPinsForCircle(slug: string) {
  return demoPins.filter((pin) => pin.circle.slug === slug);
}

function countThread(comments: DemoComment[] | DemoCircleComment[]): number {
  return comments.reduce(
    (total, comment) => total + 1 + countThread((comment.replies ?? []) as DemoComment[]),
    0
  );
}

export function getCommentThreadCount(comments: DemoComment[]) {
  return countThread(comments);
}

export function getCircleDiscussionCount(slug: string) {
  const circle = getDemoCircle(slug);
  return circle ? countThread(circle.discussion) : 0;
}

export function getDemoCircleAnalytics(slug: string) {
  const circle = getDemoCircle(slug);
  const pins = getPinsForCircle(slug);

  if (!circle) {
    return null;
  }

  const totalComments = pins.reduce((sum, pin) => sum + getCommentThreadCount(pin.comments), 0);
  const totalVotes = pins.reduce((sum, pin) => sum + pin._count.votes, 0);
  const totalPins = pins.length;
  const activeMembersLast7Days = Math.max(
    12,
    Math.min(circle._count.memberships, Math.round(circle._count.memberships * 0.21))
  );
  const engagementRate = Number(
    (((totalVotes + totalComments) / Math.max(circle._count.memberships, 1)) * 100).toFixed(1)
  );
  const circleHealthScore = Math.max(
    52,
    Math.min(
      96,
      Math.round(
        40 +
          totalPins * 6 +
          Math.min(totalComments, 20) * 1.1 +
          Math.min(totalVotes, 400) / 20
      )
    )
  );

  const topPins = [...pins]
    .sort((a, b) => b._count.votes + b._count.comments - (a._count.votes + a._count.comments))
    .slice(0, 5)
    .map((pin) => ({
      id: pin.id,
      title: pin.title,
      imageUrl: pin.imageUrl,
      voteCount: pin._count.votes,
      commentCount: getCommentThreadCount(pin.comments),
    }));

  const dateBuckets = new Map<string, { pins: number; votes: number; comments: number }>();
  for (let offset = 6; offset >= 0; offset -= 1) {
    const date = new Date("2026-03-25T12:00:00.000Z");
    date.setUTCDate(date.getUTCDate() - offset);
    const key = date.toISOString().slice(0, 10);
    dateBuckets.set(key, { pins: 0, votes: 0, comments: 0 });
  }

  pins.forEach((pin) => {
    const key = pin.createdAt.slice(0, 10);
    const bucket = dateBuckets.get(key);
    if (!bucket) return;
    bucket.pins += 1;
    bucket.votes += pin._count.votes;
    bucket.comments += getCommentThreadCount(pin.comments);
  });

  const engagementOverTime = Array.from(dateBuckets.entries()).map(([date, values]) => ({
    date,
    pins: values.pins,
    votes: values.votes,
    comments: values.comments,
  }));

  return {
    totalMembers: circle._count.memberships,
    activeMembersLast7Days,
    totalPins,
    totalComments,
    totalVotes,
    engagementRate,
    topPins,
    engagementOverTime,
    circleHealthScore,
  };
}
