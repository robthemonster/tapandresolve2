<template>
    <div>
        <b-container>
            <b-form-input
                    :state="(filterString !== '' && filteredCards.length === 0) ? false : filterString !== '' ? true : null "
                    @input="filterCards" placeholder="Search by name" size="lg"
                    v-model="filterString" list="filtered_card_list"></b-form-input>
            <datalist id="filtered_card_list">
                <option v-for="card in filteredCards" :key="card.id">{{card.name}}</option>
            </datalist>
            <CardList :card_list="filteredCards" v-on:open_modal="open_modal"></CardList>
        </b-container>
    </div>
</template>

<script>
    import CardList from "../components/CardList.vue"
    import {API_URL} from '../constants'
    import {JSON_HEADER} from "@/constants";

    const axios = require('axios');

    let cards = [];
    export default {
        components: {
            CardList
        },
        data: function () {
            return {
                cards: [],
                filteredCards: cards,
                filterString: ""
            };
        },
        methods: {
            open_modal(card) {
                this.$emit('open_modal', card)
            },
            filterCards() {
                let filteredCards = [];
                const filterString = this.filterString.toLowerCase();
                this.cards.forEach(function (card) {
                    if (card.name.toLowerCase().includes(filterString)) {
                        filteredCards.push(card);
                    }
                });
                this.filteredCards = filteredCards;
            },
            fetchCards() {
                const outerThis = this;
                this.$parent.getAccount().then(function (account) {
                    const data = {userid: account.id, token: account.token};
                    axios.post(API_URL + outerThis.apiPath, data, JSON_HEADER).then(function (response) {
                        outerThis.cards = response.data;
                        outerThis.filterCards();
                    })
                });
            }
        },
        mounted() {
            this.fetchCards();
            let outerThis = this;
            this.$root.$on('bv::modal::hidden', () => {
                outerThis.fetchCards()
            });
        },
        props: ['loggedIn', 'apiPath'],
        watch: {
            'loggedIn': function () {
                this.fetchCards();
            },
            'apiPath': function () {
                this.fetchCards();
            }
        }
    }
</script>

<style scoped>

</style>