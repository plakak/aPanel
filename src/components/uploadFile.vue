<style lang="scss" xmlns:v-on="http://www.w3.org/1999/xhtml" xmlns:v-on="http://www.w3.org/1999/xhtml"
       xmlns:v-on="http://www.w3.org/1999/xhtml">

  form {
    padding: 1em;
    text-align: center;
    background-color: rgba(220, 220, 220, 0.2);
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

  .media-button--submit {
    background-color: #553a5b;

    &:hover {
      background-color: lighten(#313a5b, 10%);
    }
    &:active {
      background-color: darken(#313a5b, 10%);
    }
  }

  .filename {
    background-color: rgba(#2d0101, .2);
    display: block;
    width: 30em;
    min-height: 5em;
    position: relative;
    margin: 1em auto 1em;
    border-radius: 4px;
    font-size: 1.2em;
    font-style: italic;
    color: #0f0f0f;
    padding: 5px;
    white-space: pre-line;
  }

  .clear-selected-file {
    position: absolute;
    top: 0;
    right: 0;
    margin: 9px 10px;
  }

  .category-selector {
    margin: auto;
    margin-bottom: 1em;
    width: 50%;

    input {
      border-radius: 4px;
      box-shadow: 0;
      border: 0;
      background-color: rgba(#2d0101, .2);

      &::-webkit-calendar-picker-indicator {
        background-color: transparent;
      }
    }
  }


</style>

<template>
  <div> export
    <p class="upload-title">FILE UPLOAD</p>
    <form enctype="multipart/form-data" method="POST" v-on:submit.prevent>

      <label class="filename" :style="sendIndicator" v-dropbox="files" ref="dropbox">
        {{ fileName }}
        <i class="glyphicon glyphicon-remove-circle clear-selected-file" @click="clearSelected"
           v-show="files"></i>
      </label>

      <div v-if='files' class="category-selector">
        <span> Category:</span>
        <input type="text" list="categoryList" v-model="selectedCategory">
        <datalist id="categoryList">
          <option v-for="category in categories">{{ category }}</option>
        </datalist>
      </div>

      <label class="media-button--select" for="file">Select files</label>
      <input id="file" type="file" name="media" v-on:change="_onFileChange" multiple/>
      <label class="media-button--submit" @click="fileSubmit">Submit</label>
    </form>
  </div>
</template>

<script type="text/babel">


  export default {
    props: {
      submitHandeler: {
        type: Function,
        required: true
      },
      categories: {
        type: Array,
        required: true
      }
    },

    data() {
      return {
        files: '',
        success: false,
        failure: false,
        selectedCategory: ''
      }
    },
    mounted() {
      this.$refs['dropbox'].addEventListener("drop", this.fileDropped);
      this.$eventBus.$on('fileSent', this._fileSent);
    },
    beforeDestroy() {
      this.$refs['dropbox'].removeEventListener("drop", this.fileDropped);
      this.$eventBus.$off('fileSent', this._fileSent);
    },
    computed: {
      fileName() {
        if (!this.success && !this.failure) {
          let names = '';
          for (let file in this.files) {
            if (this.files.hasOwnProperty(file)) {
              names += this.files[file].name + '\n';
            }
          }
          return this.files ? names : "Please select or drag a files.";
        } else {
          return this.success ? 'Files sent!' : "Oops! Files didn't send. Check size (max 10MB) and try again.";
        }
      },
      sendIndicator(){
        if (this.success) {
          return {backgroundColor: 'rgba(33, 165, 81, .2)'};
        } else if (this.failure) {
          return {backgroundColor: 'rgba(135, 11, 47, .2)'};
        } else {
          return {backgroundColor: 'rgba(45, 1, 1, .1)'};
        }
      }
    },
    methods: {
      _onFileChange(e) {
        this.files = e.target.files || e.dataTransfer.files;
      },
      fileSubmit() {
        if (this.files) {
          this.submitHandeler(this.files, this.selectedCategory)
        }
      },
      clearSelected() {
        this.files = '';
      },
      fileDropped(e) {
        e.stopPropagation();
        e.preventDefault();
        this.files = e.target.files || e.dataTransfer.files;
      },
      _fileSent(status) {
        if (status) {
          this.files = '';
          this.success = true;
        } else {
          this.files = '';
          this.failure = true;
        }

        setTimeout(() => {
          this.success = false;
          this.failure = false;
        }, 2250);
      }
    }
  }
</script>
