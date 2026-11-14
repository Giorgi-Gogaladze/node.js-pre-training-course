function timer(req, res, next){
    console.log('[timer] started');
    const start = Date.now();

    res.on("finish", () => {
        console.log(` [timer] finished in ${Date.now() - start}ms`);
    });

    next();
}
module.exports = timer;