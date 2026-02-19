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

// High-quality placeholder images (Unsplash Source - free for use)
const PIN_IMAGES = [
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&h=750&fit=crop",
  "https://images.unsplash.com/photo-1557683316-973673baf926?w=600&h=750&fit=crop",
  "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=600&h=750&fit=crop",
  "https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=600&h=750&fit=crop",
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=750&fit=crop",
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&h=750&fit=crop",
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=750&fit=crop",
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=750&fit=crop",
  "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&h=750&fit=crop",
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=750&fit=crop",
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=750&fit=crop",
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=750&fit=crop",
  "https://images.unsplash.com/photo-1557682224-5b8590e9ec58?w=600&h=750&fit=crop",
  "https://images.unsplash.com/photo-1557682260-96773eb01377?w=600&h=750&fit=crop",
  "https://images.unsplash.com/photo-1513542789411-b6df5d86c8e5?w=600&h=750&fit=crop",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=750&fit=crop",
  "https://images.unsplash.com/photo-1557683304-673a23048d34?w=600&h=750&fit=crop",
  "https://images.unsplash.com/photo-1557682268-e3955ed5d83f?w=600&h=750&fit=crop",
  "https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=600&h=750&fit=crop",
  "https://images.unsplash.com/photo-1557683311-eac922347aa1?w=600&h=750&fit=crop",
  "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=600&h=750&fit=crop",
  "https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=600&h=750&fit=crop",
  "https://images.unsplash.com/photo-1557682260-96773eb01377?w=600&h=750&fit=crop",
  "https://images.unsplash.com/photo-1557683304-673a23048d34?w=600&h=750&fit=crop",
  "https://images.unsplash.com/photo-1557683316-973673baf926?w=600&h=750&fit=crop",
];

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

