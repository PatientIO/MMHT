var Q = require("q");
var mmhtConfig = require("./mmhtConfig.json");
var clean = require('./lib/clean');
var compile = require("./lib/compile");
var update = require("./lib/update");
var report = require("./lib/report");

steps = [
    Q(clean(mmhtConfig)),
    Q(compile(mmhtConfig)),
    Q(update(mmhtConfig)),
    Q(report(mmhtConfig))
].reduce(Q.when, Q(mmhtConfig));
