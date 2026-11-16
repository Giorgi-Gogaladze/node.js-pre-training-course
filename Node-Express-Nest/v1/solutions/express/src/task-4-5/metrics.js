const stats = {
    totalRequests: 0, 
    totalResponseTimeMs: 0,
    byStatus: {},
    byMethod: {},
};

function metricsMiddleware(req, res, next){
    const start = process.hrtime.bigint();

    res.on("finish", () => {
        const durationMs = Number(process.hrtime.bigint() - start) /1e6;

        stats.totalRequests++;
        stats.totalResponseTimeMs += durationMs;
        stats.byStatus[res.statusCode] = (stats.byStatus[res.statusCode] || 0) + 1;
        stats.byMethod[req.method] = (stats.byMethod[req.method] || 0) + 1;
        

        console.log(
            `[metrics] ${req.method} ${req.originalUrl} -> ${res.statusCode} (${durationMs.toFixed(2)}ms)`
        );
    });
    next();
}


function getMetrics(){
    const avg = stats.totalRequests === 0 ? 0 : stats.totalResponseTimeMs / stats.totalRequests;

    return { 
        totalRequests: stats.totalRequests,
        averageResponseTimMs: Number(avg.toFixed(2)),
        byStatus: stats.byStatus,
        byMethod: stats.byMethod,
        uptimeSeconds: Math.round(process.uptime()),
    }
}

module.exports = {getMetrics, metricsMiddleware}
