import nodemailer from "nodemailer";
import {config} from "../config/config.js";
//creamos el transporter
const transporter = nodemailer.createTransport({
    service:"gmail",
    port:587,
    auth:{
        user: config.gmail.emailAdmin,
        pass:config.gmail.emailPass
    },
    secure:false,
    tls:{
        rejectUnauthorized:false
    }
});
//Funcion para el envio de correo electronico para recuperar la contraseña
export const sendRecoveryPass = async(userEmail,token)=>{
    const link = `http://localhost:8080/reset-password?token=${token}`;
    await transporter.sendMail({
        from:config.gmail.emailAdmin,
        to:userEmail,
        subject:"Restablecer contraseña",
        html: `
        <div>
        <h2>Has solicitado un cambio de contraseña.</h2>
        <p>Da clic en el siguiente enlace para restableces la contraseña</p>
        <a href="${link}">
        <button> Restablecer contraseña </button>
        </a>        
        </div>
        `
    })
};