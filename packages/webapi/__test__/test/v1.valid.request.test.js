/* eslint-disable */

const app = require('../../app');
const request = require('supertest')(app.listen());
const md5 = require('md5');
const nock = require('nock');

beforeAll(() => {
    jest.setTimeout(120000);
    
    nock('https://playoverwatch.com')
    .persist()
    .get('/en-us/career/pc/Trev-11289')
    .replyWithFile(200, __dirname + '/../data/trev.html');

    nock('https://playoverwatch.com')
    .persist()
    .get('/en-us/search/account-by-name/Trev%2311289')
    .reply(200, [{'platform':'pc',
    'name':'Trev#11289',
    'urlName':'Trev-11289',
    'level':555,
    'portrait':'https://d1u1mce87gyfbn.cloudfront.net/game/unlocks/0x02500000000009E1.png',
    'visibility':{'name': 'PrivateVisibility','isPublic': true, 'isPrivate': false, 'isFriendsOnly': false}}]);
});

afterAll(async () => {
    if (process.env.REDIS_URL) {
        const ioredis = require('ioredis');
        const redis = new ioredis(process.env.REDIS_URL);
        await redis.del(`owapi-*`);
    }
});

describe('Route all', () => {
    test('/v1/all/:btag', async () => {
        const rp = await request.get('/v1/all/Trev-11289')
            .expect(200)
            .expect('content-type', 'application/json; charset=utf-8');
        
        expect(JSON.parse(rp.text)).toMatchSnapshot();
    });

    test('/v1/all/:btag/:us', async () => {
        const rp = await request.get('/v1/all/Trev-11289/pc')
        .expect(200)
        .expect('content-type', 'application/json; charset=utf-8');

        expect(JSON.parse(rp.text)).toMatchSnapshot();
    });
});

describe('Route general', async () => {
    test('/v1/general/:btag', async () => {
        const rp = await request.get('/v1/general/Trev-11289')
        .expect(200)
        .expect('content-type', 'application/json; charset=utf-8');
    
        expect(JSON.parse(rp.text)).toMatchSnapshot();
    });

    test('/v1/general/:btag/:platform', async () => {
        const rp = await request.get('/v1/general/Trev-11289/pc')
        .expect(200)
        .expect('content-type', 'application/json; charset=utf-8');
    
        expect(JSON.parse(rp.text)).toMatchSnapshot();
    });
});

describe('Route mode' , async () => {
    test('/v1/mode/quickplay/:btag', async () => {
        const rp = await request.get('/v1/mode/quickplay/Trev-11289')
        .expect(200)
        .expect('content-type', 'application/json; charset=utf-8');
    
        expect(JSON.parse(rp.text)).toMatchSnapshot();
    });

    test('/v1/mode/quickplay/:btag/pc', async () => {
        const rp = await request.get('/v1/mode/quickplay/Trev-11289')
        .expect(200)
        .expect('content-type', 'application/json; charset=utf-8');
    
        expect(JSON.parse(rp.text)).toMatchSnapshot();
    });
});
