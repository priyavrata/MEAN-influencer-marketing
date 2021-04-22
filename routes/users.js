const express=require("express");
const router = express.Router();
const passport=require("passport");
const user = require("../models/user");
const jwt = require("jsonwebtoken");
const config = require('../config/database');

router.post('/profile-completion', (req,res,next)=>{
    let newUser ={
        username: req.body.username,
        iusername: req.body.iusername,
        category: req.body.category,
        tcountry: req.body.tcountry,
        promo: req.body.promo,
        price: req.body.price,
        dp: req.body.dp,
        followers: req.body.followers

    };
    console.log("Completion for: "+newUser.username);
    user.ProfileComp(newUser,(err)=>{
        if(err){
            res.json({success: false, msg: 'failed Profile Completion'});
        }
        else{
            res.json({success: true, msg: 'Profile Saved'});
        } 
    })
})

router.post('/register-influencer', (req,res,next)=>{
    let newUser ={
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        country: req.body.country,
        phonenum: req.body.phonenum

    };
    console.log("USER: ",newUser.username);
    user.addIUser(newUser, (err)=>{
        
        if(err){
            res.json({success: false, msg: 'failed to register user'});
        }
        else{
            res.json({success: true, msg: 'User Registered'});
        }
    })
})
router.post('/register', (req,res,next)=>{
    let newUser ={
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        brandname: req.body.brandname,
        brandweb: req.body.brandweb,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        phonenum: req.body.phonenum

    };
    console.log("BRANDWEB: ",newUser.brandweb);
    user.addUser(newUser, (err)=>{
        
        if(err){
            res.json({success: false, msg: 'failed to register user'});
        }
        else{
            res.json({success: true, msg: 'User Registered'});
        }
    })
})

router.get('/checkusername',(req,res)=>{
    console.log(req.query);
    user.checkUsername(req.query.username,(err,val)=>{
        if(err){
            console.log(err);
        }
        else{
            if(val==1){
                res.json({success:true});
            }
            else{
                res.json({success:false});
            }
        }
    })
})

router.get('/checkusernameI',(req,res)=>{
    console.log(req.query);
    user.checkUsernameI(req.query.username,(err,val)=>{
        if(err){
            console.log(err);
        }
        else{
            if(val==1){
                res.json({success:true});
            }
            else{
                res.json({success:false});
            }
        }
    })
})

router.get('/influencer-records',(req,res)=>{
    const category = (req.query.category);
    console.log(req.query.category);
    user.getRecords(category,(err,users)=>{
        console.log(users);
        if(err) throw err;
        if(!users)
            return res.json({success: false, msg: "User not found"});
            res.json({
                success:true,
                users:users
            });
    })
})

router.get('/influencer-records12',(req,res)=>{
    const category = (req.query.category);
    console.log(req.query.category);
    user.getRecords12(category,(err,users)=>{
        console.log(users);
        if(err) throw err;
        if(!users)
            return res.json({success: false, msg: "User not found"});
            res.json({
                success:true,
                users:users
            });
    })
})

router.post('/authenticate-influencer', (req,res,next)=>{
    const username = req.body.username;
    const password = req.body.password;
    console.log(username+" "+password);
    user.getIUserbyUsername(username,(err,users)=>{
        if(err) throw err;
        if(!users[0])
            return res.json({success: false, msg: "User not found"});
        console.log("PASSWORD: "+users[0].password);
        user.comparePassword(password,users[0].password,(err,isMatch)=>{
            console.log("ISMATCH"+isMatch);
            if(err) console.log(err);
            if(isMatch){
                const data=JSON.parse(JSON.stringify(users[0]));
                const token = jwt.sign(data,config.secret,{
                    expiresIn: 604800
                });
                console.log("TOKEN: "+token);
                res.json({
                    success:true,
                    token:'JWT' + token,
                    user: {
                        id: users[0].id,
                        username: users[0].username,
                        email:users[0].email,
                        phonenum:users[0].phonenum,
                        country: users[0].country,
                        iusername: users[0].iusername,
                        category: users[0].category,
                        tcountry: users[0].tcountry,
                        promo: users[0].promo,
                        price: users[0].price,
                        dp: users[0].dp,
                        followeers: users[0].followers
                    }

                });
            }
            else{
                return res.json({success: false, msg: "Wrong Password"});
            }
        });
    });
})

router.post('/authenticate', (req,res,next)=>{
    const username = req.body.username;
    const password = req.body.password;
    console.log(username+" "+password);
    user.getUserbyUsername(username,(err,users)=>{
        if(err) throw err;
        if(!users[0])
            return res.json({success: false, msg: "User not found"});
        console.log("PASSWORD: "+users[0].password);
        user.comparePassword(password,users[0].password,(err,isMatch)=>{
            console.log("ISMATCH"+isMatch);
            if(err) console.log(err);
            if(isMatch){
                const data=JSON.parse(JSON.stringify(users[0]));
                const token = jwt.sign(data,config.secret,{
                    expiresIn: 604800
                });
                console.log("TOKEN: "+token);
                res.json({
                    success:true,
                    token:'JWT' + token,
                    user: {
                        id: users[0].id,
                        username: users[0].username,
                        email:users[0].email,
                        brandname: users[0].brandname,
                        brandweb: users[0].brandweb,
                        firstname: users[0].firstname,
                        lastname: users[0].lastname,
                        phonenum:users[0].phonenum
                    }

                });
            }
            else{
                return res.json({success: false, msg: "Wrong Password"});
            }
        });
    });
})

router.get('/profile', (req,res,next)=>{
    res.json({user: req.user});
})


module.exports=router;