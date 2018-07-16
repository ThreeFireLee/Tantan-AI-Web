# TanTan-AI-Web
Supporting the data interaction of AI model and A/B testing

> A Vue.js project for tantan AI team
> Design doc: https://docs.google.com/document/d/18XbWuYrFeIcPgE_iGP4FRaOEThqUDplCbOMUl0FZNXw/edit

# Basic function:
1. Model provision/retrieve
2. A/B Testing deployment.
3. Model/AB Testing history presentation
4. Email function
5. Search funciton
6. Hbase and Redis A/B Testing comparison


# Tech stack:
Vue.js/axios/Node.js/Express/Hbase/MongoDB/Redis/Zookeeper

## Build Setup

``` bash
# install dependencies
npm install

#mongo DB start
mongod -f /usr/local/etc/mongod.conf

# serve with hot reload at localhost:8024
npm run dev

# serve with node at localhost:3000
node server/bin/www

# build for production with minification(optional)
npm run build

# build for production and view the bundle analyzer report(optional)
npm run build --report
```

For a detailed explanation on how vue work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
