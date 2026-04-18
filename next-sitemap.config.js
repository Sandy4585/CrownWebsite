/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://crownconsultants.in",
  generateRobotsTxt: true,
  exclude: ["/admin/*", "/api/*"],
  robotsTxtOptions: {
    additionalSitemaps: [],
    policies: [
      { userAgent: "*", allow: "/" },
      { userAgent: "*", disallow: "/admin" },
      { userAgent: "*", disallow: "/api" },
    ],
  },
};
