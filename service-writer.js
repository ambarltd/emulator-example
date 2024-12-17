/*
 *
 *  A script to simulate the real-world by repeatedly
 *  emitting account transaction events for a set of user ids.
 *
 */

const fs = require("fs");

function main() {
  const { database } = cliOptions();                             // get db name from cli arguments
  const stream = fs.createWriteStream(database, { flags: 'a' }); // open db for writing
  let serialNumber = lineCount(database) || 0;                   // get first event id
  setInterval(() => emit(stream, serialNumber++), 500)           // emit new event every 500ms
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

function lineCount(path) {
  try {
    const content = fs.readFileSync(path, { encoding: 'utf8', flag: 'r' });
    const newlines = content.split("\n").length;
    return newlines - 1;
  } catch {
    return 0;
  }
}

function emit(stream, id) {
  const event = createEvent(id);
  save(event, stream);
}

function createEvent(id) {
  const amount = between(-1000, 1000);
  const user_id = between(1, 10);
  const posix_time = Date.now() / 1000;
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
