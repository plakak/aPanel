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


</style>

<template>
    <div>

        <div class="panel panel-default box-shadow">
            <div class="panel-body color-bar-pages">
                <!--<div v-for="image in mediaData | orderBy 'uploaded' -1">-->
                    <!--<media-file-->
                          <!--:external-data="image"-->
                    <!--&gt;-->
                    <!--</media-file>-->
                <!--</div>-->

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
                                            isSaved: true,
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
            submitHandeler(file){
                var formData = new FormData();
                formData.append('media', file[0]);
                formData.append('category', 'one, two');

                axios.post('/aPanel/tasks/media/add', formData)
                        .then(resp => console.log(resp))
                        .catch(err => console.log(err));
            }


        }
    }
</script>