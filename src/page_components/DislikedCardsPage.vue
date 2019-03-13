<template>
    <div>
        <b-container>
            <b-form-input
                    :state="(filterString !== '' && filteredCards.length === 0) ? false : filterString !== '' ? true : null "
                    @input="filterCards" placeholder="Search by name" size="lg"
                    v-model="filterString" list="filtered_card_list"></b-form-input>
            <datalist id="filtered_card_list">
                <option v-for="card in filteredCards">{{card.name}}</option>
            </datalist>
            <CardList :card_list="filteredCards" v-on:open_modal="open_modal"></CardList>
        </b-container>
    </div>
</template>

<script>
    import CardList from "../components/CardList.vue"
    import {API_URL} from '../constants'
    import {EMPTY_CARD, JSON_HEADER} from "@/constants";

    const axios = require('axios');

    let cards = [];
    export default {
        components: {
            CardList,
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
            fetchDislikedCards() {
                const outerThis = this;
                this.$parent.getAccount().then(function (account) {
                    const data = {userid: account.id, token: account.token};
                    axios.post(API_URL + "/getBlocked", data, JSON_HEADER).then(function (response) {
                        outerThis.cards = response.data;
                        outerThis.filterCards();
                        outerThis.selectedCard = EMPTY_CARD;
                        outerThis.selectedCardUserStatus = {liked: false, blocked: false};
                    })
                });
            }
        },
        mounted() {
            this.fetchDislikedCards();
        },
        watch: {
            'loggedIn': function () {
                this.fetchDislikedCards();
            }
        }
    }
</script>

<style scoped>

</style>