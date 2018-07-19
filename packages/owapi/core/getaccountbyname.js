const rp = require('request-promise');

async function getAccountByName(btag) {
    const serializedBtag = encodeURIComponent(btag.replace('-','#'));
    const searchUser = await rp({
        uri: `https://playoverwatch.com/en-us/search/account-by-name/${serializedBtag}`,
        json: true,
        timeout: 10000
    });
    if (searchUser.length == 0) {
        throw 'PLAYER_NOT_EXIST';
    }

    return searchUser;
}

module.exports = getAccountByName;
