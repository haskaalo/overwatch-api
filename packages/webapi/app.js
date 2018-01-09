const Koa = require('koa');

const Router = require('koa-router');
const ioredis = require('ioredis');
const md5 = require('md5');
const app = new Koa();
const router = new Router();


let redis = undefined;
if (process.env.REDIS_URL) {
    redis = process.env.REDIS_URL ? new ioredis(process.env.REDIS_URL) : undefined;
}

/*
* Catch 404 and 500
*/

app.use(async (ctx, next) => {
    try {
        await next();
        const status = ctx.status || 404;

        if (status === 404) {
            ctx.throw(404);
        }
    } catch(err) {
        ctx.status = err.status || 500;
        if (ctx.status === 404) {
            ctx.body = {
                status: 404,
                message: 'Path not found'
            };
        } else {
            ctx.body = {
                status: ctx.status,
                message: err.message || 'Internal server error',
            };
        }
    }
});

/*
* Cache routes for 5 minutes
*/
app.use(async (ctx, next) => {
    if (redis) {
        const cache = await redis.get(`owapi-${md5(ctx.path)}`);

        if (cache !== null) {
            ctx.body = JSON.parse(cache);
            return;
        }
    }
    await next();

    if (redis && ctx.status === 200) {
        await redis.set(`owapi-${md5(ctx.path)}`, JSON.stringify(ctx.body));
        await redis.expire(`owapi-${md5(ctx.path)}`, 300);
    }
});


/*
* V1 Paths
*/

router.use(require('./routes/v1/all').routes());
router.use(require('./routes/v1/general').routes());
router.use(require('./routes/v1/mode').routes());

app.use(router.routes()).use(router.allowedMethods());

module.exports = app;
