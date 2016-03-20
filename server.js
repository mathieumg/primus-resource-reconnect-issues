var childProcess = require("child_process");
var resource = require("primus-resource");
var Primus = require("primus");
var http = require("http");

var server = http.createServer(function incoming(req, res) {
  res.setHeader('Content-Type', 'text/html');
  require('fs').createReadStream(__dirname + '/index.html').pipe(res);
});

// Primus server
var primus = new Primus(server);

// Add dependencies and use resource plugin
primus
.use("multiplex", "primus-multiplex")
.use("emitter", "primus-emitter")
.use("resource", resource);

// Create our resource
var Creature = primus.resource("creature");

Creature.oncommand = function(spark, command, fn) {
  console.log(command);
  fn("Creature just got command: " + command);

  if (argv.length === 2) {
    console.log("restart!");
    var child = childProcess.spawn(
      "node",
      ["server.js", "--no-restart"],
      {
        detached: true,
        stdio: ["ignore", "ignore", "ignore"]
      }
    );
    child.unref();
    process.exit(0);
  } else {
    server.close();
    process.exit(0);
  }
};

console.log("args:", process.argv);
var argv = process.argv;

if (argv.length === 2) {
  server.listen(8095);
} else {
  setTimeout(function() {
    server.listen(8095);
  }, 5000);
}

