# Dispatch Developers Guide

*Under Construction*

# Installation

```bash
git clone https://github.com/ubyssey/dispatch.git
cd dispatch/dispatch/static/manager

yarn setup

# build the front-end in dev/watchify mode
yarn start

# build the front-end in production models
yarn build

cd ../../..
python setup.py develop
```

# Repo Layout

```
+ dispatch <- Code
------ + admin <- Installs the '/admin' URL
------ + api <- view for the REST API
------ + apps/frontend <- code that is used by theme for special rendering components
------ + bin <- dispatch-admin tool
------ + conf <- extended settings
------ + core
------ + helpers <- Classes for registering theme
------ + modules <- Contain models and managers
------ + static/manager <- Code for manager/admin webapp
------ + templates
------ + templatetags
------ + tests <- Test Code
------ + theme
------ + vendor <- Code for working with other APIs
+ docs <- Documentation
```
