const Router = require('koa-router');
const router = new Router();
const owapi = require('owapi');

// Redirect old clients to new path
router.get('/stats/:btag/:platform', async (ctx) => {
    await ctx.redirect(`/v1/all/${ctx.params.btag}/${ctx.params.platform}`);
});

// Return all stats for a btag
router.get('/v1/all/:btag', async (ctx) => {
    const getAll = await owapi.getAllStats(ctx.params.btag).catch((err) => {
        if (err === 'PLAYER_NOT_EXIST') {
            return ctx.throw(400, 'Player do not exist.');
        } else if (err === 'ACCOUNT_PRIVATE') {
            return ctx.throw(401, 'Player account is private');
        } else {
            return ctx.throw(err);
        }
    });

    ctx.body = getAll;
});

// Return all stats for a specified platform and btag
router.get('/v1/all/:btag/:platform', async (ctx) => {
    if (!owapi.platforms.includes(ctx.params.platform)) {
        return await ctx.throw(400, 'Invalid platform');
    }

    const getAll = await owapi.getAllStats(ctx.params.btag, ctx.path.platform).catch((err) => {
        if (err === 'PLAYER_NOT_EXIST') {
            return ctx.throw(400, 'Player do not exist.');
        } else if (err === 'ACCOUNT_PRIVATE') {
            return ctx.throw(401, 'Player account is private');
        } else {
            return ctx.throw(err);
        }
    });

    ctx.body = getAll;
});

module.exports = router;
