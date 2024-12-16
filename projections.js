const http = require("http");

function main() {
  const server = http.createServer(handle);
  const port = 8080;

  server.listen(port, () =>{
    console.log(`server is up and running on port ${port}`);
  });
}

function handle(req, res) {
  switch (req.url) {
    case "/": return route_root(req, res);
    case "/calculate-balance": return route_calculateBalance(req, res);
    case "/calculate-operations": return route_calculateOperations(req, res);
    default: return route_notFound(req, res);
  }
}

function route_notFound(_, res) {
  res.writeHead(404, "Content-Type","text/plain");
  res.write("PAGE NOT FOUND");
  res.end();
}

const balances = {}

function route_calculateBalance(_, res) {
  res.writeHead(200, "Content-Type","application/json");
  res.write(`{ "result": { "success" : {} } }`);
  res.end();
}

const operations = {}

function route_calculateOperations(_, res) {
  res.writeHead(200, "Content-Type","application/json");
  res.write(`{ "result": { "success" : {} } }`);
  res.end();
}

function route_root(_, res) {
  res.writeHead(404, "Content-Type","text/plain");
  res.write("View data");
  res.end();
}

main();
