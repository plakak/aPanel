import Vue from 'vue';
import App from './app.vue';
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';
import axios from 'axios';

import Pages from './views/pages.vue';
import Posts from './views/posts.vue';
import Media from './views/media.vue';

import dropbox from './directives/file-dropbox';
// import dbClickHandler from './directives/click-handler';

const eventBus = new Vue();
Vue.prototype.$eventBus = eventBus;

Vue.use(VueResource);
Vue.use(VueRouter);


axios.get('/aPanel/tasks/siteStatus')
    .then(resp => {

        const router = new VueRouter({
            routes: [
                { path: '/', component: App,
                children: [
                    { path: 'pages', component: Pages },
                    { path: 'posts', component: Posts },
                    { path: 'media', component: Media },
                ]},
                { path: '*', redirect: `/${resp.data.initView}`}
            ]
        });

        router.beforeEach(function (route, redirect, next) {
            axios.get('/aPanel/sessionCheck').then(response => {
                if (!response.data.auth) {
                    window.location.href = '/aPanel/expired';
                } else next()
            });
        });


        new Vue({
            el: '#app',
            router: router,
            render: h => h('router-view')
        })

    })
    .catch(err => console.log(err));

