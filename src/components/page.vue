<style lang="scss">

    $border-color: darken(#efefef, 30%);
    $backgrnd-color: rgba(220,220,220, 0.2);

    .page_container {
        position: relative;
        min-height: 50px;
        background-color: $backgrnd-color;
        border: 1px solid $border-color;
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;

        &--closed {
             overflow: hidden;
             height: 50px;
             transition: all .3s ease-out;
        }

        &--open {
             height: 300px;
             transition: height .3s ease-out;
             overflow: auto;
             overflow-y: hidden;
         }
    }

    .page_heading {
        min-height: 50px;
        max-height: 50px;
        display: flex;
        flex-wrap: wrap;
        transition: height 1s linear;

        &--selected {
            background-color: rgba(#71aac2, 0.4);

        }

    }

    .indicator {
        width: 20px;
    }

    .content {
        margin: auto 0;
        flex: 5;
        padding-left: 1em;
        font-size: 1.2em;
    }

    .buttons {
        flex: 1;
        display: flex;
        justify-content: space-around;
        align-items: center;
    }

    .details {
        border-top: 1px solid #d5703a;
        border-bottom: 1px solid #d5703a;
        border-radius: 4px;
        display: flex;
        flex-basis: 100%;
        font-size: 4em;
        padding: 1rem;
        margin: 1rem;
        background-color: darken($backgrnd-color, 10%);
    }

    .click-container{
        position: absolute;
        width: 85%;
        height: 50px;
        top: 0;
        left: 0;

        &:hover {
            width: 100%;
            background-color: rgba(#71aac2, 0.2);
        }
    }


</style>

<template>

        <div class="page_container" :class="details">
            <div class="click-container"  @click="pageData.isSelected = !pageData.isSelected"></div>
            <div class="page_heading" :class="{'page_heading--selected': pageData.isSelected}">
                <span class="indicator" :style="activeColor"> </span>
                <div class="content">This is site name</div>
                <span class="buttons">
                    <i class="glyphicon" :class="activeIcon" @click='isActive = !isActive'></i>
                    <i class="glyphicon glyphicon-cog" @click='showDetails'></i>
                    <i class="glyphicon glyphicon-trash" @click='removePage'></i>
                </span>
            </div>
            <div class="details">
            </div>
        </div>


</template>

<script type="text/babel">


    export default {
        props: ['pageData', 'showDetails', 'removePage'],
        data() {
            return {
                isActive: false
            }
        },
        ready(){
        },
        computed: {
            activeColor() {
                return this.isActive ? {backgroundColor: '#71c271'} : {backgroundColor: '#d5706b'};
            },
            activeIcon() {
              return {
                  'glyphicon-eye-open': !this.isActive,
                  'glyphicon-eye-close': this.isActive
              }
            },
            details() {
                return {
                    'page_container--closed': !this.pageData.isDetails,
                    'page_container--open': this.pageData.isDetails
                }
            }

        },
        methods: {

        }

    }
</script>