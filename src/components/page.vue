<style lang="scss">

    $border-color: darken(#efefef, 30%);
    $backgrnd-color: rgba(220,220,220, 0.2);

    .page_container {
        position: relative;
        min-height: 50px;
        max-height: 50px;
        background-color: $backgrnd-color;
        border: 1px solid rgba($border-color,.5);
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;

        &--closed {
             overflow: hidden;
             max-height: 50px;
             transition: all .3s ease-out;
        }

        &--open {
             max-height: 650px;
             transition: max-height .3s ease-out;
             overflow: auto;
             overflow-y: hidden;
         }
        &--open--images {
             max-height: 2000px;
             transition: max-height .3s ease-out;
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
        margin-top: 0;
        padding-bottom: 2rem;
    }

    .click-container{
        position: absolute;
        width: 85%;
        height: 50px;
        top: 0;
        left: 0;
        /*z-index: 2;*/
        backgorund-color: transparent;

        &:hover {
            width: 100%;
            background-color: rgba(#71aac2, 0.2);
        }
    }

    .info {
        display: flex;
        justify-content: space-around;

    /*flex-direction: column;*/

        p {
           font-style: italic;
           font-weight: 400;
           font-size: 1.1em;
           margin-bottom: 2em;
        }
    }

    .save-alert {
        position: absolute;
        top: 4.9em;
        font-size: 1.25em;
        width: 100%;
        text-align: center;
        left: 0;
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

    .page-label {
        text-transform: uppercase;
        text-align: center;
        font-weight: 700;
        margin-bottom: 0.9em;
        font-size: 1.5em;
    }

    .full-width {
        min-width: 100%;
    }

    .post-image-preview {
        display: flex;
        justify-content: center;
        padding: 10px 10px 20px;
    img {
        padding: 3px;
    }
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
                       v-show="!externalData.isSaved || externalData.isEdited"
                       title="Save edits">
                    </i>
                    <i class="glyphicon glyphicon glyphicon-remove cancel-button"
                       @click='undoEdits'
                       v-show="!externalData.isSaved || externalData.isEdited"
                       title="Undo edits">
                    </i>
                    <i class="glyphicon glyphicon-check"
                       @click='externalData.isSelected = !externalData.isSelected'
                       title="Select field">
                    </i>
                    <i class="glyphicon"
                       :class="activeIcon"
                       @click='changeVisibility'
                       title="Change visibility">
                    </i>
                    <i class="glyphicon glyphicon-trash"
                       @click='removePage'
                       title="Remove">
                    </i>
                </span>
        </div>

        <div class="details">
                <span class="save-alert" v-show="!externalData.isSaved || externalData.isEdited">
                    Warning - this site is not saved!
                </span>

            <div class="info">
                <p>Published: {{ formattedPublishedDate }}</p>
                <p>Edit: {{ formattedEditDate }}</p>
                <p>Added by: {{ externalData.by }}</p>
            </div>

            <label class="page-label" for="title">Title</label>
            <input :class="formIndicatorsTitle" class="full-width" type="text" name="title" id="title" v-model="title" placeholder="Your title" />
            <label class="page-label" for="content">Content</label>
            <textarea :class="formIndicatorsContent" name="content" id="content" v-model="content" placeholder="Your content"></textarea>

            <div class="post-image-preview">
                <div v-for="image in externalData.attachedImages">
                    <img :src="image.relativePath">
                </div>
            </div>
            <i v-if="photo" class="glyphicon glyphicon-open-file open-upload-button" @click="postImageOpen = !postImageOpen"></i>

            <div v-if="postImageOpen">
                <media-files
                        :external-data="images"
                        :post-data="postData"
                        :warning="isWarning"
                ></media-files>
            </div>
        </div>
    </div>


</template>

<script type="text/babel">

    import moment from 'moment'

    import mediaFiles from './mediaFiles.vue'
    import postFiles from './postFiles.vue';

    export default {
        props: ['externalData', 'mediaData', 'showDetails', 'removePage', 'changeVisibility', 'saveData', 'photo', 'postData'],

        data() {
            return {
                title: '',
                content: '',
                initialImages: [],
                images: [],
                postImageOpen: false
            }
        },
        components: {
            postFiles,
            mediaFiles
        },
        compiled(){
            console.log(this.postData)
            this.$set('title', this.externalData.title);
            this.$set('content', this.externalData.content);
        },
        ready(){
            this.mainCheck();
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
                    'page_container--open': this.externalData.isDetails && !this.photo,
                    'page_container--open--images': this.externalData.isDetails && this.photo
                }
            },
            formIndicatorsTitle(){
                return {
                    'form-inputs': true,
                    'form-inputs--untouched': this.title === this.externalData.title && this.externalData.isSaved,
                    'form-inputs--unsaved': this.title !== this.externalData.title && this.externalData.isSaved ||
                    !this.externalData.isSaved && !this.title,
                    'form-inputs--valid': this.title && !this.externalData.isSaved
                }
            },
            formIndicatorsContent(){
                return {
                    'form-inputs': true,
                    'form-inputs--untouched': this.content === this.externalData.content && this.externalData.isSaved,
                    'form-inputs--unsaved': this.content !== this.externalData.content && this.externalData.isSaved ||
                    !this.externalData.isSaved && !this.content,
                    'form-inputs--valid': this.content  && !this.externalData.isSaved

                }
            },
            formattedEditDate(){
                return moment(this.externalData.dateEdited).format('DD-MMM-YYYY HH:mm');
            },
            formattedPublishedDate(){
                return moment(this.externalData.datePublished).format('DD-MMM-YYYY HH:mm');
            },
            imagesChanged() {
                return JSON.stringify(this.images) === JSON.stringify(this.initialImages);
            },
            isWarning() {
                return !this.imagesChanged;
            }
        },
        methods: {
            mainCheck() {
                if (this.mediaData) {

                    this.images = this.mediaData.map(e => Object.assign({}, e));

                    if (this.photo && this.externalData.attachedImages) {
                        this.images.forEach(image => {
                            if (this.externalData.attachedImages.find(e => e._id === image._id)) {
                                image.isSelected = true;
                            }
                        });
                        this.initialImages = this.images.map(e => Object.assign({}, e));
                    }

                }
            },
            undoEdits(){
                this.$set('title', this.externalData.title);
                this.$set('content', this.externalData.content);
            },
            saveEdits() {
                if (this.photo) {
                    let attachedImages = this.images.filter(e => e.isSelected).map(e => e._id);
                    this.saveData({title: this.title, content: this.content, attachedImages: attachedImages})
                } else {
                    this.saveData({title: this.title, content: this.content})
                }

            }
        },
        events: {
            'saved'(){
                this.mainCheck();

             }
        },
        watch: {
            'title'() {
                if (this.content !== this.externalData.content || this.title !== this.externalData.title || !this.imagesChanged) {
                    this.$set('externalData.isEdited', true);
                } else {
                    this.$set('externalData.isEdited', false);
                }
            },
            'content'() {
                if (this.content !== this.externalData.content || this.title !== this.externalData.title || !this.imagesChanged) {
                    this.$set('externalData.isEdited', true);
                } else {
                    this.$set('externalData.isEdited', false);
                }
            },
            'imagesChanged'(result){
                if (this.content !== this.externalData.content || this.title !== this.externalData.title || !result){
                    this.$set('externalData.isEdited', true);
                } else {
                    this.$set('externalData.isEdited', false);
                }
            }
        }
    }
</script>