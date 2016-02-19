<style lang="scss" xmlns:v-on="http://www.w3.org/1999/xhtml" xmlns:v-on="http://www.w3.org/1999/xhtml"
       xmlns:v-on="http://www.w3.org/1999/xhtml">
</style>

<template>
    <form enctype="multipart/form-data" method="POST">
        <input type="file" name="media" v-on:change="_onFileChange"/>
        <button type="submit" @click="fileSubmit"> Submit</button>
    </form>

</template>

<script type="text/babel">


    export default {
        props: ['submitHandeler'],
        data() {
            return {
                file: ''
            }
        },
        methods: {
            _onFileChange(e) {
                let file = e.target.files || e.dataTransfer.files;
                this.$set('file', file);
            },

            fileSubmit(e){
                e.preventDefault();
                this.submitHandeler(this.file)
            }

        }
    }
</script>