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
    transition: all .4s linear;

    ul {
      background-color: rgba(220, 220, 220, 0.2);
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
      background-color: lighten(#553a5b, 5%);
      transition: all 0.4s linear;
    }
  }

  .cat-list {
    display: flex;
    flex: 5;
    flex-wrap: wrap;
    justify-content: flex-start;
    transition: all .4s linear;
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
  <div>
    <media-details
            v-if="showDetails"
            :selected-items="selected"
            :show-details="showDetails"
            :add-category="addCategory"
            :categories="categories"
    ></media-details>
    <div class="panel panel-default box-shadow">
      <div class="panel-body color-bar-media">
        <div class="categories">
          <ul>
            <div class="cat-list">
              <li @click="selectedCategory = ''" :class="{'active': !selectedCategory}">All</li>
              <li v-for="(category, index) in categories" v-bind:key="index"
                  :class="{'active': category === selectedCategory}">
                <span @click="selectedCategory = category">{{ category }}</span>
              </li>
            </div>
            <div class="categories-controls">
              <i class="glyphicon glyphicon-plus button"
                 @click="modalAddCategory = !modalAddCategory"></i>
              <i class="glyphicon glyphicon-trash button" @click="deleteCategory"></i>
            </div>
          </ul>
        </div>
        <media-files
                :external-data="mediaData"
                :selected-category="selectedCategory"
                :post-data="postData"
        ></media-files>

        <div class="main-controls" style="font-size: 1.5em">
          <i class="glyphicon glyphicon-duplicate button" @click="selectAll" title="Select all"></i>
          <i class="glyphicon glyphicon-option-horizontal button" @click="toggleDetails"
             title="Show details"></i>
          <i class="glyphicon glyphicon-trash button" @click="deleteHandeler" title="Delete selected"></i>
        </div>


        <div class="space"></div>
        <upload-file
                :submit-handeler="submitHandeler"
                :categories="categories"
        >
        </upload-file>


      </div>
    </div>


    <!-- MODALS -->


    <modal :show="deleteModal.modalIsOpen" effect="fade" :width="400">
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
    <modal :show="modalAddCategory" effect="fade" :width="400">
      <div slot="modal-header">
        <h4 class="modal-title">
          <strong>Add new category</strong>
        </h4>
      </div>
      <div class="modal-body" slot="modal-body"><input v-model="newCategory"></div>
      <div class="modal-footer" slot="modal-footer">
        <button type="button" class="btn btn-default" @click="modalAddCategory = !modalAddCategory">Back
        </button>
        <button type="button" class="btn btn-success" @click="addCategory(newCategory)">Add</button>
      </div>
    </modal>

    <!-- ENDMODALS -->
  </div>
</template>

<script type="text/babel">

  import axios from 'axios';
  import Rx from 'rx';

  import modal from '../components/modal.vue';
  import mediaFiles from '../components/mediaFiles.vue';
  import uploadFile from '../components/uploadFile.vue';
  import mediaDetails from '../components/mediaDetails.vue';

  export default {

    components: {
      mediaFiles,
      uploadFile,
      mediaDetails,
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
        newCategory: '',
        categories: [],
        postData: [],
        selectedCategory: '',
        showDetails: false
      }
    },
    beforeRouteEnter(to, from, next) {
      const media$ = Rx.Observable.fromPromise(axios.get('/getData/media'))
              .map(response => response.data)
              .flatMapLatest(Rx.Observable.fromArray)
              .map(item => Object.assign({}, item, {
                isDetails: false,
                isSelected: false,
                isEdited: false
              }))
              .reduce((acc, next) => [...acc, next], []);

      const status$ = Rx.Observable.fromPromise(axios.get('/aPanel/tasks/siteStatus'))
              .map(response => response.data.categories);

      const posts$ = Rx.Observable.fromPromise(axios.get('/getData/posts'))
              .map(response => response.data);

      const result$ = media$.zip([status$, posts$], (media, status, posts) => {
        return {
          mediaData: media,
          categories: status,
          postData: posts
        }
      });

      result$.subscribe(data => {
        const {mediaData, categories, postData} = data;

        next(vm => {
          vm.mediaData = mediaData;
          vm.categories = categories;
          vm.postData = postData;
        });
      })
    },
    beforeMount() {
      this.$eventBus.$on('showDetails', (e) => this.showDetails = e);
    },
    beforeDestory() {
      this.$eventBus.$off('showDetails');
    },
    computed: {
      selected() {
        return this.mediaData.filter(e => e.isSelected);
      }
    },
    methods: {
      addCategory(name) {
        axios.post('/aPanel/tasks/media/addCategory', {category: name})
                .then(response => {
                  this.modalAddCategory = false;
                  this.categories = response.data.categories;
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
                let tmpItems = image.category.filter(item => item !== category);
                promises.push(
                        axios.post('/aPanel/tasks/media/edit', {
                          id: image._id,
                          category: tmpItems,
                          originalname: image.originalname
                        })
                                .then(() => image.category = tmpItems)
                                .catch(err => console.log(err, 'error'))
                )
              }
            }
          });

          promises.push(axios.post('/aPanel/tasks/media/removeCategory', {category: category})
                  .then(() => {
                    const index = this.categories.indexOf(category);
                    this.categories.splice(index, 1);
                    this.selectedCategory = '';
                  })
                  .catch(err => console.log(err, 'error')));

          Promise.all(promises)
                  .catch(err => console.log(err));
        }
      },

      selectAll() {
        this.mediaData.forEach(item => {
          item.isSelected = !item.isSelected;
        });
      },

      toggleDetails(){
        if (this.selected.length > 0) {
          this.showDetails = !this.showDetails;
        }
      },

      submitHandeler(files, category){
        const formData = new FormData();

        for (let file in files) {
          if (files.hasOwnProperty(file)) {
            formData.append('media', files[file]);
          }
        }

        if (category) {
          if (this.categories.indexOf(category) === -1) {
            this.addCategory(category);
          }
          formData.append('category', category);
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

                  this.mediaData = [
                    ...newEntries,
                    ...this.mediaData
                  ];

                  this.$eventBus.$emit('fileSent', true)
                })
                .catch(() => this.$eventBus.$emit('fileSent', false));
      },

      deleteHandeler(){
        if (this.selected.length > 1) {
          this.deleteModal.items = `${this.selected.length} items?`;
          this.deleteModal.modalIsOpen = !this.deleteModal.modalIsOpen;
          this.deleteModal.toRemove = this.selected;

        } else if (this.selected.length === 1) {
          this.deleteModal.items = `${this.selected[0].originalname}?`;
          this.deleteModal.modalIsOpen = !this.deleteModal.modalIsOpen;
          this.deleteModal.toRemove = this.selected;
        }

      },
      removePageConfirmation(bool){
        if (!bool) {
          this.deleteModal.modalIsOpen = !this.deleteModal.modalIsOpen;
          this.deleteModal.toRemove = [];
        } else {
          this.deleteModal.toRemove.forEach(item => this._deleteItem(item));
          this.deleteModal.toRemove = [];
          this.deleteModal.modalIsOpen = !this.deleteModal.modalIsOpen;
        }
      },

      _deleteItem(item){
        let promises = [];
        let cancel = false;

        this.postData.forEach(next => {
          if (next.attachedImages.length > 0) {
            next.attachedImages.forEach(e => {
              if (e._id === item._id) {
                let warning = confirm(`This image is used in a ${next.title} post. Are you sure you want to delete it?`);
                if (warning) {
                  let tmpItems = next.attachedImages.filter(item => item !== e);

                  promises.push(
                          axios.post('/aPanel/tasks/posts/edit', {
                            title: next.title,
                            content: next.content,
                            attachedImages: tmpItems
                          }).catch(err => console.log(err, 'error')),

                          axios.post('/aPanel/tasks/media/remove', {id: item._id})
                                  .then(() => {
                                    let index = this.mediaData.indexOf(item);
                                    this.mediaData.splice(index, 1);
                                  })
                                  .catch(err => console.log(err, 'error'))
                  );
                } else {
                  cancel = true;
                }
              }
            });
          }
        });

        if (promises.length > 0) {

          Promise.all(promises)
                  .then(() => this.selected = [])
                  .catch(err => console.log(err));

        } else if (promises.length === 0 && cancel === false) {

          axios.post('/aPanel/tasks/media/remove', {id: item._id})
                  .then(() => {
                    let index = this.mediaData.indexOf(item);
                    this.mediaData.splice(index, 1);
                  })
                  .catch(err => console.log(err, 'error'))
        }
      }
    }
  }
</script>
