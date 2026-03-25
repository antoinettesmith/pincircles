/**
 * Seed script - creates demo data for staging/development
 * Run with: npm run db:seed
 *
 * Resets existing data and populates with rich fake content.
 */
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Unsplash images organized by topic (format: ixlib ensures compatibility)
const IMG = (id: string, w = 600, h = 750) =>
  `https://images.unsplash.com/photo-${id}?ixlib=rb-4.0.3&auto=format&fit=crop&w=${w}&h=${h}&q=80`;

// Design / UI - use content-rich images, gradients only for gradient-specific titles
const DESIGN_IMAGES = [
  IMG("1618005182384-a83a8bd57fbe"),
  IMG("1557683316-973673baf926"),
  IMG("1557682250-33bd709cbe85"),
  IMG("1557682260-96773eb01377"),
  IMG("1557683304-673a23048d34"),
  IMG("1516483638261-f4dbaf036963"),
];

// Travel / mountains / landscapes
const TRAVEL_IMAGES = [
  IMG("1506905925346-21bda4d32df4"),
  IMG("1469474968028-56623f02e42e"),
  IMG("1501785888041-af3ef285b470"),
  IMG("1476514525535-07fb3b4ae5f1"),
  IMG("1533105079780-92b9be482077"),
  IMG("1699566448055-671c8dbcc7ee"),
];

// Food / meals / recipes / brunch
const FOOD_IMAGES = [
  IMG("1546069901-ba9599a7e63c"),
  IMG("1565299624946-b28f40a0ae38"),
  IMG("1504674900247-0877df9cc836"),
  IMG("1606787366850-de6330128bfc"),
  IMG("1675252369719-dd52bc69c3df4"),
  IMG("1467003909585-2f8a72700288"),
];

//  Living room / interior (fallbacks when no API key - add UNSPLASH_ACCESS_KEY for best results)
const HOME_IMAGES = [
IMG("1593062096033-9a26f09db8dd"),
IMG("1618220179428-22790b461013"),
IMG("1676321046449-5fc72b124490"),
IMG("1564078516393-cf04bd966897"),
IMG("1618221195710-dd6b41faaea6"),
IMG("1550581190-9c1c48d21d6c"),
];

// Home office - desk at home (fallbacks when no API key)
const HOME_OFFICE_IMAGES = [
  IMG("1600494603989-9650cf6ddd3d"),
  IMG("1732721753209-ba32e50818dd"),
  IMG("1547586696-ea22b4d4235d"),
  IMG("1547043736-b2247cb34b01"),
  IMG("1526657782461-9fe13402a841"),
  IMG("1505330622279-bf7d7fc918f4"),
];

// Coffee / morning ritual (use UNSPLASH_ACCESS_KEY for API-fetched coffee image)
const COFFEE_IMAGES = [
  IMG("1495474472287-4d71bcdd2085"),
  IMG("1544787219-7d0926ec0b0a"),
];

// Plants / houseplants (fallbacks when no API key)
const PLANTS_IMAGES = [
  IMG("1470058869958-2a77ade41c02"),
  IMG("1601985705806-5b9a71f6004f"),
  IMG("1673203734665-0a534c043b7f"),
  IMG("1521334884684-d80222895322"),
  IMG("1526565782131-a13074f0dbbb"),
  IMG("1446292532430-3e76f6ab6444"),
];

// Photography / golden hour / nature
const PHOTOGRAPHY_IMAGES = [
  IMG("1471341971476-ae15ff5dd4ea"),
 IMG("1620456860124-0ea5b3d2f58f"),
 IMG("1682384157305-4e62ddb3ec0f"),
 IMG("1542992804-34f8f4cb193b"),
 IMG("1680710419654-9f99c8a80d87"),
 IMG("1771655393383-aeded39730fa")
];

// Tech / workspace / office
const TECH_IMAGES = [
  IMG("1498050108023-c5249f4df085"),
  IMG("1614624532983-4ce03382d63d"),
  IMG("1504890001746-a9a68eda46e2"),
  IMG("1593376853899-fbb47a057fa0"),
  IMG("1679538642399-323a55485780"),
  IMG("1596697938289-68e8d0c6e8f4"),
];

// Topic index: 0=Design, 1=Travel, 2=Food, 3=MinimalDesign, 4=Home, 5=Photography, 6=Brunch, 7=Tech
const IMAGES_BY_CIRCLE: Record<number, string[]> = {
  0: DESIGN_IMAGES, 1: TRAVEL_IMAGES, 2: FOOD_IMAGES, 3: DESIGN_IMAGES,
  4: HOME_IMAGES, 5: PHOTOGRAPHY_IMAGES, 6: FOOD_IMAGES, 7: TECH_IMAGES,
};

