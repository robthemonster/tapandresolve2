<template>
    <div>
        <b-row class="my-3">
            <b-col>
                <b-progress>
                    <b-progress-bar :value="upvoteRatio" variant="success">{{upvotes}}</b-progress-bar>
                    <b-progress-bar :value="downvoteRatio" variant="danger">{{downvotes}}</b-progress-bar>
                </b-progress>
            </b-col>
        </b-row>
        <b-row v-if="!loggedIn" class="justify-content-center">
            <span class="text-muted">Login to vote</span>
        </b-row>
    </div>
</template>

<script>
    export default {
        props: ['upvotes', 'downvotes', 'loggedIn'],
        name: "DrawCardVoteBar",
        computed: {
            upvoteRatio: function () {
                if (this.upvotes + this.downvotes === 0) {
                    return 50;
                }
                return 100 * (this.upvotes) / (this.upvotes + this.downvotes);
            },
            downvoteRatio: function () {
                if (this.upvotes + this.downvotes === 0) {
                    return 50;
                }
                return 100 * (this.downvotes) / (this.downvotes + this.upvotes);
            }
        }
    }
</script>

<style scoped>

</style>