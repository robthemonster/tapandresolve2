<template>
    <div id="app">
        <NavBar v-on:logout="logout" v-on:login="login" :loggedIn="loggedIn"></NavBar>
        <router-view :loggedIn="loggedIn"
                     v-on:like_card="likeCard"
                     v-on:dislike_card="dislikeCard"
                     v-on:update_user_card_status="getUserCardStatus"
                     v-on:update_card_from_modal="updateCardFromModal"
                     v-on:open_modal="openModalForCard"
                     :modalOpen="modalOpen"
                     :drawCard="drawCard"
                     v-on:update_card_from_draw_page="updateDrawCard"
                     class="bg-dark py-3"></router-view>
        <CardModal
                :card="modalCard"
                :loggedIn="loggedIn"
                v-on:like_card="likeCard"
                v-on:dislike_card="dislikeCard"
                v-on:update_user_card_status="getUserCardStatus"
                v-on:update_card_from_modal="updateCardFromModal"
        ></CardModal>
        <Footer></Footer>
    </div>
</template>

<script>
    import Vue from 'vue'
    import BootstrapVue from 'bootstrap-vue'
    import Octicon from 'vue-octicon/components/Octicon.vue'
    import 'vue-octicon/icons';
    import 'bootstrap/dist/css/bootstrap.css'
    import 'bootstrap-vue/dist/bootstrap-vue.css'
    import VueCookies from 'vue-cookies'
    import NavBar from "./components/NavBar.vue"
    import Footer from "./components/Footer.vue"
    import CardModal from "./components/CardModal.vue"
    import VueAnalytics from 'vue-analytics'
    import {API_URL, DEFAULT_USER_CARD_STATUS, JSON_HEADER} from "@/constants";
    import {registerServiceWorker} from "./registerServiceWorker.js"

    registerServiceWorker();
    const axios = require('axios');

    Vue.use(VueAnalytics, {
        id: 'UA-135023229-1'
    });

    const netlifyIdentity = require('netlify-identity-widget');

    Vue.use(BootstrapVue, VueCookies);
    Vue.component('octicon', Octicon);
    let loggedIn = false;
    let card = {
        image_uris: {border_crop: ""},
        likedCount: 0,
        dislikedCount: 0,
        name: "",
        oracle_text: "",
        flavor_text: "",
        set_name: "",
        legalities: {},
        purchase_uris: {},
        uri: false,
    };
    let modalOpen = false;
    export default {
        name: 'app',
        components: {
            NavBar,
            Footer,
            CardModal
        },
        data: function () {
            return {loggedIn: loggedIn, modalOpen: modalOpen, modalCard: card, drawCard: card};
        },
        methods: {
            getAccount() {
                return new Promise(function (resolve, reject) {
                    if (netlifyIdentity.currentUser()) {
                        netlifyIdentity.currentUser().jwt().then(function (token) {
                            resolve({id: netlifyIdentity.currentUser().id, token: token});
                        }).catch(function () {
                            reject({id: undefined, token: undefined});
                        })
                    } else {
                        reject({id: undefined, token: undefined});
                    }
                });
            },
            login() {
                netlifyIdentity.open();
            },
            logout() {
                netlifyIdentity.logout();
            },
            updateCardFromModal(card) {
                this.modalCard = card;
            },
            updateDrawCard(card) {
              this.drawCard = card;
            },
            openModalForCard(card) {
                this.modalCard = card;
                this.$ga.event('modal_interaction', 'modal_open');
                this.$root.$emit('bv::show::modal', 'card_modal')
            },
            getUserCardStatus(card_id, callback = function () {
            }) {
                let cardStatus = DEFAULT_USER_CARD_STATUS;
                this.getAccount().then(function (account) {
                    let data = {uuid: card_id, userid: account.id, token: account.token};
                    axios.post(API_URL + "/getUserCardStatus", data, JSON_HEADER)
                        .then(function (response) {
                            cardStatus = response.data;
                            callback(cardStatus);
                        }).catch(callback);
                }).catch(callback);
            },
            likeCard(uuid, unlike = false, callback = () => {
            }) {
                this.getAccount().then(function (account) {
                    const data = {uuid: uuid, userid: account.id, token: account.token};
                    const action = unlike ? "/removeCardFromLiked" : "/addCardToLiked";
                    axios.post(API_URL + action, data, JSON_HEADER).then(function (response) {
                        callback(response.data);
                    });
                });
                this.$ga.event('card_interaction', 'card_liked');
            },
            dislikeCard(uuid, undislike = false, callback = () => {
            }) {
                this.getAccount().then(function (account) {
                    const data = {uuid: uuid, userid: account.id, token: account.token};
                    const action = undislike ? "/removeCardFromBlocked" : "/addCardToBlocked";
                    axios.post(API_URL + action, data, JSON_HEADER).then(function (response) {
                        callback(response.data);
                    });
                });
                this.$ga.event('card_interaction', 'card_disliked');
            }
        },
        mounted() {
            const outerThis = this;
            netlifyIdentity.on('init', user => {
                if (user) {
                    outerThis.loggedIn = true;
                }
            });
            netlifyIdentity.on('login', function () {
                outerThis.loggedIn = true;
            });
            netlifyIdentity.on('logout', function () {
                outerThis.loggedIn = false;
            });
            netlifyIdentity.init();
            this.$root.$on('bv::modal::show', (bvEvent, modalId) => {
                if (modalId === "card_modal") {
                    outerThis.modalOpen = true;
                }
            });
            this.$root.$on('bv::modal::hidden', (bvEvent, modalId) => {
                if (modalId === "card_modal") {
                    outerThis.modalOpen = false;
                }
            });
        }
    }

</script>

<style>
    #app {
        min-height: 100vh;
    }
</style>
