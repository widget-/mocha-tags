var argv    = require('minimist')(process.argv.slice(2));
var Filter  = require('./filter');

/**
 * @param tags {String...} List of tags to match
 */
function tags() {
  var chain = {};
  var either = proxy(tags.filter, arguments);
  // it & describe
  chain.it = either(tags.global.it, tags.global.xit);
  chain.it.only = tags.global.it.only;
  chain.it.skip = tags.global.it.skip;
  chain.xit = tags.global.xit;
  chain.describe = either(tags.global.describe, tags.global.xdescribe);
  chain.describe.only = tags.global.describe.only;
  chain.describe.skip = tags.global.describe.skip;
  chain.xdescribe = tags.global.xdescribe;
  // custom hooks
  if (typeof tags.hooks === 'function') {
    tags.hooks.call(chain, either);
  }
  return chain;
}

/**
 * Generate a function which returns either a test or a skipped test
 * @param filter {Filter}
 * @param tagsToMatch {String[]}
 * @returns {function(T match, T skip): T}
 * @template T
 */
function proxy(filter, tagsToMatch) {
  var run = filter.match(Array.from(tagsToMatch));
  return function(match, skip) {
    return run ? match : skip;
  };
}

tags.Filter = Filter;
tags.filter = new Filter(argv.tags);
tags.global  = global;
tags.proxy = proxy;
tags.hooks   = null;

module.exports = tags;