const PIN_TITLES = [
  "Minimalist Dashboard Design",
  "Color Palette Inspiration",
  "Sunset at the Beach",
  "Mountain Adventure",
  "Homemade Pasta Night",
  "Cozy Reading Nook",
  "Gradient Backgrounds",
  "Typography Experiments",
  "Travel Photography Tips",
  "Street Food Adventures",
  "Interior Design Ideas",
  "Morning Coffee Ritual",
  "Nature Photography",
  "Brunch Goals",
  "Workspace Setup",
  "Plant Parenthood",
  "Minimalist Living",
  "Creative Color Blocking",
  "Coastal Vibes",
  "Urban Exploration",
  "Recipe Inspiration",
  "Design System Tokens",
  "Golden Hour Shots",
  "Home Office Tour",
  "Weekend Getaway",
];

const PIN_DESCRIPTIONS = [
  "Clean and functional design that puts content first.",
  "Vibrant colors for your next project.",
  "Golden hour photography at its finest.",
  "Hiking in the Alps - unforgettable views.",
  "Fresh pasta from scratch, worth every minute.",
  "The perfect spot for a lazy Sunday.",
  "Smooth gradients that pop.",
  "Playing with type and layout.",
  "Capturing moments from around the world.",
  "The best tacos I've ever had.",
  "Making our space feel like home.",
  "Start the day right.",
  "Getting lost in the outdoors.",
  "Avocado toast and mimosas.",
  "Productivity meets aesthetics.",
  "Our growing collection.",
  "Less is more.",
  "Bold and beautiful.",
  "Beach days forever.",
  "Discovering hidden gems.",
  "Trying this recipe tonight!",
  "Building a consistent design language.",
  "Magic light.",
  "Remote work setup tour.",
  "Quick escape from the city.",
];

const COMMENT_TEXTS = [
  "Love this! Saving for later.",
  "So inspiring!",
  "Great composition.",
  "Need to try this.",
  "Beautiful work!",
  "This is exactly what I was looking for.",
  "Adding to my mood board.",
  "Obsessed with this.",
  "The colors are perfect.",
  "Such a vibe.",
  "Goals!",
  "Can't wait to try.",
  "This speaks to me.",
  "Absolutely stunning.",
  "Bookmarked!",
  "More like this please.",
  "So clean and minimal.",
  "The lighting is incredible.",
  "Perfect for the season.",
  "This made my day.",
];

