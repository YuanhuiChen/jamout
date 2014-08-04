{
  "mode": "ADVANCED",
  "id": "welcome",
    "paths": [
        "@PROJECT_DIR@/src",
        "@PROJECT_DIR@/closure/third_party"
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