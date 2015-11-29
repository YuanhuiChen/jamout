{
  "mode": "ADVANCED",
  "id": "forgotPassword",
 // "pretty-print": true,
 //  "debug": true,
    "level" : "DEFAULT",
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
        "forgotPassword": {
            "inputs": [
                "@PROJECT_DIR@/src/modules/module_forgotPassword.js"
            ],
            "deps": [

            ]
        }
    }
}