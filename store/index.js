import Vue from 'vue'
import Vuex from 'vuex'
import {storage} from '../util/util'
Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        /**
         * 是否需要强制登录
         */
        forcedLogin: true,
        hasLogin: false,
		tel:null,
    },
    mutations: {
        login(state, tel) {
			storage.setItem('tel',tel);
            state.tel = tel;
            state.hasLogin = true;
        },
        logout(state) {
			storage.removeItem('tel');
            state.tel = null;
            state.hasLogin = false;
        }
    }
})

export default store
