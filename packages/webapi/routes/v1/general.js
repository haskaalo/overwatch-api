const Router = require('koa-router');
const router = new Router();
const owapi = require('owapi');

// return general stats for a player
router.get('/v1/general/:btag', async (ctx) => {
    const getGeneral = await owapi.getGeneralStats(ctx.params.btag).catch((err) => {
        if (err === 'PLAYER_NOT_EXIST') {
            return ctx.throw(400, 'Player do not exist.');
        } else if (err === 'ACCOUNT_PRIVATE') {
            return ctx.throw(401, 'Player account is private');
        } else {
            return ctx.throw(err);
        }
    });

    ctx.body = getGeneral;
});

// return general stats for specified platform and player
router.get('/v1/general/:btag/:platform', async (ctx) => {
    if (!owapi.platforms.includes(ctx.params.platform)) {
        return await ctx.throw(400, 'Invalid platform');
    }

    const getGeneral = await owapi.getGeneralStats(ctx.params.btag, ctx.params.platform).catch((err) => {
        if (err === 'PLAYER_NOT_EXIST') {
            return ctx.throw(400, 'Player do not exist.');
        } else if (err === 'ACCOUNT_PRIVATE') {
            return ctx.throw(401, 'Player account is private');
        } else {
            return ctx.throw(err);
        }
    });

    ctx.body = getGeneral;
});

module.exports = router;
