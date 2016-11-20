import Vue from 'vue';

export default Vue.directive('dropbox', {
    bind: function (el) {
        el.addEventListener("dragover", fileDragHover.bind(null, el, 'in'));
        el.addEventListener("dragleave", fileDragHover.bind(null, el, 'out'));
        el.addEventListener("drop", fileDragHover.bind(null, el, 'out'));
    },

    unbind(el){
        el.removeEventListener("dragover", fileDragHover.bind(null, el, 'in'));
        el.removeEventListener("dragleave", fileDragHover.bind(null, el, 'out'));
        el.removeEventListener("drop", fileDragHover.bind(null, el, 'out'));
    }
});


function fileDragHover(el, type, e) {
    e.stopPropagation();
    e.preventDefault();
    el.style.backgroundColor = (type === 'in') ? 'rgba(2, 80, 104, .2)' : 'rgba(45, 1, 1, .1)';
}
