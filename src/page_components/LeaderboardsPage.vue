<template>
    <div id="app">
        <NavBar v-on:logout="logout" v-on:login="login" :loggedIn="loggedIn" :selfRef="selfRef"></NavBar>
        <b-container>
            <LeaderboardsSortSelector v-on:fetch_leaderboards="fetch_leaderboards">
            </LeaderboardsSortSelector>
            <CardList :card_list="cards" v-on:card-list-open-modal="openCardForModal"></CardList>
        </b-container>
        <CardModal
                :card="selectedCard"
                :cardUserStatus="selectedCardUserStatus"
                :loggedIn="loggedIn"
                v-on:fetchCardStatusById="getUserCardStatus"
                v-on:modal-closed-event="fetch_leaderboards(sortType)"
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
    import NavBar from "../components/NavBar.vue"
    import LeaderboardsSortSelector from "../components/leaderboards_page_components/LeaderboardsSortSelector.vue"
    import CardList from "../components/CardList.vue"
    import CardModal from "../components/CardModal.vue"
    import Footer from "../components/Footer.vue"
    import {API_URL, EMPTY_CARD, JSON_HEADER} from "@/constants";
    import {getAccountPromise} from '../constants'
    import VueAnalytics from 'vue-analytics'

    Vue.use(VueAnalytics, {
        id: 'UA-135023229-1'
    });

    const netlifyIdentity = require('netlify-identity-widget');

    Vue.use(BootstrapVue);
    Vue.component('octicon', Octicon);

    const axios = require('axios');
    let cards = [];
    let loggedIn = false;
    let selectedCardUserStatus = {liked: false, blocked: false};
    export default {
        name: "app",
        components: {
            NavBar,
            LeaderboardsSortSelector,
            CardList,
            CardModal,
            Footer
        },
        data: function () {
            return {
                loggedIn: loggedIn,
                sortType: "TOP",
                selfRef: 'leaderboards.html',
                cards: cards,
                selectedCard: EMPTY_CARD,
                selectedCardUserStatus: selectedCardUserStatus
            };
        },
        methods: {
            openCardForModal(card) {
                this.selectedCard = card;
                this.$root.$emit('bv::show::modal', 'card_modal')
            },
            getUserCardStatus(card_id) {
                const outerThis = this;
                this.getAccount().then(function (account) {
                    console.log('auth');
                    let data = {uuid: card_id, userid: account.id, token: account.token};
                    console.log(data);
                    axios.post(API_URL + "/getUserCardStatus", data, JSON_HEADER)
                        .then(function (response) {
                            console.log(response);
                            if (outerThis.selectedCard.id === card_id) {
                                console.log(response);
                                outerThis.selectedCardUserStatus = response.data;
                            }
                        }).catch((err) => console.log(err));
                })
            },
            fetch_leaderboards(sort_type) {
                this.sortType = sort_type;
                let data = {sort: sort_type};
                let outerThis = this;
                axios.post(API_URL + "/getTopCards", data, JSON_HEADER).then(function (response) {
                    outerThis.cards = response.data;
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
            document.title += " - Leaderboards";
        }
    }
</script>

<style scoped>
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        color: #2c3e50;
        min-height: 100vh;
    }
</style>