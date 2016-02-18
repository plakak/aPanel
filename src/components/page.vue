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
             height: 500px;
             transition: height .3s ease-out;
             overflow: auto;
             overflow-y: hidden;
         }
    }

    .page_heading {
        min-height: 50px;
        max-height: 50px;
        padding-right: 20px;
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
        flex: 6;
        padding-left: 1em;
        font-size: 1.2em;
    }

    .buttons {
        flex: 2;
        display: flex;
        position: relative;
        justify-content: space-around;
        align-items: center;
    }

    .details {
        border-radius: 4px;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        flex-basis: 100%;
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

    textarea {
        min-height: 200px;
        max-width: 100%;
        max-height: 200px;
    }

    input {
        min-height: 50px;
        min-width: 90%;
    }

    .info {
        align-self: flex-end;
    }

    .save-alert {
        color: #d72822;
        font-weight: 700;
    }

    .lower-opacity {
        opacity: 0.7;
        color: gray;
    }

    .hide {
        opacity: 0;
    }


</style>

<template>

        <div class="page_container" :class="details">
            <div class="click-container"  @click="pageData.isSelected = !pageData.isSelected"></div>
            <div class="page_heading" :class="{'page_heading--selected': pageData.isSelected}">
                <span class="indicator" :style="activeColor"> </span>
                <div class="content">{{pageData.title}}</div>
                <span class="buttons">
                    <i class="glyphicon glyphicon glyphicon-ok save-button" :class="savedClass" @click='saveEdits'></i>
                    <i class="glyphicon glyphicon glyphicon-remove cancel-button" :class="savedClass" @click='undoEdits'></i>
                    <i class="glyphicon" :class="activeIcon" @click='changeVisibility'></i>
                    <i class="glyphicon glyphicon-cog" @click='showDetails'></i>
                    <i class="glyphicon glyphicon-trash" @click='removePage'></i>
                </span>
            </div>
            <div class="details">
                <span class="save-alert" v-show="!pageData.isSaved">Warning - this site is not saved!</span>
                <div class="info">
                    <p>Addend on {{ pageData.datePublished }}</p>
                    <p>Addend by</p>
                </div>
                <label for="title">Title</label>
                <input type="text" name="title" id="title" v-model=pageData.title />
                <label for="content">Content</label>
                <textarea name="content" id="content" v-model="pageData.content"></textarea>
            </div>
        </div>


</template>

<script type="text/babel">


    export default {
        props: ['pageData', 'showDetails', 'removePage', 'changeVisibility', 'saveEdits'],
        data() {
            return {
            }
        },
        computed: {
            activeColor() {
                return this.pageData.isActive ? {backgroundColor: '#71c271'} : {backgroundColor: '#d5706b'};
            },
            activeIcon() {
              return {
                  'glyphicon-eye-open': !this.pageData.isActive,
                  'glyphicon-eye-close': this.pageData.isActive,
                  'lower-opacity': !this.pageData.isSaved

              }
            },
            details() {
                return {
                    'page_container--closed': !this.pageData.isDetails,
                    'page_container--open': this.pageData.isDetails
                }
            },
            savedClass(){
                return {
                    'hide': this.pageData.isSaved
                }
            }
        }
    }
</script>