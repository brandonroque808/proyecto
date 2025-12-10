import connection from "../config/db.js";

// obtener productos activos
export const listar = (req,res)=>{
    connection.query("SELECT * FROM productos WHERE activo=1",(err,result)=>{
        if(err) return res.json({error:err});
        res.json(result);
    });
};

// crear
export const crear = (req,res)=>{
    const {nombre,descripcion,precio,stock} = req.body;
    connection.query(
        "INSERT INTO productos(nombre,descripcion,precio,stock) VALUES (?,?,?,?)",
        [nombre,descripcion,precio,stock],
        err=>{
            if(err) return res.json({error:err});
            res.json({msg:"Producto creado"});
        }
    );
};

// actualizar
export const actualizar = (req,res)=>{
    const {id} = req.params;
    const {nombre,descripcion,precio,stock} = req.body;
    connection.query(
        "UPDATE productos SET nombre=?,descripcion=?,precio=?,stock=? WHERE id=?",
        [nombre,descripcion,precio,stock,id],
        err=>{
            if(err) return res.json({error:err});
            res.json({msg:"Producto actualizado"});
        }
    );
};

// eliminacion lógica
export const eliminar = (req,res)=>{
    const {id} = req.params;
    connection.query(
        "UPDATE productos SET activo=0 WHERE id=?",
        [id],
        err=>{
            if(err) return res.json({error:err});
            res.json({msg:"Producto eliminado logicamente"});
        }
    );
};
