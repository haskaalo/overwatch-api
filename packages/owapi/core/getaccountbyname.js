const axios = require('axios');


async function getAccountByName(btag) {
    const serializedBtag = encodeURIComponent(btag.replace('-','#'));
    const searchUser = await axios.get(`https://playoverwatch.com/en-us/search/account-by-name/${serializedBtag}`, {
        timeout: 10000,
        responseType: 'json',
    });

    if (searchUser.data.length == 0) {
        throw 'PLAYER_NOT_EXIST';
    }

    return searchUser.data;
}

module.exports = getAccountByName;
