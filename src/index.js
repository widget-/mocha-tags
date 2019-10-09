var _       = require('lodash');
var argv    = require('minimist')(process.argv.slice(2));
var Filter  = require('./filter');

function tags() {
  var chain = {};
  var either = proxy(tags.filter, arguments);
  // it & describe
  chain.it = either(tags.global.it, tags.global.xit);
  chain.it.only = tags.global.it.only;
  chain.xit = tags.global.xit;
  chain.describe = either(tags.global.describe, tags.global.xdescribe);
  chain.describe.only = tags.global.describe.only;
  chain.xdescribe = tags.global.xdescribe;
  // custom hooks
  if (typeof tags.hooks === 'function') {
    tags.hooks.call(chain, either);
  }
  return chain;
};

function proxy(filter, tags) {
  var run = filter.match(tags);
  return function(match, skip) {
    return run ? match : skip;
  };
};

tags.Filter = Filter;
tags.filter = new Filter(argv.tags);
tags.global  = global;
tags.hooks   = null;

module.exports = tags;
