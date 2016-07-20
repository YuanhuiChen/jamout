{
  "mode": "ADVANCED",
  "id": "activity",
   "pretty-print": true,
   "debug": true,
   "level": "DEFAULT",
     "checks": {
    // acceptable values are "ERROR", "WARNING", and "OFF" 
    // "deprecated": "ERROR",
    // "checkTypes": "ERROR",
    // "nonStandardJsDocs": "WARNING"
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
        "activity": {
            "inputs": [
                "@PROJECT_DIR@/src/modules/module_activity.js"
            ],
            "deps": [

            ]
        }
    }
}