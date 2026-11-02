const catchAsync = require('../utils/catchAsync');
const pick = require('../utils/pick');
const { newsService } = require('../services');

const getNews = catchAsync(async (req, res) => {
  const options = pick(req.query, ['category', 'search', 'limit']);
  const result = await newsService.getOpenNews(options);
  res.send(result);
});

module.exports = {
  getNews,
};
