module.exports = {
    pages: {
        index: {
            entry: "src/drawPage.js",
            template: 'public/index.html',
            title: "Draw"
        },
        liked: 'src/likedCardsPage.js',
        disliked: 'src/dislikedCardsPage.js',
        leaderboards: 'src/leaderboardsPage.js',
        search: 'src/searchPage.js',
        about: 'src/aboutPage.js'
    }
};