<style>

.modal-component {
    top: 100px;
    background-color: #f0f1f2;
    left: 0;
    right: 0;
    margin: auto;
    position: absolute;
    border: 1px solid black;
    opacity: 1;
    border-radius: 5px;
    z-index: 10; /* keep on top of other elements on the page */
    box-shadow: 0 0 0 9999px rgba(0,0,0,0.5);
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s
}
.fade-enter, .fade-leave-active {
  opacity: 0
}





</style>

<template>
  <transition name="fade">
    <div class="modal-component" v-if="show" :style="{width: width ? width + 'px' : '400px'}">
      <slot name="modal-header"></slot>
      <slot name="modal-body"></slot>
      <slot name="modal-footer"></slot>
    </div>
  </transition>
</template>

<script type="text/babel">

  export default {
    props: {
      show: {
        type: Boolean,
        required: true
      },
      width: {
        type: Number,
        required: false
      }
    }
  }

</script>
