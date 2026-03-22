export default function errorHandlerMiddleware(err, req, res, next) {
    console.error(err.stack);
    console.log('Hello i am middleware');
    console.log(err.message);
    res.status(500).json({ message: err.message });
    next();
}
//# sourceMappingURL=errorhandler.middleware.js.map