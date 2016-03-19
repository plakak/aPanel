import Vue from 'vue';

export default Vue.directive('db-click-handler', {
    params: ['image'],
    _timeouts: [],

    bind() {

        if (this.params.image.isSelected) {
            this.el.classList.toggle('selected');
        }

        this.el.addEventListener('click', this.onClick.bind(this));
        this.el.addEventListener('dblclick', this.doubleClickHandeler.bind(this));

    },

    onClick() {
        this._timeouts.push(setTimeout(() => this.clickHandeler(), 150));
    },

    clickHandeler(){
        this.el.classList.toggle('selected');
    },

    doubleClickHandeler(){
        this._timeouts.forEach( e => clearTimeout(e) );

         Array.from(this.el.children)
             .find(element => /media-info.*/g.test(element.className))
             .classList.toggle('info-open');
    },

    unbind(){
        this.el.removeEventListener('click', this.clickMe);
        this.el.removeEventListener('dblclick', this.doubleClickHandeler);
    }
});