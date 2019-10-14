module.exports = function Filter(string) {

  string = string || '';
  var parsed = compile(string);

  /**
   * Check if a filter matches all of the given tags.
   * @param tags {String} Tags in the form of "is:myTag not:myOtherTag"
   * @returns {boolean}
   */
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

function matchFilter(tagList, toMatch) {
  return (toMatch.filter(function (tags) {
    return (tags.filter(function (tag) {
      return tagList.includes(tag);
    }).length > 0);
  }).length > 0);
}
