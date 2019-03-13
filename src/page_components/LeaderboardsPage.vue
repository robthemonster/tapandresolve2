<template>
    <div>
        <b-container>
            <LeaderboardsSortSelector v-on:fetch_leaderboards="fetch_leaderboards">
            </LeaderboardsSortSelector>
            <CardList :card_list="cards" v-on:open_modal="open_modal"></CardList>
        </b-container>
    </div>
</template>

<script>
    import LeaderboardsSortSelector from "../components/leaderboards_page_components/LeaderboardsSortSelector.vue"
    import CardList from "../components/CardList.vue"
    import {API_URL, JSON_HEADER} from "@/constants";

    const axios = require('axios');
    let cards = [];
    export default {
        components: {
            LeaderboardsSortSelector,
            CardList,
        },
        props: ['loggedIn', 'cardUserStatus'],
        data: function () {
            return {
                sortType: "TOP",
                selfRef: 'leaderboards',
                cards: cards
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
                                outerThis.selectedCardUserStatus = response.data;
                            }
                        });
                })
            },
            fetch_leaderboards(sort_type) {
                this.sortType = sort_type;
                let data = {sort: sort_type};
                let outerThis = this;
                axios.post(API_URL + "/getTopCards", data, JSON_HEADER).then(function (response) {
                    outerThis.cards = response.data;
                })
            }
        }
    }
</script>
<style scoped>
</style>