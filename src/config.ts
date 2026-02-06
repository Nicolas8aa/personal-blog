export const SITE = {
  website: "https://blog.nicolascuellar.com/", // deployed domain
  author: "Nicolas Cuellar Ochoa",
  profile: "https://github.com/Nicolas8aa",
  desc: "Full-stack JavaScript developer in Colombia sharing practical notes on building and shipping web apps.",
  title: "Nicolas Cuellar",
  ogImage: "astropaper-og.jpg",
  lightAndDarkMode: true,
  postPerIndex: 4,
  postPerPage: 4,
  scheduledPostMargin: 15 * 60 * 1000, // 15 minutes
  showArchives: true,
  showBackButton: true, // show back button in post detail
  editPost: {
    enabled: false,
    text: "Edit page",
    url: "https://github.com/satnaing/astro-paper/edit/main/",
  },
  dynamicOgImage: true,
  dir: "ltr", // "rtl" | "auto"
  lang: "en", // html lang code. Set this empty and default will be "en"
  timezone: "America/Bogota", // Default global timezone (IANA format)
} as const;
