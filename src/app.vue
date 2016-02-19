<style lang="scss">

    @import 'style/_styles.scss';
    @lost flexbox flex;

   .navbar {
       margin: 20px auto 40px;
    }

   .navbar-brand {
        font-size: 3em;
   }

    .footer{
        border-top: 1px solid $btn-default-border;
        padding-top: 20px;
        margin-top: 20px;
    }

    .color-bar-error{
        position: relative;

        & .close {
            position: absolute;
            top: 5px;
            right: 10px;
        }
    }

</style>

<template>
    <div>
        <nav class="navbar navbar-primary">
            <div class="container">
                <div class="navbar-header">
                    <a class="navbar-brand" v-link="'/home'">aPanel</a>
                </div>
                <ul class="nav navbar-nav navbar-right">
                    <li><a v-link="'/site'" @click='killSite()'>Site Management</a></li>
                    <li><a v-link="'/users'">Users Management</a></li>
                    <li><a href="/aPanel/logout">Logout</a></li>
                </ul>
            </div>
        </nav>
        <div class="container">
            <div class="row">
                <div class="col-sm-3">
                    <div class="panel panel-default box-shadow">
                        <div class="panel-body color-bar-info">
                            <div class="">
                                <h5>Hello, {{ loggedIn }}</h5>

                                <p class="annotation">Last looged in: {{lastLogin}}</p>
                            </div>
                        </div>
                    </div>
                    <div class="panel panel-default box-shadow">
                        <div class="panel-body color-bar-nav">
                            <ul class="nav nav-pills nav-stacked">
                                <li><a v-link="'/pages'"> Pages </a></li>

                                <li><a v-link="'/posts'"> Posts </a></li>

                                <li><a v-link="'/media'">Media</a></li>
                                </ul>

                        </div>
                    </div>
                </div>

                <div class="col-sm-9">
                    <div class="panel panel-default box-shadow" v-if="!siteActive && !dismissed">
                        <div class="panel-body color-bar-error">
                            <span class="close glyphicon glyphicon-remove" @click="hideWarning()"></span>
                            <button class="btn btn-block btn-success" @click="activateSite()">"Turn site on"</button>
                        </div>
                    </div>
                    <router-view></router-view>
                </div>
            </div>
            <div class="row">
                <div class="col-sm-12">
                    <div class="col-sm-12 text-center footer">
                        <ul class="list-inline">
                            <li><a v-link="'/help'">Help</a></li>
                            <li><a v-link="'/contact'">Contact</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script type="text/babel">

    import moment from 'moment';
    import axios from 'axios';

    export default {

        data() {
            return {
                siteActive: true,
                offlineDescription: '',
                siteName: '',
                dismissed: false,
                loggedIn: isLoggedIn.username
            }
        },
        beforeCompile() {
            axios.get('/aPanel/tasks/getData/siteStatus/')
                    .then(response => {
                        this.$set('siteActive',response.data.siteActive);
                        this.$set('offlineDescription', response.offlineDescription || "We'll be back soon!");
                        this.$set('siteName', response.siteName);
                    });
        },
        methods: {
            hideWarning() {
                this.$set('dismissed', true);
                console.log(this.dismissed);
            },
            activateSite(){
                axios.post('/aPanel/tasks/getData/siteStatus/', {siteActive: !this.siteActive})
                    .then(response =>  this.$set('siteActive', !this.siteActive))
                    .catch(err => console.log(err));
            },
            //for testing
            killSite(){
                axios.post('/aPanel/tasks/getData/siteStatus/', {siteActive: !this.siteActive})
                        .then(response =>  this.$set('siteActive', !this.siteActive))
                        .catch(err => console.log(err));
            }
        },
        computed: {
            lastLogin() {
                if (isLoggedIn.lastLogin) {
                    return moment(isLoggedIn.lastLogin).format('DD-MMM-YYYY HH:mm');
                } else {
                    return "It's your first time!"
                }
            }
        }
    }
</script>