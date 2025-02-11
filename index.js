const createShard = require('./shardCounter');
const createAggregator = require('./aggregator');

// Configuration
const TOTAL_SHARDS = 3;

// Start counter shards
for (let i = 0; i < TOTAL_SHARDS; i++) {
    createShard(i, TOTAL_SHARDS);
}

// Start aggregator
createAggregator(TOTAL_SHARDS);