/** Fetch topic-matched image URL from Unsplash API (when key is set) */
async function fetchUnsplashImage(
  query: string,
  key: string
): Promise<string | null> {
  try {
    const res = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&client_id=${key}`
    );
    const data = (await res.json()) as { results?: Array<{ urls?: { raw?: string } }> };
    const raw = data.results?.[0]?.urls?.raw;
    if (raw) {
      const sep = raw.includes("?") ? "&" : "?";
      return `${raw}${sep}ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=750&q=80`;
    }
  } catch {
    /* ignore */
  }
  return null;
}

async function main() {
  console.log("Seeding database (resetting existing data)...");

  // Fetch topic-specific images from Unsplash API when key is set
  const unsplashKey = process.env.UNSPLASH_ACCESS_KEY;
  const fetchedUrls: Record<string, string> = {};
  if (unsplashKey) {
    const [homeOffice, plants, livingRoom, coffee] = await Promise.all([
      fetchUnsplashImage("home office desk workspace", unsplashKey),
      fetchUnsplashImage("houseplants indoor plants", unsplashKey),
      fetchUnsplashImage("living room interior design", unsplashKey),
      fetchUnsplashImage("coffee cup morning", unsplashKey),
    ]);
    if (homeOffice) fetchedUrls.homeOffice = homeOffice;
    if (plants) fetchedUrls.plants = plants;
    if (livingRoom) fetchedUrls.livingRoom = livingRoom;
    if (coffee) fetchedUrls.coffee = coffee;
  }

  // Reset in correct order (respecting foreign keys)
  await prisma.circleComment.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.vote.deleteMany();
  await prisma.pin.deleteMany();
  await prisma.membership.deleteMany();
  await prisma.circle.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  const hashedPassword = await bcrypt.hash("password123", 10);

  // Users
  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: "alice@example.com",
        username: "alice",
        password: hashedPassword,
        role: "ADMIN",
      },
    }),
    prisma.user.create({
      data: {
        email: "bob@example.com",
        username: "bob",
        password: hashedPassword,
        role: "MEMBER",
      },
    }),
    prisma.user.create({
      data: {
        email: "carol@example.com",
        username: "carol",
        password: hashedPassword,
        role: "MEMBER",
      },
    }),
    prisma.user.create({
      data: {
        email: "dave@example.com",
        username: "dave",
        password: hashedPassword,
        role: "MEMBER",
      },
    }),
    prisma.user.create({
      data: {
        email: "eve@example.com",
        username: "eve",
        password: hashedPassword,
        role: "MEMBER",
      },
    }),
  ]);

  // Categories
  const categories = await Promise.all([
    prisma.category.create({
      data: { name: "Design", slug: "design", description: "Visual design and creativity" },
    }),
    prisma.category.create({
      data: { name: "Travel", slug: "travel", description: "Travel photos and tips" },
    }),
    prisma.category.create({
      data: { name: "Food", slug: "food", description: "Recipes and food photography" },
    }),
    prisma.category.create({
      data: { name: "Technology", slug: "tech", description: "Tech and gadgets" },
    }),
    prisma.category.create({
      data: { name: "Home", slug: "home", description: "Interior design and decor" },
    }),
    prisma.category.create({
      data: { name: "Photography", slug: "photography", description: "Photo tips and inspiration" },
    }),
    prisma.category.create({
      data: { name: "Lifestyle", slug: "lifestyle", description: "Daily inspiration" },
    }),
  ]);

  // Circle cover images - topic-matched (landscape 800x400)
  const CIRCLE_IMAGES = [
    IMG("1557682250-33bd709cbe85", 800, 400), // UI Design - gradient
    IMG("1506905925346-21bda4d32df4", 800, 400), // Travel - mountain
    IMG("1546069901-ba9599a7e63c", 800, 400), // Foodie - food
    IMG("1557683316-973673baf926", 800, 400), // Minimalist Design - gradient
    IMG("1673548916468-d5dc2c1bd62b", 800, 400), // Cozy Homes - interior
    IMG("1503803548695-c2a7b4a5b875", 800, 400), // Golden Hour - mountain/sunset
    IMG("1673581430690-0b42ab287ae9", 800, 400), // Brunch Club - restaurant
    IMG("1559136555-9303baea8ebd", 800, 400), // Workspace Goals - office
  ];

  // Circles
  const circles = await Promise.all([
    prisma.circle.create({
      data: {
        name: "UI Design",
        slug: "ui-design",
        description: "Beautiful user interfaces and design systems. Share your best work.",
        imageUrl: CIRCLE_IMAGES[0],
        categoryId: categories[0].id,
        ownerId: users[0].id,
      },
    }),
    prisma.circle.create({
      data: {
        name: "Travel Photos",
        slug: "travel-photos",
        description: "Share your travel adventures and discover new destinations.",
        imageUrl: CIRCLE_IMAGES[1],
        categoryId: categories[1].id,
        ownerId: users[0].id,
      },
    }),
    prisma.circle.create({
      data: {
        name: "Foodie",
        slug: "foodie",
        description: "Delicious recipes, restaurant finds, and food photography.",
        imageUrl: CIRCLE_IMAGES[2],
        categoryId: categories[2].id,
        ownerId: users[1].id,
      },
    }),
    prisma.circle.create({
      data: {
        name: "Minimalist Design",
        slug: "minimalist-design",
        description: "Less is more. Clean, simple, intentional design.",
        imageUrl: CIRCLE_IMAGES[3],
        categoryId: categories[0].id,
        ownerId: users[1].id,
      },
    }),
    prisma.circle.create({
      data: {
        name: "Cozy Homes",
        slug: "cozy-homes",
        description: "Interior inspiration for making your space feel like home.",
        imageUrl: CIRCLE_IMAGES[4],
        categoryId: categories[4].id,
        ownerId: users[2].id,
      },
    }),
    prisma.circle.create({
      data: {
        name: "Golden Hour",
        slug: "golden-hour",
        description: "That perfect light. Share your best golden hour shots.",
        imageUrl: CIRCLE_IMAGES[5],
        categoryId: categories[5].id,
        ownerId: users[2].id,
      },
    }),
    prisma.circle.create({
      data: {
        name: "Brunch Club",
        slug: "brunch-club",
        description: "Weekend brunch spots and at-home brunch ideas.",
        imageUrl: CIRCLE_IMAGES[6],
        categoryId: categories[2].id,
        ownerId: users[3].id,
      },
    }),
    prisma.circle.create({
      data: {
        name: "Workspace Goals",
        slug: "workspace-goals",
        description: "Desk setups, home offices, and productivity spaces.",
        imageUrl: CIRCLE_IMAGES[7],
        categoryId: categories[3].id,
        ownerId: users[4].id,
      },
    }),
  ]);

  // Memberships (users join multiple circles)
  const membershipData = [
    { userId: users[0].id, circleId: circles[0].id },
    { userId: users[0].id, circleId: circles[1].id },
    { userId: users[0].id, circleId: circles[2].id },
    { userId: users[1].id, circleId: circles[0].id },
    { userId: users[1].id, circleId: circles[2].id },
    { userId: users[1].id, circleId: circles[3].id },
    { userId: users[2].id, circleId: circles[1].id },
    { userId: users[2].id, circleId: circles[2].id },
    { userId: users[2].id, circleId: circles[4].id },
    { userId: users[2].id, circleId: circles[5].id },
    { userId: users[3].id, circleId: circles[2].id },
    { userId: users[3].id, circleId: circles[6].id },
    { userId: users[3].id, circleId: circles[4].id },
    { userId: users[4].id, circleId: circles[0].id },
    { userId: users[4].id, circleId: circles[7].id },
    { userId: users[4].id, circleId: circles[3].id },
  ];
  await prisma.membership.createMany({ data: membershipData });

  // Pins - each has explicit imgUrl for manual control. Edit any imgUrl to change that pin's image.
  // Use IMG("unsplash-id") or array refs: DESIGN_IMAGES[0], FOOD_IMAGES[1], etc.
  const pinConfigs = [
    { circleIdx: 0, userIdx: 0, titleIdx: 0, descIdx: 0, imgUrl: DESIGN_IMAGES[0] },
    { circleIdx: 0, userIdx: 1, titleIdx: 1, descIdx: 1, imgUrl: DESIGN_IMAGES[1] },
    { circleIdx: 0, userIdx: 0, titleIdx: 6, descIdx: 6, imgUrl: DESIGN_IMAGES[1] },
    { circleIdx: 0, userIdx: 4, titleIdx: 7, descIdx: 7, imgUrl: DESIGN_IMAGES[2] },
    { circleIdx: 0, userIdx: 1, titleIdx: 21, descIdx: 21, imgUrl: DESIGN_IMAGES[2] },
    { circleIdx: 1, userIdx: 0, titleIdx: 2, descIdx: 2, imgUrl: TRAVEL_IMAGES[0] },
    { circleIdx: 1, userIdx: 2, titleIdx: 3, descIdx: 3, imgUrl: TRAVEL_IMAGES[1] },
    { circleIdx: 1, userIdx: 0, titleIdx: 8, descIdx: 8, imgUrl: TRAVEL_IMAGES[2] },
    { circleIdx: 1, userIdx: 2, titleIdx: 12, descIdx: 12, imgUrl: TRAVEL_IMAGES[3] },
    { circleIdx: 1, userIdx: 0, titleIdx: 22, descIdx: 22, imgUrl: PHOTOGRAPHY_IMAGES[0] },
    { circleIdx: 2, userIdx: 1, titleIdx: 4, descIdx: 4, imgUrl: FOOD_IMAGES[0] },
    { circleIdx: 2, userIdx: 2, titleIdx: 9, descIdx: 9, imgUrl: FOOD_IMAGES[1] },
    { circleIdx: 2, userIdx: 1, titleIdx: 13, descIdx: 13, imgUrl: FOOD_IMAGES[2] },
    { circleIdx: 2, userIdx: 3, titleIdx: 11, descIdx: 11, imgUrl: COFFEE_IMAGES[0] },
    { circleIdx: 2, userIdx: 1, titleIdx: 20, descIdx: 20, imgUrl: FOOD_IMAGES[0] },
    { circleIdx: 3, userIdx: 1, titleIdx: 16, descIdx: 16, imgUrl: DESIGN_IMAGES[0] },
    { circleIdx: 3, userIdx: 4, titleIdx: 17, descIdx: 17, imgUrl: DESIGN_IMAGES[3] },
    { circleIdx: 3, userIdx: 1, titleIdx: 6, descIdx: 6, imgUrl: DESIGN_IMAGES[1] },
    { circleIdx: 4, userIdx: 2, titleIdx: 5, descIdx: 5, imgUrl: HOME_IMAGES[0] },
    { circleIdx: 4, userIdx: 3, titleIdx: 10, descIdx: 10, imgUrl: HOME_IMAGES[1] },
    { circleIdx: 4, userIdx: 2, titleIdx: 15, descIdx: 15, imgUrl: PLANTS_IMAGES[0] },
    { circleIdx: 5, userIdx: 2, titleIdx: 22, descIdx: 22, imgUrl: PHOTOGRAPHY_IMAGES[0] },
    { circleIdx: 5, userIdx: 0, titleIdx: 12, descIdx: 12, imgUrl: PHOTOGRAPHY_IMAGES[1] },
    { circleIdx: 6, userIdx: 3, titleIdx: 13, descIdx: 13, imgUrl: FOOD_IMAGES[2] },
    { circleIdx: 6, userIdx: 3, titleIdx: 20, descIdx: 20, imgUrl: FOOD_IMAGES[0] },
    { circleIdx: 7, userIdx: 4, titleIdx: 14, descIdx: 14, imgUrl: TECH_IMAGES[0] },
    { circleIdx: 7, userIdx: 4, titleIdx: 23, descIdx: 23, imgUrl: HOME_OFFICE_IMAGES[0] },
  ];

  const pins = [];
  for (const cfg of pinConfigs) {
    const pin = await prisma.pin.create({
      data: {
        title: PIN_TITLES[cfg.titleIdx % PIN_TITLES.length],
        description: PIN_DESCRIPTIONS[cfg.descIdx % PIN_DESCRIPTIONS.length],
        imageUrl: cfg.imgUrl,
        circleId: circles[cfg.circleIdx].id,
        authorId: users[cfg.userIdx].id,
      },
    });
    pins.push(pin);
  }

  // Votes - varied engagement
  const voteData: { userId: string; pinId: string }[] = [];
  for (let i = 0; i < pins.length; i++) {
    const numVotes = Math.floor(Math.random() * 5) + (i % 3);
    const shuffledUsers = [...users].sort(() => Math.random() - 0.5);
    for (let v = 0; v < Math.min(numVotes, users.length); v++) {
      voteData.push({ userId: shuffledUsers[v].id, pinId: pins[i].id });
    }
  }
  const uniqueVotes = Array.from(
    new Map(voteData.map((v) => [`${v.userId}-${v.pinId}`, v])).values()
  );
  await prisma.vote.createMany({ data: uniqueVotes, skipDuplicates: true });

  // Comments - 2-4 per pin, some with @ mentions and threaded replies
  const commentData: { content: string; userId: string; pinId: string }[] = [];
  for (let i = 0; i < pins.length; i++) {
    const numComments = Math.floor(Math.random() * 3) + 2;
    const shuffledUsers = [...users].sort(() => Math.random() - 0.5);
    const shuffledComments = [...COMMENT_TEXTS].sort(() => Math.random() - 0.5);
    for (let c = 0; c < numComments; c++) {
      let content = shuffledComments[c % COMMENT_TEXTS.length];
      if (c % 4 === 0 && users.length > 1) {
        const otherUser = users[(c + 1) % users.length];
        content = `Hey @${otherUser.username} ${content}`;
      }
      commentData.push({
        content,
        userId: shuffledUsers[c % users.length].id,
        pinId: pins[i].id,
      });
    }
  }
  const createdComments = await Promise.all(
    commentData.map((c) => prisma.comment.create({ data: c }))
  );
  // Circle-level discussion comments (general, not pin-specific) with nested replies
  const circleComment1 = await prisma.circleComment.create({
    data: {
      content: "Love this circle! So much inspiration here.",
      userId: users[0].id,
      circleId: circles[0].id,
    },
  });
  await prisma.circleComment.create({
    data: {
      content: "Same! The design community here is great.",
      userId: users[1].id,
      circleId: circles[0].id,
      parentId: circleComment1.id,
    },
  });
  await prisma.circleComment.create({
    data: {
      content: "Anyone have tips for getting started with UI design?",
      userId: users[2].id,
      circleId: circles[0].id,
    },
  });
  await prisma.circleComment.create({
    data: {
      content: "Best brunch spots in the city? Drop your recs!",
      userId: users[3].id,
      circleId: circles[6].id,
    },
  });

  // Add threaded replies to first few pins
  const replyComments = [
    { content: "Thanks @alice! Glad you like it", userId: users[0].id },
    { content: "Same here @bob, totally agree", userId: users[1].id },
    { content: "Great point @carol", userId: users[2].id },
  ];
  for (let i = 0; i < Math.min(3, createdComments.length); i++) {
    const parent = createdComments[i];
    if (parent && i < replyComments.length) {
      await prisma.comment.create({
        data: {
          ...replyComments[i],
          pinId: parent.pinId,
          parentId: parent.id,
        },
      });
    }
  }

  console.log("Seed complete!");
  console.log(`Created: ${users.length} users, ${categories.length} categories, ${circles.length} circles, ${pins.length} pins`);
  console.log("Demo login: alice@example.com / bob@example.com / carol@example.com / dave@example.com / eve@example.com");
  console.log("Password for all: password123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
