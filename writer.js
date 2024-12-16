const fs = require("fs");

function main() {
  const { database } = cliOptions();
  const stream = fs.createWriteStream(database, { flags: 'a' });
  setInterval(() => emit(stream), 500)
}

function cliOptions() {
  const ix = process.argv.indexOf("--database") + 1;
  if (ix == 0 || !process.argv[ix]) {
    console.error("Missing --database option");
    process.exit(1);
  }
  const database = process.argv[ix];
  return { database };
}

function emit(database) {
  const event = createEvent();
  save(event, database);
}

let serialNumber = 0;

function createEvent() {
  const amount = between(-1000, 1000);
  const user_id = between(1, 10);
  const posix_time = Date.now() / 1000;
  const id = serialNumber++;
  return { id, user_id, amount, posix_time }
}

function between(min, max) {
  return min + Math.floor(Math.random() * (max - min))
}

function save(event, stream) {
  const line = JSON.stringify(event) + "\n"
  stream.write(line);
}

main();
