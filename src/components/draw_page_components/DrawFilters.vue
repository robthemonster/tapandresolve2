<template>
    <div>
        <b-row>
            <b-button-group class="w-100">
                <b-button v-b-toggle.filters_collapse size="lg">
                    Filters
                    <octicon name="settings"></octicon>
                </b-button>
                <b-button :pressed="!filterIsDefault()" size="lg" @click="resetFilter()" variant="outline-danger">Reset
                    all filters
                </b-button>
            </b-button-group>
        </b-row>
        <b-collapse id="filters_collapse">
            <label class="w-100 text-center" for="color_buttons">
                <b-form>
                    Draw cards using
                    <b-form-checkbox switch v-model="filter.colorExclusive" name="color_exclusive">
                        <b>{{filter.colorExclusive ? "Exactly":"At most"}}</b>
                    </b-form-checkbox>
                    these
                    <b>{{filter.colors_selected.length}}</b>
                    color(s)
                </b-form>
            </label>
            <b-form-checkbox-group class="w-100 mb-3 mt-1" id="color_buttons" buttons button-variant="outline-secondary"
                                   v-model="filter.colors_selected">
                <b-form-checkbox value="W">
                    <b-img fluid src="https://tapandresolve.com/assets/W.png" alt="white"></b-img>
                </b-form-checkbox>
                <b-form-checkbox value="U">
                    <b-img fluid src="https://tapandresolve.com/assets/U.png" alt="blue"></b-img>
                </b-form-checkbox>
                <b-form-checkbox value="B">
                    <b-img fluid src="https://tapandresolve.com/assets/B.png" alt="black"></b-img>
                </b-form-checkbox>
                <b-form-checkbox value="R">
                    <b-img fluid src="https://tapandresolve.com/assets/R.png" alt="red"></b-img>
                </b-form-checkbox>
                <b-form-checkbox value="G">
                    <b-img fluid src="https://tapandresolve.com/assets/G.png" alt="green"></b-img>
                </b-form-checkbox>
            </b-form-checkbox-group>
            <label for="types_group">
                <b-button v-b-toggle.types_collapse>Allow these <b>types</b></b-button>
            </label>
            <b-form-group id="types_group" class="justify-content-start">
                <b-collapse id="types_collapse">
                    <b-form-checkbox-group stacked
                                           name="types_name" :options="filter.types_values"
                                           v-model="filter.types_selected">
                    </b-form-checkbox-group>
                </b-collapse>
            </b-form-group>
            <label for="categories_group">
                <b-button v-b-toggle.categories_collapse>Allow these <b>categories</b></b-button>
            </label>
            <b-form-group id="categories_group" class="justify-content-start">
                <b-collapse id="categories_collapse">
                    <b-form-checkbox-group stacked name="categories_name"
                                           :options="filter.categories_values"
                                           v-model="filter.categories_selected"></b-form-checkbox-group>
                </b-collapse>
            </b-form-group>
            <label for="rarities_group">
                <b-button v-b-toggle.rarities_collapse>Allow these <b>rarities</b></b-button>
            </label>
            <b-form-group id="rarities_group">
                <b-collapse id="rarities_collapse">
                    <b-form-checkbox-group stacked name="formats_name"
                                           :options="filter.rarities_values"
                                           v-model="filter.rarities_selected"></b-form-checkbox-group>
                </b-collapse>
            </b-form-group>
            <label for="formats_group">
                <b-button v-b-toggle.formats_collapse>Must be legal in these <b>formats</b></b-button>
            </label>
            <b-form-group id="formats_group">
                <b-collapse id="formats_collapse">
                    <b-form-checkbox-group name="formats_name" :options="filter.formats_values"
                                           v-model="filter.formats_selected"></b-form-checkbox-group>
                </b-collapse>
            </b-form-group>
            <b-form-checkbox v-model="filter.commanders_only" class="mb-3">Draw commanders only</b-form-checkbox>
            <label for="artist_input">Only draw cards by this artist</label>
            <b-form-input id="artist_input" placeholder="Artist" v-model="filter.artist" :state="artist_name_state"
                          list="artist_list" class="mb-3">
            </b-form-input>
            <datalist id="artist_list">
                <option v-for="artist in artists" :key="artist">{{artist}}</option>
            </datalist>
            <label for="set_input" class="w-100 text-center">
                <b-checkbox @change="change_inclusive_set_mode" switch v-model="filter.inclusiveSetMode">
                    <b>{{filter.inclusiveSetMode ? "Include" : "Exclude"}}</b>
                </b-checkbox>
                these sets</label>
            <b-form>

                <b-form-input id="set_input" placeholder="Set name"
                              :state="set_name_exists"
                              v-model="set_input" list="set_list" class="my-2"></b-form-input>
                <b-button @click="add_or_exclude_set()" v-bind:class="add_exclude_button_class"
                          v-bind:variant="add_exclude_button_variant">{{filter.inclusiveSetMode ? "Include" :
                    "Exclude"}}
                    set
                </b-button>
                <b-button @click="reset_excluded_set_list" class="mx-2" variant="warning">Reset set filter</b-button>
                <div>
                    {{filter.inclusiveSetMode ? "Including" : "Excluding"}} {{display_sets().length}} sets:
                    <b-badge
                            v-for="set in display_sets()" :key="set">{{setCodesToNames[set]}}
                    </b-badge>
                </div>

            </b-form>

            <datalist id="set_list">
                <option v-for="set in this.sets" :key="set.code">{{set.name}}</option>
            </datalist>

        </b-collapse>
    </div>
</template>

