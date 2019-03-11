<template>>
    <b-modal scrollable>
        <p>{{card.name}}</p>
    </b-modal>

</template>

<script>
    export default {
        name: "CardModal",
        props: ['card', 'loggedIn'],
        data() {
            return {cardUserStatus: {liked: false, blocked: false}}
        }
    }
</script>

<style scoped>

</style>