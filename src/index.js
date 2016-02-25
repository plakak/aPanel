import Vue from 'vue';
import App from './app.vue';
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';
import axios from 'axios';

import Pages from './views/pages.vue';
import Posts from './views/posts.vue';
import Media from './views/media.vue';

import dropbox from './directives/file-dropbox';
import dbClickHandler from './directives/click-handler';


Vue.use(VueResource);
Vue.use(VueRouter);

export var router = new VueRouter();


axios.get('/aPanel/tasks/siteStatus')
    .then(resp => {

        Vue.config.debug = true;

        router.map({
            '/pages': {
                component: Pages
            },
            '/posts': {
                component: Posts
            },
            '/media': {
                component: Media
            }
        });

        router.redirect({
            '*': `/${resp.data.initView}`
        });

        router.beforeEach(function (transition) {
            axios.get('/aPanel/sessionCheck').then(response => {
                if (!response.data.auth) {
                    window.location.href = '/aPanel/expired';
                } else transition.next()
            });
        });

        router.start(App, '#app');

    })
    .catch(err => console.log(err));

