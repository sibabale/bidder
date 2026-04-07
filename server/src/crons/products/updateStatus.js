const cron = require('node-cron');
const { updateProductStatuses } = require('../../jobs/updateProductStatuses');

if (process.env.ENABLE_NODE_CRON === 'true') {
  cron.schedule('* * * * *', async () => {
    try {
      await updateProductStatuses();
    } catch (error) {
      console.error('Error updating product statuses:', error);
    }
  });
}
