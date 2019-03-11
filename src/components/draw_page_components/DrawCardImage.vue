<template>
    <b-row class="my-3">
        <b-col>
            <div class="text-center">
                <b-img fluid v-bind:src="image_uri"></b-img>
            </div>
        </b-col>
    </b-row>
</template>

<script>
    export default {
        props: ['image_uri'],
        name: "DrawCardImage"
    }
</script>

<style scoped>

</style>