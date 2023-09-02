import passport from 'passport';
import local from 'passport-local';
import userService from '../Dao/models/user.model.js';
import GitHubStrategy from 'passport-github2';
import { createHash, validatePassword, uploaderProfile  } from '../utils.js';
import { config } from "./config.js";
import * as logger from "./logger.js";

const LocalStrategy = local.Strategy;

const initializePassport = () => {
    
    passport.use('register', new LocalStrategy(
        {passReqToCallback:true, usernameField:'email'},
        async (req,username, password,done) =>{
            const { first_name, last_name, email, age } = req.body;
            try {
                const user = await userService.findOne({email:username}); 
                if(user){
                    logger.infoLogger.info("El usuario existe");
                    return done(null,false);
                }
                const newUser = {
                    first_name, 
                    last_name, 
                    email, 
                    age, 
                    password: createHash(password)
                }

                const result = await userService.create(newUser);
                return done(null, result);

            } catch (error) {
                return done("Error al registrar el usuario: " + error);
            }
        }
    ));

    passport.serializeUser((user,done)=>{
        done(null, user)
    });
    passport.deserializeUser( async (id, done)=>{
        const user = await userService.findById(id);
        done(null, user)
    });

    passport.use('login', new LocalStrategy({usernameField:'email'}, async (username, password, done)=>{
        try {
            const user = await userService.findOne({email:username})
            if(!user){
                return done(null, false);
            }
            if(!validatePassword(password,user)) return done (null, false);
            return done(null,user);
        } catch (error) {
            return done("Error al intentar ingresar: " + error);
        }
    }));

    passport.use('github', new GitHubStrategy({
        // riveroLucasCarrito
        clientID: config.github.clientID,
        clientSecret: config.github.clientSecret,
        callbackURL: config.github.callBackUrl
    }, async (accesToken, refreshToken, profile, done)=>{
        try {
            logger.infoLogger.info(profile);//vemos la info que nos da GitHub
            const user = await userService.find({email:profile._json.email})
            //const user = await userService.find({email:profile.username})
            if(!user || user.length == 0){
                const newUser = {
                    first_name: profile.username,
                    last_name: '',
                    email: profile._json.email,
                    age: 18,
                    password: ''
                }
                const result = await userService.create(newUser);
                done(null, result)

            }else{
                //ya existe el usuario
                done(null,user)
            }

        } catch (error) {
            return done(null,error)
        }
    }))



}

export default initializePassport;