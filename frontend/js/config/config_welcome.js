{
  "mode": "ADVANCED",
  "id": "welcome",
    "paths": [
        "@PROJECT_DIR@/src",
        "@PROJECT_DIR@/closure/third_party"
    ],
    "externs": [
     "@PROJECT_DIR@/externs/angular.js"
     ],
  "closure-library": "@PROJECT_DIR@/closure/closure/goog",
  "module-output-path": "@PROJECT_DIR@/build/module_%s.js",
    "modules": {
        "welcome": {
            "inputs": [
                "@PROJECT_DIR@/src/modules/module_welcome.js"
            ],
            "deps": [

            ]
        }
    }
}