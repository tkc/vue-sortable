import Vue from 'vue'
import Sortable from 'sortablejs'
import App from './App.vue'

Vue.directive('sortable', {
    inserted: (el, binding) => {
        new Sortable(el, binding.value || {})
    }
});

new Vue({
    el: '#app',
    render: h => h(App)
});
