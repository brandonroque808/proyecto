import connection from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Registrar usuario
export const registrar = (req, res) => {
    const { nombre, email, password, rol } = req.body;

    // clasificacion password
    let fuerza = "débil";
    if (password.length >= 8 && /\d/.test(password)) fuerza = "intermedio";
    if (password.length >= 10 && /\d/.test(password) && /[A-Z]/.test(password)) fuerza = "fuerte";

    const hash = bcrypt.hashSync(password, 10); // encriptar contraseña

    connection.query(
        "INSERT INTO usuarios(nombre,email,password,rol) VALUES (?,?,?,?)",
        [nombre, email, hash, rol],
        err => {
            if (err) return res.json({ error: err });
            res.json({ msg:"Usuario registrado", nivel_password:fuerza });
        }
    );
};

// Login
export const login = (req,res) => {
    const { email, password } = req.body;

    connection.query(
        "SELECT * FROM usuarios WHERE email=? AND activo=1",
        [email],
        (err,result)=>{
            if(err) return res.json({error:err});
            if(result.length===0) return res.json({msg:"Usuario no existe"});

            const usuario = result[0];

            if(!bcrypt.compareSync(password, usuario.password))
                return res.json({msg:"Contraseña incorrecta"});

            const token = jwt.sign(
                {id:usuario.id,rol:usuario.rol},
                process.env.JWT_SECRET,
                {expiresIn:"2h"}
            );

            res.json({msg:"Login correcto",token});
        }
    );
};
