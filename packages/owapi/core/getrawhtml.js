const axios = require('axios');
const cheerio = require('cheerio');
const getAccountByName = require('./getaccountbyname');

const regPathFix = {
    pc: '/career/pc/',
    xbl: '/career/xbl/',
    psn: '/career/psn/'
};

async function getRawHtmlFromBtag(btag, platform) {
    if (platform !== undefined && regPathFix[platform] == undefined) {
        throw new TypeError(`${platform} is not a valid platform`);
    }
    let uri = `https://playoverwatch.com/en-us${regPathFix[platform]}${encodeURIComponent(btag.replace('#', '-'))}`;

    if (platform === undefined) {
        const accountData = await getAccountByName(btag).catch((err) => {
            throw err;
        });

        if (accountData[0].visibility.isPrivate === true || accountData[0].visibility.isFriendsOnly === true) {
            throw 'ACCOUNT_PRIVATE';
        }

        uri = `https://playoverwatch.com/en-us/career/${accountData[0].platform}/${accountData[0].urlName}`;
    }

    const getProfileData = await axios.get(uri, {
        timeout: 10000,
        responseType: 'text',
    }).catch((err) => {
        if (err.response.status === 404) {
            throw 'PLAYER_NOT_EXIST';
        } else {
            throw err;
        }
    });

    const cheerioLoaded = cheerio.load(getProfileData.data);
    if (cheerioLoaded('.masthead-permission-level-text').text() === 'Private Profile') {
        throw 'ACCOUNT_PRIVATE';
    } else if (cheerioLoaded('.header-masthead').text() == '') {
        throw 'PLAYER_NOT_EXIST';
    }

    return getProfileData.data;
}

module.exports = getRawHtmlFromBtag;
