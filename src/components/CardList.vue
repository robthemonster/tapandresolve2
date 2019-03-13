<template>
    <b-list-group  id="card_list" class="bg-dark">
        <b-list-group-item style="overflow-y:hidden;" v-for="(card,index) in card_list"
                           @click="$emit('open_modal', card)">
                <b-row class="card_item">
                    <b-col cols="7" class="text-center h-100">
                        <b-row class="card_item_text" align-v="center">
                            <b-col cols="2">
                                <span>{{index+1}})</span>
                            </b-col>
                            <b-col cols="10">
                                <b-row class="justify-content-center">
                                    <span>{{card.name}}</span>
                                </b-row>
                                <b-row class="justify-content-center">
                                    <DrawCardVoteBar loggedIn="true" class="w-100" :upvotes="card.likedCount"
                                                     :downvotes="card.dislikedCount"></DrawCardVoteBar>
                                </b-row>
                            </b-col>
                        </b-row>
                    </b-col>
                    <b-col cols="5" class="text-center">
                    <span class="item_image">
                    <b-img-lazy fluid :src="card.image_uris.border_crop" :alt="card.name"></b-img-lazy>
                    </span>
                    </b-col>
                </b-row>
        </b-list-group-item>
    </b-list-group>
</template>

<script>
    import DrawCardVoteBar from "../components/draw_page_components/DrawCardVoteBar.vue";

    export default {
        name: "CardList",
        props: ['card_list'],
        components: {DrawCardVoteBar}
    }
</script>

<style scoped>
    .item_image {
        overflow-y: hidden;
        height: 100%;
    }

    .card_item {
        height: 8vh;
    }

    #card_list{
        min-height:30vh;
    }
</style>