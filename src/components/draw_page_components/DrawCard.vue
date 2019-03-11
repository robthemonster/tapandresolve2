<template>
    <b-container id="DrawCard" class="bg-dark text-white">
        <span @click="launchModal">
        <DrawCardImage :image_uri="card.image_uris.border_crop"></DrawCardImage>
        </span>
        <DrawCardVoteBar :loggedIn="loggedIn" :downvotes="card.dislikedCount"
                         :upvotes="card.likedCount"></DrawCardVoteBar>
        <DrawCardButtonRow :loggedIn="loggedIn" :cardUserStatus="cardUserStatus"
                           v-on:draw_card_event="drawRandomCard" v-on:like_card_event="likeCard"
                           v-on:dislike_card_event="dislikeCard"></DrawCardButtonRow>
        <DrawFilters v-on:filterUpdate="handleFiltersChange"></DrawFilters>
        <CardModal
                ref="card_modal_ref"
                v-on:updateCardDetailsFromModal="updateCard"
                v-on:fetchCardStatusById="fetchUserCardStatus"
                :loggedIn="loggedIn"
                :card="card"
                :cardUserStatus="cardUserStatus"
        ></CardModal>
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
                card: card,
            }
        },
        methods: {
            fetchUserCardStatus(card) {
                if (this.$props.loggedIn) {
                    let outerThis = this;
                    this.$parent.getAccount().then(function (account) {
                        let data = {uuid: outerThis.card.id, userid: account.id, token: account.token};
                        axios.post(API_URL + "/getUserCardStatus", data, JSON_HEADER)
                            .then(function (response) {
                                outerThis.cardUserStatus = response.data;
                            }).catch(function (error) {
                        })
                    });
                }
            },
            drawRandomCard(sendEvent) {
                let authenticated = {userid: "", token: ""};
                let outerThis = this;
                this.$parent.getAccount().then(function (account) {
                    authenticated = account;
                }).finally(function () {
                    let formdata = {
                        userid: authenticated.id,
                        token: authenticated.token,
                        filter: JSON.stringify(currentFilters)
                    };
                    axios.post(API_URL + "/randomCard", formdata, JSON_HEADER)
                        .then(function (response) {
                            outerThis.card = response.data;
                            outerThis.fetchUserCardStatus();
                        })
                });
                if (sendEvent) {
                    this.$gtm.trackEvent({
                        event:'draw_page_event',
                        category: 'draw_page_interaction',
                        action: 'card_drawn',
                        label:"draw_page",
                        value:1
                    });
                }
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
            },
            launchModal() {
                this.$root.$emit('bv::show::modal', 'card_modal')
            },
            getAccount() {
                return this.$parent.getAccount();
            },
            updateCard(card) {
                this.card = card;
            },
            likeCard() {
                const outerThis = this;
                this.getAccount().then(function (account) {
                    const data = {uuid: outerThis.card.id, userid: account.id, token: account.token};
                    axios.post(API_URL + "/addCardToLiked", data, JSON_HEADER).then(function (response) {
                        outerThis.updateCard(response.data);
                        outerThis.fetchUserCardStatus();
                    }).finally(function () {
                        setTimeout(outerThis.drawRandomCard, 1000);
                    });
                });
                this.$gtm.trackEvent({
                    event:'draw_page_event',
                    category: 'draw_page_interaction',
                    action: 'card_liked',
                    label:"draw_page",
                    value:1
                });
            },
            dislikeCard() {
                const outerThis = this;
                this.getAccount().then(function (account) {
                    const data = {uuid: outerThis.card.id, userid: account.id, token: account.token};
                    axios.post(API_URL + "/addCardToBlocked", data, JSON_HEADER).then(function (response) {
                        outerThis.updateCard(response.data);
                        outerThis.fetchUserCardStatus();
                    }).finally(function () {
                        setTimeout(outerThis.drawRandomCard, 1000);
                    });
                });
                this.$gtm.trackEvent({
                    event:'draw_page_event',
                    category: 'draw_page_interaction',
                    action: 'card_disliked',
                    label:"draw_page",
                    value:1
                });
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