import authApi from '@/common/apis/auth';
import util from '@/common/Util';
import request from '@/common/request';
import {Base64} from 'js-base64';
import store from '@/store/index';

export default {
    state: {
        userInfo: {},
        token: undefined,
        loginState: false,
        role: {},
        permission: {},
        tokenExp: 0
    },
    actions: {
        login({commit, state}, params) {
            return new Promise((resolve, reject) => {
                authApi.userLogin(params).then(res => {
                    util.handelHttpResponseResult(res, true, '登录成功')
                        .then(({data}) => {
                            resolve(data);
                        }).catch(() => {
                        reject(res);
                    });
                }).catch((err) => {
                    reject(err);
                });
            });
        },
        async logout({commit}) {
            // authApi.logout();
            commit('SET_USERINFO', {});
            commit('SET_TOKEN', undefined);
            commit('SET_LOGIN_STATE', false);
            commit('SET_ROLE', {});
            commit('SET_PERMISSION', {});
            commit('SET_TOKEN_EXP', 0);
            return await true;
        },
        async setUserDataInfo({commit}, data) {
            commit('SET_USERINFO', {
                name: data.name,
                managerId: data.id,
                uniqueName: data.uniqueName
            });
            let role = data.details;
            commit('SET_ROLE', {
                roleID: role.roleID,
                stores: role.stores,
                roleName: role.roleName,
                roleLevel: role.roleLevel,
                roleScope: role.roleScope
            });
            let permission = role.access;
            commit('SET_PERMISSION', permission);
            commit('SET_LOGIN_STATE', true);
            commit('SET_TOKEN_EXP', data.exp);
            return await data;
        },
        async loginThenSetToken({commit}, token) {
            commit('SET_TOKEN', token);
            let userInfo = Base64.decode(token.split('.')[1]);
            let data = JSON.parse(userInfo);
            return await data;
        },
        refreshToken() {
            authApi.refreshToken().then(res => {
                util.handelHttpResponseResult(res, false, '', false).then(({data}) => {
                    try {
                        store.commit('SET_TOKEN', data.managerToken);
                        let token = data.managerToken.split('.')[1];
                        let userInfo = JSON.parse(Base64.decode(token));
                        console.info(userInfo);
                        userInfo.details.access = JSON.parse(userInfo.details.access);
                        this.dispatch('setUserDataInfo', userInfo);
                    } catch (e) {
                        console.info(e);
                    }
                });
            });
        }
    },
    mutations: {
        SET_USERINFO(state, user) {
            state.userInfo = user;
        },
        SET_TOKEN(state, token) {
            state.token = token;
            request.defaults.headers['x-manager-token'] = token;
        },
        SET_LOGIN_STATE(state, st) {
            state.loginState = st;
        },
        SET_ROLE(state, st) {
            state.role = st;
        },
        SET_PERMISSION(state, st) {
            state.permission = st;
        },
        SET_TOKEN_EXP(state, exp) {
            state.tokenExp = exp;
        }
    },
    getters: {
        user: s => s.userInfo,
        token: s => s.token,
        loginState: s => s.loginState,
        role: s => s.role,
        permission: s => s.permission,
        tokenExp: s => s.tokenExp
    }
};
