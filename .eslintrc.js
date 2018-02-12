module.exports = {
    "env": {
        "node": true,
        "es6": true
    },
    "extends": "eslint:recommended",
    "rules": {
        "eqeqeq": "error",
        "no-console": 0,
        "no-trailing-spaces": "error",
        "object-curly-spacing": [
            "error", "always"
        ],
        "arrow-spacing": [
            "error", { "before": true, "after": true }
        ],
        "indent": [
            "error",
            2
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "never"
        ]
    }
};