/**
 * ref: http://www.dotnetwise.com/Code/Externs/index.html
 * @fileoverview Externs for soundjs
 * @externs
 */

/**
 * @constructor
 */
createjs.SoundJS = function() {};

/**
 * @type {string}
 */
createjs.SoundJS.buildDate;

/**
 * @type {string}
 */
createjs.SoundJS.version;


/**
 * @constructor
 */
createjs.HTMLAudioPlugin = function() {};

/**
 * @type {string}
 */
createjs.HTMLAudioPlugin.AUDIO_ENDED;

/**
 * @type {string}
 */
createjs.HTMLAudioPlugin.AUDIO_ERROR;

/**
 * @type {string}
 */
createjs.HTMLAudioPlugin.AUDIO_READY;

/**
 * @type {string}
 */
createjs.HTMLAudioPlugin.AUDIO_SEEKED;

/**
 * @type {string}
 */
createjs.HTMLAudioPlugin.AUDIO_STALLED;

/**
 * @type {number}
 */
createjs.HTMLAudioPlugin.prototype.defaultNumChannels;

/**
 * @type {boolean}
 */
createjs.HTMLAudioPlugin.prototype.enableIOS;

/**
 * @type {number}
 */
createjs.HTMLAudioPlugin.MAX_INSTANCES;

/**
 * @param {string} src
 * @return {createjs.SoundInstance}
 */
createjs.HTMLAudioPlugin.prototype.create = function(src) {};

/**
 * @param {string} src
 * @return {boolean}
 */
createjs.HTMLAudioPlugin.prototype.isPreloadStarted = function(src) {};

/**
 * @return {boolean}
 */
createjs.HTMLAudioPlugin.isSupported = function() {};

/**
 * @param {string} src
 * @param {Object} instance
 * @param {string} basePath
 */
createjs.HTMLAudioPlugin.prototype.preload = function(src, instance, basePath) {};

/**
 * @param {string} src
 * @param {number} instances
 * @return {Object}
 */
createjs.HTMLAudioPlugin.prototype.register = function(src, instances) {};

/**
 * @param {string} src
 */
createjs.HTMLAudioPlugin.prototype.removeAllSounds = function(src) {};

/**
 * @param {string} src
 */
createjs.HTMLAudioPlugin.prototype.removeSound = function(src) {};



/**
 * @constructor
 * @extends {createjs.EventDispatcher}
 */
createjs.Sound = function() {};

/**
 * @type {Object}
 */
createjs.Sound.activePlugin;

/**
 * @type {string}
 */
createjs.Sound.defaultInterruptBehavior;

/**
 * @type {string}
 */
createjs.Sound.DELIMITER;

/**
 * @type {Object}
 */
createjs.Sound.EXTENSION_MAP;

/**
 * @type {string}
 */
createjs.Sound.INTERRUPT_ANY;

/**
 * @type {string}
 */
createjs.Sound.INTERRUPT_EARLY;

/**
 * @type {string}
 */
createjs.Sound.INTERRUPT_LATE;

/**
 * @type {string}
 */
createjs.Sound.INTERRUPT_NONE;

/**
 * @deprecated Listen to 'fileload' event
 * @type {Function}
 */
createjs.Sound.onLoadComplete;

/**
 * @type {string}
 */
createjs.Sound.PLAY_FAILED;

/**
 * @type {string}
 */
createjs.Sound.PLAY_FINISHED;

/**
 * @type {string}
 */
createjs.Sound.PLAY_INITED;

/**
 * @type {string}
 */
createjs.Sound.PLAY_INTERRUPTED;

/**
 * @type {string}
 */
createjs.Sound.PLAY_SUCCEEDED;

/**
 * @type {Array.<string>}
 */
createjs.Sound.SUPPORTED_EXTENSIONS;

/**
 * @param {string} src
 * @return {createjs.SoundInstance}
 */
createjs.Sound.createInstance = function(src) {};

/**
 * @return {Object}
 */
