<template>
    <b-row class="my-3">
        <b-col>
            <div class="text-center">
                <b-img fluid v-bind:src="image_uri" :alt="card_name"></b-img>
            </div>
        </b-col>
    </b-row>
</template>

<script>
    export default {
        props: ['image_uri', 'card_name'],
        name: "DrawCardImage"
    }
</script>

<style scoped>

</style>