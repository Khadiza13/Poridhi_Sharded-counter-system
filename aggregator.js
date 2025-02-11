const express = require('express');
const axios = require('axios');

function createAggregator(totalShards) {
    const app = express();
    const port = 4000;

    app.use(express.json());

    // Get total count from all shards
    app.get('/total', async (req, res) => {
        try {
            let total = 0;
            const promises = [];

            // Collect counts from all shards
            for (let i = 0; i < totalShards; i++) {
                const shardPort = 3000 + i;
                promises.push(
                    axios.get(`http://localhost:${shardPort}/count`)
                        .then(response => response.data.count)
                );
            }

            const counts = await Promise.all(promises);
            total = counts.reduce((sum, count) => sum + count, 0);

            res.json({ total });
        } catch (error) {
            res.status(500).json({ error: 'Failed to aggregate counts' });
        }
    });

    // Increment counter across shards
    app.post('/increment', async (req, res) => {
        try {
            const value = req.body.value || 1;
            const targetShard = value % totalShards;
            const shardPort = 3000 + targetShard;

            const response = await axios.post(`http://localhost:${shardPort}/increment`, { value });
            res.json(response.data);
        } catch (error) {
            res.status(500).json({ error: 'Failed to increment counter' });
        }
    });

    // Start server
    app.listen(port, () => {
        console.log(`Aggregator listening on port ${port}`);
    });

    return app;
}

module.exports = createAggregator;
