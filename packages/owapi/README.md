# owapi

owapi is a module to get full detailed stats about a player on specified mode (quickplay, competitive) or even a specified platform!

## Quick start

```js
const owapi = require('owapi');

const stats = await owapi.getAllStats('Trev-11289', 'pc');

console.log(stats)
```

## API

### Reminders

* btag could be a psn or xbox tag.
* platform include pc regions and xbl, psn
* Check [errors owapi return sometimes](#errors)

### Errors

#### If user doesn't exist, it reject a string `'PLAYER_NOT_EXIST'`

Example:
```js
const generalData = await owapi.general('totally-not-existing-user', platform).catch((err) => {
  if (err === 'PLAYER_NOT_EXIST') {
    res.send('This player doesn\'t exist D:')
    return;
  }
});

...
```
#### If player account is private, it reject a string `'ACCOUNT_PRIVATE'`

Example:
```js
const generalData = await owapi.general('some-user-with-private-account', platform).catch((err) => {
  if (err === 'ACCOUNT_PRIVATE') {
    res.send('This player account is private D:')
    return;
  }
});
```

#### If platform doesn't exist, it return a type error (might go)

### .getGeneralStats(btag, ?platform, ?html)
Return general stats about a player such as level, rank, profile icon and more.

Example output:

```json
{
  "rank": 3935,
  "rank_name": "master",
  "profile": "https://d15f34w2p8l1cc.cloudfront.net/overwatch/8fb752e425af261dff0c2fb39535e06f9b110dfafcde7c8df321bc836811ba59.png"
}
```


### .getModeStats(btag, 'quickplay' || 'competitive', ?platform, ?html)

Return detailed stats on a mode about a player 

[Example output](https://gist.github.com/Haskaalo/12cbc1b8c9eb9bc0c60d3e2d2986044d)

### .getAllStats(btag, ?platform, ?html)

Get **everything** from Playoverwatch.com.

Alt to:

```js
const html = await owapi.getRawHtmlFromBtag(btag, platform);
const generalData = await owapi.general(btag, platform, html);
const quickplayData = await owapi.getModeStats(btag, 'quickplay', platform, html);
const competitiveData = await owapi.getModeStats(btag, 'competitive', platform, html);

const allStats = Object.assign(generalData, {quickplay: quickplayData}, {competitive: competitiveData});
```

[Example output](https://gist.github.com/Haskaalo/7d25f66536aa548f267f1941a2ac45e2)

### .getAccountByName(btag)

Just reply what's coming out from https://playoverwatch.com/en-us/search/account-by-name/

Reminder: It reject `'PLAYER_NOT_EXIST'` if user doesn't exist.

### .getRawHtmlFromBtag(btag, ?platform)

Just reply what's coming out from
https://playoverwatch.com/en-us/career/:platform/:btag

### .platforms

Return an array of platforms owapi uses.

## License

Copyright (c) 2021 Haskaalo

Licensed under MIT License