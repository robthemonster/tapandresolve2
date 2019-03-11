<template>
    <b-container id="DrawCard">
        <DrawCardImage v-b-modal.draw_card_modal :image_uri="card.image_uris.border_crop"></DrawCardImage>
        <DrawCardVoteBar :downvotes="card.dislikedCount" :upvotes="card.likedCount"></DrawCardVoteBar>
        <DrawCardButtonRow :loggedIn="loggedIn" :cardUserStatus="cardUserStatus"
                           v-on:draw_card_event="drawRandomCard"></DrawCardButtonRow>
        <DrawFilters v-on:filterUpdate="handleFiltersChange"></DrawFilters>
        <CardModal id="draw_card_modal" :card="card"></CardModal>
    </b-container>
</template>

<script>
    import DrawCardImage from './DrawCardImage'
    import DrawCardVoteBar from "./DrawCardVoteBar"
    import DrawCardButtonRow from "./DrawCardButtonRow"
    import DrawFilters from "./DrawFilters"
    import CardModal from "../CardModal.vue"
    import {API_URL, JSON_HEADER} from '@/constants'

    const axios = require('axios');
    let cardUserStatus = {liked: false, blocked: false};
    let card = {image_uris: {border_crop: ""}, likedCount: 0, dislikedCount: 0};
    const DEFAULT_FILTERS = {
        colorExclusive: false,
        colorFlags: {"B": true, "U": true, "G": true, "R": true, "W": true},
        formatFlags: {
            "standard": false,
            "future": false,
            "frontier": false,
            "modern": false,
            "legacy": false,
            "pauper": false,
            "vintage": false,
            "penny": false,
            "commander": false,
            "duel": false,
            "oldschool": false
        },
        allowLands: true,
        allowBasicLands: true,
        commandersOnly: false,
        excludedSets: [],
        excludeSilly: false,
        excludePromos: false,
        excludeDigital: false,
        excludeTokens: false,
        rarityExclusions: {
            uncommon: false,
            common: false,
            rare: false,
            mythic: false
        },
        artist: ""
    };
    let currentFilters = DEFAULT_FILTERS;
    export default {
        name: "DrawCard",
        props: ['loggedIn'],
        data: function () {
            return {
                cardUserStatus: cardUserStatus,
                card: card
            }
        },
        methods: {
            fetchUserCardStatus() {
                if (this.$props.loggedIn) {
                    console.log('loggedIn');
                    let outerThis = this;
                    this.$parent.getAccount().then(function (account) {
                        let data = {uuid: outerThis.card.id, userid: account.id, token: account.token};
                        axios.post(API_URL + "/getUserCardStatus", data, JSON_HEADER)
                            .then(function (response) {
                                console.log(response.data);
                                outerThis.cardUserStatus = response.data;
                            }).catch(function(error) {
                                console.log(error);
                        })
                    }).catch(function (error) {
                        console.log("user error");
                        console.log(error);
                    });
                }
            },
            drawRandomCard() {
                let authenticated = {userid: "", token: ""};
                let outerThis = this;
                this.$parent.getAccount().then(function (account) {
                    authenticated = account;
                }).catch(function (error) {
                    console.log(error);
                }).finally(function () {
                    let formdata = {
                        userid: authenticated.id,
                        token: authenticated.token,
                        filter: JSON.stringify(currentFilters)
                    };
                    axios.post(API_URL + "/randomCard", formdata,JSON_HEADER)
                        .then(function (response) {
                            outerThis.card = response.data;
                            outerThis.fetchUserCardStatus();
                        })
                })
            },
            handleFiltersChange(filter) {
                const selectedColors = new Set(filter.colors_selected);
                for (let color in currentFilters.colorFlags) {
                    currentFilters.colorFlags[color] = selectedColors.has(color);
                }
                currentFilters.colorExclusive = filter.colorExclusive;
                const selectedTypes = new Set(filter.types_selected);
                currentFilters.allowLands = selectedTypes.has('lands');
                currentFilters.allowBasicLands = selectedTypes.has('basics');
                currentFilters.excludeTokens = !selectedTypes.has('tokens');
                currentFilters.excludeDigital = !selectedTypes.has('digital');
                currentFilters.excludePromos = !selectedTypes.has('promos');
                currentFilters.excludeSilly = !selectedTypes.has('silly');
                const selectedFormats = new Set(filter.formats_selected);
                for (let format in currentFilters.formatFlags) {
                    currentFilters.formatFlags[format] = selectedFormats.has(format);
                }
                currentFilters.commandersOnly = filter.commanders_only;
                currentFilters.artist = filter.artist;
                currentFilters.excludedSets = filter.excludedSets;
            }
        },
        mounted() {
            this.drawRandomCard();
        },
        watch: {
            loggedIn: function (val) {
                if (val) {
                    this.fetchUserCardStatus();
                }
            }
        },
        components: {
            DrawCardImage,
            DrawCardVoteBar,
            DrawCardButtonRow,
            DrawFilters,
            CardModal
        }
    }
</script>

<style scoped>

</style>