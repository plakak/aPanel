<style lang="scss" xmlns:v-on="http://www.w3.org/1999/xhtml" xmlns:v-on="http://www.w3.org/1999/xhtml"
       xmlns:v-on="http://www.w3.org/1999/xhtml">

    .home-content {
        display: flex;
        flex-direction: column;

    }

    .space {
        margin-top: 2em;
    }

    .page_space {
        margin: .5em 0;
    }

    .title {
        display: flex;
        flex-direction: row;

        p {
            margin-top: auto;
            padding-left: 1em;
        }
    }

    .main-controls {
        display: flex;
        height: 2em;
        margin-left: auto;
        align-items: center;
        justify-content: flex-end;

        .button {
            padding: 20px;
        }
    }

    .modal-title, .modal-body, .modal-footer {
        padding: 20px;
    }

    .lower-opacity {
        opacity: 0.7;
        color: gray;
    }

    img {
        max-width: 100%;
    }

    .image-container{
        display: flex;
        flex-wrap: wrap;
        align-items: flex-start;
        justify-content: center;
        /*lost-center: 100%;*/
        /*height: 100%;*/
        /*lost-utility: edit;*/
    }

    .item {
        display: flex;
        position: relative;
        flex-direction: column;
        border-radius: 4px;
        flex-basis: calc(100% / 3 - 15px);
        margin: 5px;
        padding: 5px;
        align-items: center;
        justify-content: center;
        background-color: #00b3ee;
    }

    .remove-button {
        position: absolute;
        top: -10px;
        right: -5px;
        cursor: pointer;
        font-weight: 700;
        font-size: 1.3em;
    }

    .image{
        flex: 2;
        display: flex;
        align-items: center;
        vertical-align: bottom;

    }

    .description {
        flex: 1;
        background-color: lighten(#00b3ee,20%);
        display: flex;
        word-break: break-all;
        align-self: stretch;
        justify-content: center;
        align-items: center;
        text-align: center;
        padding: 10px;
    }


    .scroll-container {
        padding: 20px;
        height: 35em;
        overflow-y: scroll;
    }


</style>

<template>
    <div>

        <div class="panel panel-default box-shadow">
            <div class="panel-body color-bar-pages">
                <div class="scroll-container">
                    <div class="image-container">
                        <div class="item" v-for="image in mediaData | orderBy 'uploaded' -1">
                            <span class="remove-button" @click="_deleteItem(image)">X</span>
                            <div class="image">
                                <img :src="image.relativePath"/>
                            </div>
                            <div class="description">
                                {{ image.originalname }}
                            </div>
                          <div v-if="image.category.indexOf('posts') !== -1">
                              Warning, used in posts.
                          </div>
                        </div>
                    </div>
                </div>
                <upload-file
                        :submit-handeler="submitHandeler"
                >
                </upload-file>


                <div class="main-controls">


                    <!--<i class="glyphicon glyphicon-plus button" @click="addNewPage"></i>-->
                    <!--<i class="glyphicon glyphicon-duplicate button" @click="selectAll"></i>-->
                    <!--<i class="glyphicon glyphicon-cog button lower-opacity"></i>-->


                </div>
            </div>
        </div>
        <modal :show.sync="modal.modalIsOpen" effect="fade" :width="400">
            <div slot="modal-header">
                <h4 class="modal-title">
                    <strong>Delete confirmation</strong>
                </h4>
            </div>
            <div class="modal-body" slot="modal-body">Are you sure you want to delete {{ modal.items }}</div>
            <div class="modal-footer" slot="modal-footer">
                <button type="button" class="btn btn-default" @click="removePageConfirmation(false)">Back</button>
                <button type="button" class="btn btn-danger" @click="removePageConfirmation(true)">Delete</button>
            </div>

        </modal>
    </div>
</template>

<script type="text/babel">

    import axios from 'axios';
    import { modal } from 'vue-strap';
    import moment from 'moment'

    import mediaFile from '../components/mediaFile.vue'
    import uploadFile from '../components/uploadFile.vue'

    export default {
        route: {
            data(transition) {
                axios.get('/getData/media')
                        .then(response => {
                            let mediaData = response.data.map(e => {
                                return Object.assign({}, e,
                                        {
                                            isDetails: false,
                                            isSelected: false,
                                            isEdited: false
                                        });
                            });
                            transition.next({
                                mediaData
                            });
                        });
            },
            waitForData: true
        },
        data() {
            return {
                modal: {
                    modalIsOpen: false,
                    items: '',
                    toRemove: []
                },
                mediaData: []
            }
        },
        components: {
            mediaFile,
            uploadFile,
            modal
        },
        methods: {
            submitHandeler(files){
                var formData = new FormData();

                for (let file in files){
                    if (files.hasOwnProperty(file)) {
                        formData.append('media', files[file]);
                    }
                }

                axios.post('/aPanel/tasks/media/add', formData)
                    .then((resp) => {

                        let newEntries = resp.data.map(item => {
                            return Object.assign({}, item, {
                                isDetails: false,
                                isSelected: false,
                                isEdited: false
                            });
                        });

                        this.mediaData = this.mediaData = [
                            ...newEntries,
                            ...this.mediaData
                        ];

                        this.$broadcast('fileSent', true)
                    })
                    .catch(() => this.$broadcast('fileSent', false));
            },
            _deleteItem(item){
                // todo: remove reference from posts that were attaching this image
                axios.post('/aPanel/tasks/media/remove', {id: item._id})
                        .then(() => this.mediaData.$remove(item))
                        .catch(err => console.log(err, 'error'));
            }
        }
    }
</script>