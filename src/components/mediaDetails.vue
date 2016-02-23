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


</style>

<template>
    <div class="media-details-ouside">
        <div class="media-details">
            <div v-if="single">
                <pre>{{ selectedItems | json}}</pre>
            </div>
            <div v-else>
                Batch modify category:
                <div class="categories">
                    <ul>
                        <div class="cat-list">
                            <li v-for="category in newCategories" :class="{'active': category === selectedCategory}">
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
                    <input type="text" list="categoryList" v-model="selectedCategory">
                    <datalist id="categoryList">
                        <option v-for="category in filteredCategories">{{ category }}</option>
                    </datalist>
                    <i class="glyphicon glyphicon-plus button" @click="addToList"></i>
                </div>

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
              newCategories: [],
              selectedCategory: ''
          }
        },
        ready() {
            this.$set('newCategories', this.currentCategories);
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
                               acc.push(category)
                           }
                        });
                    }
                    return acc;
                },[]);
            },
            filteredCategories(){
                return this.categories.reduce((acc, next) => {
                   if (this.newCategories.indexOf(next) === -1) {
                       acc.push(next);
                   }
                    return acc;
                },[]);
            },
            isPristine(){
                return this.newCategories.every(catA => this.currentCategories.find(catB => catB === catA));
            }
        },
        methods: {
            addToList(){
                if (this.selectedCategory) {
                    if (this.categories.indexOf(this.selectedCategory) === -1) {
                        this.addCategory(this.selectedCategory);
                    }

                    this.newCategories.push(this.selectedCategory);
                    this.$set('selectedCategory', '');
                }
            },
            removeFromList(){

            },
            batchUpdate(){
                axios.post('/aPanel/tasks/media/edit', {category: newCategories})
                    .then(() => console.log('saved'))
                    .catch(err => console.log('unsaved', err));
            }
        }
    }
</script>