<script>
    const deep_equal = require('deep-equal');

    function removeFromList(list, value) {
        let newList = [];
        list.forEach(function (item) {
            if (item !== value) {
                newList.push(item);
            }
        });
        return newList;
    }

    function listDifference(list, sub) {
        let subSet = new Set(sub);
        let newList = [];
        list.forEach(function (item) {
            if (!subSet.has(item)) {
                newList.push(item);
            }
        });
        return newList;
    }

    import {API_URL} from "../../constants"

    const axios = require('axios');
    const DEFAULT_FILTER = {
        colorExclusive:
            false,
        colors_selected:
            ["B", "U", "G", "R", "W"],
        types_selected: ['token', 'basic', 'land', 'creature', 'artifact', 'enchantment', 'planeswalker', 'instant', 'sorcery', 'misc'],
        types_values: [
            {text: 'Tokens', value: 'token'},
            {text: 'Basics', value: 'basic'},
            {text: "Lands", value: 'land'},
            {text: "Creatures", value: 'creature'},
            {text: "Artifact", value: 'artifact'},
            {text: 'Enchantment', value: 'enchantment'},
            {text: "Planeswalker", value: 'planeswalker'},
            {text: "Instant", value: 'instant'},
            {text: "Sorcery", value: "sorcery"},
            {text: "Misc.", value: "misc"}
        ],
        categories_selected: ['digital', 'promo', 'silly'],
        categories_values: [
            {text: 'Online-Only', value: 'digital'},
            {text: 'Promos', value: 'promo'},
            {text: 'Jokes', value: 'silly'}
        ],
        formats_selected: [],
        formats_values: [
            {text: 'Standard', value: 'standard'},
            {text: 'Modern', value: 'modern'},
            {text: 'Commander', value: 'commander'},
            {text: 'Future', value: 'future'},
            {text: 'Frontier', value: 'frontier'},
            {text: 'Legacy', value: 'legacy'},
            {text: 'Pauper', value: 'pauper'},
            {text: 'Vintage', value: 'vintage'},
            {text: 'Penny', value: 'penny'},
            {text: 'Duel', value: 'duel'},
            {text: 'Oldschool', value: 'oldschool'}
        ],
        rarities_selected: ['common', 'uncommon', 'rare', 'mythic'],
        rarities_values: [
            {text: 'Common', value: 'common'},
            {text: 'Uncommon', value: 'uncommon'},
            {text: 'Rare', value: 'rare'},
            {text: 'Mythic', value: 'mythic'}
        ],
        commanders_only: false,
        artist: "",
        inclusiveSetMode: false,
        excludedSets: [],
    };
    let currentFilter = DEFAULT_FILTER;
    let artists = [];
    let sets = [];
    let setNamesToCodes = {};
    let setCodesToNames = {};
    let setNames = new Set();
    export default {
        name: "DrawFilters",
        data: function () {
            return {
                defaultFilter: DEFAULT_FILTER,
                filter: currentFilter,
                artists: artists,
                sets: sets,
                setNames: setNames,
                setNamesToCodes: setNamesToCodes,
                setCodesToNames: setCodesToNames,
                set_input: ""
            }
        },
        mounted() {
            if (localStorage.filter) {
                const localFilters = JSON.parse(localStorage.filter);
                if (JSON.stringify(Object.keys(localFilters).sort()) === JSON.stringify(Object.keys(DEFAULT_FILTER).sort())) {
                    this.filter = localFilters
                }
            }
            let outerThis = this;
            axios.post(API_URL + "/getArtistNames").then(function (response) {
                outerThis.artists = response.data;
                outerThis.$forceUpdate();
            });
            axios.post(API_URL + "/getSetCodes").then(function (response) {
                outerThis.sets = response.data;
                outerThis.sets.forEach(function (set) {
                    outerThis.setNames.add(set.name);
                    outerThis.setNamesToCodes[set.name] = set.code;
                    outerThis.setCodesToNames[set.code] = set.name;
                });
                outerThis.$forceUpdate();
            });
        },
        methods: {
            filterIsDefault() {
                return deep_equal(this.filter, this.defaultFilter);
            },
            resetFilter: function () {
                Object.assign(this.filter, this.defaultFilter);
                this.set_input = "";
            },
            add_or_exclude_set() {
                if (this.setNames.has(this.set_input)) {
                    if (!this.filter.inclusiveSetMode) {
                        this.filter.excludedSets.push(this.setNamesToCodes[this.set_input]);
                    } else {
                        this.filter.excludedSets = removeFromList(this.filter.excludedSets, this.setNamesToCodes[this.set_input]);
                    }
                    this.filter.excludedSets = [...new Set(this.filter.excludedSets)];
                }
            },
            reset_excluded_set_list() {
                if (!this.filter.inclusiveSetMode) {
                    this.filter.excludedSets = [];
                } else {
                    this.filter.excludedSets = Object.keys(this.setCodesToNames);
                }
            },
            change_inclusive_set_mode() {
                this.filter.excludedSets = listDifference(Object.keys(setCodesToNames), this.filter.excludedSets);
            },
            display_sets() {
                if (!this.filter.inclusiveSetMode) {
                    return this.filter.excludedSets;
                } else {
                    return listDifference(Object.keys(this.setCodesToNames), this.filter.excludedSets);
                }
            }
        },
        computed: {
            artist_name_state() {
                return this.filter.artist === "" || new Set(this.artists).has(this.filter.artist)
            },
            set_name_exists() {
                return this.setNames.has(this.set_input);
            },
            add_exclude_button_class() {
                return this.set_name_exists ? "" : "disabled";
            },
            add_exclude_button_variant() {
                return this.filter.inclusiveSetMode ? "success" : "danger";
            }
        },
        watch: {
            'filter': {
                handler() {
                    this.$emit('filterUpdate', this.filter);
                    localStorage.filter = JSON.stringify(this.filter);
                },
                deep: true
            }
        }
    }
</script>

<style scoped>

</style>