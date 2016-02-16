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


</style>

<template>
    <div>

        <div class="panel panel-default box-shadow">
            <div class="panel-body color-bar-pages">
                <div v-for="page in data">
                    <page class="page_space"
                          :page-data="page"
                          :show-details="showDetails.bind(null, page)"
                          :remove-page="deleteHandler.bind(null,page)"
                    >
                    </page>
                </div>
                <div class="main-controls">


                    <i class="glyphicon glyphicon-plus button"></i>
                    <i class="glyphicon glyphicon-duplicate button" @click="selectAll"></i>


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
                <button type="button" class="btn btn-default" @click="removePage(false)">Back</button>
                <button type="button" class="btn btn-danger" @click="removePage(true)">Delete</button>
            </div>

        </modal>
    </div>
</template>

<script type="text/babel">

    import axios from 'axios';
    import { modal } from 'vue-strap';

    import page from '../components/page.vue'

    export default {
        data() {
            return {
                modal: {
                    modalIsOpen: false,
                    items: '',
                    toRemove: []
                },
                data: [
                    {id: 1, title: 'myTitle', isSelected: false, isDetails: false},
                    {id: 2, title: 'myTitle', isSelected: false, isDetails: false},
                    {id: 3, title: 'myTitle', isSelected: false, isDetails: false},
                    {id: 4, title: 'myTitle', isSelected: false, isDetails: false},
                    {id: 5, title: 'myTitle', isSelected: false, isDetails: false},
                    {id: 6, title: 'myTitle', isSelected: false, isDetails: false}
                ]
            }
        },
        components: {
            page,
            modal
        },
        methods: {
            showDetails(page){
                if (page.isSelected) {
                    this.data.forEach(item => {
                        if (item.isSelected) {
                            item.isDetails = !item.isDetails;
                            item.isSelected = false;
                        }
                    });
                } else {
                    page.isDetails = !page.isDetails;

                    this.data.forEach(item => {
                        item.isSelected = false;
                    });
                }
            },
            selectAll(){
                this.data.forEach(item => {
                    item.isSelected =  !item.isSelected;
                });
            },
            deleteHandler(page){
                let selected = this.data.filter(e => e.isSelected);

                if ( selected.length > 1){
                    this.$set('modal.items', `${selected.length} items?`);
                    this.$set('modal.modalIsOpen', !this.modal.modalIsOpen);
                    this.$set('modal.toRemove', selected);
                } else {
                    this.$set('modal.items', `${page.title}?`);
                    this.$set('modal.modalIsOpen', !this.modal.modalIsOpen);
                    this.$set('modal.toRemove', page);
                }

            },
            removePage(bool){
                if (!bool){
                    this.$set('modal.modalIsOpen', !this.modal.modalIsOpen);
                } else {
                    this.modal.toRemove.forEach(item => this.$remove(item));
                    this.$set('modal.modalIsOpen', !this.modal.modalIsOpen);
                }
            }
        }
    }
</script>