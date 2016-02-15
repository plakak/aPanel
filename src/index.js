import Vue from 'vue';
import App from './app.vue';
import Pages from './views/pages.vue';
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';
import axios from 'axios';

Vue.use(VueResource);
Vue.use(VueRouter);

export var router = new VueRouter();

Vue.config.debug = true;

router.map({
    '/pages': {
        component: Pages
    }
    //'/posts': {
    //    component: Posts
    //}
    //'/contact': {
    //    component: Contact
    //}
});

router.redirect({
    '*': '/pages'
});

router.beforeEach(function (transition) {
    axios.get('/aPanel/sessionCheck').then(response => {
        if (!response.data.auth) {
            window.location.href = '/aPanel/expired';
        } else transition.next()
    });
});

router.start(App, '#app');
