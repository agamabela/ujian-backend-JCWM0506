const {db,dbQuery, createToken} = require('../config')
const Crypto = require('crypto')

module.exports={
    getUsers:async(req,res,next)=>{
        try{
            let getSQL, dataSearch=[]
            let getRole = `Select * from roles;`
            for(let prop in req.query){
                dataSearch.push(`${prop} = ${db.escape(req.query[prop])}`)
            }
            console.log(dataSearch.join('AND'))
            if(dataSearch.length>0){
                getSQL=`Select * from users where ${dataSearch.join('AND')};`
            }else{
                getSQL=`Select * from users;`
            }
            let get = await dbQuery(getSQL)
            getRole = await dbQuery(getRole)
            get.forEach(item=>{
                item.role =[]
                getRole.forEach(el=>{
                    if(item.id == el.id){
                        item.role.push(el.role)
                    }
                })
            })
            res.status(200).send(get)
        }catch(error){
            next(error)
        }
    },
    addUsers:async(req,res,next)=>{
        try{
           let hashPassword = Crypto.createHmac("sha256", "ujian$$$").update(req.body.password).digest("hex")

           let insertSQL = `Insert into users (uid, username, email, password, role, status) 
           values (${db.escape(Date.now())}, ${db.escape(req.body.username)}, ${db.escape(req.body.email)}, ${db.escape(hashPassword)}, ${req.body.roles.id}, ${req.body.status.id} );`
            let regis = await dbQuery(insertSQL)
            let getUser = await dbQuery(`Select * from users where id = ${regis.insertId}`)
            let {id, uid, username,email, password, role, status} = getUser[0]


            res.status(202).send({success:true, message:"Berhasil add user!"})

        }catch (error){
            next(error)
        }   
    },
    login:async(req,res,next)=>{
        if(req.status.id==1){
        if(req.body.email || req.body.username && req.body.password){
            let hashPassword = Crypto.createHmac("sha256", "ujian$$$").update(req.body.password).digest("hex")
            let getSQL = `Select * from users
            where email=${db.escape(req.body.email)} and password=${db.escape(hashPassword)};`
            db.query(getSQL,(err,results)=>{
                if(err){
                    res.status(500).send({status:'Error mysql', message:err})
                }
                if(results.length>0){
                    let{id,uid,username,email, password,role,status}=results[0]
                    let token = createToken({id,uid,username,email, password,role,status})
                    res.status(200).send({id,uid,username,email, password,role,status,token})
                }else{
                    res.status(404).send({status:"error mysql", message:'email dan password salah'})
                }
            })
        }else{
            res.status(500).send({error:true, message:"Params not complete"})
        }
    }else{
        res.status(402).send({error:true, message:"Id tidak aktif/close"})
    }
    },
    deactivate: async (req, res, next) => {
        try {
            console.log("Hasil readToken :", req.user)
            let sqlUpdate = `Update status set id = 2 where id=${req.status.id};`
            sqlUpdate = await dbQuery(sqlUpdate)
            res.status(200).send({ success: true, message: "Deactivate Success ✅" })
        } catch (error) {
            next(error)
        }
    },
    reactivate: async (req, res, next) => {
       if(!req.body.status.id == 3){
        try {
            console.log("Hasil readToken :", req.user)
            let sqlUpdate = `Update status set id = 1 where id=${req.status.id};`
            sqlUpdate = await dbQuery(sqlUpdate)
            res.status(200).send({ success: true, message: "Deactivate Success ✅" })
        } catch (error) {
            next(error)
        }
    }else{
        res.status(404).send({ success: true, message: "Akun tidak bisa dikembalikan" })
    }
    },
    closed: async (req, res, next) => {
        try {
            console.log("Hasil readToken :", req.user)
            let sqlUpdate = `Update status set id = 3 where id=${req.status.id};`
            sqlUpdate = await dbQuery(sqlUpdate)
            res.status(200).send({ success: true, message: "Reactivate Success ✅" })
        } catch (error) {
            next(error)
        }
    }
    
}