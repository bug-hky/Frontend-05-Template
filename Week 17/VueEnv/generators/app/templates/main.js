import Main from './main.vue'
import Vue from 'Vue'

Vue.config.productionTip = false;

new Vue({
    el: "#app",
    // render: h => h(Main)
    template: "<Main/>",
    components: { Main }
})