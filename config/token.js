const jwt = require('jsonwebtoken')

module.exports = {
    //Middleware atau method function untuk membuat token
    createToken: (payload) => {
        return jwt.sign(payload, "ujian$", {
            expiresIn: '12h'
        })
    },
    readToken: (req, res, next) => {
        console.log("Cek REQ TOKEN", req.token)
        jwt.verify(req.token, 'ujian$', (err, decoded) => {
            if (err) {
                return res.status(401).send(err)
            }

            //data hasil terjemahan token
            req.users = decoded

            next()
        })
    }
}