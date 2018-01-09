const getRawHtmlFromBtag = require('./getrawhtml');
const prestige = require('./prestige');
const cheerio = require('cheerio');

const tier = {
    'rank-1.png': 'bronze',
    'rank-2.png': 'silver',
    'rank-3.png': 'gold',
    'rank-4.png': 'platinum',
    'rank-5.png': 'diamond',
    'rank-6.png': 'master',
    'rank-7.png': 'grandmaster',
};

async function general(btag, platform, html) {
    try {
        if (html === undefined) {
            html = await getRawHtmlFromBtag(btag, platform);
        }

        const $ = cheerio.load(html);

        let data = {};
        data.rank = $('.masthead-player .competitive-rank').text() || undefined;

        if (data.rank || data.rank !== undefined) {
            data.rank_name = tier[$('.competitive-rank > img').attr('src').replace('https://d1u1mce87gyfbn.cloudfront.net/game/rank-icons/season-2/', '')];
        }

        data.bnet_id = $('script:contains(\'window.app.career.init\')').html().replace(/\D/g, '');
        data.prestige = prestige($('.player-level')
            .attr('style')
            .replace('background-image:url(https://d1u1mce87gyfbn.cloudfront.net/game/playerlevelrewards/', '').replace('_Border.png)', ''));
        data.level = $('.masthead-player .player-level').text();
        data.profile = $('.player-portrait').attr('src');

        return data;
    } catch(e) {
        throw e;
    }
}

module.exports = general;
