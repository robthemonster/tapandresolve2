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
            <CardList :card_list="displayedCards" v-on:open_modal="open_modal"></CardList>
            <infinite-loading ref="infiniteLoader" :identifier="JSON.stringify(filteredCards)" class="text-white"
                              @infinite="addPage">
                <div slot="no-more">No more cards</div>
                <div slot="no-results">No cards</div>
            </infinite-loading>
        </b-container>
    </div>
</template>

<script>
    import CardList from "../components/CardList.vue"
    import {API_URL, JSON_HEADER} from '../constants'
    import InfiniteLoading from 'vue-infinite-loading';

    const axios = require('axios');

    let cards = [];
    export default {
        components: {
            CardList,
            InfiniteLoading
        },
        data: function () {
            return {
                cards: [],
                page: 0,
                PAGE_SIZE: 15,
                filteredCards: cards,
                displayedCards: cards,
                filterString: ""
            };
        },
        methods: {
            open_modal(card) {
                this.$emit('open_modal', card)
            },
            filterCards() {
                let filteredCards = [];
                this.page = 0;
                this.$refs.infiniteLoader.stateChanger.reset();
                const filterString = this.filterString.toLowerCase();
                this.cards.forEach(function (card) {
                    if (card.name.toLowerCase().includes(filterString)) {
                        filteredCards.push(card);
                    }
                });
                this.filteredCards = filteredCards;
                this.displayedCards = filteredCards.slice(0, this.PAGE_SIZE);
            },
            fetchCards() {
                const outerThis = this;
                this.$parent.getAccount().then(function (account) {
                    const data = {userid: account.id, token: account.token};
                    axios.post(API_URL + outerThis.apiPath, data, JSON_HEADER).then(function (response) {
                        outerThis.cards = response.data;
                        outerThis.filterCards();
                    });
                });
            },
            addPage($state) {
                if (this.page * this.PAGE_SIZE < this.filteredCards.length) {
                    this.page++;
                    this.displayedCards.push(... this.filteredCards.slice(this.page * this.PAGE_SIZE,
                        Math.min(this.filteredCards.length, (this.page + 1) * this.PAGE_SIZE)));
                    $state.loaded();
                } else {
                    $state.complete();
                }
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
