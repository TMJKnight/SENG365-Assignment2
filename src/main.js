import Vue from 'vue';
import App from './App.vue';
import Home from './Home.vue';
import Venues from './Venues.vue';
import SingleVenue from './SingleVenue.vue';
import SignUp from './SignUp.vue';
import LogIn from './LogIn.vue';
import CreateVenue from './CreateVenue.vue';
import EditVenue from './EditVenue.vue';
import CreateReview from './CreateReview.vue';
import User from './User.vue';
import EditUser from './EditUser.vue'


import VueRouter from 'vue-router';
Vue.use(VueRouter);

import VueResource from 'vue-resource';
Vue.use(VueResource);

import Vuetify from 'vuetify';
Vue.use(Vuetify);

import Vuex from 'vuex';
Vue.use(Vuex);

const routes = [
  {
    path: "/",
    name: "home",
    component: Home
  },
  {
    path: "/venues/create",
    name: "createVenue",
    component: CreateVenue
  },
  {
    path: "/venues/edit/:id",
    name: "editVenue",
    component: EditVenue
  },
  {
    path: "/venues/review/:id",
    name: "createReview",
    component: CreateReview
  },
  {
    path: "/venues/:id",
    name: "venue",
    component: SingleVenue
  },
  {
    path: "/venues",
    name: "venues",
    component: Venues
  },
  {
    path: "/users/edit/:id",
    name: "editUser",
    component: EditUser
  },
  {
    path: "/users/:id",
    name: "user",
    component: User
  },
  {
    path: "/users/signup",
    name: "SignUp",
    component: SignUp
  },
  {
    path: "/users/login",
    name: "login",
    component: LogIn
  },


];

const router = new VueRouter({
  routes: routes,
  mode: 'history'
});

new Vue({
  el: '#app',
  router: router,
  render: h => h(App)
});
console.log(localStorage)
