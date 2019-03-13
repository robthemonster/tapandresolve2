<template>
    <div>
        <b-container>
            <b-jumbotron bg-variant="dark" text-variant="light" header="Tap and Resolve"
                         lead="The Deck-Building Brainstormer">
                <hr>
                <p>
                    Tap and Resolve allows you to discover new Magic The Gathering cards by presenting them to you
                    randomly.
                </p>
                <p>
                    Tap
                    <b-button variant="warning">
                        <octicon name="sync"></octicon>
                    </b-button>
                    to draw a new card,
                    <b-button variant="success">
                        <octicon name="thumbsup"></octicon>
                    </b-button>
                    to like a card, and
                    <b-button variant="danger">
                        <octicon name="thumbsdown"></octicon>
                    </b-button>
                    to dislike a card. You can apply all kinds of filters by clicking on
                    <b-button>
                        <octicon name="settings"></octicon>
                    </b-button>
                    . You can click on a card to get additional information about it.
                </p>

                <hr>
                <b-row class="justify-content-center my-5">
                    <b-button size="lg" href="./" class="w-100">Get Started</b-button>
                </b-row>
                <p>
                    Your feedback and suggestions help improve the site. I also just like to hear from you. Please feel
                    free to reach out.
                </p>
                <p>
                    Tap and Resolve is a self funded passion project. If (and <b>only if</b>) you are satisfied with my
                    work, you may donate to help mitigate web hosting and development costs.
                </p>
                <b-row class="justify-content-center">
                    <a href="https://donorbox.org/tap-and-resolve" class="dbox-donation-button">
                        <b-button variant="primary">Donate</b-button>
                    </a>
                </b-row>
            </b-jumbotron>
        </b-container>
    </div>
</template>

<script>
    import 'vue-octicon/icons';
    import 'bootstrap/dist/css/bootstrap.css'
    import 'bootstrap-vue/dist/bootstrap-vue.css'

    let loggedIn = false;
    export default {
        components: {},
        data: function () {
            return {loggedIn: loggedIn};
        },
        mounted() {
            let donateScript = document.createElement('script');
            donateScript.setAttribute('src', "https://donorbox.org/install-popup-button.js");
            document.head.appendChild(donateScript);
        }
    }
</script>

<style scoped>

</style>