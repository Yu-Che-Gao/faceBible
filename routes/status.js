var status404 = (req, res, next) => {
    var err = new Error('Not Found')
    err.status = 404
    next(err)
}

exports.status404 = status404