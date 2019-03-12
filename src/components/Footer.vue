<template>
    <footer class="footer text-center bg-light text-dark">
        <div class="py-5">
            <p>
                Apply filters, draw cards, get build inspiration<br>
                View random Magic The Gathering cards<br>
                Find Your Next Deck
            </p>
            <b>Contact<br>Email: <a href="mailto:tapandresolve@gmail.com">tapandresolve@gmail.com</a><br>Twitter: <a
                    href="twitter.com/tapandresolve">@tapandresolve</a>
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