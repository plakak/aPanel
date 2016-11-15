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

    .button-on {
        background-color: #71c271;
    }

</style>

<template>
    <div>
        <nav class="navbar navbar-primary">
            <div class="container">
                <div class="navbar-header">
                    <router-link class="navbar-brand" to="/home">aPanel</router-link>
                </div>
                <ul class="nav navbar-nav navbar-right">
                    <li><a @click='killSite()'>Site Management</a></li>
                    <li><router-link to="/users">Users Management</router-link></li>
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
                                <li><router-link to="/pages"> Pages</router-link></li>

                                <li><router-link to="/posts"> Posts</router-link></li>

                                <li><router-link to="/media">Media</router-link></li>
                                </ul>

                        </div>
                    </div>
                </div>

                <div class="col-sm-9">
                    <div class="panel panel-default box-shadow" v-if="!siteActive && !dismissed">
                        <div class="panel-body color-bar-error">
                            <span class="close glyphicon glyphicon-remove" @click="hideWarning()"></span>
                            <button class="btn btn-block btn-success button-on" @click="activateSite()">"Turn site on"</button>
                        </div>
                    </div>
                    <router-view></router-view>
                </div>
            </div>
            <div class="row">
                <div class="col-sm-12">
                    <div class="col-sm-12 text-center footer">
                        <ul class="list-inline">
                            <li><router-link to="/help">Help</router-link></li>
                            <li><router-link to="/contact">Contact</router-link></li>
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
        created() {
            axios.get('/aPanel/tasks/siteStatus/')
                    .then(response => {
                        this.siteActive = response.data.siteActive;
                        this.offlineDescription = response.offlineDescription || "We'll be back soon!";
                        this.siteName = response.siteName;
                    });
        },
        methods: {
            hideWarning() {
                this.dismissed = true;
            },
            activateSite(){
                axios.post('/aPanel/tasks/siteStatus/', {siteActive: !this.siteActive})
                    .then(response =>  this.siteActive = !this.siteActive)
                    .catch(err => console.log(err));
            },
            //for testing
            killSite(){
                axios.post('/aPanel/tasks/siteStatus/', {siteActive: !this.siteActive})
                        .then(response =>  this.siteActive = !this.siteActive)
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
