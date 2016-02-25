<style lang="scss">

    img {
        max-width: 100%;

    }

    .image-container{
        display: flex;
        flex-wrap: wrap;
        align-items: flex-start;
        justify-content: center;
    }

    .item {
        position: relative;
        display: flex;
        width: 200px;
        height: 200px;
        border-radius: 10px;
        border: 3px solid snow;
        box-shadow: 5px 5px 5px rgba(0,0,0,0.2);
        margin: 5px;
        padding: 10px 5px;
        background-color: darken(#00b3ee, 10%);
        color: white;
        cursor: pointer;
        justify-content: center;
        align-items: center;
        user-select: none;
    }

    .item-inside {

        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .image {
        display: flex;
        align-items: center;
        align-self: center;
    }

     .scroll-container {
        padding: 20px;
        height: 35em;
        overflow-y: scroll;
    }

     .normal-color {
         background-color: rgba(220,220,220, 0.2);
         transition: all 0.3s linear;
     }

     .warning-color {
         background-color: rgba(#d5706b, 0.4);
         transition: all 0.3s linear;
     }

    .selected {
        background-color: darken(#00b3ee, 30%) ;
    }

    .media-info {
        /*display: flex;*/
        justify-content: space-around;
        opacity: 0;
        font-size: 1.2em;
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border-radius: 10px;
        line-height: 2em;
        padding: 10px;
        background-color: rgba(0,0,0,.4);
        overflow-y: hidden;
        transition: opacity .3s linear;
    }

    .info-open {
        opacity: 1;
    }

    .file-name {
        display: block;
        font-weight: bold;
        margin-top: -.5em;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 200px;
    }

    .file-details {
        font-weight: 400;
        line-height: 1em;
        margin-top: 5px;
        margin-left: 0;
        padding: 0;
    }

    .italic-span {
        font-style: italic;
    }

    .post-use {
        margin-top: 10px;
    }


</style>

<template>
    <div>
        <div class="scroll-container" :class='isWarning'>
            <div class="image-container">
                <div class="item"
                     v-for="image in externalData | orderBy 'uploaded' -1 | byCategory selectedCategory"
                     @click="selectImage(image)"
                     v-db-click-handler>
                    <div class="item-inside">
                        <div class="image">
                            <img :src="image.relativePath" />
                        </div>
                    </div>
                    <div class="media-info" :class="{'info-open': image.isDetails}" >
                        <div class='file-name'>
                            {{ image.originalname }}
                        </div>
                        <div class='file-details'>
                            Categories:
                            <span class="italic-span">
                                {{ image.category }}
                            </span>
                            <div class="post-use">
                                Used in post:
                                <span class="italic-span" v-show="findPost(image)">
                                    {{ findPost(image) }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
        </div>
    </div>
        </div>

</template>

<script type="text/babel">

    import moment from 'moment'

    export default {
        props: ['externalData', 'selectedCategory', 'postData', 'warning'],

        computed: {
           isWarning() {
               return this.warning ? 'warning-color' : 'normal-color'
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
            },
            selectImage(image){
                image.isSelected = !image.isSelected;
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