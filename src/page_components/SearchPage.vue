<template>
    <div id="app">
        <NavBar v-on:logout="logout" v-on:login="login" :loggedIn="loggedIn" :selfRef="selfRef"></NavBar>
        <b-form-input :state="searchString.length > 2" placeholder="Card name" size="lg"
                      v-model="searchString"></b-form-input>
        <CardList v-on:card-list-open-modal="openCardForModal" :card_list="cards"></CardList>
        <CardModal
                :card="selectedCard"
                :cardUserStatus="selectedStatus"
                :loggedIn="loggedIn"
                v-on:fetchCardStatusById="getUserCardStatus"
                v-on:modal-closed-event="fetchSearchResults"
        ></CardModal>
    </div>
</template>

<script>
    import Vue from 'vue'
    import BootstrapVue from 'bootstrap-vue'
    import Octicon from 'vue-octicon/components/Octicon.vue'
    import 'vue-octicon/icons';
    import 'bootstrap/dist/css/bootstrap.css'
    import 'bootstrap-vue/dist/bootstrap-vue.css'
    import NavBar from "../components/NavBar.vue"
    import CardList from "../components/CardList.vue"
    import CardModal from "../components/CardModal.vue"
    import {API_URL, getAccountPromise, JSON_HEADER} from '../constants'
    import {EMPTY_CARD} from "@/constants";


    const axios = require('axios');

    const netlifyIdentity = require('netlify-identity-widget');

    Vue.use(BootstrapVue);
    Vue.component('octicon', Octicon);
    let loggedIn = false;
    let cards = [];
    export default {
        name: "app",
        components: {
            NavBar,
            CardList,
            CardModal
        },
        data: function () {
            return {
                loggedIn: loggedIn,
                selfRef: 'search.html',
                cards: cards,
                searchString: "",
                selectedCard: EMPTY_CARD,
                selectedStatus: {liked: false, blocked: false}
            };
        },
        methods: {
            openCardForModal(card) {
                this.selectedCard = card;
                this.getUserCardStatus(card.id);
                this.$root.$emit('bv::show::modal', 'card_modal')
            },
            getUserCardStatus(card_id) {
                console.log(card_id);
                const outerThis = this;
                this.getAccount().then(function (account) {
                    let data = {uuid: card_id, userid: account.id, token: account.token};
                    axios.post(API_URL + "/getUserCardStatus", data, JSON_HEADER)
                        .then(function (response) {
                            if (outerThis.selectedCard.id === card_id) {
                                outerThis.selectedStatus = response.data;
                            }
                        });
                })
            },
            getAccount() {
                return getAccountPromise(netlifyIdentity);
            },
            login() {
                netlifyIdentity.open();
            },
            logout() {
                netlifyIdentity.logout();
            },
            fetchSearchResults() {
                const outerThis = this;
                const data = {searchString: this.searchString, pageNumber: 0, pageSize: 50};
                axios.post(API_URL + "/searchForCard", data, JSON_HEADER).then(function (response) {
                    outerThis.cards = response.data.cards;
                    outerThis.selectedCard = EMPTY_CARD;
                    outerThis.selectedCardUserStatus = {liked: false, blocked: false};
                });
            }
        },
        mounted() {
            netlifyIdentity.on('init', user => {
                if (user) {
                    this.loggedIn = true;
                }
            });
            netlifyIdentity.on('login', user => {
                this.loggedIn = true;
            });
            netlifyIdentity.on('logout', user => {
                this.loggedIn = false;
            });
            netlifyIdentity.init();
        },
        watch: {
            'searchString': function () {
                this.fetchSearchResults();
            }
        }
    }
</script>

<style scoped>

</style>