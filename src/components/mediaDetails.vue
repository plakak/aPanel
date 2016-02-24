<style lang="scss">

    .close-details {
        position: absolute;
        top: .3em;
        right: .3em;
        font-size: 2em;
    }

    .media-details{
        top: 10em;
        left: 0;
        right: 0;
        bottom: 0;
        position: fixed;
        width: 70%;
        border-radius: 4px;
        padding: 2em;
        box-shadow: 2px 2px 20px rgba(0,0,0,0.2),
                inset 1px 1px 1px rgba(0,0,0,0.2),
                inset -1px -1px 1px rgba(0,0,0,0.2);
        height: 40em;
        margin: 0 auto;
        background-color: white;
        z-index: 1000;
        opacity: 1;
        transition: opacity 0.4s linear;
    }

    .categories-modefied {
        background-color:  rgba(#d5706b, 0.4);
    }

    .categories {
        position: relative;
    }

    .category-warning {
        background-color: rgba(#d5706b, 0.4) !important;
    }

    .active.category-warning {
        background-color: rgba(#d5706b, 0.8) !important;
    }


</style>

<template>
    <div class="media-details-ouside">
        <div class="media-details">
            <div v-if="single">
                <pre>{{ selectedItems | json}}</pre>
            </div>
            <div v-else>
                Batch modify category:
                <div class="categories" :class="{ 'categories-modefied': !isPristine }">
                    <ul>
                        <div class="cat-list">
                            <li v-for="category in newCategoryList"
                                :class="{'active': category === selectedCategory, 'category-warning': notSharedCategory(category) }"
                            >
                                <span @click="selectedCategory = category">{{ category }}</span>
                            </li>
                        </div>
                        <div class="categories-controls">
                            <i class="glyphicon glyphicon-trash button" @click="removeFromList"></i>
                        </div>
                    </ul>
                </div>

                <div class="category-selector">
                    <span> Category:</span>
                    <input type="text" list="categoryList" v-model="newCategory">
                    <datalist id="categoryList">
                        <option v-for="category in filteredCategories">{{ category }}</option>
                    </datalist>
                    <i class="glyphicon glyphicon-plus button" @click="addToList"></i>
                </div>
                <button @click="batchUpdate" :disabled="isPristine">Go</button>
            </div>
            <i class="glyphicon glyphicon-remove button close-details" @click="showDetails = !showDetails"></i>
        </div>
    </div>

</template>

<script type="text/babel">

    import moment from 'moment'
    import axios from 'axios'

    export default {
        props: ['selectedItems', 'categories', 'showDetails', 'addCategory'],
        data() {
          return {
              newCategoryList: [],
              newCategory:'',
              selectedCategory: ''
          }
        },
        ready() {
            this.$set('newCategoryList', this.currentCategories);
        },
        computed: {
            single() {
                return this.selectedItems.length < 2;
            },
            currentCategories() {
                return this.selectedItems.reduce((acc, next) => {
                    if (next.category.length > 0) {
                        next.category.forEach(category => {
                           if (acc.indexOf(category) === -1) {
                               acc.push(category);
                           }
                        });
                    }
                    return acc;
                },[]);
            },

            filteredCategories(){
                return this.categories.reduce((acc, next) => {
                   if (this.newCategoryList.indexOf(next) === -1) {
                       acc.push(next);
                   }
                    return acc;
                },[]);
            },
            isPristine(){
                return this.currentCategories.every(catA =>
                    this.newCategoryList.indexOf(catA) !== -1) &&
                    this.currentCategories.length === this.newCategoryList.length;
            }
            // todo: add check for isPristine when 'notSharedCategory' is false (forEach all newList)
        },
        methods: {
            addToList(){
                if (this.newCategory) {
                    this.$set('newCategoryList', this.newCategoryList.concat(this.newCategory));
                    this.$set('newCategory', '');
                }
            },
            removeFromList(){
                this.newCategoryList.$remove(this.selectedCategory);
            },
            batchUpdate(){

                let promises = [];

                this.newCategoryList.forEach(category => {
                    if (this.categories.indexOf(category) === -1) {
                        this.addCategory(category);
                    }
                });

                this.selectedItems.forEach(image => {
                    promises.push(axios.post('/aPanel/tasks/media/edit', {id: image._id, category: this.newCategoryList})
                        .then(() => image.category = this.newCategoryList)
                    )
                });

                Promise.all(promises)
                    .then(() => console.log('saved'))
                    .catch( err => console.log('error', err));

            },
            /* When category is present on one image but not on the other */
            notSharedCategory(input) {
                return this.selectedItems.every(e => e.category.indexOf(input) !== -1);
            }
        }
    }
</script>