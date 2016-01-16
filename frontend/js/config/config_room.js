{
  "mode": "WHITESPACE",
  "id": "room",
  "pretty-print": true,
  "debug": true,
  "experimental-compiler-options": {
      "languageIn": "ECMASCRIPT5"
   },
  // "level": "VERBOSE",
  "checks": {
    // acceptable values are "ERROR", "WARNING", and "OFF" 
    // "deprecated": "ERROR",
    // "checkTypes": "ERROR",
    "nonStandardJsDocs": "WARNING"
  },
   "paths": [
        "@PROJECT_DIR@/src",
        "@PROJECT_DIR@/closure/third_party"
    ],
  "externs": [
   "@PROJECT_DIR@/externs/angular.js",
   "@PROJECT_DIR@/externs/socket.io.js",
   "@PROJECT_DIR@/externs/RTCPeerConnection.js"
   ],
  "treat-warnings-as-errors": true,
  "closure-library": "@PROJECT_DIR@/closure/closure/goog",
  "module-output-path": "@PROJECT_DIR@/build/module_%s.js",
    "modules": {
        "room": {
            "inputs": [
                "@PROJECT_DIR@/src/modules/module_room.js"
            ],
            "deps": [

            ]
        }
    }
}