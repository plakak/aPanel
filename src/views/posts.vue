<style lang="scss">

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
            <div class="panel-body color-bar-posts">
                <div v-for="page in pageData | orderBy 'datePublished' -1">
                    <page class="page_space"
                          :external-data="page"
                          :show-details="showDetails.bind(null, page)"
                          :remove-page="deleteHandler.bind(null,page)"
                          :change-visibility="changeVisibility.bind(null, page)"
                          :save-data="saveData.bind(null, page)"
                          :photo="true"
                    >
                        <div v-else v-for="image in page.attachedImages">
                            <img :src="image.relativePath">
                        </div>
                    </page>
                </div>
                <div class="main-controls">
                    <i class="glyphicon glyphicon-plus button" @click="addNewPage"></i>
                    <i class="glyphicon glyphicon-duplicate button" @click="selectAll"></i>
                    <i class="glyphicon glyphicon-cog button lower-opacity"></i>
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

    import page from '../components/page.vue'
    import mediaFiles from '../components/mediaFiles.vue'

    export default {
        route: {
            data(transition) {

                const promises = [
                axios.get('/getData/posts')
                    .then(response => {
                        return response.data.map(e => {
                            return Object.assign({}, e,
                                {
                                    isDetails: false,
                                    isSelected: false,
                                    isSaved: true,
                                    isEdited: false
                                });
                        })
                    }),
                axios.get('/getData/media')
                        .then(response => {
                            return response.data.map(e => {
                            return Object.assign({}, e,
                                {
                                    isDetails: false,
                                    isSelected: false,
                                    isSaved: true,
                                    isEdited: false
                                });
                            })
                        })];
                Promise.all(promises).then(response => {

                        transition.next({
                            pageData: response[0],
                            mediaData: response[1]
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
                pageData: [],
                mediaData: []
            }
        },
        components: {
            page,
            modal,
            mediaFiles
        },

        methods: {
            addNewPage(){
                this.$set('pageData', [
                    ...this.pageData,

                    {
                        title: '',
                        isSelected: false,
                        isDetails: true,
                        isSaved: false,
                        isActive: false,
                        isEdited: false,
                        by: isLoggedIn.username
                    }

                ]);
            },

            saveData(page, data){
                if (!page.isSaved) {
                    axios.post('/aPanel/tasks/posts/add',
                            {
                                title: data.title,
                                content: data.content,
                                by: isLoggedIn.username
                            })

                            .then((resp) => {
                                page.isSaved = true;
                                page.isEdited = false;
                                page.title = resp.data.title;
                                page.content = resp.data.content;
                            })

                            .catch(err => console.log(err, 'error'));

                } else {
                    axios.post('/aPanel/tasks/posts/edit',
                            {
                                title: data.title,
                                content: data.content,
                                id: page._id
                            })

                            .then((resp) => {
                                page.isEdited = false;
                                page.title = resp.data.title;
                                page.content = resp.data.content;
                                page.dateEdited = moment.now();
                            })

                            .catch(err => console.log(err, 'error'));
                }
            },

            showDetails(page){
                if (page.isSelected) {
                    this.pageData.forEach(item => {
                        if (item.isSelected) {
                            item.isDetails = !item.isDetails;
                            item.isSelected = false;
                        }
                    });
                } else {
                    page.isDetails = !page.isDetails;

                    this.pageData.forEach(item => {
                        item.isSelected = false;
                    });
                }
            },

            selectAll(){
                this.pageData.forEach(item => {
                    item.isSelected = !item.isSelected;
                });
            },

            changeVisibility(page){
                if (page.isSaved) {
                    page.isActive = !page.isActive;
                    axios.post('/aPanel/tasks/posts/changeStatus', {id: page._id, isActive: page.isActive})
                            .catch(() => page.isActive = !page.isActive);
                }
            },

            deleteHandler(page){
                if (!page.isSaved) {
                    this.pageData.$remove(page);
                } else {
                    let selected = this.pageData.filter(e => e.isSelected);

                    if (selected.length > 1) {
                        this.$set('modal.items', `${selected.length} items?`);
                        this.$set('modal.modalIsOpen', !this.modal.modalIsOpen);
                        this.$set('modal.toRemove', selected);

                    } else {
                        this.$set('modal.items', `${page.title}?`);
                        this.$set('modal.modalIsOpen', !this.modal.modalIsOpen);
                        this.$set('modal.toRemove', [page]);
                    }
                }
            },
            removePageConfirmation(bool){
                if (!bool) {
                    this.$set('modal.modalIsOpen', !this.modal.modalIsOpen);
                    this.$set('modal.toRemove', []);
                } else {
                    this.modal.toRemove.forEach(item => this._deletePage(item));
                    this.$set('modal.modalIsOpen', !this.modal.modalIsOpen);
                }
            },

            _deletePage(page){
                axios.post('/aPanel/tasks/posts/remove', {id: page._id})
                        .then(() => this.pageData.$remove(page))
                        .catch(err => console.log(err, 'error'));
            }

        }

    }
</script>