const {db, dbQuery, createToken}= require('../config')
const Crypto = require('crypto')
module.exports={
    getAll: async(req, res, next)=>{
        try{
                let dataSearch=[], getSQL
                for (let prop in req.query) {
                    dataSearch.push(`${prop} = ${db.escape(req.query[prop])}`)
                }
                console.log(dataSearch.join(' AND '))
                if (dataSearch.length > 0) {
                    getSQL = `Select * from movies where ${dataSearch.join(' AND ')};`
                } else {
                    getSQL = `Select * from movies;`
                }
                let get = await dbQuery(getSQL)
                res.status(200).send(get)
            
        }catch(error){
            next(error)
        }
    },
    getMovie:async(req,res,next)=>{
        try{
        let getSQL, dataSearch = []
        for (let prop in req.query){
            dataSearch.push(`${prop} = ${db.escape(req.query[prop])}`)
        }
        console.log(dataSearch.join('AND'))
        if(dataSearch.length>0){
            getSQL=`Select m.*, ms.id, l.id, st.id from movies m movie_status ms join locations l join show_times st on schedule where ${dataSearch.join('AND')};`
        }else{
            getSQL = `Select * movies`
        }
        let get = await dbQuery(getSQL)
        res.status(200).send(get)
    }catch(error){
        next(error)
    }
    },
    add:async(req,res,next)=>{
        try{
        if(req.users.status==1){
            let add = `Insert into movies (name, release_date, release_month, release_year, duration_min, genre, description, status)
            values (${db.escape(req.body.name)},${db.escape(req.body.release_date)}, ${db.escape(req.body.release_month)}, ${db.escape(req.body.release_year)}, ${db.escape(req.body.durationMin)}, ${db.escape(req.body.genre)}, ${db.escape(req.body.desc)}, ${db.escape(req.body.status)});`
            add= await dbQuery(add)
            res.status(200).send("Insert film berhasil!")
        }else{
            res.status(500).send("Kamu bukan admin")
        }
    }catch(error){
        next(error)
    }
}
}