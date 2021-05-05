const Tarea = require('../models/Tarea');
const Proyecto = require('../models/Proyecto');
const {validationResult} = require('express-validator')

//Crea una nueva tarea,
exports.crearTarea = async(req,res)=>{
  // revisar si hay errores
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }

  try {
    //extraer el proyecto y comprobar si existe
    const {proyecto} = req.body;
    const existeProyecto = await Proyecto.findById(proyecto);
    if(!existeProyecto){
      return res.status(400).json({msg:'Proyeto no Encontrado'});
    }
    //Revisar si el proyecto actual pertenece al usuario autenticaco.
    if(existeProyecto.creador.toString() !== req.usuario.id){
      return res.status(401).json({msg:'No Autorizado'});
    }
    //Crear tarea
    const tarea = new Tarea(req.body);
    console.log(tarea);
    await tarea.save();
    res.json({tarea});
  } catch (error) {
    console.log(error);
    res.status(500).send('Hubo un error');
  }
}

//Obtener Tareas
exports.obtenerTareas = async(req,res)=>{
  try {
    //extraer el proyecto y comprobar si existe
    const {proyecto} = req.query;
    const existeProyecto = await Proyecto.findById(proyecto);
    if(!existeProyecto){
      return res.status(400).json({msg:'Proyeto no Encontrado'});
    }
    //Revisar si el proyecto actual pertenece al usuario autenticaco.
    if(existeProyecto.creador.toString() !== req.usuario.id){
      return res.status(401).json({msg:'No Autorizado'});
    }

    //obtener las tareas por proyecto 
    const tareas = await Tarea.find({proyecto}).sort({creado:-1});
    res.json({tareas});
    
  } catch (error) {
    //console.log(error);
    res.status(500).send('Hubo un error');
  }
};

//actualizar una tarea
exports.actualizarTarea = async(req,res)=>{
  try {
      //extraer el proyecto y comprobar si existe
      const {proyecto,nombre,estado} = req.body;
      //Validar si la tarea existe.
      let tarea = await Tarea.findById(req.params.id);
      if(!tarea){
        return res.status(404).json({msg:'No existe esa tarea'});
      }
      const existeProyecto = await Proyecto.findById(proyecto);
      if(existeProyecto !== null){
        //Revisar si el proyecto actual pertenece al usuario autenticaco.
        if(existeProyecto.creador.toString() !== req.usuario.id){
          return res.status(401).json({msg:'No Autorizado 1'});
        }
      }
      else{
        return res.status(401).json({msg:'No Autorizado 2'});
      }
      

      //Crear objeto con la nueva informacion
      const nuevaTarea={};

      nuevaTarea.nombre= nombre;
      nuevaTarea.estado= estado;

      //Guardar la tarea
      tarea = await Tarea.findOneAndUpdate({_id:req.params.id},nuevaTarea,{new:true});

      res.json({tarea});
  } catch (error) {
    console.log(error);
    res.status(500).send('Hubo un error');
  }
  };

  //Elimina una tarea.
exports.eliminarTarea = async (req,res)=>{
  try {
      //extraer el proyecto y comprobar si existe
      const {proyecto} = req.query;
      //Validar si la tarea existe.
      let tarea = await Tarea.findById(req.params.id);
      if(!tarea){
        return res.status(404).json({msg:'No existe esa tarea'});
      }
      const existeProyecto = await Proyecto.findById(proyecto);

      //Revisar si el proyecto actual pertenece al usuario autenticaco.
      if(existeProyecto.creador.toString() !== req.usuario.id){
        return res.status(401).json({msg:'No Autorizado'});
      }
      //Eliminar
      await Tarea.findOneAndRemove({_id:req.params.id});
      res.json({msg:'Tarea Eliminada'});
  } catch (error) {
    console.log(error);
    res.status(500).send('Hubo un error');
  }
}