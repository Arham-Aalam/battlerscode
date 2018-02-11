var User = require('../models/user');
var Code = require('../models/code');
var Admin = require('../models/admins');
var config = require('../../config');
var jsonwebtoken = require('jsonwebtoken');
var secretKey = config.secretKey;

function createToken(user){
    var token = jsonwebtoken.sign({
        id : user._id,
        name : user.name,
        username : user.username
    },secretKey,{
        expiresIn : 1440
    });
    return token;
}
module.exports = function(app){

  var loginData = {
    status : false,
    message : "Login to Do more code",
    token : ""
  };

  app.get('/',function(req, res){
    res.render('home', { data : loginData });
  });

  app.get('/student', function(req, res){
    var token = req.body.token || req.param('token') || req.headers['user-a-token'];
    if(token){
      jsonwebtoken.verify(token, secretKey, function(err, decoded){
                if(err){
                  loginData.status = false;
                  loginData.message = "Login to Do more code";
                  loginData.token = "";
                }else{
                    req.decoded = decoded;
                    loginData.status = true;
                    loginData.message = "successfully login";
                    loginData.token = token;
                }
            });
    }
    res.render('student', { data : loginData });
  });

  app.post('/login/student', function(req, res){
    //when you logged in put data in loginData

    User.findOne({
            username : req.body.username
        }).select('password').exec(function(err, user){
            if(err) throw err;

            if(!user){
                loginData.status = false;
                loginData.message = "user does not exist";
                res.render('home', { data : loginData});
              //  res.send({ message : "user doesn't exist" });
            }else if(user){
                if(user.comparePassword(req.body.password)){
                    // user is valid let create token
                    var token = createToken(user);

                    /*var loginData = {
                        success : true,
                        message : "successfully login",
                        token : token
                    };*/
                    loginData.status = true;
                    loginData.message = "successfully login";
                    loginData.token = token;
                    //here your token will save
                    res.cookie('userToken', token);
                    res.cookie('username', req.body.username);
                    res.setHeader('user-a-token', token);
                    res.setHeader('username', req.body.username);
                    res.setHeader('userid', user._id);
                    res.render('student');
                    //res.json(loginData);
                }else{
                  loginData.status = false;
                  loginData.message = "Invalid Password";
                  res.render('home', { data : loginData});
                    //res.send({ message : "Invalid Password" });
                }
            }
        });
  });

  app.get('/faculty', function(req, res){
    var token = req.body.token || req.param('token') || req.headers['user-a-token'];
    if(token){
      jsonwebtoken.verify(token, secretKey, function(err, decoded){
                if(err){
                  loginData.status = false;
                  loginData.message = "Login to Do more code";
                  loginData.token = "";
                }else{
                    req.decoded = decoded;
                    loginData.status = true;
                    loginData.message = "successfully login";
                    loginData.token = token;
                }
            });
    }
    res.render('faculty', { data : loginData });
  });

  app.post('/signup/faculty', function(req, res){
        var user = new Admin({
            name : req.body.name,
            username : req.body.username,
            password : req.body.password
        });
        user.save(function(err){
            if(err){
              //  res.render('signup', {res : "user or username already exist"});
                res.send(err);
                return;
            }
              //  res.render('signup', {res : "successfully registered"});
                res.json({ message : "User has been created!" });
        });
  });

  app.post('/login/faculty', function(req, res){
    //when you logged in put data in loginData

    Admin.findOne({
            username : req.body.username
        }).select('password').exec(function(err, user){
            if(err) throw err;

            if(!user){
              loginData.status = false;
              loginData.message = "user does not exist";
              res.render('home', { data : loginData});
              //  res.send({ message : "user doesn't exist" });
            }else if(user){
                if(user.comparePassword(req.body.password)){
                    // user is valid let create token
                    var token = createToken(user);
                    /*var loginData = {
                        success : true,
                        message : "successfully login",
                        token : token
                    };*/
                    loginData.status = true;
                    loginData.message = "successfully login";
                    loginData.token = token;
                    //here your token will save
                    res.cookie('userToken', token);
                    res.setHeader('user-a-token', token);
                    res.setHeader('username', req.body.username);
                    res.setHeader('userid', user._id);
                    res.cookie('username', req.body.username);
                    //res.render('student',{ data : loginData}});
                    //res.json(loginData);
                }else{
                  loginData.status = false;
                  loginData.message = "Invalide Password";
                  res.render('home', { data : loginData});
                    //res.send({ message : "Invalid Password" });
                }
            }
        });
  });

  app.route('/getcode')

  .post(function(req, res){
    var token = req.headers['user-a-token'];
    if(token){
      jsonwebtoken.verify(token, secretKey, function(err, decoded){
                if(err){
                    res.status(403).send({ status : false, message : "Fail to authenticate user" });
                }else{
                    req.decoded = decoded;
                    var code = new Code({
                            creator : req.headers['userid'],
                            content : req.body.content
                        });
                        code.save(function(err){
                            if(err){
                            res.send(err);
                            console.log("it means it is code saving problem");
                            return;}
                            res.render('student', {codes : { status : true, content : code }})
                            //res.json({ message : "Code saved" });
                        });
                }
            });
      }else{
        res.render('student',{codes : { status : false, content : "" }});
        //res.json({ status : false, content : "" });
      }
  })
  .get(function(req, res){
    var token = req.body.token || req.param('token') || req.headers['user-a-token'];
    if(token){
      jsonwebtoken.verify(token, secretKey, function(err, decoded){
                if(err){
                    res.status(403).send({ status : false, message : "Fail to authenticate user" });
                }else{
                    req.decoded = decoded;
                    var utc = new Date().toJSON().slice(0,10).replace(/-/g,'/');
                    Code.find({"created" : utc}, function(err, code){
                         if(err){
                             res.send(err);
                             return;
                         }
                         res.render('student',{codes : { status : true, content : code }});
                         //res.json(code);
                     });
                }
              });
    }else{
      res.render('student',{codes : { status : false, content : "" }});
      //res.json({ status : false, content : "" });
    }
  });
}
