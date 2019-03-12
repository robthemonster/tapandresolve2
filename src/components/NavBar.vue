<template>
    <div>
        <b-navbar toggleable="lg" type="light" class="text-black" variant="light">
            <b-navbar-brand :href="getOrDefault(selfRef, draw_page_ref)">
                <b-img fluid src="https://tapandresolve.com/assets/icon_64.png" style="max-height: 32px" alt=""></b-img>
                Tap and Resolve
            </b-navbar-brand>
            <b-navbar-toggle target="nav_collapse"/>

            <b-collapse is-nav id="nav_collapse">
                <b-navbar-nav class="ml-auto" >
                    <b-nav-item v-bind:class="getClassOrDefault(selfRef,draw_page_ref)"
                                :href="getOrDefault(selfRef, draw_page_ref)">
                        <span v-bind:class="getTextColorClass(selfRef,draw_page_ref)">
                            <octicon name="home"></octicon> Home
                        </span>
                    </b-nav-item>
                    <b-nav-item v-bind:class="getClassOrDefault(selfRef,liked_page_ref)" v-if="loggedIn"
                                :href="getOrDefault(selfRef, liked_page_ref)">
                        <span v-bind:class="getTextColorClass(selfRef,liked_page_ref, 'text-success')">
                            <octicon name="thumbsup"></octicon> Liked Cards
                        </span>
                    </b-nav-item>
                    <b-nav-item v-bind:class="getClassOrDefault(selfRef,disliked_page_ref)" v-if="loggedIn"
                    :href="getOrDefault(selfRef, disliked_page_ref)">
                        <span v-bind:class="getTextColorClass(selfRef,disliked_page_ref, 'text-danger')">
                            <octicon name="thumbsdown"></octicon> Disliked Cards
                        </span>
                    </b-nav-item>
                    <b-nav-item v-bind:class="getClassOrDefault(selfRef,leaderboards_page_ref)"
                                :href="getOrDefault(selfRef, leaderboards_page_ref)">
                        <span v-bind:class="getTextColorClass(selfRef,leaderboards_page_ref, 'text-warning')">
                        <octicon name="flame"></octicon> Leaderboards
                        </span>
                    </b-nav-item>
                    <b-nav-item v-bind:class="getClassOrDefault(selfRef,search_page_ref)"
                                :href="getOrDefault(selfRef, search_page_ref)">
                        <span v-bind:class="getTextColorClass(selfRef,search_page_ref)">
                        <octicon name="search"></octicon> Search
                        </span>
                    </b-nav-item>
                    <b-nav-item v-bind:class="getClassOrDefault(selfRef,about_page_ref)"
                                :href="getOrDefault(selfRef, about_page_ref)">
                        <span v-bind:class="getTextColorClass(selfRef,about_page_ref)">
                        <octicon name="question"></octicon> About
                        </span>
                    </b-nav-item>
                    <b-nav-item-dropdown text="Account" v-if="loggedIn">
                        <b-dropdown-item href="#" @click="trigger_logout()">Logout</b-dropdown-item>
                    </b-nav-item-dropdown>
                    <b-nav-item v-if="!loggedIn" @click="trigger_login()">
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
        props: ['loggedIn', 'selfRef'],
        methods: {
            trigger_logout() {
                this.$emit('logout');
            },
            trigger_login() {
                this.$emit('login');
            },
            getOrDefault(selfRef, testRef) {
                return selfRef === testRef ? "#" : testRef;
            },
            getClassOrDefault(selfRef, testRef) {
                return selfRef === testRef ? "badge-dark badge-pill" : "";
            },
            getTextColorClass(selfRef, testRef, color = "") {
                if (selfRef === testRef && (color === "text-black" || color === "")) {
                    return "text-white";
                } else {
                    return color;
                }
            }
        },
        data() {
            return {
                draw_page_ref: './',
                liked_page_ref: 'liked.html',
                disliked_page_ref:'disliked.html',
                search_page_ref:"search.html",
                leaderboards_page_ref: 'leaderboards.html',
                about_page_ref:'about.html'
            }
        }
    }
</script>

<style scoped>

</style>