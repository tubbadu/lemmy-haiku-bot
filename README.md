# lemmy-haiku-bot

*note: this is a work in progress!*

## usage:
to add *Haiku-bot* in a community, just write in any comment 
```
!Haiku-bot SUBSCRIBE
```
and to remove it from a community:
```
!Haiku-bot UNSUBSCRIBE
```
*(note: it is case-insensitive, `UnSuBsCrIbE` is also accepted)*

you can also reply to one of *Haiku-bot* comments and write `UNSUBSCRIBE`

### delete messages
IN TEORY it should be able to remove any of its post if you reply `REMOVE` to it, but unfortunately [a bug](https://github.com/SleeplessOne1917/lemmy-bot/issues/18) prevent this so this feature is currently removed. Please don't answer REMOVED under its posts or it would probably go crazy

## hosting
the bot is currently hosted in a free plan on [alwaysdata.com](alwaysdata.com)

## contribution
any type of suggestion, contribution, anything is welcome!

## known issues
- it appears that sometimes some communities or something are not detected, boh
- I'm quite busy so I may be slow fixing bugs etc, sorry >_<

## TODO:
- [ ] read personal messages for subscribe/unsibscribe
- [ ] if a moderator adds or removes haiku-bot, non-mod users can not remove or add it
- [ ] or perhaps only allow moderators to subscribe or unsibscribe
