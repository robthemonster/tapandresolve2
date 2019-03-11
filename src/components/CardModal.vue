<template>
    <b-modal ref="modal_ref" id="card_modal" class="text-dark" size="lg" :title="card.name" centered scrollable>
        <DrawCardImage :image_uri="card.image_uris.border_crop"></DrawCardImage>
        <DrawCardVoteBar :loggedIn="loggedIn" :downvotes="card.dislikedCount" :upvotes="card.likedCount"></DrawCardVoteBar>
        <div v-if="!card.card_faces">
            <p>{{card.oracle_text}}</p>
            <p><i>{{card.flavor_text}}</i></p>
        </div>
        <div v-if="card.card_faces" v-for="face in card.card_faces">
            <h5>{{face.name}}</h5>
            <p>{{face.oracle_text}}</p>
            <p><i>{{face.flavor_text}}</i></p>
        </div>
        <div>
            <h5>Set</h5>
            {{card.set_name}}
        </div>
        <div>
            <h5>Prices</h5>
            <div v-for="price in prices">
                {{price}}
            </div>
        </div>
        <div>
            <h5>Purchase links</h5>
            <div v-for="link in purchaseLinks">
                <b-link target="_blank" :href="link.ref">{{link.name}}</b-link>
            </div>
        </div>
        <div>
            <h5>Resources</h5>
            <div v-for="link in related_uris">
                <b-link target="_blank" :href="link.ref">{{link.name}}</b-link>
            </div>
        </div>
        <div slot="modal-footer" class="w-100">
            <b-button-group size="lg" class="w-100">
                <b-button @click="toggleLikeStatus(cardUserStatus.liked)" v-if="loggedIn" variant="outline-success"
                          v-bind:pressed="cardUserStatus.liked">
                    <octicon name="thumbsup"></octicon>
                </b-button>
                <b-button @click="closeModal" variant="outline-dark">
                    <octicon name="chevron-down"></octicon>
                </b-button>
                <b-button @click="toggleDislikedStatus(cardUserStatus.blocked)" v-if="loggedIn" variant="outline-danger"
                          v-bind:pressed="cardUserStatus.blocked">
                    <octicon name="thumbsdown"></octicon>
                </b-button>
            </b-button-group>
        </div>
    </b-modal>
</template>

<script>
    import DrawCardImage from "./draw_page_components/DrawCardImage"
    import DrawCardVoteBar from "./draw_page_components/DrawCardVoteBar"
    import {API_URL, JSON_HEADER} from "@/constants";

    const axios = require('axios');
    export default {
        name: "CardModal",
        props: ['card', 'loggedIn', 'cardUserStatus'],
        data() {
            return {
                prices: [],
                purchaseLinks: []
            }
        },
        mounted() {
            const outerThis = this;
            this.$emit('fetchCardStatusById', this.card.id);
            this.$root.$on('bv::modal::hidden', function(bvEvent, modalId){
                if (modalId === 'card_modal') {
                    outerThis.$emit('modal-closed-event');
                }
            })
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
            toggleLikeStatus(liked) {
                const outerThis = this;
                const action = liked ? "/removeCardFromLiked" : "/addCardToLiked";
                this.$parent.getAccount().then(function (account) {
                    const data = {uuid: outerThis.$props.card.id, userid: account.id, token: account.token};
                    axios.post(API_URL + action, data, JSON_HEADER)
                        .then(function (response) {
                            outerThis.$emit('updateCardDetailsFromModal', response.data);
                            outerThis.$emit('fetchCardStatusById', response.data.id);
                        });
                });

            },
            toggleDislikedStatus(disliked) {
                const outerThis = this;
                const action = disliked ? "/removeCardFromBlocked" : "/addCardToBlocked";
                this.$parent.getAccount().then(function (account) {
                    const data = {uuid: outerThis.$props.card.id, userid: account.id, token: account.token};
                    axios.post(API_URL + action, data, JSON_HEADER)
                        .then(function (response) {
                            outerThis.$emit('updateCardDetailsFromModal', response.data);
                            outerThis.$emit('fetchCardStatusById', response.data.id);
                        });
                });
            },
            closeModal() {
                this.$refs.modal_ref.hide();
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
                axios.get(this.$props.card.uri).then(function (response) {
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
            'card.id': function() {
                this.$emit('fetchCardStatusById', this.card.id);
            }
        }
    }
</script>

<style scoped>

</style>