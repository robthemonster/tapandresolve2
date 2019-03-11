<template>
    <div>
        <LeaderboardsSortSelector v-on:fetch_leaderboards="fetch_leaderboards">
        </LeaderboardsSortSelector>
        <CardList :card_list="cards"></CardList>
    </div>
</template>

<script>
    import LeaderboardsSortSelector from "./LeaderboardsSortSelector"
    import CardList from "../CardList"
    import {API_URL, JSON_HEADER} from "@/constants";

    const axios = require('axios');
    let cards = [];
    export default {
        name: "Leaderboards",
        components: {
            LeaderboardsSortSelector,
            CardList
        },
        methods: {
            fetch_leaderboards(sort_type) {
                console.log(sort_type);
                let data = {sort:sort_type};
                let outerThis = this;
                axios.post(API_URL + "/getTopCards",data, JSON_HEADER).then(function(response) {
                    outerThis.cards = response.data;
                })
            }
        },
        data() {
            return {cards:cards};
        }
    }
</script>

<style scoped>

</style>