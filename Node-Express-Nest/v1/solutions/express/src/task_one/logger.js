function logger(req, res, next){
    console.log(` [logger] ${req.method} ${req.originalUrl}`);
    next();
}

module.exports = logger;