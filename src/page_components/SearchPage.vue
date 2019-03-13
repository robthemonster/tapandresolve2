<template>
    <div>
        <b-container>
            <b-form-input
                    :state="searchString.length > 2 && cards.length > 0 ? true : searchString.length > 2 ? false : null"
                    placeholder="Search by name" size="lg"
                    v-model="searchString" list="search_result_list"></b-form-input>
            <datalist id="search_result_list">
                <option v-for="card in cards">{{card.name}}</option>
            </datalist>
            <CardList v-on:open_modal="open_modal" :card_list="cards"></CardList>
        </b-container>
    </div>
</template>

<script>
    import CardList from "@/components/CardList";
    import {API_URL, JSON_HEADER} from "@/constants";

    const axios = require('axios');

    let cards = [];
    export default {
        components: {
            CardList
        },
        data: function () {
            return {
                cards: cards,
                searchString: "",
            };
        },
        methods: {
            open_modal(card) {
                this.$emit('open_modal', card);
            },
            getUserCardStatus(card_id) {
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
            fetchSearchResults() {
                const outerThis = this;
                const data = {searchString: this.searchString, pageNumber: 0, pageSize: 50};
                axios.post(API_URL + "/searchForCard", data, JSON_HEADER).then(function (response) {
                    outerThis.cards = response.data.cards;
                });
            }
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