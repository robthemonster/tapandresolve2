<template>
    <b-container id="DrawCard" class="bg-dark text-white">
        <span @click="$emit('open_modal', card)">
        <DrawCardImage :image_uri="card.image_uris.border_crop" :card_name="card.name"></DrawCardImage>
        </span>
        <DrawCardVoteBar :loggedIn="loggedIn" :downvotes="card.dislikedCount"
                         :upvotes="card.likedCount"></DrawCardVoteBar>
        <DrawCardButtonRow :loggedIn="loggedIn" :cardUserStatus="cardUserStatus"
                           v-on:draw_card_event="drawRandomCard"
                           v-on:like_card_event="like_if_not_liked"
                           v-on:dislike_card_event="dislike_if_not_disliked"></DrawCardButtonRow>
        <DrawFilters v-on:filterUpdate="handleFiltersChange"></DrawFilters>
    </b-container>
</template>

<script>
    import DrawCardImage from '../components/draw_page_components/DrawCardImage'
    import DrawCardVoteBar from "../components/draw_page_components/DrawCardVoteBar"
    import DrawCardButtonRow from "../components/draw_page_components/DrawCardButtonRow"
    import DrawFilters from "../components/draw_page_components/DrawFilters"
    import {API_URL, JSON_HEADER} from '../constants'

    const axios = require('axios');

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
    export default {
        props: ['loggedIn', 'cardUserStatus', 'card', 'modalOpen'],
        data() {
            return {currentFilters: DEFAULT_FILTERS, defaultFilters: DEFAULT_FILTERS}
        },
        methods: {
            like_if_not_liked() {
                if (!this.$props.cardUserStatus.liked) {
                    this.$emit('like_card');
                } else {
                    this.drawRandomCard();
                }
            },
            dislike_if_not_disliked() {
                if (!this.$props.cardUserStatus.blocked) {
                    this.$emit('dislike_card');
                } else {
                    this.drawRandomCard();
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
                        filter: JSON.stringify(outerThis.currentFilters)
                    };
                    axios.post(API_URL + "/randomCard", formdata, JSON_HEADER)
                        .then(function (response) {
                            outerThis.$emit("update_card", response.data);
                            outerThis.$emit('update_user_card_status', response.data.id);
                        });
                });
                if (sendEvent) {
                    this.$ga.event('draw_page_interaction', 'card_drawn');
                }
            },
            handleFiltersChange(filter) {
                const selectedColors = new Set(filter.colors_selected);
                for (let color in this.currentFilters.colorFlags) {
                    this.currentFilters.colorFlags[color] = selectedColors.has(color);
                }
                this.currentFilters.colorExclusive = filter.colorExclusive;
                const selectedTypes = new Set(filter.types_selected);
                this.currentFilters.allowLands = selectedTypes.has('lands');
                this.currentFilters.allowBasicLands = selectedTypes.has('basics');
                this.currentFilters.excludeTokens = !selectedTypes.has('tokens');
                this.currentFilters.excludeDigital = !selectedTypes.has('digital');
                this.currentFilters.excludePromos = !selectedTypes.has('promos');
                this.currentFilters.excludeSilly = !selectedTypes.has('silly');
                const selectedFormats = new Set(filter.formats_selected);
                for (let format in this.currentFilters.formatFlags) {
                    this.currentFilters.formatFlags[format] = selectedFormats.has(format);
                }
                this.currentFilters.commandersOnly = filter.commanders_only;
                this.currentFilters.artist = filter.artist;
                this.currentFilters.excludedSets = filter.excludedSets;
            }
        },
        mounted() {
            if (!this.$props.card.id) {
                this.drawRandomCard();
            }
        },
        watch: {
            loggedIn: function (val) {
                if (val) {
                    this.$emit('update_user_card_status', this.card.id);
                }
            },
            'cardUserStatus': function (newVal) {
                if (!this.$props.modalOpen && (newVal.liked || newVal.blocked)) {
                    setTimeout(this.drawRandomCard, 500);
                }
            }
        },
        components: {
            DrawCardImage,
            DrawCardVoteBar,
            DrawCardButtonRow,
            DrawFilters,
        }
    }
</script>

<style scoped>

</style>