const express = require('express');

function createShard(shardId, totalShards) {
    const app = express();
    let count = 0;
    const port = 3000 + shardId;

    app.use(express.json());

    // Check if this shard should handle the value
    function shouldHandleValue(value) {
        return value % totalShards === shardId;
    }

    // Increment counter
    app.post('/increment', (req, res) => {
        const value = req.body.value || 1;
        if (shouldHandleValue(value)) {
            count += value;
            res.json({ success: true, shardId, count });
        } else {
            res.json({ success: false, message: 'Value not handled by this shard' });
        }
    });

    // Get current count
    app.get('/count', (req, res) => {
        res.json({ shardId, count });
    });

    // Start server
    app.listen(port, () => {
        console.log(`Shard ${shardId} listening on port ${port}`);
    });

    return app;
}

module.exports = createShard;