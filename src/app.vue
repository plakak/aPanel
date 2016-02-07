<style lang="scss">

    @import 'style/_styles.scss';
    @lost flexbox flex;

    .bg {
        background-color: $well-bg;
    }
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
            <div class="row">
                <div class="col-sm-3">
                    <div class="panel panel-default">
                        <div class="panel-body">
                            <h5>Hello, {{ loggedIn }}</h5>

                            <p>Last looged in: {{lastLogin}}</p>

                        </div>
                    </div>
                    <div class="panel panel-default">
                        <div class="panel-body">
                            <ul class="nav nav-pills nav-stacked">
                                <li><a v-link="'/posts'"> Pages </a></li>

                                <li><a href="#"> Posts </a></li>

                                <li><a href="#">Media</a></li>
                                </ul>

                        </div>
                    </div>
                </div>

                <div class="col-sm-9">
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


    export default {
        data() {
            return {
                loggedIn: isLoggedIn.username
            }
        },
        computed: {
            lastLogin() {
                return moment(isLoggedIn.lastLogin).format('DD-MMM-YYYY HH:mm');
            }
        }
    }
</script>