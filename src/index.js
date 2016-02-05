import Vue from 'vue';
import App from './app.vue';
import Home from './views/home.vue';
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';


Vue.use(VueResource);
Vue.use(VueRouter);

export var router = new VueRouter();

Vue.config.debug = true;

router.map({
    '/home': {
        component: Home
    }
    //},
    //'/help': {
    //    component: Help
    //},
    //'/contact': {
    //    component: Contact
    //}
});

router.redirect({
    '*': '/home'
});

router.start(App, '#app');
