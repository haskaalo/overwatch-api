const Router = require('koa-router');
const router = new Router();
const owapi = require('owapi');

// return specified 
router.get('/v1/mode/:mode/:btag', async (ctx) => {
    if (!['quickplay', 'competitive'].includes(ctx.params.mode)) {
        return await ctx.throw(400, 'Invalid mode');
    }

    const modeStats = await owapi.getModeStats(ctx.params.btag, ctx.params.mode).catch((err) => {
        if (err === 'PLAYER_NOT_EXIST') {
            return ctx.throw(400, 'Player do not exist.');
        } else {
            return ctx.throw(err);
        }
    });

    ctx.body = modeStats;
});

router.get('/v1/mode/:mode/:btag/:platform', async (ctx) => {
    if (!['quickplay', 'competitive'].includes(ctx.params.mode)) {
        return await ctx.throw(400, 'Invalid mode');
    }

    const modeStats = await owapi.getModeStats(ctx.params.btag, ctx.params.mode, ctx.params.platform).catch((err) => {
        if (err === 'PLAYER_NOT_EXIST') {
            return ctx.throw(400, 'Player do not exist.');
        } else if (err === 'ACCOUNT_PRIVATE') {
            return ctx.throw(401, 'Player account is private');
        } else {
            return ctx.throw(err);
        }
    });

    ctx.body = modeStats;
});

module.exports = router;
