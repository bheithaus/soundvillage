// Generated by CoffeeScript 1.6.1
(function() {

  var autoLink,
    __slice = [].slice;
	
  autoLink = function() {
    var k, linkAttributes, option, options, pattern, v;
    options = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    pattern = /(^|\s)((^|\s?:https?|ftp|www)?(:\/\/)?([\-A-Z0-9+\u0026@#\/%?=~_|!:,.;])*[\-A-Z0-9+\u0026@#\/%=~_|]\.[a-zA-z]{2,}(\/[\-A-Z0-9?+\u0026@#\/%=~_|]{1,})?)/gi;
	
	if (!(options.length > 0)) {
		url = this.replace(pattern, "$1<a href='$2'>$2</a>");
  	  	url = url.match(/(?:https?|ftp)/gi) ? url : "http://" + url;
      return url;
    }
    option = options[0];
    linkAttributes = ((function() {
      var _results;
      _results = [];
      for (k in option) {
        v = option[k];
        if (k !== 'callback') {
          _results.push(" " + k + "='" + v + "'");
        }
      }
      return _results;
    })()).join('');
    return this.replace(pattern, function(match, space, url) {
      var link;
	  url = url.match(/(?:https?|ftp)/gi) ? url : "http://" + url;
      link = (typeof option.callback === "function" ? option.callback(url) : void 0) || ("<a href='" + url + "'" + linkAttributes + ">" + url + "</a>");
      return "" + space + link;
    });
  };

  String.prototype['autoLink'] = autoLink;

}).call(this);
