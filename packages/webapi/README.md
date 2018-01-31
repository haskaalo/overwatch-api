# webapi

Overwatch API made on Koa.

## Setup (Docker)

1. `docker pull haskaalo/overwatch-api:latest`
3. `docker run overwatch-api:latest -e REDIS_URL=redis://myuser:supersecretpwd@myhost:6379` (you can ignore `-e REDIS_URL...` if you don't want caching)

## v1 api

**:platform is not required**

## /v1/all/:btag/:platform

* `:btag`: Battle.net Tag, PSN Tag, XBL, Tag
* `:platform`: One of the [.platforms]

Output of mode + general combined

[Example output](https://gist.github.com/Haskaalo/7d25f66536aa548f267f1941a2ac45e2)

## /v1/mode/:mode/:btag/:platform

* `:btag`: Battle.net Tag, PSN Tag, XBL, Tag
* `:mode`: quickplay or competitive
* `:platform`: One of the [.platforms](https://github.com/haskaalo/overwatch-api/tree/master/packages/owapi/#platforms)

Return detailed stats on a mode about a player.

[Example output](https://gist.github.com/Haskaalo/12cbc1b8c9eb9bc0c60d3e2d2986044d)

## /v1/general/:btag/:platform

* `:btag`: Battle.net Tag, PSN Tag, XBL, Tag
* `:platform`: One of the [.platforms](https://github.com/haskaalo/overwatch-api/tree/master/packages/owapi/#platforms)

Output general data about a player. 

Example output:

```json
{
  "rank": "3160",
  "rank_name": "diamond",
  "bnet_id": "350010705",
  "prestige": 5,
  "level": "24",
  "profile": "https://d1u1mce87gyfbn.cloudfront.net/game/unlocks/0x02500000000009E1.png"
}
```
