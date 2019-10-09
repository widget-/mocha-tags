var _ = require('lodash');

module.exports = function Filter(string) {

  string = string || '';
  var parsed = compile(string);

  function match(tags) {
    var include = (parsed.is.length === 0)  || matchFilter(tags, parsed.is);
    var exclude = (parsed.not.length !== 0) && matchFilter(tags, parsed.not);
    return include && !exclude;
  }

  function toString() {
    return string.trim();
  }

  function add(part) {
    string = string + ' ' + part;
    parsed = compile(string);
  }

  function remove(part) {
    string = string.replace(part, '');
    parsed = compile(string);
  }

  return {
    match: match,
    add: add,
    remove: remove,
    toString: toString
  };

};

function compile(string) {
  return {
    is:  extract(string, /is:([^\s]+)/g),
    not: extract(string, /not:([^\s]+)/g)
  };
}

function extract(string, regex) {
  var list = [], match = null;
  while (match = regex.exec(string)) {
    list.push(match[1].split('+'));
  }
  return list;
}

function matchFilter(tags, list) {
  return _.any(list, function(values) {
    return _.difference(values, tags).length === 0;
  });
}
