<style lang="scss">

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
        background-color: rgba(220,220,220, 0.2);
        padding: 20px;
        height: 35em;
        overflow-y: scroll;
    }


</style>

<template>
    <div>
        <div class="scroll-container">
            <div class="image-container">
                <div class="categories"> {{ categories }} </div>
                <div class="item" v-for="image in externalData | orderBy 'uploaded' -1 | byCategory selectedCategory ">
                    <span class="remove-button" @click="deleteItem(image)">X</span>
                    <div class="image">
                        <img :src="image.relativePath"/>
                    </div>
                    <div class="description">
                        {{ image.originalname }}
                    </div>
                    <div v-show="findPost(image)">
                        Used in post: {{ findPost(image) }}
                </div>
            </div>
        </div>
    </div>


</template>

<script type="text/babel">

    import moment from 'moment'

    export default {
        props: ['externalData', 'selectedCategory', 'postData', 'deleteItem'],

        data() {
            return {

            }
        },
       methods: {
           findPost(image) {
               let post = this.postData.reduce((acc, next) => {
                   if (next.attachedImages) {
                       next.attachedImages.forEach(e => {
                           if (e._id === image._id) {
                               acc.push(next.title)
                           }
                       })
                   }
                   return acc;
               }, []);

               return post.length > 0 ? post : false;
           }
       },
        filters: {
            'byCategory'(value, category){
                if (category) {
                    return value.filter(item => item.category.some(e => e === category));
                } else return value;
            }
        }
    }
</script>