const yargs = require('yargs/yargs');
const run = require('promisify-tuple');
const Ref = require('ssb-ref');
const sleep = require('util').promisify(setTimeout);
import {startSSB} from './ssb';

(async () => {
  const argv = yargs(process.argv)
    .option('whoami', {
      type: 'boolean',
      describe: 'Display info about the dummy SSB feed used here',
    })
    .option('claim-invite', {
      type: 'string',
      describe: 'Input an invite URL to become a room member',
    })
    .option('consume-alias', {
      type: 'string',
      describe: "Input an alias URL to connect to the alias's owner",
    })
    .option('sign-in', {
      type: 'string',
      describe: 'Input the multiserver address of server to login to',
    })
    .option('sign-out', {
      type: 'string',
      describe: 'Input the multiserver address of server to sign out',
    })
    .usage('ssb-room2-check [opts]').argv;

  if (argv.whoami) {
    const ssb = startSSB();
    console.log(ssb.id);
    await sleep(200);
    await run(ssb.close)();
    return;
  }

  if (argv.claimInvite) {
    const uri = argv.claimInvite;
    const ssb = startSSB();
    console.log(`Claiming invite...`);
    var [err, msaddr] = await run(ssb.roomClient.consumeInviteUri)(uri);
    if (err) {
      console.error(err.message);
      await run(ssb.close)();
      return;
    }
    console.log(`Connecting to the room...`);
    await sleep(200);
    var [err] = await run(ssb.conn.connect)(msaddr);
    if (err) {
      console.error(err.message);
      await run(ssb.close)();
      return;
    }
    console.log(`Storing the room's address in ConnDB...`);
    var [err] = await run(ssb.conn.remember)(msaddr, {type: 'room'});
    if (err) {
      console.error(err.message);
      await run(ssb.close)();
      return;
    } else console.log(`Success`);
    await run(ssb.close)();
    return;
  }

  if (argv.consumeAlias) {
    const uri = argv.consumeAlias;
    const ssb = startSSB();
    console.log(`Consuming alias...`);
    const [err] = await run(ssb.roomClient.consumeAliasUri)(uri);
    if (err) console.error(err.message);
    else console.log(`Success`);
    await run(ssb.close)();
    return;
  }

  if (argv.signIn) {
    const msaddr = argv.signIn;
    const ssb = startSSB();
    console.log(`Connecting to the room...`);
    await sleep(200);
    var [err] = await run(ssb.conn.connect)(msaddr);
    if (err) {
      console.error(err.message);
      await run(ssb.close)();
      return;
    }
    const {key} = Ref.toAddress(msaddr);
    console.log(`Producing Sign-in URL...`);
    var [err, url] = await run(ssb.httpAuthClient.produceSignInWebUrl)(key);
    if (err) {
      console.error(err.message);
      await run(ssb.close)();
      return;
    }
    if (url.includes('localhost')) {
      url = url.replace('localhost', 'localhost:3000')
      url = url.replace('https', 'http')
    }
    console.log(
      `Success. Open the following link in your browser ` +
        `within the next 2 minutes:\n\n${url}`,
    );
    await sleep(120e3);
    await run(ssb.close)();
    return;
  }

  if (argv.signOut) {
    const msaddr = argv.signOut;
    const ssb = startSSB();
    console.log(`Connecting to the room...`);
    await sleep(200);
    var [err] = await run(ssb.conn.connect)(msaddr);
    if (err) {
      console.error(err.message);
      await run(ssb.close)();
      return;
    }
    const {key} = Ref.toAddress(msaddr);
    console.log(`Invalidate all tokens...`);
    var [err] = await run(ssb.httpAuthClient.invalidateAllSessions)(key);
    if (err) {
      console.error(err.message);
      await run(ssb.close)();
      return;
    }
    console.log(`Success`);
    await run(ssb.close)();
    return;
  }
})();
