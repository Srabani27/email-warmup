const schedule = require('node-schedule');
const { getAccounts } = require('./server'); // or re-export helper
// Alternatively require DB helper and replicate getAccounts

let dailyVolume = 2;
const maxVolume = 20;

function startScheduler(sendFn) {
  // Run at 09:00 local every day
  schedule.scheduleJob('0 9 * * *', async () => {
    const accounts = await sendFn.getAccounts();
    if (accounts.length < 2) return;
    const shuffled = accounts.sort(() => 0.5 - Math.random());
    for (let i=0; i < Math.min(dailyVolume, shuffled.length-1); i++) {
      await sendFn.sendWarmUpEmail(shuffled[i], shuffled[i+1].email);
    }
    if (dailyVolume < maxVolume) dailyVolume += 2;
  });
}

module.exports = { startScheduler };
