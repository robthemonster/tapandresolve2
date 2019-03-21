<template>
    <b-row>
        <b-col>
            <div id="image_div" :class="!loading ? 'text-center' : 'text-center d-flex align-items-center '">
                <b-img v-if="!loading" fluid v-bind:src="loadedUrl" :alt="card_name"></b-img>
                <b-spinner v-if="loading" class="mx-auto"></b-spinner>
            </div>
        </b-col>
    </b-row>
</template>

<script>
    export default {
        props: ['image_uri', 'card_name'],
        data() {
            return {loading: true, loadedUrl: ""}
        },
        name: "DrawCardImage",
        watch: {
            'image_uri': function () {
                const image = new Image();
                this.loading = true;
                const outerThis = this;
                image.onload = function () {
                    outerThis.loadedUrl = outerThis.image_uri;
                    outerThis.loading = false;
                };
                image.src = this.image_uri;
            }
        }
    }
</script>

<style scoped>
    #image_div {
        min-height: 65vh;
    }
</style>