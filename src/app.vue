<style lang="scss">

    @import 'style/_styles.scss';
    @lost flexbox flex;

    $brand-primary: darken(red, 6.5%) !default; // #337ab7

   .navbar {
       margin: 20px auto 40px;
    }

   .navbar-brand {
        font-size: 3em;
   }

    .footer{
        border-top: 1px solid $brand-primary;
        padding-top: 20px;
        margin-top: 20px;
    }

    .footer-logout {
        margin-top: 50px;
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
                    <li><a v-link="'/users'">Users Management</a></li>
                    <li><a href="/aPanel/logout">Logout</a></li>
                </ul>
            </div>
        </nav>
        <div class="container">
            <div class="row" style="margin-left: -30px">
                <div class="col-sm-12">
                    {{ loggedIn }}
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

    import axios from 'axios';

    export default {
        data() {
            return {
                loggedIn: isLoggedIn.username
            }
        },
        watch: {
            'loggedIn'(){
                if (!this.loggedIn){
                    window.location.href = "/aPanel/expired";
                }
            }
        }
    }
</script>