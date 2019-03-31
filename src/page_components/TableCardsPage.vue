<template>
    <div>
        <b-container>
            <div class="sticky-top">
                <div class="bg-dark text-white text-center">Displaying {{cards.length}} of {{size}}</div>
                <b-form-input
                        :state="(filterString !== '' && cards.length === 0) ? false : filterString !== '' ? true : null "
                        @input="fetchCards(0)" placeholder="Search by name" size="lg"
                        v-model="filterString" list="filtered_card_list"></b-form-input>

            </div>
            <datalist id="filtered_card_list">
                <option v-for="card in cards" :key="card.id">{{card.name}}</option>
            </datalist>
            <CardList :card_list="cards" v-on:open_modal="open_modal"></CardList>

            <infinite-loading v-if="loaderEnabled" ref="infiniteLoader" :identifier="filterString" class="text-white"
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

    export default {
        components: {
            CardList,
            InfiniteLoading
        },
        data: function () {
            return {
                cards: [],
                size: 0,
                autocomplete: [],
                page: 0,
                PAGE_SIZE: 15,
                filterString: "",
                loaderEnabled: false
            };
        },
        methods: {
            open_modal(card) {
                this.$emit('open_modal', card)
            },
            async fetchCards(page) {
                if (page === 0) {
                    this.loaderEnabled = false;
                }
                const outerThis = this;
                await this.$parent.getAccount().then(async function (account) {
                    const data = {
                        userid: account.id,
                        token: account.token,
                        page: page,
                        pageSize: outerThis.PAGE_SIZE,
                        filterString: outerThis.filterString
                    };
                    await axios.post(API_URL + outerThis.apiPath, data, JSON_HEADER).then(function (response) {
                        if (page === 0) {
                            outerThis.cards = [];
                            outerThis.loaderEnabled = true;
                        }
                        outerThis.cards.push(...response.data.cards);
                        outerThis.autocomplete = response.data.autocomplete;
                        outerThis.size = response.data.size;
                        if (response.data.cards.length > 0) {
                            outerThis.page = page;
                        }
                    });
                });
            },
            async addPage($state) {
                const prevPage = this.page;
                await this.fetchCards(prevPage + 1);
                if (this.page === prevPage) {
                    $state.complete();
                } else {
                    $state.loaded();
                }
            }
        },
        mounted() {
            this.fetchCards(0);
            let outerThis = this;
            this.$root.$on('bv::modal::hidden',async () => {
                await outerThis.fetchCards(0)
            });
        },
        props: ['loggedIn', 'apiPath'],
        watch: {
            'loggedIn': async function () {
                await this.fetchCards(0);
                this.$refs.infiniteLoader.stateChanger.reset();
            },
            'apiPath': async function () {
                await this.fetchCards(0);
                this.$refs.infiniteLoader.stateChanger.reset();
            }
        }
    }
</script>

<style scoped>

</style>