createjs.Sound.getCapabilities = function() {};

/**
 * @param {string} key
 * @return {number|boolean}
 */
createjs.Sound.getCapability = function(key) {};

/**
 * @return {boolean}
 */
createjs.Sound.getMute = function() {};

/**
 * @return {number}
 */
createjs.Sound.getVolume = function() {};

/**
 * @return {boolean}
 */
createjs.Sound.initializeDefaultPlugins = function() {};

/**
 * @param {string} src
 * @return {boolean}
 */
createjs.Sound.loadComplete = function(src) {};

/**
 * @deprecated Use setMute instead.
 * @param {boolean} value
 */
createjs.Sound.mute = function(value) {};

/**
 * @param {string} src
 * @param {string|Object=} interrupt
 * @param {number=} delay
 * @param {number=} offset
 * @param {number=} loop
 * @param {number=} volume
 * @param {number=} pan
 * @return {createjs.SoundInstance}
 */
createjs.Sound.play = function(src, interrupt, delay, offset, loop, volume, pan) {};

/**
 * @param {Array} manifest
 * @param {string} basePath
 * @return {Object}
 */
createjs.Sound.registerManifest = function(manifest, basePath) {};

/**
 * @param {Object} plugin
 * @return {boolean}
 */
createjs.Sound.registerPlugin = function(plugin) {};

/**
 * @param {Array} plugins
 * @return {boolean}
 */
createjs.Sound.registerPlugins = function(plugins) {};

/**
 * @param {string|Object} src
 * @param {string=} id
 * @param {number|Object=} data
 * @param {boolean=} preload
 * @param {string=} basePath
 * @return {Object}
 */
createjs.Sound.registerSound = function(src, id, data, preload, basePath) {};

/**
 * 
 */
createjs.Sound.removeAllSounds = function() {};

/**
 * @param {Array} manifest
 * @return {Object}
 */
createjs.Sound.removeManifest = function(manifest) {};

/**
 * @param {string|Object} src
 * @return {boolean}
 */
createjs.Sound.removeSound = function(src) {};

/**
 * @param {boolean} value
 * @return {boolean}
 */
createjs.Sound.setMute = function(value) {};

/**
 * @param {number} value
 */
createjs.Sound.setVolume = function(value) {};

/**
 * 
 */
createjs.Sound.stop = function() {};


/**
 * @constructor
 * @extends {createjs.EventDispatcher}
 * @param {string} src
 * @param {Object} owner
 */
createjs.SoundInstance = function(src, owner) {};

/**
 * @type {string}
 */
createjs.SoundInstance.prototype.gainNode;

/**
 * @deprecated Listen to 'complete' event
 * @type {Function}
 */
createjs.SoundInstance.prototype.onComplete;

/**
 * @deprecated Listen to 'loop' event
 * @type {Function}
 */
createjs.SoundInstance.prototype.onLoop;

/**
 * @deprecated Listen to 'failed' event
 * @type {Function}
 */
createjs.SoundInstance.prototype.onPlayFailed;

/**
 * @deprecated Listen to 'interrupted' event
 * @type {Function}
 */
createjs.SoundInstance.prototype.onPlayInterrupted;

/**
 * @deprecated Listen to 'succeeded' event
 * @type {Function}
 */
createjs.SoundInstance.prototype.onPlaySucceeded;

/**
 * @deprecated Listen to 'ready' event
 * @type {Function}
 */
createjs.SoundInstance.prototype.onReady;

/**
 * @type {number}
 */
createjs.SoundInstance.prototype.pan;

/**
 * @type {Node|Element|null}
 */
createjs.SoundInstance.prototype.panNode;

/**
 * @type {string}
 */
createjs.SoundInstance.prototype.playState;

/**
 * @type {Node|Element|null}
 */
createjs.SoundInstance.prototype.sourceNode;

/**
 * @type {string|number}
 */
createjs.SoundInstance.prototype.uniqueId;

/**
 * @type {number}
 */
