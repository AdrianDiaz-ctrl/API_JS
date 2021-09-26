import express from 'express'
import mysql from 'mysql'
import cors from 'cors'
// import { json, _json } from 'express'

const app = express()

// con el metodo .use declaramos el uso de json
app.use(express.json())
app.use(cors())

//Establecemos los prámetros de conexión 
const conexion = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'articulosdb'
})
//Conexión al database
conexion.connect(function(error){
    if(error){
        //throw => "Lanzar" es una forma de devolver una excepcio, en este caso un error
        throw error
    }else{
        console.log("¡Conexión exitosa a la base de datos!")
    }
})

app.get('/', function(req,res){
    res.send('Ruta INICIO')
})

//Mostramos todos los artículos
app.get('/api/articulos', (req,res)=>{
    // consulta | .query ( sentencia SQL, funcion )
    conexion.query('SELECT * FROM articulos', (error, filas)=>{
        if(error){
            throw error
        }else{
            res.send(filas)
        }
    })
})

//Mostramos un SOLO artículo
app.get('/api/articulos/:id', (req, res)=>{
    conexion.query('SELECT * FROM articulos WHERE id = ?', [req.params.id], (error, fila)=>{
        if(error){
            throw error
        }else{
            //res.send(fila)
            /* muestra solo la descripcion del primer registro */
            res.send(fila[0].descripcion)
        }
    })
})

//Creamos un artículo
app.post('/api/articulos', (req, res)=>{
    let data = {descripcion:req.body.descripcion, precio:req.body.precio, stock:req.body.stock}
    // el sigo ? define todos los parametros
    let sql = "INSERT INTO articulos SET ?"
    conexion.query(sql, data, function(err, result){
            if(err){
               throw err
            }else{              
             /*Esto es lo nuevo que agregamos para el CRUD con Javascript*/
             Object.assign(data, {id: result.insertId}) //agregamos el ID al objeto data             
             res.send(data) //enviamos los valores                         
        }
    })
})

//Editar articulo
app.put('/api/articulos/:id', (req, res)=>{
    let id = req.params.id
    let descripcion = req.body.descripcion
    let precio = req.body.precio
    let stock = req.body.stock

    let sql = "UPDATE articulos SET descripcion = ?, precio = ?, stock = ? WHERE id = ?"
    conexion.query(sql, [descripcion, precio, stock, id], function(error, results){
        if(error){
            throw error
        }else{              
            res.send(results)
        }
    })
})

//Eliminar articulo
app.delete('/api/articulos/:id', (req,res)=>{
    conexion.query('DELETE FROM articulos WHERE id = ?', [req.params.id], (e, filas) =>{
        if(e){
            throw e
        }else{              
            res.send(filas)
        }
    })
})

const puerto = process.env.PUERTO || 8080
app.listen(puerto, function(){
    console.log("Servidor Ok en puerto:" + puerto)
})
