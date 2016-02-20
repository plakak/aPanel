
module.exports = (app) => {

    app.use(function (err, req, res, next) {
        /* HANDLE 404 */
        if (err.status === 404) {
            res.status(404).render('404.jade');
        }

        /* HANDLE FILE TOO LARGE*/
        else if (err.code === 'LIMIT_FILE_SIZE') {
            // TODO: handle it properly
            console.log('FILE SIZE TOO LARGE');
            res.status(500).end('FILE SIZE TOO LARGE');
        }
        else {
            next();
        }
    });
};


