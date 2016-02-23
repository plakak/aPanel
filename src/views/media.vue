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
    .categories {
        flex: 1;
        flex-basis: 100%;

        ul {
            background-color: rgba(220,220,220, 0.2);
            display: flex;
            align-items: center;
            justify-content: space-between;
            list-style: none;
            padding: 1em;
            margin-top: 1em;
            flex-wrap: wrap;
        }
        li {
            background-color: slategray;
            color: white;
            padding: 5px 10px;
            margin-bottom: 5px;
            margin-right: 2px;
            border-radius: 4px;
            cursor: pointer;
        }
        .active {
            background-color: green;
        }
    }

    .cat-list {
        display: flex;
        flex: 5;
        flex-wrap: wrap;
        justify-content: flex-start;
    }

    .categories-controls {
        display: flex;
        flex-direction: column;
        justify-content: center;
        margin-left: 20px;
        align-self: stretch;
        i {
            padding-bottom: 10px;
            align-self: flex-end;
        }
    }


</style>

<template>
    <div class="panel panel-default box-shadow">
        <div class="panel-body color-bar-pages">
            <div class="categories">
                <ul>
                    <div class="cat-list">
                    <li @click="selectedCategory = ''" :class="{'active': !selectedCategory}">All</li>
                    <li v-for="category in categories" :class="{'active': category === selectedCategory}">
                        <span @click="selectedCategory = category">{{ category }}</span>
                    </li>
                    </div>
                    <div class="categories-controls">
                    <i class="glyphicon glyphicon-plus button" @click="modalAddCategory = !modalAddCategory"></i>
                        <i class="glyphicon glyphicon-trash button" @click="deleteCategory"></i>
                    </div>
                </ul>

            </div>
                <media-files
                    :external-data="mediaData"
                    :selected-category="selectedCategory"
                    :post-data="postData"
                    :delete-item="_deleteItem"
                ></media-files>
            <div class="space"></div>
                <upload-file
                        :submit-handeler="submitHandeler"
                >
                </upload-file>

                <div class="main-controls">

                </div>
            </div>
        </div>


    <!-- MODALS -->


        <modal :show.sync="deleteModal.modalIsOpen" effect="fade" :width="400">
            <div slot="modal-header">
                <h4 class="modal-title">
                    <strong>Delete confirmation</strong>
                </h4>
            </div>
            <div class="modal-body" slot="modal-body">Are you sure you want to delete {{ deleteModal.items }}</div>
            <div class="modal-footer" slot="modal-footer">
                <button type="button" class="btn btn-default" @click="removePageConfirmation(false)">Back</button>
                <button type="button" class="btn btn-danger" @click="removePageConfirmation(true)">Delete</button>
            </div>
        </modal>
    <modal :show.sync="modalAddCategory" effect="fade" :width="400">
        <div slot="modal-header">
            <h4 class="modal-title">
                <strong>Add new category</strong>
            </h4>
        </div>
        <div class="modal-body" slot="modal-body"><input v-model="newCategory"></div>
        <div class="modal-footer" slot="modal-footer">
            <button type="button" class="btn btn-default" @click="modalAddCategory = !modalAddCategory">Back</button>
            <button type="button" class="btn btn-success" @click="addCategory(newCategory)">Add</button>
        </div>
    </modal>

    <!-- ENDMODALS -->

    </div>
</template>

<script type="text/babel">

    import axios from 'axios';
    import { modal } from 'vue-strap';
    import moment from 'moment'

    import mediaFiles from '../components/mediaFiles.vue'
    import uploadFile from '../components/uploadFile.vue'

    export default {
        route: {
            data(transition) {
                const promises = [
                    axios.get('/getData/media')
                        .then(response => {
                            return response.data.map(e => {
                                return Object.assign({}, e,
                                        {
                                            isDetails: false,
                                            isSelected: false,
                                            isEdited: false
                                        });
                            });
                        }),
                    axios.get('/aPanel/tasks/siteStatus')
                        .then(response => {
                            return response.data.categories
                        }),
                    axios.get('/getData/posts')
                            .then(response => {
                                return response.data
                            })
                ];

                Promise.all(promises).then(response => {
                    transition.next({
                        mediaData: response[0],
                        categories: response[1],
                        postData: response[2]
                    });
                });
            },
            waitForData: true
        },
        components: {
            mediaFiles,
            uploadFile,
            modal
        },
        data() {
            return {
                deleteModal: {
                    modalIsOpen: false,
                    items: '',
                    toRemove: []
                },
                modalAddCategory: false,
                mediaData: [],
                categories: [],
                postData: [],
                selectedCategory: ''
            }
        },
        methods: {
            addCategory(name) {
                axios.post('/aPanel/tasks/media/addCategory', {category: name})
                    .then(response => {
                        this.$set('modalAddCategory', false);
                        this.$set('categories', response.data.categories);
                    })
                    .catch(err => console.log(err));

            },
            deleteCategory() {
                let category = this.selectedCategory;
                let promises = [];

                if (category) {
                    this.mediaData.forEach(image => {
                        if (image.category) {
                            if (image.category.indexOf(category) !== -1) {
                                let index = image.category.indexOf(category);
                                let tmpItems = [...image.category.slice(0, index), ...image.category.slice(index + 1)];
                                promises.push(
                                        axios.post('/aPanel/tasks/media/edit', {id: image._id, category: tmpItems})
                                                .catch(err => console.log(err, 'error'))
                                )
                            }
                        }
                    });

                    promises.push(axios.post('/aPanel/tasks/media/removeCategory', {category: category})
                            .then(() => this.categories.$remove(category))
                            .catch(err => console.log(err, 'error')));

                    Promise.all(promises)
                            .catch(err => console.log(err));
                }
            },
            //todo: edit categories and edit media in general (+ adding categories before uploading)

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

                let promises = [];

                this.postData.forEach((next, idx, arr) => {
                    if (next.attachedImages > 0) {

                        next.attachedImages.forEach(e => {
                            if (e._id === item._id) {
                                if(confirm(`This image is used in a ${next.title} post.
                                    Are you sure you want to delete it?`)) {
                                    let index = next.attachedImages.indexOf(e);
                                    let tmpItems = [...next.attachedImages.slice(0, index), ...next.attachedImages.slice(index + 1)];

                                    promises.push(
                                        axios.post('/aPanel/tasks/posts/edit', {attachedImages: tmpItems})
                                            .catch(err => console.log(err, 'error')),
                                        axios.post('/aPanel/tasks/media/remove', {id: item._id})
                                                .then(() => this.mediaData.$remove(item))
                                                .catch(err => console.log(err, 'error'))
                                    )
                                }
                            } else {
                                promises.push(
                                    axios.post('/aPanel/tasks/media/remove', {id: item._id})
                                        .then(() => this.mediaData.$remove(item))
                                        .catch(err => console.log(err, 'error')));
                            }
                        });
                    } else {
                        if (idx === arr.length -1) {
                            promises.push(
                                axios.post('/aPanel/tasks/media/remove', {id: item._id})
                                    .then(() => this.mediaData.$remove(item))
                                    .catch(err => console.log(err, 'error')));
                        }
                    }
                });

                Promise.all(promises)
                    .catch(err => console.log(err));

            }
        }
    }
</script>