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
      <div class="panel-body color-bar-pages">
        <div v-for="page in pageDataFiltered">
          <page class="page_space"
                :external-data="page"
                :show-details="showDetails.bind(null, page)"
                :remove-page="deleteHandler.bind(null,page)"
                :change-visibility="changeVisibility.bind(null, page)"
                :save-data="saveData.bind(null, page)"
                :photo="false"
          >
          </page>
        </div>
        <div class="main-controls">

          <i class="glyphicon glyphicon-plus button" @click="addNewPage" title="Add new page"></i>
          <i class="glyphicon glyphicon-duplicate button" @click="selectAll" title="Select all"></i>
          <i class="glyphicon glyphicon-cog button lower-opacity" title="Custom fields"></i>

        </div>
      </div>
    </div>
    <modal :show="modal.modalIsOpen" effect="fade" :width="400">
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
  import modal from '../components/modal.vue';
  import moment from 'moment';
  import Rx from 'rx';
  import orderBy from 'lodash/orderBy';

  import page from '../components/page.vue';

  export default {
    data() {
      return {
        modal: {
          modalIsOpen: false,
          items: '',
          toRemove: []
        },
        pageData: []
      }
    },
    components: {
      page,
      modal
    },
    beforeRouteEnter(to, from, next) {
      Rx.Observable.fromPromise(axios.get('/aPanel/tasks/getData/pages'))
              .map(response => response.data)
              .flatMapLatest(Rx.Observable.fromArray)
              .map(item => Object.assign({}, item, {
                isDetails: false,
                isSelected: false,
                isSaved: true,
                isEdited: false
              }))
              .reduce((acc, next) => {
                acc.push(next);
                return acc;
              }, [])
              .subscribe(pageData => next(vm => vm.pageData = pageData));
    },
    computed: {
      pageDataFiltered() {
        return orderBy(this.pageData, 'datePublised', ['desc']);
      }
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
          axios.post('/aPanel/tasks/pages/add',
                  {
                    title: data.title,
                    content: data.content,
                    by: isLoggedIn.username
                  })
                  .then((resp) => {
                    page._id = resp.data._id;
                    page.isSaved = true;
                    page.isEdited = false;
                    page.title = resp.data.title;
                    page.content = resp.data.content;
                  })
                  .catch(err => console.log(err, 'error'));

        } else {
          axios.post('/aPanel/tasks/pages/edit',
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
          axios.post('/aPanel/tasks/pages/changeStatus', {id: page._id, isActive: page.isActive})
                  .catch(() => page.isActive = !page.isActive);
        }
      },

      deleteHandler(page){
        if (!page.isSaved) {
          const index = this.pageData.indexOf(page);
          this.pageData.splice(index, 1)
        } else {
          let selected = this.pageData.filter(e => e.isSelected);

          if (selected.length > 1) {
            this.modal.items = `${selected.length} items?`;
            this.modal.modalIsOpen = !this.modal.modalIsOpen;
            this.modal.toRemove = selected;

          } else {
            this.modal.items = `${page.title}?`;
            this.modal.modalIsOpen = !this.modal.modalIsOpen;
            this.modal.toRemove = [page];
          }
        }
      },
      removePageConfirmation(bool){
        if (!bool) {
          this.modal.modalIsOpen = !this.modal.modalIsOpen;
          this.modal.toRemove = [];
        } else {
          this.modal.toRemove.forEach(item => this._deletePage(item));
          this.modal.modalIsOpen = !this.modal.modalIsOpen;
        }
      },

      _deletePage(page){
        axios.post('/aPanel/tasks/pages/remove', {id: page._id})
                .then(() => {
                  const index = this.pageData.indexOf(page);
                  this.pageData.splice(index, 1)
                })
                .catch(err => console.log(err, 'error'));
      }
    }

  }
</script>
