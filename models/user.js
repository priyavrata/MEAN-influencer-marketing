const mysql = require("mysql");
const bcrypt = require("bcryptjs");
const config=require("../config/database");
const jwt = require('jsonwebtoken');

//change data here to connect to the new database
const connection= mysql.createConnection({
    host:'localhost',
    // user: 'root',
    // password: '12345678',
    // database: 'iProject'
    database: 'bluhorse_i-project',
    username: 'bluhorse_i-project',
    passowrd: 'iProject'
});
connection.connect();
module.exports = {
    id:Number,
    username: String,
    email: String,
    password: String,
    brandname: String,
    bandweb: String,
    firstname: String,
    lastname: String,
    phonenum: Number

}
module.exports.getUserbyId = function(id, callback){
    connection.query("SELECT * FROM CUSTOMER WHERE id=?",[id], (err,result) =>{
        if(err) throw err;
        callback(null,result);
    });
}

module.exports.getIUserbyUsername = function(username,callback){
    console.log(username+" RECEIVED");
    connection.query("SELECT * FROM INFLUENCER WHERE USERNAME=?",username, (err,result) =>{
        if(err) throw err;
        console.log(result);
        callback (err,result);
    });
}

module.exports.getUserbyUsername = function(username,callback){
    console.log(username+" RECEIVED");
    connection.query("SELECT * FROM CUSTOMER WHERE USERNAME=?",username, (err,result) =>{
        if(err) throw err;
        console.log(result);
        callback (err,result);
    });
}

module.exports.addIUser = function(newUser, callback){
    
    bcrypt.genSalt(10,(err,salt)=>{
        bcrypt.hash(newUser.password,salt,(err,hash)=>{
            newUser.password=hash;
            
            var idc;
            connection.query("select max(id) from influencer",(err,id)=>{
                if(err) throw err;
                console.log("ID: ");
                idc=JSON.parse(JSON.stringify(id[0]))['max(id)'];
                console.log(idc);
                if(idc==null)
                    idc=1;
                else
                    idc=idc+1;
                console.log(idc);
            
            connection.query("INSERT INTO INFLUENCER VALUES(?,?,?,?,?,?,NULL,NULL,NULL,NULL,NULL,NULL,NULL)",[idc,newUser.email,newUser.username,newUser.phonenum,newUser.password,newUser.country],(err)=>{
                if(err) throw err;
                console.log("RECORD INSERTED");
                callback(null);
            });
        });
        });
    });
}

module.exports.ProfileComp = (newUser, callback)=>{
    connection.query("UPDATE INFLUENCER SET iusername = ?,category = ?,tcountry = ?, promo = ?, price = ?, dp = ?, followers = ? WHERE USERNAME=?", [newUser.iusername,newUser.category,newUser.tcountry,newUser.promo,newUser.price,newUser.dp,newUser.followers,newUser.username],(err)=>{
        if(err) throw (err);
        callback(null);
    })
}

module.exports.addUser = function(newUser, callback){
    
    bcrypt.genSalt(10,(err,salt)=>{
        bcrypt.hash(newUser.password,salt,(err,hash)=>{
            newUser.password=hash;
            
            var idc;
            connection.query("select max(id) from customer",(err,id)=>{
                if(err) throw err;
                console.log("ID: ");
                idc=JSON.parse(JSON.stringify(id[0]))['max(id)'];
                console.log(idc);
                if(idc==null)
                    idc=1;
                else
                    idc=idc+1;
                console.log(idc);
            
            connection.query("INSERT INTO CUSTOMER VALUES(?,?,?,?,?,?,?,?,?)",[idc,newUser.username,newUser.email,newUser.password,newUser.brandname,newUser.brandweb,newUser.firstname,newUser.lastname,newUser.phonenum],(err)=>{
                if(err) throw err;
                console.log("RECORD INSERTED");
                callback(null);
            });
        });
        });
    });
}

module.exports.comparePassword=function(candidatePassword,hash,callback){
    console.log(candidatePassword+ " "+ hash);
    bcrypt.compare(candidatePassword,hash,(err,isMatch)=>{
        if(err) console.log(err);
        callback(err,isMatch);
    });
}

module.exports.getRecords=function(category,callback){
    connection.query("SELECT * FROM INFLUENCER WHERE CATEGORY LIKE '%"+category+"%' order by followers desc",(err,users)=>{
        callback(err,users);
    })
}

module.exports.getRecords12=function(category,callback){
    connection.query("SELECT * FROM INFLUENCER WHERE CATEGORY LIKE '%"+category+"%' order by followers desc limit 0,12",(err,users)=>{
        callback(err,users);
    })
}
module.exports.storePayment=function(user,callback){
    connection.query("INSERT INTO PAYMENT VALUES(?,?,?,?,?,NULL,NULL)",[user.id,user.customer,user.influencer,user.amount,user.currency],(err)=>{
        callback(err);
    });
}
module.exports.paymentSuccess=function(user,callback){
    connection.query("UPDATE PAYMENT SET PAYMENT_ID=?,SIGNATURE=? WHERE ORDER_ID=?",[user.payment_id,user.signature,user.order_id],(err)=>{
        callback(err);
    })
}
module.exports.checkUsername=function(username,callback){
    connection.query("SELECT * FROM CUSTOMER WHERE USERNAME=?",username,(err,users)=>{
        if(users[0]!=null){
            console.log(users);
            callback(err,0);
        }
        else   
            callback(err,1);
    })
}
module.exports.checkUsernameI=function(username,callback){
    connection.query("SELECT * FROM INFLUENCER WHERE USERNAME=?",username,(err,users)=>{
        if(users[0]!=null){
            console.log(users);
            callback(err,0);
        }
        else   
            callback(err,1);
    })
}