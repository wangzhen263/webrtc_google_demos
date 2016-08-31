cordova.define("com.coviu.rtc.WebRTC", function(require, exports, module) { module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = ".";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {var mediaStreamRenderers = {};
	var mediaStreams = {};


	var
	    debug                  = __webpack_require__(1)('coviu-mobile-rtc'),
	    exec                   = __webpack_require__(4),
	    domready               = __webpack_require__(5),

	    getUserMedia           = __webpack_require__(6),
	    RTCPeerConnection      = __webpack_require__(13),
	    RTCSessionDescription  = __webpack_require__(15),
	    RTCIceCandidate        = __webpack_require__(16),
	    RTCDataChannel         = __webpack_require__(14),
	    MediaStream            = __webpack_require__(7),
	    MediaStreamTrack       = __webpack_require__(9),
	    videoElementsHandler   = __webpack_require__(17);


	module.exports = {
	    // Expose WebRTC classes and functions.
	    getUserMedia:          getUserMedia,
	    RTCPeerConnection:     RTCPeerConnection,
	    RTCSessionDescription: RTCSessionDescription,
	    RTCIceCandidate:       RTCIceCandidate,
	    RTCDataChannel:        RTCDataChannel,
	    MediaStream:           MediaStream,
	    MediaStreamTrack:      MediaStreamTrack,

	    // Expose a function to refresh current videos rendering a MediaStream.
	    refreshVideos:         refreshVideos,

	    // Expose a function to handle a video not yet inserted in the DOM.
	    observeVideo:          videoElementsHandler.observeVideo,

	    // Select audio output (earpiece or speaker).
	    selectAudioOutput:     selectAudioOutput,

	    // Expose a function to pollute window and naigator namespaces.
	    registerGlobals:       registerGlobals,

	    // Expose the debug module.
	    debug:                 __webpack_require__(1)
	};


	domready(function () {
	    // Let the MediaStream class and the videoElementsHandler share same MediaStreams container.
	    MediaStream.setMediaStreams(mediaStreams);
	    videoElementsHandler(mediaStreams, mediaStreamRenderers);
	});


	function refreshVideos() {
	    debug('refreshVideos()');

	    var id;

	    for (id in mediaStreamRenderers) {
	        if (mediaStreamRenderers.hasOwnProperty(id)) {
	            mediaStreamRenderers[id].refresh();
	        }
	    }
	}


	function selectAudioOutput(output) {
	    debug('selectAudioOutput() | [output:"%s"]', output);

	    switch (output) {
	        case 'earpiece':
	            exec(null, null, 'WebRTCPlugin', 'selectAudioOutputEarpiece', []);
	            break;
	        case 'speaker':
	            exec(null, null, 'WebRTCPlugin', 'selectAudioOutputSpeaker', []);
	            break;
	        default:
	            throw new Error('output must be "earpiece" or "speaker"');
	    }
	}


	function registerGlobals() {
	    if (!global.navigator) {
	        global.navigator = {};
	    }

	    if (!navigator.mediaDevices) {
	        navigator.mediaDevices = {};
	    }

	    navigator.getUserMedia                  = getUserMedia;
	    navigator.webkitGetUserMedia            = getUserMedia;
	    navigator.mediaDevices.getUserMedia     = getUserMedia;
	    window.RTCPeerConnection                = RTCPeerConnection;
	    window.webkitRTCPeerConnection          = RTCPeerConnection;
	    window.RTCSessionDescription            = RTCSessionDescription;
	    window.RTCIceCandidate                  = RTCIceCandidate;
	    window.MediaStream                      = MediaStream;
	    window.webkitMediaStream                = MediaStream;
	    window.MediaStreamTrack                 = MediaStreamTrack;
	}

	    // MEDIASTREAM_ID_REGEXP = new RegExp(/^mediastream:/);
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	
	/**
	 * This is the web browser implementation of `debug()`.
	 *
	 * Expose `debug()` as the module.
	 */

	exports = module.exports = __webpack_require__(2);
	exports.log = log;
	exports.formatArgs = formatArgs;
	exports.save = save;
	exports.load = load;
	exports.useColors = useColors;
	exports.storage = 'undefined' != typeof chrome
	               && 'undefined' != typeof chrome.storage
	                  ? chrome.storage.local
	                  : localstorage();

	/**
	 * Colors.
	 */

	exports.colors = [
	  'lightseagreen',
	  'forestgreen',
	  'goldenrod',
	  'dodgerblue',
	  'darkorchid',
	  'crimson'
	];

	/**
	 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
	 * and the Firebug extension (any Firefox version) are known
	 * to support "%c" CSS customizations.
	 *
	 * TODO: add a `localStorage` variable to explicitly enable/disable colors
	 */

	function useColors() {
	  // is webkit? http://stackoverflow.com/a/16459606/376773
	  return ('WebkitAppearance' in document.documentElement.style) ||
	    // is firebug? http://stackoverflow.com/a/398120/376773
	    (window.console && (console.firebug || (console.exception && console.table))) ||
	    // is firefox >= v31?
	    // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
	    (navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31);
	}

	/**
	 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
	 */

	exports.formatters.j = function(v) {
	  return JSON.stringify(v);
	};


	/**
	 * Colorize log arguments if enabled.
	 *
	 * @api public
	 */

	function formatArgs() {
	  var args = arguments;
	  var useColors = this.useColors;

	  args[0] = (useColors ? '%c' : '')
	    + this.namespace
	    + (useColors ? ' %c' : ' ')
	    + args[0]
	    + (useColors ? '%c ' : ' ')
	    + '+' + exports.humanize(this.diff);

	  if (!useColors) return args;

	  var c = 'color: ' + this.color;
	  args = [args[0], c, 'color: inherit'].concat(Array.prototype.slice.call(args, 1));

	  // the final "%c" is somewhat tricky, because there could be other
	  // arguments passed either before or after the %c, so we need to
	  // figure out the correct index to insert the CSS into
	  var index = 0;
	  var lastC = 0;
	  args[0].replace(/%[a-z%]/g, function(match) {
	    if ('%%' === match) return;
	    index++;
	    if ('%c' === match) {
	      // we only are interested in the *last* %c
	      // (the user may have provided their own)
	      lastC = index;
	    }
	  });

	  args.splice(lastC, 0, c);
	  return args;
	}

	/**
	 * Invokes `console.log()` when available.
	 * No-op when `console.log` is not a "function".
	 *
	 * @api public
	 */

	function log() {
	  // this hackery is required for IE8/9, where
	  // the `console.log` function doesn't have 'apply'
	  return 'object' === typeof console
	    && console.log
	    && Function.prototype.apply.call(console.log, console, arguments);
	}

	/**
	 * Save `namespaces`.
	 *
	 * @param {String} namespaces
	 * @api private
	 */

	function save(namespaces) {
	  try {
	    if (null == namespaces) {
	      exports.storage.removeItem('debug');
	    } else {
	      exports.storage.debug = namespaces;
	    }
	  } catch(e) {}
	}

	/**
	 * Load `namespaces`.
	 *
	 * @return {String} returns the previously persisted debug modes
	 * @api private
	 */

	function load() {
	  var r;
	  try {
	    r = exports.storage.debug;
	  } catch(e) {}
	  return r;
	}

	/**
	 * Enable namespaces listed in `localStorage.debug` initially.
	 */

	exports.enable(load());

	/**
	 * Localstorage attempts to return the localstorage.
	 *
	 * This is necessary because safari throws
	 * when a user disables cookies/localstorage
	 * and you attempt to access it.
	 *
	 * @return {LocalStorage}
	 * @api private
	 */

	function localstorage(){
	  try {
	    return window.localStorage;
	  } catch (e) {}
	}


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	
	/**
	 * This is the common logic for both the Node.js and web browser
	 * implementations of `debug()`.
	 *
	 * Expose `debug()` as the module.
	 */

	exports = module.exports = debug;
	exports.coerce = coerce;
	exports.disable = disable;
	exports.enable = enable;
	exports.enabled = enabled;
	exports.humanize = __webpack_require__(3);

	/**
	 * The currently active debug mode names, and names to skip.
	 */

	exports.names = [];
	exports.skips = [];

	/**
	 * Map of special "%n" handling functions, for the debug "format" argument.
	 *
	 * Valid key names are a single, lowercased letter, i.e. "n".
	 */

	exports.formatters = {};

	/**
	 * Previously assigned color.
	 */

	var prevColor = 0;

	/**
	 * Previous log timestamp.
	 */

	var prevTime;

	/**
	 * Select a color.
	 *
	 * @return {Number}
	 * @api private
	 */

	function selectColor() {
	  return exports.colors[prevColor++ % exports.colors.length];
	}

	/**
	 * Create a debugger with the given `namespace`.
	 *
	 * @param {String} namespace
	 * @return {Function}
	 * @api public
	 */

	function debug(namespace) {

	  // define the `disabled` version
	  function disabled() {
	  }
	  disabled.enabled = false;

	  // define the `enabled` version
	  function enabled() {

	    var self = enabled;

	    // set `diff` timestamp
	    var curr = +new Date();
	    var ms = curr - (prevTime || curr);
	    self.diff = ms;
	    self.prev = prevTime;
	    self.curr = curr;
	    prevTime = curr;

	    // add the `color` if not set
	    if (null == self.useColors) self.useColors = exports.useColors();
	    if (null == self.color && self.useColors) self.color = selectColor();

	    var args = Array.prototype.slice.call(arguments);

	    args[0] = exports.coerce(args[0]);

	    if ('string' !== typeof args[0]) {
	      // anything else let's inspect with %o
	      args = ['%o'].concat(args);
	    }

	    // apply any `formatters` transformations
	    var index = 0;
	    args[0] = args[0].replace(/%([a-z%])/g, function(match, format) {
	      // if we encounter an escaped % then don't increase the array index
	      if (match === '%%') return match;
	      index++;
	      var formatter = exports.formatters[format];
	      if ('function' === typeof formatter) {
	        var val = args[index];
	        match = formatter.call(self, val);

	        // now we need to remove `args[index]` since it's inlined in the `format`
	        args.splice(index, 1);
	        index--;
	      }
	      return match;
	    });

	    if ('function' === typeof exports.formatArgs) {
	      args = exports.formatArgs.apply(self, args);
	    }
	    var logFn = enabled.log || exports.log || console.log.bind(console);
	    logFn.apply(self, args);
	  }
	  enabled.enabled = true;

	  var fn = exports.enabled(namespace) ? enabled : disabled;

	  fn.namespace = namespace;

	  return fn;
	}

	/**
	 * Enables a debug mode by namespaces. This can include modes
	 * separated by a colon and wildcards.
	 *
	 * @param {String} namespaces
	 * @api public
	 */

	function enable(namespaces) {
	  exports.save(namespaces);

	  var split = (namespaces || '').split(/[\s,]+/);
	  var len = split.length;

	  for (var i = 0; i < len; i++) {
	    if (!split[i]) continue; // ignore empty strings
	    namespaces = split[i].replace(/\*/g, '.*?');
	    if (namespaces[0] === '-') {
	      exports.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
	    } else {
	      exports.names.push(new RegExp('^' + namespaces + '$'));
	    }
	  }
	}

	/**
	 * Disable debug output.
	 *
	 * @api public
	 */

	function disable() {
	  exports.enable('');
	}

	/**
	 * Returns true if the given mode name is enabled, false otherwise.
	 *
	 * @param {String} name
	 * @return {Boolean}
	 * @api public
	 */

	function enabled(name) {
	  var i, len;
	  for (i = 0, len = exports.skips.length; i < len; i++) {
	    if (exports.skips[i].test(name)) {
	      return false;
	    }
	  }
	  for (i = 0, len = exports.names.length; i < len; i++) {
	    if (exports.names[i].test(name)) {
	      return true;
	    }
	  }
	  return false;
	}

	/**
	 * Coerce `val`.
	 *
	 * @param {Mixed} val
	 * @return {Mixed}
	 * @api private
	 */

	function coerce(val) {
	  if (val instanceof Error) return val.stack || val.message;
	  return val;
	}


/***/ },
/* 3 */
/***/ function(module, exports) {

	/**
	 * Helpers.
	 */

	var s = 1000;
	var m = s * 60;
	var h = m * 60;
	var d = h * 24;
	var y = d * 365.25;

	/**
	 * Parse or format the given `val`.
	 *
	 * Options:
	 *
	 *  - `long` verbose formatting [false]
	 *
	 * @param {String|Number} val
	 * @param {Object} options
	 * @return {String|Number}
	 * @api public
	 */

	module.exports = function(val, options){
	  options = options || {};
	  if ('string' == typeof val) return parse(val);
	  return options.long
	    ? long(val)
	    : short(val);
	};

	/**
	 * Parse the given `str` and return milliseconds.
	 *
	 * @param {String} str
	 * @return {Number}
	 * @api private
	 */

	function parse(str) {
	  str = '' + str;
	  if (str.length > 10000) return;
	  var match = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(str);
	  if (!match) return;
	  var n = parseFloat(match[1]);
	  var type = (match[2] || 'ms').toLowerCase();
	  switch (type) {
	    case 'years':
	    case 'year':
	    case 'yrs':
	    case 'yr':
	    case 'y':
	      return n * y;
	    case 'days':
	    case 'day':
	    case 'd':
	      return n * d;
	    case 'hours':
	    case 'hour':
	    case 'hrs':
	    case 'hr':
	    case 'h':
	      return n * h;
	    case 'minutes':
	    case 'minute':
	    case 'mins':
	    case 'min':
	    case 'm':
	      return n * m;
	    case 'seconds':
	    case 'second':
	    case 'secs':
	    case 'sec':
	    case 's':
	      return n * s;
	    case 'milliseconds':
	    case 'millisecond':
	    case 'msecs':
	    case 'msec':
	    case 'ms':
	      return n;
	  }
	}

	/**
	 * Short format for `ms`.
	 *
	 * @param {Number} ms
	 * @return {String}
	 * @api private
	 */

	function short(ms) {
	  if (ms >= d) return Math.round(ms / d) + 'd';
	  if (ms >= h) return Math.round(ms / h) + 'h';
	  if (ms >= m) return Math.round(ms / m) + 'm';
	  if (ms >= s) return Math.round(ms / s) + 's';
	  return ms + 'ms';
	}

	/**
	 * Long format for `ms`.
	 *
	 * @param {Number} ms
	 * @return {String}
	 * @api private
	 */

	function long(ms) {
	  return plural(ms, d, 'day')
	    || plural(ms, h, 'hour')
	    || plural(ms, m, 'minute')
	    || plural(ms, s, 'second')
	    || ms + ' ms';
	}

	/**
	 * Pluralization helper.
	 */

	function plural(ms, n, name) {
	  if (ms < n) return;
	  if (ms < n * 1.5) return Math.floor(ms / n) + ' ' + name;
	  return Math.ceil(ms / n) + ' ' + name + 's';
	}


/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = require("cordova/exec");

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/*!
	  * domready (c) Dustin Diaz 2014 - License MIT
	  */
	!function (name, definition) {

	  if (true) module.exports = definition()
	  else if (typeof define == 'function' && typeof define.amd == 'object') define(definition)
	  else this[name] = definition()

	}('domready', function () {

	  var fns = [], listener
	    , doc = document
	    , hack = doc.documentElement.doScroll
	    , domContentLoaded = 'DOMContentLoaded'
	    , loaded = (hack ? /^loaded|^c/ : /^loaded|^i|^c/).test(doc.readyState)


	  if (!loaded)
	  doc.addEventListener(domContentLoaded, listener = function () {
	    doc.removeEventListener(domContentLoaded, listener)
	    loaded = 1
	    while (listener = fns.shift()) listener()
	  })

	  return function (fn) {
	    loaded ? setTimeout(fn, 0) : fns.push(fn)
	  }

	});


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	(function (global) {
	    'use strict';

	    var exec = __webpack_require__(4),
	        MediaStream = __webpack_require__(7);

	    //getUserMedia implementation
	    var getUserMedia = function (constraints, successCallback, errorCallback) {
	        exec(function (res) {
	            var mediaBlob = MediaStream.create(res);
	            successCallback(mediaBlob);
	            mediaBlob.emitConnected();
	        }, errorCallback, 'WebRTCPlugin', 'getUserMedia', [constraints]);
	    };

	    module.exports = getUserMedia;
	})(this);

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	(function (global) {
	    'use strict';

	    var exec = __webpack_require__(4);
	    var CoviuUtils = __webpack_require__(8);
	    var MediaStreamTrack = __webpack_require__(9);
	    var EventTarget = __webpack_require__(10).EventTarget;
	    var debug = __webpack_require__(1)('MediaStream');

	    var mediaStreams;
	    var MediaStream = window.Blob;

	    MediaStream.setMediaStreams = function (_mediaStreams) {
	        mediaStreams = _mediaStreams;
	    };

	    MediaStream.create = function (opt) {
	        var stream,
	            blobId = 'MediaStream_' + opt.id,
	            trackId;

	        // Note that this is the Blob constructor.
	        stream = new MediaStream([blobId], {
	            type: 'stream'
	        });

	        mediaStreams[blobId] = stream;

	        EventTarget.call(stream);

	        // Private attributes.
	        stream.id = opt.id || CoviuUtils.randomString();
	        stream.label = opt.label || {};
	        stream.blobId = blobId;
	        stream.active = true;
	        stream.audioTracks = {};
	        stream.videoTracks = {};
	        stream.connected = false;

	        var track, optTrack;
	        for (trackId in opt.audioTracks) {
	            if (opt.audioTracks.hasOwnProperty(trackId)) {
	                optTrack = opt.audioTracks[trackId];
	                optTrack.streamId = stream.id;

	                track = new MediaStreamTrack(optTrack);
	                stream.audioTracks[optTrack.id] = track;

	                addListenerForTrackEnded.call(stream, track);
	            }
	        }

	        for (trackId in opt.videoTracks) {
	            if (opt.videoTracks.hasOwnProperty(trackId)) {
	                optTrack = opt.videoTracks[trackId];
	                optTrack.streamId = stream.id;

	                track = new MediaStreamTrack(optTrack);
	                stream.videoTracks[optTrack.id] = track;

	                addListenerForTrackEnded.call(stream, track);
	            }
	        }

	        exec(function (res) {
	            var track, event, type = res.cmd;
	            //update states
	            if (type === 'addtrack') {
	                track = new MediaStreamTrack(res.track);
	                track.streamId = stream.id;
	                if (track.kind === 'audio') {
	                    this.audioTracks[res.track.id] = track;
	                } else if (track.kind === 'video') {
	                    this.videoTracks[res.track.id] = track;
	                }

	                addListenerForTrackEnded.call(this, track);

	                event = new Event(type);
	                event.track = track;
	                this.dispatchEvent(event);

	                // Also emit 'update' for the MediaStreamRenderer.
	                this.dispatchEvent(new Event('update'));
	            } else if (type === 'removetrack') {
	                if (res.track.kind === 'audio') {
	                    delete this.audioTracks[res.track.id];
	                } else if (data.track.kind === 'video') {
	                    delete this.videoTracks[res.track.id];
	                }

	                event = new Event(type);
	                this.dispatchEvent(event);

	                // Also emit 'update' for the MediaStreamRenderer.
	                this.dispatchEvent(new Event('update'));

	                // Check whether the MediaStream still is active.
	                checkActive.call(this);
	            }

	            // CoviuUtils.createEventAndTrigger(res.cmd, null, this);

	        }.bind(this), function () {
	            throw 'Error creating MediaStream';
	        }, 'WebRTCPlugin', 'cmdMediaStream', ['new', stream.id, '']);

	        return stream;
	    };

	    MediaStream.prototype.getAudioTracks = function () {
	        var tracks = [],
	            id;

	        for (id in this.audioTracks) {
	            if (this.audioTracks.hasOwnProperty(id)) {
	                tracks.push(this.audioTracks[id]);
	            }
	        }

	        return tracks;
	    };

	    MediaStream.prototype.getVideoTracks = function () {
	        var tracks = [],
	            id;

	        for (id in this.videoTracks) {
	            if (this.videoTracks.hasOwnProperty(id)) {
	                tracks.push(this.videoTracks[id]);
	            }
	        }

	        return tracks;
	    };

	    MediaStream.prototype.getTracks = function () {
	        var tracks = [],
	            id;

	        for (id in this.audioTracks) {
	            if (this.audioTracks.hasOwnProperty(id)) {
	                tracks.push(this.audioTracks[id]);
	            }
	        }

	        for (id in this.videoTracks) {
	            if (this.videoTracks.hasOwnProperty(id)) {
	                tracks.push(this.videoTracks[id]);
	            }
	        }

	        return tracks;
	    };

	    MediaStream.prototype.getTrackById = function (id) {
	        return this.audioTracks[id] || this.videoTracks[id] || null;
	    };

	    MediaStream.prototype.addTrack = function (track) {
	        if (!(track instanceof MediaStreamTrack)) {
	            throw new Error('argument must be an instance of MediaStreamTrack');
	        }

	        if (this.audioTracks[track.id] || this.videoTracks[track.id]) {
	            return;
	        }

	        if (track.kind === 'audio') {
	            this.audioTracks[track.id] = track;
	        } else if (track.kind === 'video') {
	            this.videoTracks[track.id] = track;
	        } else {
	            throw new Error('unknown kind attribute: ' + track.kind);
	        }

	        track.setStreamId(this.id);
	        exec(null, null, 'WebRTCPlugin', 'cmdMediaStream', ['addTrack', this.id, track.id]);
	    };

	    MediaStream.prototype.removeTrack = function (track) {
	        if (!(track instanceof MediaStreamTrack)) {
	            throw new Error('argument must be an instance of MediaStreamTrack');
	        }

	        if (!this.audioTracks[track.id] && !this.videoTracks[track.id]) {
	            return;
	        }

	        if (track.kind === 'audio') {
	            delete this.audioTracks[track.id];
	        } else if (track.kind === 'video') {
	            delete this.videoTracks[track.id];
	        } else {
	            throw new Error('unknown kind attribute: ' + track.kind);
	        }

	        exec(null, null, 'WebRTCPlugin', 'cmdMediaStream', ['removeTrack', this.id, track.id]);
	        checkActive.call(this);
	    };

	    MediaStream.prototype.stop = function () {
	        var trackId;

	        for (trackId in this.audioTracks) {
	            if (this.audioTracks.hasOwnProperty(trackId)) {
	                this.audioTracks[trackId].stop();
	            }
	        }

	        for (trackId in this.videoTracks) {
	            if (this.videoTracks.hasOwnProperty(trackId)) {
	                this.videoTracks[trackId].stop();
	            }
	        }
	    };


	    MediaStream.prototype.emitConnected = function () {
	        debug('emitConnected()');

	        var self = this;

	        if (this.connected) {
	            return;
	        }
	        this.connected = true;

	        setTimeout(function () {
	            self.dispatchEvent(new Event('connected'));
	        });
	    };

	    function addListenerForTrackEnded(track) {
	        debug('addListenerForTrackEnded()');

	        var self = this;

	        track.addEventListener('ended', function () {
	            if (track.kind === 'audio' && !self.audioTracks[track.id]) {
	                return;
	            } else if (track.kind === 'video' && !self.videoTracks[track.id]) {
	                return;
	            }

	            checkActive.call(self);
	        });
	    }

	    function checkActive() {
	    // A MediaStream object is said to be active when it has at least one MediaStreamTrack
	    // that has not ended. A MediaStream that does not have any tracks or only has tracks
	    // that are ended is inactive.

	        var self = this,
	            trackId;

	        if (!this.active) {
	            return;
	        }

	        if (Object.keys(this.audioTracks).length === 0 && Object.keys(this.videoTracks).length === 0) {
	            debug('no tracks, releasing MediaStream');

	            release();
	            return;
	        }

	        for (trackId in this.audioTracks) {
	            if (this.audioTracks.hasOwnProperty(trackId)) {
	                if (this.audioTracks[trackId].readyState !== 'ended') {
	                    return;
	                }
	            }
	        }

	        for (trackId in this.videoTracks) {
	            if (this.videoTracks.hasOwnProperty(trackId)) {
	                if (this.videoTracks[trackId].readyState !== 'ended') {
	                    return;
	                }
	            }
	        }

	        debug('all tracks are ended, releasing MediaStream');
	        release();

	        function release() {
	            self.active = false;
	            self.dispatchEvent(new Event('inactive'));

	            // Remove the stream from the dictionary.
	            delete mediaStreams[self.blobId];

	            exec(null, null, 'iosrtcPlugin', 'MediaStream_release', [self.id]);
	        }
	    }

	    module.exports = MediaStream;
	})(this);

/***/ },
/* 8 */
/***/ function(module, exports) {

	(function (global) {
	    'use strict';

	    function createAttributeDescriptor(name, attributes) {
	        return {
	            "get": function () {
	                var attribute = attributes[name];
	                return typeof attribute == "function" ? attribute() : attribute;
	            },
	            "enumerable": true
	        };
	    }
	    var CoviuUtils = {
	        createEventAndTrigger: function (type, args, target) {
	            if (typeof target['on' + type] === 'function') {
	                var event = document.createEvent('Event');
	                event.initEvent(type, true, true);

	                //extend the event
	                for (var key in args) {
	                    if (args.hasOwnProperty(key)) {
	                        event[key] = args[key];
	                    }
	                }

	                setTimeout(function () {
	                    target['on' + type](event);
	                });
	            } else {
	                console.log('Error: Invalid event type ', type, target);
	            }
	        },
	        blobContent: function (blob, cb) {
	            //use a fileReader to convert the blob contents to string
	            var fileReader = new FileReader();
	            fileReader.onload = function () {
	                var res = String.fromCharCode.apply(null, new Uint8Array(this.result));
	                cb(this.error, res);
	            };
	            fileReader.onerror = function () {
	                cb(this.error, null);
	            };
	            fileReader.readAsArrayBuffer(blob);
	        },
	        addReadOnlyAttributes: function (target, attributes) {
	            for (var name in attributes)
	                Object.defineProperty(target, name, createAttributeDescriptor(name, attributes));
	        },
	        mediaStreamTrackGetSources: function() {
	            return [];
	        },
	        randomString: function() {
	            var randomValues = new Uint8Array(27);
	            crypto.getRandomValues(randomValues);
	            return btoa(String.fromCharCode.apply(null, randomValues));
	        }
	    };

	    module.exports = CoviuUtils;
	})(this);

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	(function (global) {
	    'use strict';

	    var exec = __webpack_require__(4);
	    var CoviuUtils = __webpack_require__(8);
	    var EventTarget = __webpack_require__(10).EventTarget;

	    var MediaStreamTrack = function (opt) {
	        var self = this;
	        EventTarget.call(this);

	        this.id = opt.id;
	        this.kind = opt.kind || "";
	        this.label = opt.label || "";
	        this.muted = opt.muted || false;
	        this.readyState = opt.readyState || "live";
	        this.streamId = opt.streamId || "";

	        // Private attributes.
	        this._enabled = opt.enabled || false;
	        this._ended = false;

	        function setStreamId (streamId) {
	            self._streamId = streamId;
	        }

	        exec(function (res) {
	            //update states
	            if (res.cmd === 'mute') {
	                self.muted = true;
	            } else if (res.cmd === 'unmute') {
	                self.muted = false;
	            } else if (res.cmd === 'ended') {
	                self.enabled = false;
	            } else if (res.cmd === 'statechange') {
	                self.readyState = res.readyState;
	                self.enabled = res.enabled;

	                if (res.readyState == 'ended') {
	                    this.dispatchEvent(new Event('ended'));
	                }
	                return;
	            }

	            // CoviuUtils.createEventAndTrigger(res.cmd, null, this);

	        }.bind(this), function () {
	            throw 'Error creating MediaStreamTrack';
	        }, 'WebRTCPlugin', 'cmdMediaStreamTrack', ['new', this.id, this._streamId]);
	    };

	    Object.defineProperty(MediaStreamTrack.prototype, 'enabled', {
	        get: function () {
	            return this._enabled;
	        },
	        set: function (value) {
	            debug('enabled = %s', !!value);

	            this._enabled = !!value;
	            exec(null, null, 'WebRTCPlugin', 'cmdMediaStreamTrack', ['setEnabled', this.id, this._enabled]);
	        }
	    });

	    MediaStreamTrack.prototype.clone = function (){
	        return new MediaStreamTrack(this);
	    };

	    MediaStreamTrack.prototype.stop = function (){
	        exec(null, null, 'WebRTCPlugin',
	            'cmdMediaStreamTrack', ['stop', this.label, this._streamId]);
	    };

	    MediaStreamTrack.prototype.getSources = function (callback){
	        if (window.mediaStreamTrackGetSources) {
	            var sources = CoviuUtils.mediaStreamTrackGetSources();
	            callback(sources);
	        }
	    };

	    MediaStreamTrack.getSources = function(gotSources) {
	        exec(gotSources, function () {
	            throw 'Error creating MediaStreamTrack.getSources';
	        }, 'WebRTCPlugin', 'cmdGetSources', []);
	    };

	    module.exports = MediaStreamTrack;
	})(this);

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = {
		EventTarget:  __webpack_require__(11),
		Event:        __webpack_require__(12)
	};


/***/ },
/* 11 */
/***/ function(module, exports) {

	/**
	 * Expose the _EventTarget class.
	 */
	module.exports = _EventTarget;


	function _EventTarget() {
		// Do nothing if called for a native EventTarget object..
		if (typeof this.addEventListener === 'function') {
			return;
		}

		this._listeners = {};

		this.addEventListener = _addEventListener;
		this.removeEventListener = _removeEventListener;
		this.dispatchEvent = _dispatchEvent;
	}


	Object.defineProperties(_EventTarget.prototype, {
		listeners: {
			get: function () {
				return this._listeners;
			}
		}
	});


	function _addEventListener(type, newListener) {
		var listenersType,
			i, listener;

		if (!type || !newListener) {
			return;
		}

		listenersType = this._listeners[type];
		if (listenersType === undefined) {
			this._listeners[type] = listenersType = [];
		}

		for (i = 0; !!(listener = listenersType[i]); i++) {
			if (listener === newListener) {
				return;
			}
		}

		listenersType.push(newListener);
	}


	function _removeEventListener(type, oldListener) {
		var listenersType,
			i, listener;

		if (!type || !oldListener) {
			return;
		}

		listenersType = this._listeners[type];
		if (listenersType === undefined) {
			return;
		}

		for (i = 0; !!(listener = listenersType[i]); i++) {
			if (listener === oldListener) {
				listenersType.splice(i, 1);
				break;
			}
		}

		if (listenersType.length === 0) {
			delete this._listeners[type];
		}
	}


	function _dispatchEvent(event) {
		var type,
			listenersType,
			dummyListener,
			stopImmediatePropagation = false,
			i, listener;

		if (!event || typeof event.type !== 'string') {
			throw new Error('`event` must have a valid `type` property');
		}

		if (event._dispatched) {
			throw new Error('event already dispatched');
		}
		event._dispatched = true;

		// Force the event to be cancelable.
		event.cancelable = true;
		event.target = this;

		// Override stopImmediatePropagation() function.
		event.stopImmediatePropagation = function () {
			stopImmediatePropagation = true;
		};

		type = event.type;
		listenersType = (this._listeners[type] || []);

		dummyListener = this['on' + type];
		if (typeof dummyListener === 'function') {
			listenersType.push(dummyListener);
		}

		for (i = 0; !!(listener = listenersType[i]); i++) {
			if (stopImmediatePropagation) {
				break;
			}

			listener.call(this, event);
		}

		return !event.defaultPrevented;
	}


/***/ },
/* 12 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {/**
	 * In browsers export the native Event interface.
	 */

	module.exports = global.Event;

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	(function (global) {
	    'use strict';

	    var exec = __webpack_require__(4),
	        RTCDataChannel = __webpack_require__(14),
	        RTCSessionDescription = __webpack_require__(15),
	        RTCIceCandidate = __webpack_require__(16),
	        CoviuUtils = __webpack_require__(8),
	        EventTarget = __webpack_require__(10).EventTarget;

	    var RTCPeerConnection = function (iceServers, constraints) {
	        //initial states
	        var self = this;
	        EventTarget.call(this);

	        this.id = CoviuUtils.randomString();
	        this.iceConnectionState = 'new';
	        this.iceGatheringState = 'new';
	        this.signalingState = 'stable';
	        this.localDescription = new RTCSessionDescription({'type': '','sdp': ''});
	        this.remoteDescription = new RTCSessionDescription({'type': '','sdp': ''});
	        this.localStreams = {};
	        this.remoteStreams = {};

	        exec(function (res) {
	            var type = res.cmd,
	                event = new Event(type);

	            //update states
	            if (res.cmd === 'signalingstatechange') {
	                self.signalingState = res.args.state;
	            } else if (res.cmd === 'iceconnectionstatechange') {
	                self.iceConnectionState = res.args.state;
	            } else if (res.cmd === 'icegatheringchange') {
	                self.iceGatheringState = res.args.state;
	            } else if (res.cmd === 'addstream') {
	                var mediaBlob = MediaStream.create(res.args);
	                event.stream = mediaBlob;
	                this.remoteStreams[mediaBlob.id] = mediaBlob;
	            } else if (res.cmd === 'datachannel') {
	                dataChannel = new RTCDataChannel(this, null, null, res.args);
	                event.channel = dataChannel;
	            } else if (res.cmd === 'icecandidate') {
	                if (res.args.candidate.candidate) {
	                    event.candidate = new RTCIceCandidate(res.args.candidate);
	                } else {
	                    event.candidate = null;
	                }

	                // Update localDescription.
	                if (this.localDescription) {
	                    this.localDescription.type = res.args.localDescription.type;
	                    this.localDescription.sdp = res.args.localDescription.sdp;
	                } else {
	                    this.localDescription = new RTCSessionDescription(res.args.localDescription);
	                }
	            } else if (res.cmd === 'removestream') {
	                var stream = this.remoteStreams[res.args];
	                event.stream = stream;
	                delete this.remoteStreams[stream.id];
	             }

	            this.dispatchEvent(event);
	            // CoviuUtils.createEventAndTrigger(res.cmd, res.args, this);

	        }.bind(this), function () {
	            throw 'Error creating peer connection';
	        }, 'WebRTCPlugin', 'cmdPeerConnection', ['new', this.id, iceServers, constraints]);
	    };

	    RTCPeerConnection.prototype.getRemoteStreams = function () {
	        var streams = [], id;

	        for (id in this.remoteStreams) {
	            if (this.remoteStreams.hasOwnProperty(id)) {
	                streams.push(this.remoteStreams[id]);
	            }
	        }

	        return streams;
	    };

	    RTCPeerConnection.prototype.getLocalStreams = function () {
	        var streams = [], id;

	        for (id in this.localStreams) {
	            if (this.localStreams.hasOwnProperty(id)) {
	                streams.push(this.localStreams[id]);
	            }
	        }

	        return streams;
	    };

	    RTCPeerConnection.prototype.getStreamById = function (id) {
	        return this.localStreams[id] || this.remoteStreams[id] || null;
	    };

	    RTCPeerConnection.prototype.createOffer = function (
	        successCallback, errorCallback, constraints) {
	        exec(successCallback, errorCallback, 'WebRTCPlugin',
	            'cmdPeerConnection', ['createOffer', this.id, constraints]);
	    };

	    RTCPeerConnection.prototype.createAnswer = function (
	        successCallback, errorCallback, constraints) {
	        exec(successCallback, errorCallback, 'WebRTCPlugin',
	            'cmdPeerConnection', ['createAnswer', this.id, constraints]);
	    };

	    RTCPeerConnection.prototype.addIceCandidate = function (candidate,
	        successCallback, errorCallback) {
	        var self = this;
	        function cb(sd) {
	            self.remoteDescription = new RTCSessionDescription({'type':sd.type,'sdp':sd.sdp});
	            successCallback();
	        }
	        exec(cb, errorCallback, 'WebRTCPlugin',
	            'cmdPeerConnection', ['addIceCandidate', this.id, candidate]);
	    };

	    RTCPeerConnection.prototype.updateIce = function (configuration, constraints) {
	        exec(null, null, 'WebRTCPlugin',
	            'cmdPeerConnection', ['updateIce', this.id, configuration, constraints]);
	    };

	    RTCPeerConnection.prototype.createDataChannel = function (label, dcOptions) {
	        if (this.signalingState === 'closed')
	            throw 'Error creating peer connection';

	        return new RTCDataChannel(this, label, dcOptions);
	    };

	    RTCPeerConnection.prototype.setLocalDescription = function (sessionDescription,
	        successCallback, errorCallback) {
	        this.localDescription = new RTCSessionDescription({'type':sessionDescription.type,
	                   'sdp':sessionDescription.sdp});
	        exec(successCallback, errorCallback, 'WebRTCPlugin',
	            'cmdPeerConnection', ['setLocalDescription', this.id, sessionDescription]);
	    };

	    RTCPeerConnection.prototype.setRemoteDescription = function (sessionDescription,
	        successCallback, errorCallback) {
	        var sd;
	        if (sessionDescription.dict)
	            sd = sessionDescription.dict;
	        else
	            sd = sessionDescription;
	        this.remoteDescription = new RTCSessionDescription({'type':sd.type, 'sdp':sd.sdp});
	        exec(successCallback, errorCallback, 'WebRTCPlugin',
	            'cmdPeerConnection', ['setRemoteDescription', this.id, sessionDescription]);
	    };

	    RTCPeerConnection.prototype.addStream = function (stream) {
	        if (this.localStreams[stream.id]) {
	            console.log('addStream() | given stream already in present in local streams');
	            return;
	        }

	        this.localStreams[stream.id] = stream;

	        exec(null, null, 'WebRTCPlugin',
	            'cmdPeerConnection', ['addStream', this.id, stream.id]);
	    };

	    RTCPeerConnection.prototype.removeStream = function (stream) {
	        if (!this.localStreams[stream.id]) {
	            console.log('removeStream() | given stream not present in local streams');
	            return;
	        }

	        delete this.localStreams[stream.id];
	        exec(null, null, 'WebRTCPlugin',
	            'cmdPeerConnection', ['removeStream', this.id, stream.id]);
	    };

	    RTCPeerConnection.prototype.getStats = function (cb) {
	        exec(function (nativeResultArray) {
	            var returnArray = [];
	            nativeResultArray.forEach(function (nativeResultStat) {
	                returnArray.push({
	                    type: nativeResultStat.type,
	                    timestamp: nativeResultStat.timestamp,
	                    id: nativeResultStat.reportId,
	                    names: function () {
	                        return Object.keys(nativeResultStat.values);
	                    },
	                    stat: function (key) {
	                        return nativeResultStat.values[key] || '';
	                    }
	                });
	            });
	            cb({
	                result: function () {
	                    return returnArray;
	                },
	                namedItem: function () {
	                    throw 'namedItem not implemented';
	                }
	            });
	        }, null, 'WebRTCPlugin', 'cmdPeerConnection', ['getStats', this.id]);
	    };

	    RTCPeerConnection.prototype.close = function () {
	        exec(null, null, 'WebRTCPlugin', 'cmdPeerConnection', ['close', this.id]);
	    };

	    RTCPeerConnection.prototype.dispose = function () {
	        exec(null, null, 'WebRTCPlugin', 'cmdPeerConnection', ['dispose', this.id]);
	    };

	    module.exports = RTCPeerConnection;
	})(this);

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	(function (global) {
	    'use strict';

	    var exec = __webpack_require__(4);
	    var CoviuUtils = __webpack_require__(8);
	    var EventTarget = __webpack_require__(10).EventTarget;

	    var RTCDataChannel = function (pc, label, options, dataFromEvent) {
	        var self = this;
	        options = options || {};
	        this._pcid = pc.id;
	        EventTarget.call(this);

	        this.onopen = function(){};
	        this.onclose = function(){};
	        this.onmessage = function(){};

	        if (!dataFromEvent) {
	            this.id = {};
	            this.label = label;
	            this.ordered = options.hasOwnProperty('ordered') ? options.ordered : true;
	            this.maxPacketLifeTime = options.hasOwnProperty('maxPacketLifeTime') ? Number(options.maxPacketLifeTime) : null;
	            this.maxRetransmits = options.hasOwnProperty('maxRetransmits') ? Number(options.maxRetransmits) : null;
	            this.protocol = options.hasOwnProperty('protocol') ? String(options.protocol) : '';
	            this.negotiated = options.hasOwnProperty('negotiated') ? options.negotiated : false;
	            this.readyState = 'connecting';
	            this.bufferedAmount = 0;

	            exec(this._oncmd.bind(this), function (err) {
	                throw err;
	            }, 'WebRTCPlugin',
	            'cmdRTCDataChannel', ['new', pc.id, label, options]);
	        } else {
	            this.id = dataFromEvent.id;
	            this.label = dataFromEvent.label;
	            this.ordered = dataFromEvent.ordered;
	            this.maxPacketLifeTime = dataFromEvent.maxPacketLifeTime;
	            this.maxRetransmits = dataFromEvent.maxRetransmits;
	            this.protocol = dataFromEvent.protocol;
	            this.negotiated = dataFromEvent.negotiated;
	            this.readyState = dataFromEvent.readyState;
	            this.bufferedAmount = dataFromEvent.bufferedAmount;

	            exec(this._oncmd.bind(this), null, 'WebRTCPlugin',
	                'cmdRTCDataChannel', ['attach', pc.id, this.id]);
	        }
	    };

	    RTCDataChannel.prototype._oncmd = function (res) {
	        if (res.cmd === 'statechange') {
	            this.readyState = res.args.state;

	            if (res.args.state === 'open') {
	                this.dispatchEvent(new Event('open'));
	                // CoviuUtils.createEventAndTrigger('open', res.args, this);
	            } else if (res.args.state === 'closed') {
	                this.dispatchEvent(new Event('close'));
	                // CoviuUtils.createEventAndTrigger('close', res.args, this);
	            }
	        } else if (res instanceof ArrayBuffer || typeof res === 'string') {
	            // CoviuUtils.createEventAndTrigger('message', {
	                // data: res
	            // }, this);
	            var event = new Event('message');
	            event.data = res;
	            this.dispatchEvent(event);
	        } else if (res.cmd === 'update') {
	            this.id = res.args.id;
	            this.ordered = res.args.ordered;
	            this.maxPacketLifeTime = res.args.maxPacketLifeTime;
	            this.maxRetransmits = res.args.maxRetransmits;
	            this.protocol = res.args.protocol;
	            this.negotiated = res.args.negotiated;
	            this.readyState = res.args.readyState;
	            this.bufferedAmount = res.args.bufferedAmount;
	        }
	    };

	    RTCDataChannel.prototype.send = function (data) {
	        if (this.readyState === 'closed' || this.readyState === 'closing')
	            return;

	        if (!data) {
	            return;
	        }

	        var self = this;
	        function onSuccess(ret) {
	            self.bufferedAmount = ret.bufferedAmount;
	        }

	        if (typeof data === 'string' || data instanceof String) {
	            exec(onSuccess, null, 'WebRTCPlugin', 'cmdRTCDataChannel',
	                ['sendString', this._pcid, this.id, data]);
	        } else if (
	            (window.ArrayBuffer && data instanceof window.ArrayBuffer) ||
	            (window.Int8Array && data instanceof window.Int8Array) ||
	            (window.Uint8Array && data instanceof window.Uint8Array) ||
	            (window.Uint8ClampedArray && data instanceof window.Uint8ClampedArray) ||
	            (window.Int16Array && data instanceof window.Int16Array) ||
	            (window.Uint16Array && data instanceof window.Uint16Array) ||
	            (window.Int32Array && data instanceof window.Int32Array) ||
	            (window.Uint32Array && data instanceof window.Uint32Array) ||
	            (window.Float32Array && data instanceof window.Float32Array) ||
	            (window.Float64Array && data instanceof window.Float64Array) ||
	            (window.DataView && data instanceof window.DataView)
	        ) {
	            exec(onSuccess, null, 'WebRTCPlugin', 'cmdRTCDataChannel',
	                ['sendBinary', this._pcid, this.id, data]);
	        } else {
	            throw new Error('unsupported data type');
	        }
	    };

	    RTCDataChannel.prototype.close = function () {
	        if (this.readyState === 'closed' || this.readyState === 'closing')
	            return;

	        this.readyState = 'closing';
	        exec(null, null, 'WebRTCPlugin', 'cmdRTCDataChannel', ['close', this._pcid, this.id]);
	    };

	    module.exports = RTCDataChannel;
	})(this);

/***/ },
/* 15 */
/***/ function(module, exports) {

	(function (global) {
	    'use strict';

	    var RTCSessionDescription = function (initDict) {
		    this.type = initDict.hasOwnProperty('type') ? String(initDict.type) : null;
		    this.sdp = initDict.hasOwnProperty('sdp') ? String(initDict.sdp) : null;

		    this.toJSON = function () {
		        return { 'type': this.type, 'sdp': this.sdp };
		    };

		    this.toString = RTCSessionDescription.toString;
	    };

		RTCSessionDescription.toString = function () {
		    return '[object RTCSessionDescription]';
		};

	    module.exports = RTCSessionDescription;
	})(this);

/***/ },
/* 16 */
/***/ function(module, exports) {

	(function (global) {
	    'use strict';

		// var CoviuUtils = require('./rtcutils.js');
	    var RTCIceCandidate = function (initDict) {
	    	initDict = initDict || {};
	    	this.sdpMid = String(initDict.sdpMid);
			this.sdpMLineIndex = parseInt(initDict.sdpMLineIndex) || 0;
			this.candidate = String(initDict.candidate);
	    	// var a = { // attributes
		    //     'sdpMid': initDict.hasOwnProperty('sdpMid') ? String(initDict.sdpMid) : null,
		    //     'sdpMLineIndex': parseInt(initDict.sdpMLineIndex) || 0,
		    //     'candidate': initDict.hasOwnProperty('candidate') ? String(initDict.candidate) : null
		    // };
		    // CoviuUtils.addReadOnlyAttributes(this, a);

		    this.toJSON = function () {
		        return { 'candidate': this.candidate, 'sdpMid': this.sdpMid, 'sdpMLineIndex': this.sdpMLineIndex };
		    };

		    this.toString = RTCIceCandidate.toString;
	    };

	    RTCIceCandidate.toString = function () {
		    return '[object RTCIceCandidate]';
		};

	    module.exports = RTCIceCandidate;
	})(this);

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {/**
	 * Dependencies.
	 */
	var debug = __webpack_require__(1)('videoElementsHandler'),
		MediaStreamRenderer = __webpack_require__(18),


	/**
	 * Local variables.
	 */

		// RegExp for MediaStream blobId.
		MEDIASTREAM_ID_REGEXP = new RegExp(/^MediaStream_/),

		// RegExp for Blob URI.
		BLOB_URI_REGEX = new RegExp(/^blob:/),

		// Dictionary of MediaStreamRenderers (provided via module argument).
		// - key: MediaStreamRenderer id.
		// - value: MediaStreamRenderer.
		mediaStreamRenderers,

		// Dictionary of MediaStreams (provided via module argument).
		// - key: MediaStream blobId.
		// - value: MediaStream.
		mediaStreams,

		// Video element mutation observer.
		videoObserver = new MutationObserver(function (mutations) {
			var i, numMutations, mutation,
				video;

			for (i = 0, numMutations = mutations.length; i < numMutations; i++) {
				mutation = mutations[i];

				// HTML video element.
				video = mutation.target;

				// .src removed.
				if (!video.src) {
					// If this video element was previously handling a MediaStreamRenderer, release it.
					releaseMediaStreamRenderer(video);
					continue;
				}

				handleVideo(video);
			}
		}),

		// DOM mutation observer.
		domObserver = new MutationObserver(function (mutations) {
			var i, numMutations, mutation,
				j, numNodes, node;

			for (i = 0, numMutations = mutations.length; i < numMutations; i++) {
				mutation = mutations[i];

				// Check if there has been addition or deletion of nodes.
				if (mutation.type !== 'childList') {
					continue;
				}

				// Check added nodes.
				for (j = 0, numNodes = mutation.addedNodes.length; j < numNodes; j++) {
					node = mutation.addedNodes[j];

					checkNewNode(node);
				}

				// Check removed nodes.
				for (j = 0, numNodes = mutation.removedNodes.length; j < numNodes; j++) {
					node = mutation.removedNodes[j];

					checkRemovedNode(node);
				}
			}

			function checkNewNode(node) {
				var j, childNode;

				if (node.nodeName === 'VIDEO') {
					debug('new video element added');

					// Avoid same node firing more than once (really, may happen in some cases).
					if (node._iosrtcVideoHandled) {
						return;
					}
					node._iosrtcVideoHandled = true;

					// Observe changes in the video element.
					observeVideo(node);
				} else {
					for (j = 0; j < node.childNodes.length; j++) {
						childNode = node.childNodes.item(j);

						checkNewNode(childNode);
					}
				}
			}

			function checkRemovedNode(node) {
				var j, childNode;

				if (node.nodeName === 'VIDEO') {
					debug('video element removed');

					// If this video element was previously handling a MediaStreamRenderer, release it.
					releaseMediaStreamRenderer(node);
				} else {
					for (j = 0; j < node.childNodes.length; j++) {
						childNode = node.childNodes.item(j);

						checkRemovedNode(childNode);
					}
				}
			}
		});


	function videoElementsHandler(_mediaStreams, _mediaStreamRenderers) {
		var existingVideos = document.querySelectorAll('video'),
			i, len,
			video;

		mediaStreams = _mediaStreams;
		mediaStreamRenderers = _mediaStreamRenderers;

		// Search the whole document for already existing HTML video elements and observe them.
		for (i = 0, len = existingVideos.length; i < len; i++) {
			video = existingVideos.item(i);

			debug('video element found');

			observeVideo(video);
		}

		// Observe the whole document for additions of new HTML video elements and observe them.
		domObserver.observe(document, {
			// Set to true if additions and removals of the target node's child elements (including text nodes) are to
			// be observed.
			childList: true,
			// Set to true if mutations to target's attributes are to be observed.
			attributes: false,
			// Set to true if mutations to target's data are to be observed.
			characterData: false,
			// Set to true if mutations to not just target, but also target's descendants are to be observed.
			subtree: true,
			// Set to true if attributes is set to true and target's attribute value before the mutation needs to be
			// recorded.
			attributeOldValue: false,
			// Set to true if characterData is set to true and target's data before the mutation needs to be recorded.
			characterDataOldValue: false
			// Set to an array of attribute local names (without namespace) if not all attribute mutations need to be
			// observed.
			// attributeFilter:
		});
	}


	function observeVideo(video) {
		debug('observeVideo()');

		// If the video already has a src property but is not yet handled by the plugin
		// then handle it now.
		if (video.src && !video._iosrtcMediaStreamRendererId) {
			handleVideo(video);
		}

		// Add .src observer to the video element.
		videoObserver.observe(video, {
			// Set to true if additions and removals of the target node's child elements (including text
			// nodes) are to be observed.
			childList: false,
			// Set to true if mutations to target's attributes are to be observed.
			attributes: true,
			// Set to true if mutations to target's data are to be observed.
			characterData: false,
			// Set to true if mutations to not just target, but also target's descendants are to be observed.
			subtree: false,
			// Set to true if attributes is set to true and target's attribute value before the mutation
			// needs to be recorded.
			attributeOldValue: false,
			// Set to true if characterData is set to true and target's data before the mutation needs to be
			// recorded.
			characterDataOldValue: false,
			// Set to an array of attribute local names (without namespace) if not all attribute mutations
			// need to be observed.
			// TODO: Add srcObject, mozSrcObject
			attributeFilter: ['src']
		});

		// Intercept video 'error' events if it's due to the attached MediaStream.
		video.addEventListener('error', function (event) {
			if (video.error.code === global.MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED && BLOB_URI_REGEX.test(video.src)) {
				debug('stopping "error" event propagation for video element');

				event.stopImmediatePropagation();
			}
		});
	}


	/**
	 * Private API.
	 */

	function handleVideo(video) {
		var xhr = new XMLHttpRequest();

		xhr.open('GET', video.src, true);
		xhr.responseType = 'blob';
		xhr.onload = function () {
			if (xhr.status !== 200) {
				// If this video element was previously handling a MediaStreamRenderer, release it.
				releaseMediaStreamRenderer(video);

				return;
			}

			var reader = new FileReader();

			// Some versions of Safari fail to set onloadend property, some others do not react
			// on 'loadend' event. Try everything here.
			try {
				reader.onloadend = onloadend;
			} catch (error) {
				reader.addEventListener('loadend', onloadend);
			}
			reader.readAsText(xhr.response);

			function onloadend() {
				var mediaStreamBlobId = reader.result;

				// The retrieved URL does not point to a MediaStream.
				if (!mediaStreamBlobId || typeof mediaStreamBlobId !== 'string' || !MEDIASTREAM_ID_REGEXP.test(mediaStreamBlobId)) {
					// If this video element was previously handling a MediaStreamRenderer, release it.
					releaseMediaStreamRenderer(video);

					return;
				}

				provideMediaStreamRenderer(video, mediaStreamBlobId);
			}
		};
		xhr.send();
	}


	function provideMediaStreamRenderer(video, mediaStreamBlobId) {
		var mediaStream = mediaStreams[mediaStreamBlobId],
			mediaStreamRenderer = mediaStreamRenderers[video._iosrtcMediaStreamRendererId];

		if (!mediaStream) {
			releaseMediaStreamRenderer(video);

			return;
		}

		if (mediaStreamRenderer) {
			mediaStreamRenderer.render(mediaStream);
		} else {
			mediaStreamRenderer = new MediaStreamRenderer(video);
			mediaStreamRenderer.render(mediaStream);

			mediaStreamRenderers[mediaStreamRenderer.id] = mediaStreamRenderer;
			video._iosrtcMediaStreamRendererId = mediaStreamRenderer.id;
		}

		// Close the MediaStreamRenderer of this video if it emits "close" event.
		mediaStreamRenderer.addEventListener('close', function () {
			if (mediaStreamRenderers[video._iosrtcMediaStreamRendererId] !== mediaStreamRenderer) {
				return;
			}

			releaseMediaStreamRenderer(video);
		});

		// Override some <video> properties.
		// NOTE: This is a terrible hack but it works.
		Object.defineProperties(video, {
			videoWidth: {
				configurable: true,
				get: function () {
					return mediaStreamRenderer.videoWidth || 0;
				}
			},
			videoHeight: {
				configurable: true,
				get: function () {
					return mediaStreamRenderer.videoHeight || 0;
				}
			},
			readyState: {
				configurable: true,
				get: function () {
					if (mediaStreamRenderer && mediaStreamRenderer.stream && mediaStreamRenderer.stream.connected) {
						return video.HAVE_ENOUGH_DATA;
					} else {
						return video.HAVE_NOTHING;
					}
				}
			}
		});
	}


	function releaseMediaStreamRenderer(video) {
		if (!video._iosrtcMediaStreamRendererId) {
			return;
		}

		var mediaStreamRenderer = mediaStreamRenderers[video._iosrtcMediaStreamRendererId];

		if (mediaStreamRenderer) {
			delete mediaStreamRenderers[video._iosrtcMediaStreamRendererId];
			mediaStreamRenderer.close();
		}

		delete video._iosrtcMediaStreamRendererId;

		// Remove overrided <video> properties.
		delete video.videoWidth;
		delete video.videoHeight;
		delete video.readyState;
	}

	/**
	 * Expose a function that must be called when the library is loaded.
	 * And also a helper function.
	 */
	module.exports = videoElementsHandler;
	module.exports.observeVideo = observeVideo;
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Expose the MediaStreamRenderer class.
	 */
	module.exports = MediaStreamRenderer;


	/**
	 * Dependencies.
	 */
	var
		debug = __webpack_require__(1)('MediaStreamRenderer'),
		exec = __webpack_require__(4),
		CoviuUtils = __webpack_require__(8),
		EventTarget = __webpack_require__(10).EventTarget,
		MediaStream = __webpack_require__(7);


	function MediaStreamRenderer(element) {
		debug('new() | [element:"%s"]', element);

		var self = this;

		// Make this an EventTarget.
		EventTarget.call(this);

		if (!(element instanceof HTMLElement)) {
			throw new Error('a valid HTMLElement is required');
		}

		// Public atributes.
		this.element = element;
		this.stream = undefined;
		this.videoWidth = undefined;
		this.videoHeight = undefined;

		// Private attributes.
		this.id = CoviuUtils.randomString();

		function onResultOK(data) {
			onEvent.call(self, data);
		}

		exec(onResultOK, null, 'WebRTCPlugin', 'cmdMediaStreamRenderer', ['new', this.id]);

		this.refresh(this);
	}

	MediaStreamRenderer.prototype.render = function (stream) {
		debug('render() [stream:%o]', stream);

		var self = this;

		if (!(stream instanceof MediaStream)) {
			throw new Error('render() requires a MediaStream instance as argument');
		}

		this.stream = stream;

		exec(null, null, 'WebRTCPlugin', 'cmdMediaStreamRenderer', ['render', this.id, stream.id]);

		// Subscribe to 'update' event so we call native mediaStreamChanged() on it.
		stream.addEventListener('update', function () {
			if (self.stream !== stream) {
				return;
			}

			debug('MediaStream emits "update", calling native mediaStreamChanged()');

			exec(null, null, 'WebRTCPlugin', 'cmdMediaStreamRenderer', ['mediaStreamChanged', self.id]);
		});

		// Subscribe to 'inactive' event and emit "close" so the video element can react.
		stream.addEventListener('inactive', function () {
			if (self.stream !== stream) {
				return;
			}

			debug('MediaStream emits "inactive", emiting "close" and closing this MediaStreamRenderer');

			self.dispatchEvent(new Event('close'));
			self.close();
		});

		if (stream.connected) {
			connected();
		// Otherwise subscribe to 'connected' event to emulate video elements events.
		} else {
			stream.addEventListener('connected', function () {
				if (self.stream !== stream) {
					return;
				}

				connected();
			});
		}

		function connected() {
			// Emit video events.
			self.element.dispatchEvent(new Event('loadedmetadata'));
			self.element.dispatchEvent(new Event('loadeddata'));
			self.element.dispatchEvent(new Event('canplay'));
			self.element.dispatchEvent(new Event('canplaythrough'));
		}
	};

	MediaStreamRenderer.prototype.refresh = function () {
		debug('refresh()');

		var elementPositionAndSize = getElementPositionAndSize.call(this),
			computedStyle,
			videoRatio,
			elementRatio,
			elementLeft = elementPositionAndSize.left,
			elementTop = elementPositionAndSize.top,
			elementWidth = elementPositionAndSize.width,
			elementHeight = elementPositionAndSize.height,
			videoViewWidth,
			videoViewHeight,
			visible,
			opacity,
			zIndex,
			mirrored,
			objectFit,
			clip,
			borderRadius,
			paddingTop,
			paddingBottom,
			paddingLeft,
			paddingRight;

		computedStyle = window.getComputedStyle(this.element);

		// get padding values
		paddingTop = parseInt(computedStyle.paddingTop) | 0;
		paddingBottom = parseInt(computedStyle.paddingBottom) | 0;
		paddingLeft = parseInt(computedStyle.paddingLeft) | 0;
		paddingRight = parseInt(computedStyle.paddingRight) | 0;

		// fix position according to padding
		elementLeft += paddingLeft;
		elementTop += paddingTop;

		// fix width and height according to padding
		elementWidth -= (paddingLeft + paddingRight);
		elementHeight -= (paddingTop + paddingBottom);

		videoViewWidth = elementWidth;
		videoViewHeight = elementHeight;

		// visible
		if (computedStyle.visibility === 'hidden') {
			visible = false;
		} else {
			visible = !!this.element.offsetHeight;  // Returns 0 if element or any parent is hidden.
		}

		// opacity
		opacity = parseFloat(computedStyle.opacity);

		// zIndex
		zIndex = parseFloat(computedStyle.zIndex) || parseFloat(this.element.style.zIndex) || 0;

		// mirrored (detect "-webkit-transform: scaleX(-1);" or equivalent)
		if (computedStyle.transform === 'matrix(-1, 0, 0, 1, 0, 0)' ||
			computedStyle['-webkit-transform'] === 'matrix(-1, 0, 0, 1, 0, 0)') {
			mirrored = true;
		} else {
			mirrored = false;
		}

		// objectFit ('contain' is set as default value)
		objectFit = computedStyle.objectFit || 'contain';

		// clip
		if (objectFit === 'none') {
			clip = false;
		} else {
			clip = true;
		}

		// borderRadius
		borderRadius = parseFloat(computedStyle.borderRadius);
		if (/%$/.test(borderRadius)) {
			borderRadius = Math.min(elementHeight, elementWidth) * borderRadius;
		}

		/**
		 * No video yet, so just update the UIView with the element settings.
		 */

		if (!this.videoWidth || !this.videoHeight) {
			debug('refresh() | no video track yet');

			nativeRefresh.call(this);
			return;
		}

		videoRatio = this.videoWidth / this.videoHeight;

		/**
		 * Element has no width and/or no height.
		 */

		if (!elementWidth || !elementHeight) {
			debug('refresh() | video element has 0 width and/or 0 height');

			nativeRefresh.call(this);
			return;
		}

		/**
		 * Set video view position and size.
		 */

		elementRatio = elementWidth / elementHeight;

		switch (objectFit) {
			case 'cover':
				// The element has higher or equal width/height ratio than the video.
				if (elementRatio >= videoRatio) {
					videoViewWidth = elementWidth;
					videoViewHeight = videoViewWidth / videoRatio;
				// The element has lower width/height ratio than the video.
				} else if (elementRatio < videoRatio) {
					videoViewHeight = elementHeight;
					videoViewWidth = videoViewHeight * videoRatio;
				}
				break;

			case 'fill':
				videoViewHeight = elementHeight;
				videoViewWidth = elementWidth;
				break;

			case 'none':
				videoViewHeight = this.videoHeight;
				videoViewWidth = this.videoWidth;
				break;

			case 'scale-down':
				// Same as 'none'.
				if (this.videoWidth <= elementWidth && this.videoHeight <= elementHeight) {
					videoViewHeight = this.videoHeight;
					videoViewWidth = this.videoWidth;
				// Same as 'contain'.
				} else {
					// The element has higher or equal width/height ratio than the video.
					if (elementRatio >= videoRatio) {
						videoViewHeight = elementHeight;
						videoViewWidth = videoViewHeight * videoRatio;
					// The element has lower width/height ratio than the video.
					} else if (elementRatio < videoRatio) {
						videoViewWidth = elementWidth;
						videoViewHeight = videoViewWidth / videoRatio;
					}
				}
				break;

			// 'contain'.
			default:
				objectFit = 'contain';
				// The element has higher or equal width/height ratio than the video.
				if (elementRatio >= videoRatio) {
					videoViewHeight = elementHeight;
					videoViewWidth = videoViewHeight * videoRatio;
				// The element has lower width/height ratio than the video.
				} else if (elementRatio < videoRatio) {
					videoViewWidth = elementWidth;
					videoViewHeight = videoViewWidth / videoRatio;
				}
				break;
		}

		nativeRefresh.call(this);

		function nativeRefresh() {
			var data = {
				elementLeft: elementLeft,
				elementTop: elementTop,
				elementWidth: elementWidth,
				elementHeight: elementHeight,
				videoViewWidth: videoViewWidth,
				videoViewHeight: videoViewHeight,
				visible: visible,
				opacity: opacity,
				zIndex: zIndex,
				mirrored: mirrored,
				objectFit: objectFit,
				clip: clip,
				borderRadius: borderRadius
			};

			debug('refresh() | [data:%o]', data);

			exec(null, null, 'WebRTCPlugin', 'cmdMediaStreamRenderer', ['refresh', this.id, data]);
		}
	};

	MediaStreamRenderer.prototype.close = function () {
		debug('close()');

		if (!this.stream) {
			return;
		}
		this.stream = undefined;

		exec(null, null, 'WebRTCPlugin', 'cmdMediaStreamRenderer', ['close', this.id]);
	};


	/**
	 * Private API.
	 */


	function onEvent(data) {
		var type = data.type,
			event;

		debug('onEvent() | [type:%s, data:%o]', type, data);

		switch (type) {
			case 'videoresize':
				this.videoWidth = data.size.width;
				this.videoHeight = data.size.height;
				this.refresh(this);

				event = new Event(type);
				event.videoWidth = data.size.width;
				event.videoHeight = data.size.height;
				this.dispatchEvent(event);

				break;
		}
	}

	function getElementPositionAndSize() {
		var rect = this.element.getBoundingClientRect();

		return {
			left:   rect.left + this.element.clientLeft,
			top:    rect.top + this.element.clientTop,
			width:  this.element.clientWidth,
			height: this.element.clientHeight
		};
	}


/***/ }
/******/ ]);
});
