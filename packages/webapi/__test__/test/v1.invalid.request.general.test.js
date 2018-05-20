/* eslint-disable */

const app = require('../../app');
const request = require('supertest')(app.listen());
const nock = require('nock');

function notValidUser() {
    nock('https://playoverwatch.com')
    .get('/en-us/search/account-by-name/not_existinguserxd')
    .reply(200, []);

    nock('https://playoverwatch.com')
    .get('/en-us/career/pc/not_existinguserxd')
    .reply(404, 'xd');
};

beforeEach(() => {
    nock.cleanAll();
});

afterAll(async () => {
    if (process.env.REDIS_URL) {
        const ioredis = require('ioredis');
        const redis = new ioredis(process.env.REDIS_URL);
        await redis.del(`owapi-*`);
    }
});

test('Not a existing user request /v1/all/:btag', async () => {
    notValidUser();

    const rp = await request.get('/v1/general/not_existinguserxd')
    .expect(400)
    .expect('content-type', 'application/json; charset=utf-8');

    expect(JSON.parse(rp.text)).toEqual({
        status: 400,
        message: 'Player do not exist.'
    });
});

test('Not a existing user request /v1/all/:btag/:platform', async () => {
    notValidUser();

    const rp = await request.get('/v1/general/not_existinguserxd/pc')
    .expect(400)
    .expect('content-type', 'application/json; charset=utf-8');

    expect(JSON.parse(rp.text)).toEqual({
        status: 400,
        message: 'Player do not exist.'
    });
});

test('Tell not a valid platform /v1/all/:btag/notvalidplatform', async () => {
    const rp = await request.get('/v1/general/not_existinguserxd/not_a_valid_platform')
    .expect(400)
    .expect('content-type', 'application/json; charset=utf-8');

    expect(JSON.parse(rp.text)).toEqual({
        status: 400,
        message: 'Invalid platform'
    });
});
