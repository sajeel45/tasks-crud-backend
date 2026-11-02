/**
 * Curated fallback news articles in case network is offline or API is unreachable
 */
const fallbackArticles = [
  {
    title: 'Next-Generation AI Models Revolutionize Modern Web Development and Automation',
    description:
      'Autonomous agents, real-time code synthesis, and intelligent dev tools are transforming the speed and quality of modern software engineering teams worldwide.',
    url: 'https://news.ycombinator.com',
    urlToImage:
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    publishedAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    source: { name: 'Tech Innovations' },
    category: 'technology',
  },
  {
    title: 'Global Tech Giants Announce Clean Energy Initiatives for Hyperscale Data Centers',
    description:
      'Leading infrastructure operators commit billions toward next-generation geothermal and solar microgrids to power sustainable AI computing clusters.',
    url: 'https://news.ycombinator.com',
    urlToImage:
      'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80',
    publishedAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    source: { name: 'Clean Tech Report' },
    category: 'science',
  },
  {
    title: 'Financial Markets Rally as Inflation Cools and Global Trade Accelerates',
    description:
      'Central banks project strong economic resilience as consumer indexes beat quarterly expectations across major emerging and developed markets.',
    url: 'https://news.ycombinator.com',
    urlToImage:
      'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=80',
    publishedAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    source: { name: 'Global Finance Weekly' },
    category: 'business',
  },
  {
    title: 'Breakthrough Study in Preventive Healthcare Shows Promise for Longevity',
    description:
      'Researchers uncover key metabolic markers that delay cellular aging, paving the way for personalized preventative therapeutics.',
    url: 'https://news.ycombinator.com',
    urlToImage:
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80',
    publishedAt: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
    source: { name: 'Medical Science Today' },
    category: 'health',
  },
  {
    title: 'Space Agency Successfully Deploys Deep Space Telescope Array',
    description:
      'New infrared sensors will enable astronomers to study atmospheric compositions of habitable exoplanets across nearby star systems.',
    url: 'https://news.ycombinator.com',
    urlToImage:
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
    publishedAt: new Date(Date.now() - 1000 * 60 * 420).toISOString(),
    source: { name: 'Astronomy Gazette' },
    category: 'science',
  },
  {
    title: 'Open Source Community Releases Blazing-Fast Next-Gen JavaScript Runtime',
    description:
      'The new release delivers instant cold starts, native TypeScript execution, and unified cross-platform API compatibility for microservices.',
    url: 'https://news.ycombinator.com',
    urlToImage:
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
    publishedAt: new Date(Date.now() - 1000 * 60 * 540).toISOString(),
    source: { name: 'Dev Ecosystem' },
    category: 'technology',
  },
];

/**
 * Fetch news from Open News API with fallback handling
 * @param {Object} query - Query parameters (category, search, limit)
 * @returns {Promise<Object>}
 */
const getOpenNews = async ({ category = 'general', search = '', limit = 20 }) => {
  const normalizedCategory = category.toLowerCase() === 'all' ? 'general' : category.toLowerCase();
  const openApiUrl = `https://saurav.tech/NewsAPI/top-headlines/category/${normalizedCategory}/us.json`;

  let articles = [];

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000); // 6s timeout

    const response = await fetch(openApiUrl, {
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
      },
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      if (Array.isArray(data.articles) && data.articles.length > 0) {
        articles = data.articles
          .filter((a) => a.title && a.title !== '[Removed]')
          .map((a) => ({
            title: a.title,
            description: a.description || a.content || 'Click to view the full story on the original publication.',
            url: a.url,
            urlToImage:
              a.urlToImage ||
              'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=800&q=80',
            publishedAt: a.publishedAt || new Date().toISOString(),
            source: a.source || { name: 'News Daily' },
            category: normalizedCategory,
          }));
      }
    }
  } catch (err) {
    // Graceful fallback to curated data
  }

  // If external fetch failed or returned nothing, use fallback articles
  if (articles.length === 0) {
    articles = fallbackArticles.filter((item) => {
      if (normalizedCategory === 'general') return true;
      return item.category === normalizedCategory;
    });
    if (articles.length === 0) {
      articles = fallbackArticles;
    }
  }

  // Apply search query filter if provided
  if (search && search.trim()) {
    const queryTerm = search.trim().toLowerCase();
    articles = articles.filter(
      (a) =>
        (a.title && a.title.toLowerCase().includes(queryTerm)) ||
        (a.description && a.description.toLowerCase().includes(queryTerm)) ||
        (a.source?.name && a.source.name.toLowerCase().includes(queryTerm))
    );
  }

  const cappedArticles = articles.slice(0, parseInt(limit, 10) || 20);

  return {
    status: 'ok',
    category: normalizedCategory,
    totalResults: cappedArticles.length,
    articles: cappedArticles,
  };
};

module.exports = {
  getOpenNews,
};
