<template>
    <footer class="footer text-center bg-light text-dark">
        <div class="py-5">
            <p>
                Apply filters, draw cards, get build inspiration</p>
            <p> View random Magic The Gathering cards</p>
            <p> Find Your Next Deck
            </p>
            <b>Contact<br><a target="_blank" href="mailto:tapandresolve@gmail.com">tapandresolve@gmail.com</a><br> <a
                    target="_blank" href="twitter.com/tapandresolve">@tapandresolve</a><br><a
                    target="_blank" href="https://www.linkedin.com/in/robert-joseph-levin-6194a990/">Robert Joseph Levin</a>
            </b>
        </div>
        <Timeline :widget-class="'timeline'" :id="'tapandresolve'" :sourceType="'profile'"
                  :options="{width:550, tweetLimit: '3' , theme:'light'}"/>
    </footer>
</template>

<script>
    import {Timeline} from 'vue-tweet-embed'

    export default {
        name: "Footer",
        components: {
            Timeline
        }
    }
</script>

<style scoped>


</style>