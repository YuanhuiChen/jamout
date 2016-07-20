/**
* @fileoverview Sound Service to play audio sounds in the Room
* @author Jay 
*/
goog.provide('jamout.services.SoundService');


/**
* @constructor
*/
jamout.services.SoundService = function () {};

/**
* Sound sample dictionary to play 
* @type {Array}
*/
jamout.services.SoundService.SOUNDLIST = [
      {NAME: 'notification', URL: window.location.origin + '/sounds/notify.mp3'},
      {NAME: 'kick',         URL: window.location.origin + '/sounds/kick.mp3'},
      {NAME: 'analogKick',   URL: window.location.origin + '/sounds/analogKick.mp3'},
      {NAME: 'clap',         URL: window.location.origin + '/sounds/clap.mp3'},
      {NAME: 'snare',        URL: window.location.origin + '/sounds/snare.mp3'},
      {NAME: 'burp',         URL: window.location.origin + '/sounds/burp.mp3'},
      {NAME: 'rattle',       URL: window.location.origin + '/sounds/rattle.mp3'},
      {NAME: 'yo',           URL: window.location.origin + '/sounds/yo.mp3'},
      {NAME: 'badadum',      URL: window.location.origin + '/sounds/badadum.mp3'},
      {NAME: 'trap',         URL: window.location.origin + '/sounds/trap.mp3'},
      {NAME: 'whatTheHell',  URL: window.location.origin + '/sounds/whatTheHell.mp3'},
      {NAME: 'awww',         URL: window.location.origin + '/sounds/awww.mp3'},
      {NAME: 'airHorn',      URL: window.location.origin + '/sounds/airHorn.mp3'},
      {NAME: 'whistle',      URL: window.location.origin + '/sounds/whistle.mp3'},
      {NAME: 'chime',        URL: window.location.origin + '/sounds/chime.mp3'},
      {NAME: 'drip',         URL: window.location.origin + '/sounds/drip.mp3'},
      {NAME: 'sms',          URL: window.location.origin + '/sounds/sms.mp3'},
      {NAME: 'nya',          URL: window.location.origin + '/sounds/nya.mp3'}
    ];


/**
* Fetches and Preloads the sounds
*/
jamout.services.SoundService.prototype.preLoadSounds = function () {
      for (var i = 0; i < jamout.services.SoundService.SOUNDLIST.length; i++) {
        /** @const */
        var initSound = new Audio();
        initSound.src = jamout.services.SoundService.SOUNDLIST[i].URL;
        /** @const */
        initSound.load();
        if (initSound) {
            jamout.services.SoundService.SOUNDLIST[i].LOADED = initSound;
         } else {
           // todo: retry loading
            console.log('failed to load sound', jamout.services.SoundService.SOUNDLIST[i].NAME);
        }
      }
      console.log('sounds loaded');
};


/**
* Play sound
* @param {String} soundName - Name of the sound to play on key press
*/
jamout.services.SoundService.prototype.playSound = function(soundName) {
      /** @const */
      var name = soundName || "";

      for (var i = 0; i < jamout.services.SoundService.SOUNDLIST.length; i++) {
        if (name === jamout.services.SoundService.SOUNDLIST[i].NAME) {
          /** @const */
          var loadedSound = jamout.services.SoundService.SOUNDLIST[i].LOADED;
          
          if(loadedSound.ended) {
              loadedSound.currentTime = 0;
          }

          if(loadedSound.currentTime > 0) {
               loadedSound.currentTime = 0;
          } else {
            loadedSound.play();
            return;
          }
         
        } 
     }
};


jamout.services.SoundService.INJECTS = [jamout.services.SoundService];