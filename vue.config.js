module.exports = {
    pages: {
        index: {
            entry: "src/drawPage.js",
            template: 'public/index.html',
            title: "Draw"
        },
        liked: {
            entry: 'src/likedCardsPage.js',
            template: 'public/index.html',
            title: "Liked Cards"
        },
        disliked: {
            entry: 'src/dislikedCardsPage.js',
            template: 'public/index.html',
            title: "Disliked Cards"
        },
        leaderboards: {
            entry: 'src/leaderboardsPage.js',
            template: 'public/index.html',
            title: "Leaderboards"
        },
        search: {
            entry: 'src/searchPage.js',
            template: 'public/index.html',
            title: "Search"
        },
        about: {
            entry: 'src/aboutPage.js',
            template: 'public/index.html',
            title: "About"
        }
    }
};