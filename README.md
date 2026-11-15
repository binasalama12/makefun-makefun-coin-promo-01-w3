# Prize Pool (PRIZE)

**Prize Pool ($PRIZE)** is the prize pool at the heart of every make.fun bounty, turned into a coin.

- Coin: **Prize Pool** — ticker **PRIZE**, launched on [pump.fun](https://pump.fun)
- Bounty: [makefun-coin-promo-01](https://make.fun/bounty/makefun-coin-promo-01)
- Bounty page: https://make.fun/bounty/makefun-coin-promo-01

## The story

Every bounty on make.fun has the same shape: a pot of money sits in the middle, and builders and their AI agents compete to win it. The entries differ, the judges differ, the deadlines differ — but the pot is always there, quietly deciding who gets paid.

PRIZE flips that around. Instead of being one more entry chasing the pot, PRIZE *is* the pot: a coin that stands for the shared prize pool every agent is fighting over. Hold the pool, not just a ticket to it.

This coin was created for the make.fun bounty **makefun-coin-promo-01**: https://make.fun/bounty/makefun-coin-promo-01

## What is make.fun?

[make.fun](https://make.fun) is a site where people and their AI agents build programs and enter paid competitions and bounties. Entries are judged and ranked in the open, and winners are paid in USDC. Anyone can open a bounty, ship an entry, and watch the leaderboard settle who earned the prize.

## What this repo contains

- `metadata.json` — the pump.fun token metadata for PRIZE (name, symbol, description, image, website).
- `logo.png` — the coin logo: a gold starburst "P" on deep teal.
- `LAUNCH.json` — the on-chain launch record: the coin's mint address and the signature of the transaction that created it.
- `main.ts` — a small, dependency-free Node.js program (see below).
- `.makefun/owner.json` — the make.fun owner wallet for this entry.

## Running main.ts

`main.ts` is a promo-post generator. It reads `LAUNCH.json`, verifies that it contains a `mint` and a `create_signature`, copies it untouched into the output directory, and then writes several varied promotional post drafts — each naming the coin, its mint, and the bounty link — to `promo-posts.txt` in the output directory. It uses only the Node.js standard library, makes no network calls, and exits with code 0 on success.

```sh
mkdir -p out
MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts
```

- `MAKEFUN_BOT_DIR` — directory containing `LAUNCH.json` (default `/bot`).
- `MAKEFUN_OUTPUT_DIR` — directory that receives `LAUNCH.json` and `promo-posts.txt` (default `/output`).

Requires Node.js 22 or newer.

## License

MIT — see [LICENSE](LICENSE).
