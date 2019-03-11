<template>
    
    <label for="sort_radio_group" class="w-100 text-center">Sort By
        <b-form-radio-group id="sort_radio_group" v-model="selected_sort">
            <b-form-radio value="TOP">Top</b-form-radio>
            <b-form-radio value="WORST">Worst</b-form-radio>
            <b-form-radio value="CONTROVERSIAL">Controversial</b-form-radio>
        </b-form-radio-group>
    </label>
</template>

<script>
    export default {
        name: "LeaderboardsSortSelector",
        data() {
            return {selected_sort: "TOP"}
        },
        mounted() {
            console.log(this.selected_sort);
            this.$emit('fetch_leaderboards', this.selected_sort)
        },
        watch: {
            'selected_sort': function () {
                this.$emit('fetch_leaderboards', this.selected_sort)
            }
        }
    }
</script>

<style scoped>

</style>