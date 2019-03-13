<template>
    <div>
        <b-navbar toggleable="lg" type="light" class="text-black" variant="light">
            <b-navbar-brand to="/">
                <b-img fluid src="https://tapandresolve.com/assets/icon_64.png" alt="tapandresolve.com" style="max-height: 32px"></b-img>
                Tap and Resolve
            </b-navbar-brand>
            <b-navbar-toggle target="nav_collapse"/>

            <b-collapse is-nav id="nav_collapse">
                <b-navbar-nav class="ml-auto">
                    <b-nav-item :class="getClassOrDefault(draw_page_ref)" to="/">
                        <span v-bind:class="getTextColorClass(draw_page_ref)">
                            <octicon name="home"></octicon> Home
                        </span>
                    </b-nav-item>
                    <b-nav-item active v-bind:class="getClassOrDefault(liked_page_ref)" v-if="loggedIn" to="/liked">
                        <span v-bind:class="getTextColorClass(liked_page_ref, 'text-success')">
                            <octicon name="thumbsup"></octicon> Liked Cards
                        </span>
                    </b-nav-item>
                    <b-nav-item v-bind:class="getClassOrDefault(disliked_page_ref)" v-if="loggedIn" to="/disliked">
                        <span v-bind:class="getTextColorClass(disliked_page_ref, 'text-danger')">
                            <octicon name="thumbsdown"></octicon> Disliked Cards
                        </span>
                    </b-nav-item>
                    <b-nav-item v-bind:class="getClassOrDefault(leaderboards_page_ref)" to="/leaderboards">
                        <span v-bind:class="getTextColorClass(leaderboards_page_ref, 'text-warning')">
                        <octicon name="flame"></octicon> Leaderboards
                        </span>
                    </b-nav-item>
                    <b-nav-item v-bind:class="getClassOrDefault(search_page_ref)" to="/search">
                        <span v-bind:class="getTextColorClass(search_page_ref)">
                        <octicon name="search"></octicon> Search
                        </span>
                    </b-nav-item>
                    <b-nav-item v-bind:class="getClassOrDefault(about_page_ref)" to="/about">
                        <span v-bind:class="getTextColorClass(about_page_ref)">
                        <octicon name="question"></octicon> About
                        </span>
                    </b-nav-item>
                    <b-nav-item-dropdown text="Account" v-if="loggedIn">
                        <b-dropdown-item @click="$emit('logout')">Logout</b-dropdown-item>
                    </b-nav-item-dropdown>
                    <b-nav-item v-if="!loggedIn" @click="$emit('login')">
                        <span>
                        <octicon name="lock"></octicon> Login
                        </span>
                    </b-nav-item>
                </b-navbar-nav>
            </b-collapse>
        </b-navbar>
    </div>
</template>

<script>
    export default {
        name: "NavBar",
        props: ['loggedIn'],
        methods: {
            getClassOrDefault(route) {
                return this.$router.currentRoute.path === route ? "badge-dark badge-pill" : "";
            },
            getTextColorClass(testRef, color = "") {
                if (this.$router.currentRoute.path === testRef && (color === "text-black" || color === "")) {
                    return "text-white";
                } else {
                    return color;
                }
            }
        },
        data() {
            return {
                draw_page_ref: '/',
                liked_page_ref: '/liked',
                disliked_page_ref: '/disliked',
                search_page_ref: "/search",
                leaderboards_page_ref: '/leaderboards',
                about_page_ref: '/about',
            }
        },
        watch: {
            '$route': {
                handler() {
                    this.$forceUpdate();
                },
                deep: true
            }
        }
    }
</script>

<style scoped>

</style>