createjs.SoundInstance.prototype.volume;

/**
 * @return {number}
 */
createjs.SoundInstance.prototype.getDuration = function() {};

/**
 * @return {boolean}
 */
createjs.SoundInstance.prototype.getMute = function() {};

/**
 * @return {number}
 */
createjs.SoundInstance.prototype.getPan = function() {};

/**
 * @return {number}
 */
createjs.SoundInstance.prototype.getPosition = function() {};

/**
 * @return {number}
 */
createjs.SoundInstance.prototype.getVolume = function() {};

/**
 * @deprecated Use setMute instead.
 * @param {string} value
 * @return {boolean}
 */
createjs.SoundInstance.prototype.mute = function(value) {};

/**
 * @return {boolean}
 */
createjs.SoundInstance.prototype.pause = function() {};

/**
 * @param {string|Object=} interrupt
 * @param {number=} delay
 * @param {number=} offset
 * @param {number=} loop
 * @param {number=} volume
 * @param {number=} pan
 */
createjs.SoundInstance.prototype.play = function(interrupt, delay, offset, loop, volume, pan) {};

/**
 * @return {boolean}
 */
createjs.SoundInstance.prototype.resume = function() {};

/**
 * @param {boolean} value
 * @return {boolean}
 */
createjs.SoundInstance.prototype.setMute = function(value) {};

/**
 * @param {number} value
 * @return {number|boolean}
 */
createjs.SoundInstance.prototype.setPan = function(value) {};

/**
 * @param {number} value
 */
createjs.SoundInstance.prototype.setPosition = function(value) {};

/**
 * @param {number} value
 * @return {boolean}
 */
createjs.SoundInstance.prototype.setVolume = function(value) {};

/**
 * @return {boolean}
 */
createjs.SoundInstance.prototype.stop = function() {};

/**
 * @constructor
 */
createjs.WebAudioPlugin = function() {};

/**
 * @type {Object}
 */
createjs.WebAudioPlugin.prototype.context;

/**
 * @type {Node|Element}
 */
createjs.WebAudioPlugin.prototype.dynamicsCompressorNode;

/**
 * @type {Node|Element}
 */
createjs.WebAudioPlugin.prototype.gainNode;

/**
 * @param {string} src
 * @return {boolean}
 */
createjs.WebAudioPlugin.prototype.addPreloadResults = function(src) {};

/**
 * @param {string} src
 * @return {createjs.SoundInstance}
 */
createjs.WebAudioPlugin.prototype.create = function(src) {};

/**
 * @return {number}
 */
createjs.WebAudioPlugin.prototype.getVolume = function() {};

/**
 * @param {string} src
 * @return {boolean}
 */
createjs.WebAudioPlugin.prototype.isPreloadComplete = function(src) {};

/**
 * @param {string} src
 * @return {boolean}
 */
createjs.WebAudioPlugin.prototype.isPreloadStarted = function(src) {};

/**
 * @return {boolean}
 */
createjs.WebAudioPlugin.isSupported = function() {};

/**
 * 
 */
createjs.WebAudioPlugin.prototype.playEmptySound = function() {};

/**
 * @param {string} src
 * @param {number} instances
 * @return {Object}
 */
createjs.WebAudioPlugin.prototype.register = function(src, instances) {};

/**
 * @param {string} src
 */
createjs.WebAudioPlugin.prototype.removeAllSounds = function(src) {};

/**
 * @deprecated is deprecated
 * @param {string} src
 */
createjs.WebAudioPlugin.prototype.removeFromPreload = function(src) {};

/**
 * @param {string} src
 */
createjs.WebAudioPlugin.prototype.removeSound = function(src) {};

/**
 * @param {boolean} value
 * @return {boolean}
 */
createjs.WebAudioPlugin.prototype.setMute = function(value) {};

/**
 * @param {number} value
 * @return {boolean}
 */
createjs.WebAudioPlugin.prototype.setVolume = function(value) {};
 