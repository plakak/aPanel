<style lang="scss">

    $border-color: darken(#efefef, 30%);
    $backgrnd-color: rgba(220,220,220, 0.2);

    .page_container {
        position: relative;
        min-height: 50px;
        background-color: $backgrnd-color;
        border: 1px solid rgba($border-color,.5);
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
        flex: 1;
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
        box-shadow: 1px 1px 30px rgba(0,0,0,.2);
        border: 1px solid rgba(0,0,0,.2);
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

    .info {
        display: flex;
        flex-direction: column;
        align-self: flex-end;
        align-items: flex-end;
    }

    .save-alert {
        position: absolute;
        color: #d72822;
        font-weight: 700;
    }

    .lower-opacity {
        opacity: 0.7;
        color: gray;
    }

    .cancel-button {
        color: #d72822;
        position: absolute;
        left: -25px;
        top: calc(100% - 32px)
    }

    .save-button {
        color: #71c271;
        position: absolute;
        left: -60px;
        top: calc(100% - 32px)
    }

</style>

<template>
        <div class="page_container" :class="details">
            <div class="click-container"  @click="showDetails"></div>
            <div class="page_heading" :class="{'page_heading--selected': externalData.isSelected}">
                <span class="indicator" :style="activeColor"> </span>

                <div class="content">{{title}}</div>

                <span class="buttons">
                    <i class="glyphicon glyphicon glyphicon-ok save-button"
                       @click='saveEdits'
                       v-show="!externalData.isSaved || externalData.isEdited">
                    </i>
                    <i class="glyphicon glyphicon glyphicon-remove cancel-button"
                       @click='undoEdits'
                       v-show="!externalData.isSaved || externalData.isEdited">
                    </i>
                    <i class="glyphicon glyphicon-check"
                       @click='externalData.isSelected = !externalData.isSelected'>
                    </i>
                    <i class="glyphicon"
                       :class="activeIcon"
                       @click='changeVisibility'>
                    </i>
                    <i class="glyphicon glyphicon-trash"
                       @click='removePage'>
                    </i>
                </span>
            </div>

            <div class="details">
                <span class="save-alert" v-show="!externalData.isSaved || externalData.isEdited">
                    Warning - this site is not saved!
                </span>

                <div class="info">
                    <p>Last edit on {{ formattedEditDate }}</p>
                    <p>Added by {{ externalData.by }}</p>
                </div>

                <label for="title">Title</label>
                <input :class="formIndicatorsTitle" type="text" name="title" id="title" v-model="title" />
                <label for="content">Content</label>
                <textarea :class="formIndicatorsContent" name="content" id="content" v-model="content"></textarea>

            </div>
        </div>


</template>

<script type="text/babel">

    import moment from 'moment'

    export default {
        props: ['externalData', 'showDetails', 'removePage', 'changeVisibility', 'saveData'],

        data() {
            return {
                title: '',
                content: ''
            }
        },
        compiled(){
            this.$set('title', this.externalData.title);
            this.$set('content', this.externalData.content);
        },
        computed: {
            activeColor() {
                return this.externalData.isActive ? {backgroundColor: '#71c271'} : {backgroundColor: '#d5706b'};
            },
            activeIcon() {
              return {
                  'glyphicon-eye-open': !this.externalData.isActive,
                  'glyphicon-eye-close': this.externalData.isActive,
                  'lower-opacity': !this.externalData.isSaved

              }
            },
            details() {
                return {
                    'page_container--closed': !this.externalData.isDetails,
                    'page_container--open': this.externalData.isDetails
                }
            },
            formIndicatorsTitle(){
                  return {
                      'form-inputs': true,
                      'form-inputs--untouched': this.title === this.externalData.title && this.externalData.isSaved,
                      'form-inputs--unsaved': this.title !== this.externalData.title
                  }
            },
            formIndicatorsContent(){
                return {
                    'form-inputs': true,
                    'form-inputs--untouched':  this.content === this.externalData.content && this.externalData.isSaved,
                    'form-inputs--unsaved': this.content !== this.externalData.content
                }
            },
            formattedEditDate(){
                return moment(this.externalData.dateEdited).format('DD-MMM-YYYY HH:mm')
            }
        },
        methods: {
            undoEdits(){
                this.$set('title', this.externalData.title);
                this.$set('content', this.externalData.content);
            },
            saveEdits() {
                this.saveData({title: this.title, content: this.content})
            }
        },
        watch: {
            'title'() {
                if (this.content !== this.externalData.content || this.title !== this.externalData.title) {
                    this.$set('externalData.isEdited', true);
                } else {
                    this.$set('externalData.isEdited', false);
                }
            },
            'content'() {
                if (this.content !== this.externalData.content || this.title !== this.externalData.title) {
                    this.$set('externalData.isEdited', true);
                } else {
                    this.$set('externalData.isEdited', false);
                }
            }
        }
    }
</script>