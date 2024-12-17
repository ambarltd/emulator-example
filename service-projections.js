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
  1: { name: "John Smith", age: 25 },
  2: { name: "Jane Doe", age: 36 },
  3: { name: "Michael Johnson", age: 59 },
  4: { name: "Emily Davis", age: 29 },
  5: { name: "Robert Brown", age: 70 },
  6: { name: "Sarah Wilson", age: 62 },
  7: { name: "David Miller", age: 44 },
  8: { name: "Jessica Taylor", age: 40 },
  9: { name: "William Anderson", age: 80 },
}

function route_root(_, res) {
  const rows = Object.keys(user_info).map(user_id => ({
    name: user_info[user_id].name,
    age: user_info[user_id].age,
    balance: "$" + (balances[user_id] || 0) + ".00",
    operations: operations[user_id] || 0,
  }));
  res.writeHead(200, "Content-Type","text/plain");
  res.write("<h1>Dashboard</h1>");
  res.write(`<table style="text-align: left; border: 1px solid black">`);
  res.write(`<tr>
    <th>Name</th>
    <th>Age</th>
    <th>Balance</th>
    <th>Operations</th>
  </tr>`);
  rows.forEach(row => res.write(`<tr>
    <td>${row.name}</td>
    <td>${row.age}</td>
    <td>${row.balance}</td>
    <td>${row.operations}</td>
    </tr>`));
  res.end();
}

function withBody(req, callback) {
  let body = '';
  req.on('data', chunk => body += chunk);
  req.on('end', () => callback(body));
}

main();