async function main() {
  console.log("Seeding database (resetting existing data)...");

  // Reset in correct order (respecting foreign keys)
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

  // Circles
  const circles = await Promise.all([
    prisma.circle.create({
      data: {
        name: "UI Design",
        slug: "ui-design",
        description: "Beautiful user interfaces and design systems. Share your best work.",
        categoryId: categories[0].id,
        ownerId: users[0].id,
      },
    }),
    prisma.circle.create({
      data: {
        name: "Travel Photos",
        slug: "travel-photos",
        description: "Share your travel adventures and discover new destinations.",
        categoryId: categories[1].id,
        ownerId: users[0].id,
      },
    }),
    prisma.circle.create({
      data: {
        name: "Foodie",
        slug: "foodie",
        description: "Delicious recipes, restaurant finds, and food photography.",
        categoryId: categories[2].id,
        ownerId: users[1].id,
      },
    }),
    prisma.circle.create({
      data: {
        name: "Minimalist Design",
        slug: "minimalist-design",
        description: "Less is more. Clean, simple, intentional design.",
        categoryId: categories[0].id,
        ownerId: users[1].id,
      },
    }),
    prisma.circle.create({
      data: {
        name: "Cozy Homes",
        slug: "cozy-homes",
        description: "Interior inspiration for making your space feel like home.",
        categoryId: categories[4].id,
        ownerId: users[2].id,
      },
    }),
    prisma.circle.create({
      data: {
        name: "Golden Hour",
        slug: "golden-hour",
        description: "That perfect light. Share your best golden hour shots.",
        categoryId: categories[5].id,
        ownerId: users[2].id,
      },
    }),
    prisma.circle.create({
      data: {
        name: "Brunch Club",
        slug: "brunch-club",
        description: "Weekend brunch spots and at-home brunch ideas.",
        categoryId: categories[2].id,
        ownerId: users[3].id,
      },
    }),
    prisma.circle.create({
      data: {
        name: "Workspace Goals",
        slug: "workspace-goals",
        description: "Desk setups, home offices, and productivity spaces.",
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

  // Pins - distribute across circles with varied content
  const pinConfigs = [
    { circleIdx: 0, userIdx: 0, titleIdx: 0, descIdx: 0, imgIdx: 0 },
    { circleIdx: 0, userIdx: 1, titleIdx: 1, descIdx: 1, imgIdx: 1 },
    { circleIdx: 0, userIdx: 0, titleIdx: 6, descIdx: 6, imgIdx: 2 },
    { circleIdx: 0, userIdx: 4, titleIdx: 7, descIdx: 7, imgIdx: 3 },
    { circleIdx: 0, userIdx: 1, titleIdx: 20, descIdx: 20, imgIdx: 4 },
    { circleIdx: 1, userIdx: 0, titleIdx: 2, descIdx: 2, imgIdx: 5 },
    { circleIdx: 1, userIdx: 2, titleIdx: 3, descIdx: 3, imgIdx: 6 },
    { circleIdx: 1, userIdx: 0, titleIdx: 8, descIdx: 8, imgIdx: 7 },
    { circleIdx: 1, userIdx: 2, titleIdx: 12, descIdx: 12, imgIdx: 8 },
    { circleIdx: 1, userIdx: 0, titleIdx: 22, descIdx: 22, imgIdx: 9 },
    { circleIdx: 2, userIdx: 1, titleIdx: 4, descIdx: 4, imgIdx: 10 },
    { circleIdx: 2, userIdx: 2, titleIdx: 9, descIdx: 9, imgIdx: 11 },
    { circleIdx: 2, userIdx: 1, titleIdx: 13, descIdx: 13, imgIdx: 12 },
    { circleIdx: 2, userIdx: 3, titleIdx: 14, descIdx: 14, imgIdx: 13 },
    { circleIdx: 2, userIdx: 1, titleIdx: 20, descIdx: 20, imgIdx: 14 },
    { circleIdx: 3, userIdx: 1, titleIdx: 16, descIdx: 16, imgIdx: 15 },
    { circleIdx: 3, userIdx: 4, titleIdx: 17, descIdx: 17, imgIdx: 16 },
    { circleIdx: 3, userIdx: 1, titleIdx: 20, descIdx: 20, imgIdx: 17 },
    { circleIdx: 4, userIdx: 2, titleIdx: 5, descIdx: 5, imgIdx: 18 },
    { circleIdx: 4, userIdx: 3, titleIdx: 10, descIdx: 10, imgIdx: 19 },
    { circleIdx: 4, userIdx: 2, titleIdx: 15, descIdx: 15, imgIdx: 20 },
    { circleIdx: 5, userIdx: 2, titleIdx: 22, descIdx: 22, imgIdx: 21 },
    { circleIdx: 5, userIdx: 0, titleIdx: 12, descIdx: 12, imgIdx: 22 },
    { circleIdx: 6, userIdx: 3, titleIdx: 13, descIdx: 13, imgIdx: 23 },
    { circleIdx: 6, userIdx: 3, titleIdx: 14, descIdx: 14, imgIdx: 24 },
    { circleIdx: 7, userIdx: 4, titleIdx: 14, descIdx: 14, imgIdx: 0 },
    { circleIdx: 7, userIdx: 4, titleIdx: 23, descIdx: 23, imgIdx: 1 },
  ];

  const pins = [];
  for (const cfg of pinConfigs) {
    const pin = await prisma.pin.create({
      data: {
        title: PIN_TITLES[cfg.titleIdx % PIN_TITLES.length],
        description: PIN_DESCRIPTIONS[cfg.descIdx % PIN_DESCRIPTIONS.length],
        imageUrl: PIN_IMAGES[cfg.imgIdx % PIN_IMAGES.length],
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

  // Comments - 2-4 per pin on average
  const commentData: { content: string; userId: string; pinId: string }[] = [];
  for (let i = 0; i < pins.length; i++) {
    const numComments = Math.floor(Math.random() * 3) + 2;
    const shuffledUsers = [...users].sort(() => Math.random() - 0.5);
    const shuffledComments = [...COMMENT_TEXTS].sort(() => Math.random() - 0.5);
    for (let c = 0; c < numComments; c++) {
      commentData.push({
        content: shuffledComments[c % COMMENT_TEXTS.length],
        userId: shuffledUsers[c % users.length].id,
        pinId: pins[i].id,
      });
    }
  }
  await prisma.comment.createMany({ data: commentData });

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
