import Vue from 'vue';
import App from './App.vue';
import Home from './Home.vue';
import Users from './Users.vue';
import VenueSingle from './VenueSingle.vue';
import createVenue from './createVenue.vue';
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';
import Venue from "./Venue";
import Reviews from "./Reviews";
import VueCookie from 'vue-cookie';

Vue.use(VueResource);
Vue.http.options.emulateJSON = true;

Vue.use(VueCookie);
Vue.use(VueRouter);

Vue.component('modal', {
  template: '#modal-template'
});

const routes = [
  {
    path: "/",
    component: Home
  },
  {
    path :  "/users/:userId",
    name :  "user",
    component :  Users
  },
  {
    path: "/venues",
    component: Venue
  },
  {
    path: "/newVenue",
    component: createVenue
  },
  {
    path :  "/venues/:venueId",
    name :  "venue",
    component :  VenueSingle
  },
  {
    path :  "/venues/:venueId/reviews",
    name :  "reviews",
    component :  Reviews
  }
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
