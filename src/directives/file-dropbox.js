import Vue from 'vue';

export default Vue.directive('dropbox', {
    bind: function () {

        this.el.addEventListener("dragover", this.FileDragHover.bind(this, 'in'), false);
        this.el.addEventListener("dragleave", this.FileDragHover.bind(this, 'out'), false);
        this.el.addEventListener("drop", this.FileDropped.bind(this), false);

    },
    FileDragHover(type, e){
        e.stopPropagation();
        e.preventDefault();

        this.el.style.backgroundColor = (type === 'in') ? 'rgba(2, 80, 104, .2)' : 'rgba(45, 1, 1, .1)';
    },

    FileDropped(e){
        e.stopPropagation();
        e.preventDefault();

        this.FileDragHover.call(this, 'out', e);

        this.vm.$data[this.expression] = e.target.files || e.dataTransfer.files;

    },

    unbind(){
        this.el.removeEventListener("dragover", this.FileDragHover.bind(this, 'in'), false);
        this.el.removeEventListener("dragleave", this.FileDragHover.bind(this, 'out'), false);
        this.el.removeEventListener("drop", this.FileDropped.bind(this), false);
    }
});