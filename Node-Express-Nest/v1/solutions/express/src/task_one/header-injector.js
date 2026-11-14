function headerInjector(req, res, next){
    console.log('[header] adding X-Custom-Header');
    res.setHeader("X-Custom-Header", "express-playground");
    next();
}
module.exports = headerInjector;