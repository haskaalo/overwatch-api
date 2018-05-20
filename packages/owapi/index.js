const stats = require('./core/stats');
const getRawHtmlFromBtag = require('./core/getrawhtml');
const general = require('./core/general');
const getAccountByName = require('./core/getaccountbyname');

async function getAllStats(btag, platform) {
    try {
        const html = await getRawHtmlFromBtag(btag, platform);
        const generalData = await general(btag, platform, html);
        const quickplayData = await stats(btag, 'quickplay', platform, html);
        const competitiveData = await stats(btag, 'competitive', platform, html);

        return Object.assign(generalData, {quickplay: quickplayData}, {competitive: competitiveData});
    } catch(e) {
        throw e;
    }
}

module.exports = {
    getAccountByName,
    getRawHtmlFromBtag,
    getAllStats,
    getModeStats: stats,
    getGeneralStats: general,
    platforms: ['pc', 'xbl', 'psn']
};
