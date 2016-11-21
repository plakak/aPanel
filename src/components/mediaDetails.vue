<style lang="scss">

    .close-details {
        position: absolute;
        top: .3em;
        right: .3em;
        font-size: 2em;
    }

    .media-details{
        top: -40px;
        left: 0;
        right: 0;
        bottom: 0;
        position: absolute;
        width: 100%;
        border-radius: 4px;
        padding: 2em;
        box-shadow: 2px 2px 20px rgba(0,0,0,0.2),
                inset 1px 1px 5px rgba(0,0,0,.5),
                inset -1px -1px 5px rgba(0,0,0,.5);
        margin: 0 auto;
        background-color: white;
        z-index: 1000;
        opacity: 1;
        transition: opacity 0.4s linear;
    }

    .md-height-large {
        height: 50em;
    }


    .md-height-small {
        height: 40em;
    }


    .categories-modefied {
        background-color:  rgba(#d5706b, 0.2);
        transition: all .4s linear;
    }

    .categories {
        position: relative;
    }

    .category-warning {
        background-color: rgba(#d5706b, 0.4) !important;
        transition: all .4s linear;
    }

    .active.category-warning {
        background-color: rgba(#d5706b, 0.8) !important;
        transition: all .4s linear;
    }


    h2 {
        text-align: center;
        margin-bottom: 2em;
    }

    .single {

        .image-preview {
            text-align: center;
            max-width: 700px;
            margin: auto;
        }

        .title {
            margin-top: .5em;
            width: 100%;
            display: inline-block;
            text-align: center;
            font-size: 1.2em;
        }

        .single-details {
            padding-bottom: 1em;
            text-align: center;
            font-style: italic;
        }
    }


    .category-input-single {
        margin: 2em auto;
        display: flex;
        align-items: center;
        justify-content: center;

        .plus-icon {
            flex: 1;
            margin-left: 0.2em;
            font-size: 2em;
        }

        .single-input {
            flex: 4;
            border-radius: 4px;
            box-shadow: 0;
            border: 0;
            background-color: rgba(#D5CCCC, .2);

            &::-webkit-calendar-picker-indicator {
                background-color: transparent;
            }

        }

        .save-changes {
            margin: 0;
            flex: 1;
        }
    }


</style>

<template>
    <div class="media-details-ouside">
        <div class="media-details" :class="{'md-height-large': single, 'md-height-small': !single}">
            <div v-if="single" class="single">
                <div class="image-preview">
                    <img :src="selectedItems[0].relativePath" />
                </div>
                <div>
                    <p class="title" @click="editTitle=!editTitle" v-if="!editTitle">{{ originalname }}</p>
                    <input type="text" @blur="editTitle=!editTitle" v-on:keypress.enter="editTitle=false"
                           v-if="editTitle" v-model="originalname">
                    <p class="single-details"> Uploaded on: {{ formattedTime }} by {{ selectedItems[0].uploadedBy
                        }} </p>
                </div>
            </div>

            <h2 v-if="!single"> BATCH MODIFY CATEGORY</h2>
            <div class="categories" :class="{ 'categories-modefied': !isPristine }">
                <ul>
                    <div class="cat-list">
                        <li v-for="category in newCategoryList"
                            :class="{
                                'active': category === selectedCategory,
                                 'category-warning': isWarning(category)
                                 }"
                        >
                            <span @click="selectedCategory = category">{{ category }}</span>
                        </li>
                    </div>
                    <div class="categories-controls">
                        <i class="glyphicon glyphicon-trash button" @click="removeFromList"></i>
                    </div>
                </ul>
            </div>
            <div class="category-input-single">
                <input type="text"
                       list="categoryList"
                       v-model="newCategory"
                       placeholder="Choose / write new category"
                       class="single-input"
                >
                <datalist id="categoryList">
                    <option v-for="category in filteredCategories">{{ category }}</option>
                </datalist>
                <i class="glyphicon glyphicon-plus button plus-icon" @click="addToList"></i>
                <button
                        class="btn btn-lg btn-info button save-changes"
                        style="background-color:#553A5B; border: 0;"
                        @click="batchUpdate"
                        :disabled="isPristine && !categoryDiscrepancy && singleNameIsPristine"
                >
                    Save
                </button>
            </div>

            <i class="glyphicon glyphicon-remove button close-details" @click="changeDetailsVisibility()"></i>
        </div>
    </div>

</template>

<script type="text/babel">

    import moment from 'moment'
    import axios from 'axios'

    export default {
        props: {
            selectedItems: {
                type: Array,
                required: true
            },
            categories: {
                type: Array,
                required: true
            },
            showDetails: {
                type: Boolean,
                required: true
            },
            addCategory: {
                type: Function,
                required: true
            }
        },
        data() {
          return {
              newCategoryList: [],
              newCategory:'',
              selectedCategory: '',
              originalname: '',
              editTitle: false
          }
        },
        mounted() {
            this.originalname = this.selectedItems[0].originalname;
            this.newCategoryList = this.currentCategories;
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
            singleNameIsPristine(){
               return this.selectedItems[0].originalname === this.originalname;
            },
            isPristine(){
                return this.currentCategories.every(catA =>
                    this.newCategoryList.indexOf(catA) !== -1) &&
                    this.currentCategories.length === this.newCategoryList.length;
            },
            categoryDiscrepancy(){
                return this.newCategoryList.reduce((acc, next) => {
                    if (this.notSharedCategory(next)){
                        acc = true;
                    }
                    return acc;
                }, false);
            },
            formattedTime(){
                return moment(this.selectedItems[0].uploaded).format('DD-MM-YYYY');
            }
        },
        methods: {
            changeDetailsVisibility() {
              this.$eventBus.$emit('showDetails', !this.showDetails);
            },
            addToList(){
                if (this.newCategory) {
                    this.$set('newCategoryList', this.newCategoryList.concat(this.newCategory));
                    this.$set('newCategory', '');
                }
            },
            removeFromList(){
                this.newCategoryList = this.newCategoryList.filter(item => item !== this.selectedCategory);
            },
            batchUpdate(){
                let promises = [];

                this.newCategoryList.forEach(category => {
                    if (this.categories.indexOf(category) === -1) {
                        this.addCategory(category);
                    }
                });

                this.selectedItems.forEach(image => {
                    promises.push(axios.post('/aPanel/tasks/media/edit', {
                        id: image._id,
                        originalname: this.single ? this.originalname : image.originalname,
                        category: this.newCategoryList
                    })
                        .then(() => image.category = this.newCategoryList)
                    )
                });

                Promise.all(promises)
                    .catch( err => console.log('error', err));

            },

            isWarning(input){
                return this.notSharedCategory(input) && this.currentCategories.length > 0 &&
                    !this.selectedItems.every(e => e.category.indexOf(input) === -1)
            },

            /* When category is present on one image but not on the other */
            notSharedCategory(input) {
                return !this.selectedItems.every(e => e.category.indexOf(input) !== -1);
            }
        }
    }
</script>
