const run = require('promisify-tuple');
const sleep = require('util').promisify(setTimeout);
const Ref = require('ssb-ref');
const pull = require('pull-stream');
import {startSSB} from '../ssb';

exports.command = 'watch <roomid>';

exports.describe = 'connects to a room and logs the attendance list';

exports.builder = (yargs: any) => {
  return yargs.positional('roomid', {
    describe: 'SSB ID of the room server',
    type: 'string',
  });
};

exports.handler = async function (argv: any) {
  const {roomid} = argv;
  console.log(`Looking up the room with that ID...`);
  const ssb = startSSB();
  await sleep(3e3);
  for (const [msaddr] of ssb.conn.dbPeers()) {
    const key = Ref.getKeyFromAddress(msaddr);
    if (key === roomid) {
      console.log(`Connecting to the room...`);
      var [err, rpc] = await run(ssb.conn.connect)(msaddr);
      if (err) {
        console.error(err.message);
        await run(ssb.close)();
        await sleep(10e3);
        return;
      }
      console.log(`opening attendants stream`);
      pull(
          rpc.room.attendants(),
          pull.drain((evt: any) => {
              console.log(evt)
          }, (err: any) => {
              console.warn('attendants closed:'+err)
          })
      )
      return
    }
  }
};
