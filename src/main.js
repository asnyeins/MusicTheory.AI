import Vue from 'vue';
import App from './App.vue';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';

Vue.config.productionTip = false;

Vue.use(Vuetify, {
	theme: {
		primary: '#59292e',
		secondary: '#282e3c',
		accent: '#303747',
		info: '#323642',
		error: '#ff643d',
	},
});

new Vue({
	render: h => h(App),
}).$mount('#app');
