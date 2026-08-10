const cron = require('node-cron');
const { log } = require('../../lib/logger');
const { updateProductStatuses } = require('../../jobs/updateProductStatuses');

if (process.env.ENABLE_NODE_CRON === 'true') {
  cron.schedule('* * * * *', async () => {
    try {
      log('info', '[cron/updateStatus] running product status update...');
      await updateProductStatuses();
      log('info', '[cron/updateStatus] product status update complete...');
    } catch (error) {
      log('error', '[cron/updateStatus] failed to update product statuses...', { error: error.message });
    }
  });
}
