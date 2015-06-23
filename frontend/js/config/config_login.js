{
  "mode": "WHITESPACE",
  "id": "login",
  "pretty-print": true,
  "debug": true,
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
        "login": {
            "inputs": [
                "@PROJECT_DIR@/src/modules/module_login.js"
            ],
            "deps": [

            ]
        }
    }
}