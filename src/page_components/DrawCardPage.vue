<template>
    <div>
        <b-container id="DrawCard" class="text-white">
        <span @click="$emit('open_modal', drawCard)">
        <DrawCardImage :image_uri="drawCard.image_uris.border_crop" :card_name="drawCard.name"></DrawCardImage>
                        <p class="text-muted text-center">Tap card for prices and info</p>
        </span>
            <DrawCardVoteBar :loggedIn="loggedIn" :downvotes="drawCard.dislikedCount"
                             :upvotes="drawCard.likedCount"></DrawCardVoteBar>
            <DrawCardButtonRow :loggedIn="loggedIn" :userCardStatus="userCardStatus"
                               v-on:draw_card_event="drawRandomCard"
                               v-on:like_card_event="like_if_not_liked"
                               v-on:dislike_card_event="dislike_if_not_disliked"></DrawCardButtonRow>
            <p class="text-center">Cards left after applying filters: {{filterSize}}</p>
            <DrawFilters v-on:filterUpdate="handleFiltersChange"></DrawFilters>
        </b-container>
    </div>
</template>

<script>
    import DrawCardImage from '../components/draw_page_components/DrawCardImage'
    import DrawCardVoteBar from "../components/draw_page_components/DrawCardVoteBar"
    import DrawCardButtonRow from "../components/draw_page_components/DrawCardButtonRow"
    import DrawFilters from "../components/draw_page_components/DrawFilters"
    import {API_URL, JSON_HEADER} from '../constants'
    import {DEFAULT_USER_CARD_STATUS} from "@/constants";

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
        allowedTypes: {
            'token': true,
            'basic': true,
            'land': true,
            'creature': true,
            'artifact': true,
            'enchantment': true,
            'planeswalker': true,
            'instant': true,
            'sorcery': true,
            'misc': true
        },
        allowedCategories: {
            'digital': true,
            'promo': true,
            'silly': true
        },
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
        artist: "",
        restrictCmc: false,
        cmc: 0
    };
    export default {
        props: ['loggedIn', 'modalOpen', 'drawCard'],
        data() {
            return {
                currentFilters: DEFAULT_FILTERS,
                defaultFilters: DEFAULT_FILTERS,
                userCardStatus: DEFAULT_USER_CARD_STATUS,
                filterSize: 0
            }
        },
        methods: {
            setCard(card) {
                this.$emit('update_card_from_draw_page', card);
                this.$emit('update_user_card_status', card.id, this.setUserCardStatus);
            },
            setUserCardStatus(status) {
                this.userCardStatus = status;
            },
            like_if_not_liked() {
                if (!this.userCardStatus.liked) {
                    this.$emit('like_card', this.$props.drawCard.id, false, this.setCard);
                } else {
                    this.drawRandomCard();
                }
            },
            dislike_if_not_disliked() {
                if (!this.userCardStatus.blocked) {
                    this.$emit('dislike_card', this.$props.drawCard.id, false, this.setCard);
                } else {
                    this.drawRandomCard();
                }
            },
            drawRandomCard(sendEvent) {
                let authenticated;
                let outerThis = this;
                this.$parent.getAccount().then(function (account) {
                    authenticated = account;
                }).catch(function () {
                    authenticated = {userid: "", token: ""};
                }).finally(function () {
                    let formdata = {
                        userid: authenticated.id,
                        token: authenticated.token,
                        filter: JSON.stringify(outerThis.currentFilters)
                    };
                    axios.post(API_URL + "/randomCard", formdata, JSON_HEADER)
                        .then(function (response) {
                            outerThis.setCard(response.data);
                            outerThis.updateFilterSize();
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

                for (let type in this.currentFilters.allowedTypes) {
                    this.currentFilters.allowedTypes[type] = selectedTypes.has(type);
                }
                const selectedCategories = new Set(filter.categories_selected);
                for (let category in this.currentFilters.allowedCategories) {
                    this.currentFilters.allowedCategories[category] = selectedCategories.has(category);
                }

                const selectedFormats = new Set(filter.formats_selected);
                for (let format in this.currentFilters.formatFlags) {
                    this.currentFilters.formatFlags[format] = selectedFormats.has(format);
                }
                const selectedRarities = new Set(filter.rarities_selected);
                for (let rarity in this.currentFilters.rarityExclusions) {
                    this.currentFilters.rarityExclusions[rarity] = !selectedRarities.has(rarity);
                }
                this.currentFilters.commandersOnly = filter.commanders_only;
                this.currentFilters.artist = filter.artist;
                this.currentFilters.excludedSets = filter.excludedSets;
                this.currentFilters.restrictCmc = filter.restrictCmc;
                this.currentFilters.cmc = filter.cmc;

                this.updateFilterSize();

            },
            updateFilterSize() {
                const outerThis = this;
                let authenticated = {userid: "", token: ""};
                this.$parent.getAccount().then(account => {
                    authenticated = account;
                }).finally(() => {
                    let data = {
                        userid: authenticated.id,
                        token: authenticated.token,
                        filters: JSON.stringify(outerThis.currentFilters)
                    };
                    axios.post(API_URL+"/getFilterSize", data, JSON_HEADER).then(response => {
                        outerThis.filterSize = response.data.numLeft;
                    })
                })
            },
            refreshUserCardStatus() {
                this.setCard(this.$props.drawCard);
            }
        },
        mounted() {
            if (!this.$props.drawCard.id) {
                this.drawRandomCard();
            }
            let outerThis = this;
            this.$root.$on('bv::modal::hidden', () => {
                outerThis.refreshUserCardStatus()
            })
        },
        watch: {
            loggedIn: function (val) {
                if (val) {
                    this.$emit('update_user_card_status', this.$props.drawCard.id, this.setUserCardStatus);
                }
            },
            'userCardStatus': function (newVal) {
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