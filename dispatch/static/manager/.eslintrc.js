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
    "no-console": 0,
    "react/prop-types": 0,
    "react/jsx-indent-props": ["error", 2]
  },
  "plugins": [
    "react"
  ]
};
