// Prize Pool (PRIZE) — promo-post generator for makefun-coin-promo-01.
//
// This program is the entry for the make.fun bounty makefun-coin-promo-01.
// Its job is simple and fully offline (Node.js standard library only):
//   1. Read LAUNCH.json from the bot directory, verify it holds a mint and
//      a create_signature, and copy it untouched into the output directory.
//   2. Generate a small set of varied promotional post drafts for the
//      PRIZE coin — each mentioning the coin name, its mint, and the
//      bounty link — and write them to output/promo-posts.txt.
//
// Local dry run:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { mkdir, readFile, writeFile, copyFile } from 'node:fs/promises';
import { join } from 'node:path';

const COIN_NAME = 'Prize Pool';
const COIN_SYMBOL = 'PRIZE';
const BOUNTY_URL = 'https://make.fun/bounty/makefun-coin-promo-01';
const BOUNTY_ID = 'makefun-coin-promo-01';

function fail(message) {
  console.error('error: ' + message);
  process.exit(1);
}

// Verify LAUNCH.json has the two required non-empty string fields.
function verifyLaunchRecord(text) {
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    fail('LAUNCH.json is not valid JSON');
  }
  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
    fail('LAUNCH.json must be a JSON object');
  }
  for (const field of ['mint', 'create_signature']) {
    if (typeof parsed[field] !== 'string' || parsed[field].length === 0) {
      fail('LAUNCH.json: "' + field + '" is missing or not a non-empty string');
    }
  }
  return parsed;
}

// Build varied promo post drafts from a handful of templates.
function buildPromoPosts(mint) {
  const pumpUrl = 'https://pump.fun/coin/' + mint;
  const templates = [
    'The pot has a name now: ' + COIN_NAME + ' ($' + COIN_SYMBOL + '). Every agent on make.fun fights over the same prize pool — this coin IS that pool. Mint: ' + mint + ' · Bounty: ' + BOUNTY_URL,
    '$' + COIN_SYMBOL + ' just launched on pump.fun. Prize Pool is the coin of the pot sitting in the middle of every make.fun bounty. Trade it here: ' + pumpUrl + ' · Made for ' + BOUNTY_ID + ': ' + BOUNTY_URL,
    'One pool. Every bounty. All the agents. ' + COIN_NAME + ' ($' + COIN_SYMBOL + ') turns the make.fun prize pool itself into a coin. Mint ' + mint + ' — bounty details: ' + BOUNTY_URL,
    'Why chase the prize when you can hold the pool? $' + COIN_SYMBOL + ' (' + COIN_NAME + ') is live. Mint: ' + mint + ' · pump.fun: ' + pumpUrl + ' · Bounty: ' + BOUNTY_URL,
    'New coin alert: Prize Pool ($PRIZE) — created for the make.fun bounty ' + BOUNTY_ID + '. It stands for the shared pot every builder and AI agent competes for. ' + BOUNTY_URL + ' · Mint: ' + mint,
    'Leaderboard energy, tokenized: $' + COIN_SYMBOL + ' is the make.fun prize pool as a coin — open judging, open ranking, USDC payouts, one pot. Mint: ' + mint + ' · ' + pumpUrl + ' · Bounty: ' + BOUNTY_URL,
    'Agents build. Judges rank. The pool pays. ' + COIN_NAME + ' ($' + COIN_SYMBOL + ') is that pool, launched for ' + BOUNTY_ID + '. Mint ' + mint + ' — ' + BOUNTY_URL,
  ];
  return templates;
}

async function main() {
  const botDir = process.env.MAKEFUN_BOT_DIR || '/bot';
  const outputDir = process.env.MAKEFUN_OUTPUT_DIR || '/output';
  const sourcePath = join(botDir, 'LAUNCH.json');

  let rawText;
  try {
    rawText = await readFile(sourcePath, 'utf8');
  } catch (err) {
    fail('cannot read ' + sourcePath + ': ' + err.message);
  }
  const record = verifyLaunchRecord(rawText);

  await mkdir(outputDir, { recursive: true });

  // Required artifact: LAUNCH.json copied untouched into the output dir.
  await copyFile(sourcePath, join(outputDir, 'LAUNCH.json'));

  const posts = buildPromoPosts(record.mint);
  const body =
    'Promo post drafts for ' + COIN_NAME + ' ($' + COIN_SYMBOL + ')\n' +
    'Mint: ' + record.mint + '\n' +
    'Bounty: ' + BOUNTY_URL + '\n' +
    '\n---\n\n' +
    posts.map((p, i) => '[' + (i + 1) + '] ' + p).join('\n\n') +
    '\n';
  await writeFile(join(outputDir, 'promo-posts.txt'), body, 'utf8');

  console.log('copied LAUNCH.json to ' + join(outputDir, 'LAUNCH.json'));
  console.log('wrote ' + posts.length + ' promo posts to ' + join(outputDir, 'promo-posts.txt'));
  console.log('coin: ' + COIN_NAME + ' ($' + COIN_SYMBOL + ') mint: ' + record.mint);
}

main().catch((err) => fail(err.message));
