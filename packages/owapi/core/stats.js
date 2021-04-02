const cheerio = require('cheerio');
const getRawHtmlFromBtag = require('./getrawhtml');

async function stats(btag, mode, platform, html) {
    if (mode === undefined || !['quickplay', 'competitive'].includes(mode)) {
        throw new TypeError('mode isn\'t quickplay or competitive');
    }

    const $ = cheerio.load(html === undefined ? await getRawHtmlFromBtag(btag, platform) : html);

    let data = {};

    data.time_played = {};
    data.career_stats = {};
    data.hero_list = [];

    /* STATS TIME PLAYED */
    const heroCount = $(`#${mode} div[data-category-id="0x0860000000000021"] > div`).length;
    for (let i = 1; i < heroCount; i++) {
        const heroName = $(`#${mode} div[data-category-id="0x0860000000000021"] > div:nth-child(${i}) .ProgressBar-title`).text().replace('.', '');
        data.time_played[heroName] = $(`#${mode} div[data-category-id="0x0860000000000021"] > div:nth-child(${i}) .ProgressBar-description`).text();
    }

    /* CAREER STATS */
    $(`#${mode} select[data-js="career-select"][data-group-id="stats"] > option`).each(function() {
        const dataName = $(this).attr('option-id').replace('.', '');
        const dataId = $(this).attr('value');
        data.career_stats[dataName] = {};

        if (dataName != 'ALL HEROES') {
            data.hero_list.push(dataName);
        }

        $(`#${mode} div[data-group-id="stats"][data-category-id="${dataId}"] > div`).each(function() {
            const categoryName = $(this).find('h5').text();
            data.career_stats[dataName][categoryName] = {};
            $(this).find('tbody > tr').each(function() {
                data.career_stats[dataName][categoryName][$(this).find('td:nth-child(1)').text().replace(/[^a-zA-Z0-9]/g, '')] = $(this).find('td:nth-child(2)').text().replace(/[ ,%]/g, '');

            });
        });
    });

    return data;
}

module.exports = stats;
