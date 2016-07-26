/**
* @fileoverview Sound Service to play audio sounds in the Room using createjs
* @author Jay 
*/
goog.provide('jamout.services.SoundService');


/**
* @constructor
*/
jamout.services.SoundService = function () {};


/**
* Sound dictionary 
* @type {Array}
*/
jamout.services.SoundService.SOUNDLIST = [
      {id: 'notification', src: 'notify.mp3'},
      {id: 'kick',         src: 'kick.mp3'},
      {id: 'analogKick',   src: 'analogKick.mp3'},
      {id: 'clap',         src: 'clap.mp3'},
      {id: 'snare',        src: 'snare.mp3'},
      {id: 'burp',         src: 'burp.mp3'},
      {id: 'rattle',       src: 'rattle.mp3'},
      {id: 'yo',           src: 'yo.mp3'},
      {id: 'badadum',      src: 'badadum.mp3'},
      {id: 'trap',         src: 'trap.mp3'},
      {id: 'whatTheHell',  src: 'whatTheHell.mp3'},
      {id: 'awww',         src: 'awww.mp3'},
      {id: 'airHorn',      src: 'airHorn.mp3'},
      {id: 'whistle',      src: 'whistle.mp3'},
      {id: 'chime',        src: 'chime.mp3'},
      {id: 'drip',         src: 'drip.mp3'},
      {id: 'sms',          src: 'sms.mp3'},
      {id: 'nya',          src: 'nya.mp3'}
    ];



/**
* Fetches and Preloads the sounds
* @method preLoadSounds
*/
jamout.services.SoundService.prototype.preLoadSounds = function () 
{
    // if initializeDefaultPlugins returns false, we cannot play sound in this browser
    if (!createjs.Sound.initializeDefaultPlugins()) {return;} 
 
    createjs.Sound.alternateExtensions = ["ogg"];
    createjs.Sound.addEventListener("fileload", jamout.services.SoundService.prototype.handleLoad);
    createjs.Sound.registerSounds(jamout.services.SoundService.SOUNDLIST, jamout.services.SoundService.PATH);

    for (var i = 0; i < jamout.services.SoundService.SOUNDLIST.length; i++) {
        /** @static */
        var initSound = createjs.Sound.play(jamout.services.SoundService.SOUNDLIST[i].id);
        
        if (initSound) {
            jamout.services.SoundService.SOUNDLIST[i].LOADED = initSound;
         } else {
            console.log('failed to load sound', jamout.services.SoundService.SOUNDLIST[i].id);
        }
      }
};

/**
* Load handler
* @method handleLoad
* @param {*} event 
*/
jamout.services.SoundService.prototype.handleLoad = function (event) 
{
  // console.log('sounds successfully loaded');
};


/**
* Plays a sound on keypress
* @param {String} soundName - Name of the sound to play
* @method playSound
*/
jamout.services.SoundService.prototype.playSound = function(soundName) 
{
    /** @static */
    var name = soundName || "";
    /**
    * Set creatjs sound properties
    * ref: http://www.createjs.com/docs/soundjs/classes/PlayPropsConfig.html 
    * @static
    */
    var ppc = new createjs.PlayPropsConfig().set({interrupt:createjs.Sound.INTERRUPT_ALL});  

    for (var i = 0; i < jamout.services.SoundService.SOUNDLIST.length; i++) {
        if (name === jamout.services.SoundService.SOUNDLIST[i].id) {
          /** @const */
          var loadedSound = jamout.services.SoundService.SOUNDLIST[i].LOADED;
          

          if (loadedSound.position == loadedSound.duration) {
            loadedSound.position = 0;
          }

          if (loadedSound.position > 0) {
              loadedSound.position = 0; 
          } else {
            loadedSound.play(ppc);
            return;
          }
         
        } 
     }
};

/**
* Path to sound files
* @const
*/
jamout.services.SoundService.PATH = window.location.origin + '/sounds/'; 


jamout.services.SoundService.INJECTS = [jamout.services.SoundService];