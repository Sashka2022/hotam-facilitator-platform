import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.plenary.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      title: "מליאת טשרניחובסקי",
      description:
        "המליאה עוסקת בשאלה איך יוצרים שיח משמעותי בכיתה, ומשלבת הרצאה קצרה ודיון בקבוצות. כל חומרי העזר למנחה זמינים סביב.",
    },
  });

  const existing = await prisma.material.count();
  if (existing === 0) {
    await prisma.material.createMany({
      data: [
        {
          title: "מצגת פתיחה",
          shareTitle: "איך פותחים שנת לימודים עם השראה",
          category: "presentation",
          link: "https://docs.google.com/presentation/d/example-1",
          description:
            "מצגת פתיחה חמה לשנת הלימודים, לשימוש במפגש הראשון עם הצוות החינוכי.",
          shareSlug: "a1b2c3",
        },
        {
          title: "סרטון השראה",
          shareTitle: "",
          category: "video",
          link: "https://youtube.com/watch?v=example-2",
          description:
            "סרטון קצר (4 דק׳) שמניע שיחה על משמעות בהוראה, מתאים לפתיחת מפגש צוות.",
          shareSlug: "d4e5f6",
        },
        {
          title: "מאמר רקע",
          shareTitle: "קהילה לומדת שמניעה שינוי אמיתי",
          category: "article",
          link: "https://example.org/article-3",
          description:
            "מאמר קריאה להעמקה לקראת מפגש צוות בנושא עבודה קהילתית משותפת.",
          shareSlug: "g7h8i9",
        },
        {
          title: "שאלון מקדים",
          shareTitle: "",
          category: "worksheet",
          link: "https://example.org/worksheet-4.pdf",
          description:
            "שאלון קצר למילוי לפני המליאה, כדי למפות ציפיות וידע קודם.",
          shareSlug: "j1k2l3",
        },
      ],
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
