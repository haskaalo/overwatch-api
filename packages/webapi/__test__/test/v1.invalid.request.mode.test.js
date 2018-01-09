/* eslint-disable */

const app = require('../../app');
const request = require('supertest')(app.listen());
const nock = require('nock');

function notValidUser() {
    nock('https://playoverwatch.com')
    .get('/en-us/search/account-by-name/not_existinguserxd')
    .reply(200, []);

    nock('https://playoverwatch.com')
    .get('/en-us/career/pc/us/not_existinguserxd')
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

test('Not a existing user request /v1/mode/:mode/:btag', async () => {
    notValidUser();

    const rp = await request.get('/v1/mode/quickplay/not_existinguserxd')
    .expect(400)
    .expect('content-type', 'application/json; charset=utf-8');

    expect(JSON.parse(rp.text)).toEqual({
        status: 400,
        message: 'Player do not exist.'
    });
});

test('Not a existing user request /v1/mode/:mode/:btag/:platform', async () => {
    notValidUser();

    const rp = await request.get('/v1/mode/quickplay/not_existinguserxd/us')
    .expect(400)
    .expect('content-type', 'application/json; charset=utf-8');

    expect(JSON.parse(rp.text)).toEqual({
        status: 400,
        message: 'Player do not exist.'
    });
});

test('Not a valid mode /v1/mode/:mode/:btag', async () => {
    notValidUser();

    const rp = await request.get('/v1/mode/whatmode/not_existinguserxd')
    .expect(400)
    .expect('content-type', 'application/json; charset=utf-8');

    expect(JSON.parse(rp.text)).toEqual({
        status: 400,
        message: 'Invalid mode'
    });
});

test('Not a valid mode /v1/mode/:mode/:btag/:platform', async () => {
    notValidUser();

    const rp = await request.get('/v1/mode/whatmode/not_existinguserxd/us')
    .expect(400)
    .expect('content-type', 'application/json; charset=utf-8');

    expect(JSON.parse(rp.text)).toEqual({
        status: 400,
        message: 'Invalid mode'
    });
});
