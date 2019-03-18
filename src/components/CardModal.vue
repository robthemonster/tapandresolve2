<template>
    <b-modal ref="modal_ref" id="card_modal" size="lg" :title="card.name" centered scrollable>
        <DrawCardImage :image_uri="card.image_uris.border_crop" :card_name="card.name"></DrawCardImage>
        <DrawCardVoteBar :loggedIn="loggedIn" :downvotes="card.dislikedCount"
                         :upvotes="card.likedCount"></DrawCardVoteBar>
        <div><h5>{{card.type_line}}</h5></div>
        <div v-if="!card.card_faces">
            <p>{{card.oracle_text}}</p>
            <p><i>{{card.flavor_text}}</i></p>
        </div>
        <div v-if="card.card_faces">
            <div v-for="face in card.card_faces" :key="face.name">
                <h5>{{face.name}}</h5>
                <p>{{face.oracle_text}}</p>
                <p><i>{{face.flavor_text}}</i></p>
            </div>
        </div>
        <div>
            <h5>Set</h5>
            {{card.set_name}}
        </div>
        <div v-if="printings.length > 1" class="my-3">
            <b-button variant="outline-dark" v-b-toggle.printings_collapse>Other prints
                <octicon name="chevron-down"></octicon>
            </b-button>
            <b-collapse id="printings_collapse">
                <div v-for="printing in printings" :key="printing.id">
                    <b-link v-if="printing.set !== card.set" @click="$emit('update_card_from_modal', printing)">{{printing.set_name}}</b-link>
                </div>
            </b-collapse>
        </div>
        <div>
            <h5>Artist</h5>
            {{card.artist}}
        </div>
        <div class="text-capitalize">
            <h5>Rarity</h5>
            {{card.rarity}}
        </div>
        <div class="mb-1">
            <h5>Formats</h5>
            <span v-for="format in Object.keys(card.legalities)" :key="format">
                <span v-if="card.legalities[format] === 'legal'" class="text-capitalize">{{format}} </span>
            </span>
        </div>
        <div v-if="rulings.length > 0" class="my-3">
            <b-button variant="outline-dark" v-b-toggle.rulings_collapse>Rulings
                <octicon name="chevron-down"></octicon>
            </b-button>
            <b-collapse id="rulings_collapse">
                <div v-for="ruling in rulings" :key="ruling.comment">
                    <p>
                        {{ruling.comment}}<br>
                        <i class="ml-3">-{{ruling.source !== 'wotc' ? ruling.soruce : "Wizards of the Coast"}} -
                            {{ruling.published_at}}</i>
                    </p>

                </div>
            </b-collapse>
        </div>
        <div>
            <h5>Prices</h5>
            <div v-for="price in prices" :key="price">
                {{price}}
            </div>
        </div>
        <div>
            <h5>Purchase links</h5>
            <div v-for="link in purchaseLinks" :key="link.name">
                <b-link class="text-capitalize font-weight-bold" target="_blank" :href="link.ref">{{link.name}}</b-link>
            </div>
        </div>
        <div>
            <h5>Resources</h5>
            <div v-for="link in related_uris" :key="link.name">
                <b-link class="text-capitalize font-weight-bold" target="_blank" :href="link.ref">{{link.name}}</b-link>
            </div>
        </div>
        <div slot="modal-footer" class="w-100">
            <b-button-group size="lg" class="w-100">
                <b-button @click="$emit('like_card', card.id, userCardStatus.liked, updateCardFromModal)"
                          v-if="loggedIn" variant="outline-success"
                          v-bind:pressed="userCardStatus.liked">
                    <octicon name="thumbsup"></octicon>
                </b-button>
                <b-button @click="closeModal" variant="outline-dark">
                    <octicon name="chevron-down"></octicon>
                </b-button>
                <b-button @click="$emit('dislike_card', card.id, userCardStatus.blocked, updateCardFromModal)"
                          v-if="loggedIn"
                          variant="outline-danger"
                          v-bind:pressed="userCardStatus.blocked">
                    <octicon name="thumbsdown"></octicon>
                </b-button>
            </b-button-group>
        </div>
    </b-modal>
</template>

<script>
    import DrawCardImage from "./draw_page_components/DrawCardImage"
    import DrawCardVoteBar from "./draw_page_components/DrawCardVoteBar"
    import {DEFAULT_USER_CARD_STATUS} from "@/constants";

    const axios = require('axios');
    export default {
        name: "CardModal",
        props: ['loggedIn', 'card'],
        data() {
            return {
                prices: [],
                purchaseLinks: [],
                userCardStatus: DEFAULT_USER_CARD_STATUS,
                rulings: [],
                printings: []
            }
        },
        mounted() {
            this.$emit('update_user_card_status', this.$props.card.id, this.setUserCardStatus);
        },
        components: {
            DrawCardImage,
            DrawCardVoteBar
        },
        computed: {
            related_uris() {
                const related_uris = [];
                for (let link in this.card.related_uris) {
                    related_uris.push({name: link, ref: this.card.related_uris[link]});
                }
                related_uris.push({name: "scryfall", ref: this.card.scryfall_uri});
                return related_uris;
            }
        },
        methods: {
            closeModal() {
                this.$refs.modal_ref.hide();
            },
            setUserCardStatus(status) {
                this.userCardStatus = status;
            },
            updateCardFromModal(card) {
                this.$emit('update_card_from_modal', card);
            }
        },
        watch: {
            'card.uri': function () {
                if (!this.card.uri) {
                    return;
                }
                this.prices = [];
                this.purchaseLinks = [];
                const outerThis = this;
                axios.get(this.card.uri).then(function (response) {
                    for (const price in response.data.prices) {
                        const qty = response.data.prices[price];
                        if (qty === null) {
                            continue;
                        }
                        let displayPrice = "";
                        if (price === 'usd') {
                            displayPrice = "$" + qty;
                        } else if (price === 'usd_foil') {
                            displayPrice = "$" + qty + " foil";
                        } else if (price === 'tix') {
                            displayPrice = qty + " TIX";
                        }
                        outerThis.prices.push(displayPrice);
                    }
                    for (const link in response.data.purchase_uris) {
                        const ref = response.data.purchase_uris[link];
                        outerThis.purchaseLinks.push({ref: ref, name: link});
                    }
                })
            },
            'card.rulings_uri': function () {
                if (!this.card.rulings_uri) {
                    return;
                }
                this.rulings = [];
                const outerThis = this;
                axios.get(this.card.rulings_uri).then(function (response) {
                    if (response.data && response.data.data) {
                        response.data.data.forEach(data => outerThis.rulings.push(data));
                    }
                })
            },
            'card.prints_search_uri': function () {
                if (!this.card.prints_search_uri) {
                    return;
                }
                this.printings = [];
                const outerThis = this;
                axios.get(this.card.prints_search_uri).then(function (response) {
                    if (response.data && response.data.data) {
                        response.data.data.forEach(printing => outerThis.printings.push(printing));
                    }
                });
            },
            'card': {
                handler() {
                    this.$emit('update_user_card_status', this.card.id, this.setUserCardStatus);
                }, deep: true
            }
        }
    }
</script>
<style scoped>
</style>