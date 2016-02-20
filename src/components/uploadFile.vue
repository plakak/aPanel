<style lang="scss" xmlns:v-on="http://www.w3.org/1999/xhtml" xmlns:v-on="http://www.w3.org/1999/xhtml"
       xmlns:v-on="http://www.w3.org/1999/xhtml">

    form {
        padding: 1em;
        text-align: center;
        background-color: rgba(220,220,220, 0.2);
    }



    input[type="file"] {
        display: none;
    }

    .upload-title {
        font-weight: 700;
        font-size: 1.5em;
        text-align: center;
    }

    .media-button--select,
    .media-button--submit {
        padding: .5em;
        display: inline-block;
        margin: 0 auto;
        border-radius: 4px;
        color: white;
        font-style: normal;
        font-weight: 400;
    }

    .media-button--select {
        background-color: #7f8c81;
        &:hover {
            background-color: lighten(#7f8c81, 10%);
        }
        &:active {
         background-color: darken(#7f8c81, 10%);
        }
        }

    .media-button--submit{
        background-color: #313a5b;

        &:hover {
             background-color: lighten(#313a5b, 10%);
        }
        &:active {
             background-color: darken(#313a5b, 10%);
         }
    }

    .filename {
        background-color: rgba(#2d0101,.2);
        display: block;
        width: 30em;
        position: relative;
        margin: 1em auto 1em;
        border-radius: 4px;
        font-size: 1.2em;
        font-style: italic;
        color: #0f0f0f;
        padding: 5px;
    }

    .clear-selected-file {
        position: absolute;
        top: 0;
        right: 0;
        margin: 9px 10px;
    }

</style>

<template>
    <p class="upload-title">FILE UPLOAD</p>
    <form enctype="multipart/form-data" method="POST">

        <label class="filename" :style="sendIndicator" v-dropbox="file">
            {{ fileName }}
            <i class="glyphicon glyphicon-remove-circle clear-selected-file" @click="clearSelected" v-show="file"></i>
        </label>
        <label class="media-button--select" for="file" >Select file</label>

        <input id="file" type="file" name="media" v-on:change="_onFileChange" />
        <label class="media-button--submit" @click="fileSubmit">Submit</label>
    </form>

</template>

<script type="text/babel">


    export default {
        props: ['submitHandeler'],
        data() {
            return {
                file: '',
                success: false,
                failure: false
            }
        },
        computed: {
            fileName() {
                if (!this.success && !this.failure)
                    return this.file ? this.file[0].name : "Please select a file.";
                else {
                    return this.success ? 'File sent!' : "Oops! File didn't send. Check size (max 10MB) and try again.";
                }
            },
            sendIndicator(){
                if (this.success){
                    return {backgroundColor: 'rgba(33, 165, 81, .2)' };
                } else if (this.failure) {
                    return {backgroundColor: 'rgba(135, 11, 47, .2)'};
                } else {
                    return {backgroundColor: 'rgba(45, 1, 1, .1)'};
                }
            }
        },
        methods: {
            _onFileChange(e) {
                let file = e.target.files || e.dataTransfer.files;
                this.$set('file', file);
            },

            fileSubmit(){
                if (this.file) {
                    this.submitHandeler(this.file)
                }
            },
            clearSelected(){
                this.$set('file', '');
            }
        },
        events: {
            'fileSent'(status){
               if (status) {
                   this.$set('file', '');
                   this.$set('success', true);
               } else {
                   this.$set('file', '');
                   this.$set('failure', true);
               }

                setTimeout(() => {
                    this.$set('success', false);
                    this.$set('failure', false);
                }, 2250)

            }
        }
    }
</script>