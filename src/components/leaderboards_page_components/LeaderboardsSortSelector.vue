<template>
    <label for="sort_radio_group" class="text-white w-100 text-center">Sort By
        <b-form-radio-group id="sort_radio_group" v-model="selected_sort">
            <b-form-radio value="TOP">Likes</b-form-radio>
            <b-form-radio value="WORST">Dislikes</b-form-radio>
            <b-form-radio value="CONTROVERSIAL">Controversial</b-form-radio>
        </b-form-radio-group>
        <b-form-checkbox switch v-model="commandersOnly"><span
                :class="commandersOnly ? '' : 'text-primary'">All cards </span><span
                :class="!commandersOnly ? '' : 'text-primary'">Commanders Only</span></b-form-checkbox>
    </label>
</template>

<script>
    export default {
        name: "LeaderboardsSortSelector",
        data() {
            return {selected_sort: "TOP", commandersOnly: false}
        },
        mounted() {
            this.$emit('fetch_leaderboards', this.selected_sort, this.commandersOnly)
        },
        methods: {
            fetch_leaderboards() {
                this.$emit('fetch_leaderboards', this.selected_sort, this.commandersOnly)
            }
        },
        watch: {
            'selected_sort': function(){this.fetch_leaderboards()},
            'commandersOnly': function(){this.fetch_leaderboards()}
        }
    }
</script>

<style scoped>

</style>      