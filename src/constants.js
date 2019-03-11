export const EMPTY_CARD = {
    name: "",
    oracle_text: "",
    image_uris: {border_crop: "https://tapandresolve.com/assets/no_cards_remaining.png"}
};
export const API_URL = "https://api.tapandresolve.tk";
export const JSON_HEADER = {headers: {'Content-type': 'application/json'}};

export function getAccountPromise(netlifyIdentity) {
    return new Promise(function (resolve, reject) {
        if (netlifyIdentity.currentUser()) {
            netlifyIdentity.currentUser().jwt().then(function (token) {
                resolve({id: netlifyIdentity.currentUser().id, token: token});
            }).catch(function () {
                reject({id: undefined, token: undefined});
            })
        } else {
            reject({id: undefined, token: undefined});
        }
    });
}
