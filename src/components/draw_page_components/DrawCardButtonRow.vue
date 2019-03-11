<template>
    <b-row id="component" class="my-3 justify-content-center">
        <b-button-group size="lg" class="w-100">
            <b-button  variant="warning" @click="$emit('draw_card_event', true)">
                <octicon name="sync"></octicon>
            </b-button>

            <b-button @click="$emit('like_card_event')" v-if="loggedIn" variant="outline-success" v-bind:pressed="cardUserStatus.liked">
                <octicon name="thumbsup"></octicon>
            </b-button>

            <b-button @click="$emit('dislike_card_event')" v-if="loggedIn" variant="outline-danger" v-bind:pressed="cardUserStatus.blocked">
                <octicon name="thumbsdown"></octicon>
            </b-button>
        </b-button-group>
    </b-row>
</template>

<script>
    export default {
        name: "DrawCardButtonRow",
        props: ['loggedIn', 'cardUserStatus']
    }
</script>

<style scoped>
    #component {
        text-align: center;
    }
</style>