import Vue from 'vue';
import Rx, {Observable} from 'rxjs';

export default Vue.directive('db-click-handler', {

    bind() {
        this.clickSource = Rx.Observable.fromEvent(this.el, 'click').delay(150);
        this.dbClickSource =  Rx.Observable.fromEvent(this.el, 'dblclick');

        this.clickSubscribe = this.clickSource.subscribe(this.clickHandeler.bind(this));
        this.dblClickSubscribe = this.dbClickSource.subscribe(this.doubleClickHandeler.bind(this));
    },

    clickHandeler(){
        this.el.classList.toggle('selected');
    },

    doubleClickHandeler(){
        this.clickSubscribe.unsubscribe();

         Array.from(this.el.children)
             .find(element => /media-info.*/g.test(element.className))
             .classList.toggle('info-open');

        this.clickSubscribe = this.clickSource.subscribe(this.clickHandeler.bind(this));
    },

    unbind(){
        this.clickSubscribe.unsubscribe();
        this.dblClickSubscribe.unsubscribe();
    }
});