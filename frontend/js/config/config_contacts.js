{
  "mode": "ADVANCED",
  "id": "contacts",
  "pretty-print": true,
  "debug": true,
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
        "@PROJECT_DIR@/externs/angular.js"
  ],
  "treat-warnings-as-errors": true,
  "closure-library": "@PROJECT_DIR@/closure/closure/goog",
  "module-output-path": "@PROJECT_DIR@/build/module_%s.js",
    "modules": {
        "contacts": {
            "inputs": [
                "@PROJECT_DIR@/src/modules/module_contacts.js"
            ],
            "deps": [

            ]
        }
    }
}