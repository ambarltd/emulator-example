/*
 *
 *  A server that implements projections and displays a view model.
 *
 *  View the dashboard at http://localhost:8080
 *
 *  The server implements two projections:
 *
 *    * Account balance per user
 *    * Total operations per user
 *
 *  Each projection builds a view of the data and is implemented
 *  in an endpoint which processes events and updates a JS object
 *  with relevant data.
 *
 *  The object acts as an in-memory database which holds the
 *  stateful data backing the view.
 *
 *  The dashboard shows a table with data from both projections.
 *
 */

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

// each user's balances
const balances = {}

function route_calculateBalance(req, res) {
  withBody(req, body => {
    const { payload } = JSON.parse(body);
    const { user_id, amount } = payload;
    const oldBalance = balances[user_id] || 0;
    balances[user_id] = oldBalance + amount;

    res.writeHead(200, "Content-Type","application/json");
    res.write(`{ "result": { "success" : {} } }`);
    res.end();
  })
}

// count of operations per user
const operations = {}

function route_calculateOperations(req, res) {
  withBody(req, body => {
    const { payload } = JSON.parse(body);
    const { user_id } = payload;
    operations[user_id] = (operations[user_id] || 0) + 1;

    res.writeHead(200, "Content-Type","application/json");
    res.write(`{ "result": { "success" : {} } }`);
    res.end();
  });
}

const user_info = {
  1: { name: "John Smith" },
  2: { name: "Jane Doe" },
  3: { name: "Michael Johnson" },
  4: { name: "Emily Davis" },
  5: { name: "Robert Brown" },
  6: { name: "Sarah Wilson" },
  7: { name: "David Miller" },
  8: { name: "Jessica Taylor" },
  9: { name: "William Anderson" },
}

function route_root(_, res) {
  res.writeHead(200, "Content-Type","text/plain");
  res.write("<h1>Dashboard</h1>");
  res.write(`<table style="text-align: left; border: 1px solid black">`);
  res.write(`<tr>
    <th>Name</th>
    <th>Balance</th>
    <th>Operations</th>
  </tr>`);

  Object.keys(user_info)
    .map(user_id => res.write(`<tr>
      <td>${user_info[user_id].name}</td>
      <td>$${balances[user_id] || 0}.00</td>
      <td>${operations[user_id] || 0}</td>
      </tr>`));
  res.end();
}

function withBody(req, callback) {
  let body = '';
  req.on('data', chunk => body += chunk);
  req.on('end', () => callback(body));
}

main();
