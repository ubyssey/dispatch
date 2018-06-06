module.exports = {
  "env": {
    "browser": true,
    "commonjs": true,
    "es6": true,
    "node": true,
  },
  "extends": ["eslint:recommended", "plugin:react/recommended"],
  "parserOptions": {
    "sourceType": "module",
    "ecmaFeatures": {
      "jsx": true
    }
  },
  "rules": {
    "indent": ["error", 2],
    "linebreak-style": 0,
    "quotes": ["error", "single"],
    "semi": ["error", "never"],
    "no-unused-vars": ["warn", {"args": "after-used"}],
    "no-console": ["warn"],
    "keyword-spacing": 2,
    "react/prop-types": 0,
    "react/no-find-dom-node": 0,
    "react/self-closing-comp": 2,
    "react/jsx-indent-props": ["error", 2],
    "react/jsx-first-prop-new-line": ["error", "multiline-multiprop"],
    "react/jsx-closing-bracket-location": ["error", "after-props"],
    "react/jsx-curly-spacing": 2,
    "react/no-string-refs": 0,
    "react/jsx-props-no-multi-spaces": 2,
    "react/jsx-space-before-closing": 2,
    "react/no-deprecated": 0,
  },
  "plugins": [
    "react"
  ]
};
