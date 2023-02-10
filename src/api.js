const http = require('http');
const BaseRepository = require('./repository/base/baseRepository');
const UserService = require('./services/userService');

const getQueryParams = (request) => {
  const { url } = request;
  const urlParams = new URL(url, `http://${request.headers.host}`);
  const urlParamsIterator = urlParams.searchParams.entries();
  let query = {};

  urlParams.searchParams.forEach(() => {
    const [key, value] = urlParamsIterator.next().value;
    query = {
      ...query,
      [key]: value,
    }
  });

  return query;
}

const routes = {
  '/user': async (request, response) => {
    if (request.method === 'GET') {
      const { userId } = getQueryParams(request);
      const userService = new UserService(BaseRepository);
      const userData = await userService.getUserData(userId);
  
      return response.end(JSON.stringify(userData));
    }
  },
  default: (_request, response) => {
    response.writeHead(200, {
      'Content-Type': 'text/html'
    })
    response.write('Hello World')
    return response.end()
  }
}

const handler = async (request, response) => {
  const urlParams = new URL(request.url, `http://${request.headers.host}`);

  const service = routes[urlParams.pathname] || routes.default;

  response.writeHead(200, {
    'Content-Type': 'application/json'
  })

  return await service(request, response);
}

const app = http.createServer(handler)
                .listen(3000, () => console.log('app running at', 3000));

module.exports = app;
