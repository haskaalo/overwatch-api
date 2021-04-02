const getRawHtmlFromBtag = require('./getrawhtml');
const cheerio = require('cheerio');

const tier = {
    'rank-BronzeTier.png': 'bronze',
    'rank-SilverTier.png': 'silver',
    'rank-GoldTier.png': 'gold',
    'rank-PlatinumTier.png': 'platinum',
    'rank-DiamondTier.png': 'diamond',
    'rank-MasterTier.png': 'master',
    'rank-GrandmasterTier.png': 'grandmaster',
};

async function general(btag, platform, html) {
    if (html === undefined) {
        html = await getRawHtmlFromBtag(btag, platform);
    }

    const $ = cheerio.load(html);

    let data = {};
    data.rank = $('.masthead-player .competitive-rank-level').text() || undefined;
    if (data.rank != undefined) {
        data.rank = Number(data.rank);
    }

    if (data.rank || data.rank !== undefined) {
        data.rank_name = tier[$('.competitive-rank-tier-icon').attr('src').replace('https://d1u1mce87gyfbn.cloudfront.net/game/rank-icons/', '')];
    }

    data.profile = $('.player-portrait').attr('src');
    return data;
}

module.exports = general;
