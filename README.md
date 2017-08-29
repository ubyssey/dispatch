Dispatch
=====================
[![Travis branch](https://img.shields.io/travis/ubyssey/dispatch/develop.svg)](https://travis-ci.org/ubyssey/dispatch)
[![codecov](https://codecov.io/gh/ubyssey/dispatch/branch/develop/graph/badge.svg)](https://codecov.io/gh/ubyssey/dispatch)
[![PyPI](https://img.shields.io/pypi/v/dispatch.svg)](https://pypi.python.org/pypi/dispatch)

Dispatch is a publishing platform for modern newspapers and digital publications. Created in tandem by student journalists and developers, it aims to make online news more open, more hackable, and of course, more fun.

Made with :heart: by [_The Ubyssey_](https://www.ubyssey.ca/), the University of British Columbia's student newspaper since 1918.

## Installation

```
pip install dispatch
```

## Contribute

```bash
# Install Dispatch in Development Mode
git clone https://github.com/ubyssey/dispatch.git
cd dispatch
pip install -e .[dev]
python setup.py develop
```

```bash
# Front-end manager app
cd dispatch/dispatch/static/manager

# Install dependencies
yarn setup

# Run Webpack in watch mode
yarn start
```

### Testing

```bash

# Run tests
# make sure your current working directory is ubyssey-dev/dispatch
dispatch-admin test

# Generate coverage report
dispatch-admin coverage
```
