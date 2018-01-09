const ms = require('ms');
const cheerio = require('cheerio');
const getRawHtmlFromBtag = require('./getrawhtml');

async function stats(btag, mode, platform, html) {
    try {
        if (mode === undefined || !['quickplay', 'competitive'].includes(mode)) {
            throw new TypeError('mode isn\'t quickplay or competitive');
        }

        const $ = cheerio.load(html === undefined ? await getRawHtmlFromBtag(btag, platform) : html);

        let data = {};

        data.time_played = {};
        data.career_stats = {};
        data.featured_stats = {};
        data.hero_list = [];

        /* FEATURED STATS COMPETITIVE */

        data.featured_stats.average = $(`#${mode} > section.content-box.u-max-width-container.highlights-section > div > ul > li:nth-child(1) > div > div.card-content > h3`).text();
        data.featured_stats.damage_done_per_10min = $(`#${mode} > section.content-box.u-max-width-container.highlights-section > div > ul > li:nth-child(2) > div > div.card-content > h3`).text().replace(/,/g, '');
        data.featured_stats.deaths = $(`#${mode} > section.content-box.u-max-width-container.highlights-section > div > ul > li:nth-child(3) > div > div.card-content > h3`).text();
        data.featured_stats.final_blows = $(`#${mode} > section.content-box.u-max-width-container.highlights-section > div > ul > li:nth-child(4) > div > div.card-content > h3`).text();
        data.featured_stats.healing_done = $(`#${mode} > section.content-box.u-max-width-container.highlights-section > div > ul > li:nth-child(5) > div > div.card-content > h3`).text().replace(/,/g, '');
        data.featured_stats.objective_kills = $(`#${mode} > section.content-box.u-max-width-container.highlights-section > div > ul > li:nth-child(6) > div > div.card-content > h3`).text();
        data.featured_stats.objective_time = $(`#${mode} > section.content-box.u-max-width-container.highlights-section > div > ul > li:nth-child(7) > div > div.card-content > h3`).text();
        data.featured_stats.solo_kills = $(`#${mode} > section.content-box.u-max-width-container.highlights-section > div > ul > li.column.xs-12.sm-6.lg-4.xl-3.end > div > div.card-content > h3`).text();

        /* STATS TIME PLAYED */
        const heroCount = $(`#${mode} div[data-category-id="overwatch.guid.0x0860000000000021"] > div`).length;
        for (let i = 1; i < heroCount; i++) {
            const heroName = $(`#${mode} div[data-category-id="overwatch.guid.0x0860000000000021"] > div:nth-child(${i}) .title`).text().replace('.', '');
            data.time_played[heroName] = ms($(`#${mode} div[data-category-id="overwatch.guid.0x0860000000000021"] > div:nth-child(${i}) .description`).text().replace('--', '0'));
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
    } catch(e) {
        throw e;
    }
}

module.exports = stats;
