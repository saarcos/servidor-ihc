import express, { Request, Response, response } from 'express';
import { Pool } from 'pg';
import { eq, and } from 'drizzle-orm';
const router = express.Router();
import { drizzle } from 'drizzle-orm/node-postgres';
import { categorias, platos, reservas, restaurantes, usuarios } from './db/schema';

const pool = new Pool({ connectionString: `${process.env.DATABASE_URL}`, ssl: { rejectUnauthorized: false } });
const db = drizzle(pool);

// Error handler for database queries
const handleQueryError = (err: any, res: Response) => {
  console.error('Error executing query:', err);
  res.status(500).json({ error: 'An error occurred while executing the query.' });
};

// Get all products
router.get('/restaurantes', async (req: Request, res: Response) => {
  try {
    const rows = await db.select().from(restaurantes);
    res.json(rows);
  } catch (err) {
    handleQueryError(err, res);
  }
});

// Get a single product by ID
router.get('/restaurantes/:id', async (req: Request, res: Response) => { 
  const id = req.params.id;
  try { 
    const user = await db.select().from(restaurantes).where(eq(restaurantes.id, +id));
    if (user.length === 0) {
      return res.status(404).json({ error: "Restaurante no encontrado" });
    }
    res.json(user[0]); 
  } catch (error) { 
    handleQueryError(error, res); 
  } 
});

// Crea un nuevo restaurante
router.post('/restaurantes', async (req: Request, res: Response) => {
    try {
      const {categoria_id, nombre, correo, password_restaurante, direccion,foto, aforo, horaApertura, horaCierre}=req.body;
      const resultado = await db.insert(restaurantes).values({categoria_id:categoria_id,nombre:nombre,correo:correo,password_restaurante:password_restaurante,direccion:direccion,foto:foto,aforo:aforo,horaApertura:horaApertura,horaCierre:horaCierre}).execute(); // Ejecuta la inserción en la base de datos
  
    if (resultado.rowCount > 0) {
        res.status(201).json({ message: 'Restaurante creado correctamente'}); // Devuelve una respuesta con el ID del restaurante creado
      } else {
        res.status(500).json({ error: 'No se pudo crear el restaurante.' }); // Si no se pudo insertar, devuelve un error
      }
    } catch (err) {
      handleQueryError(err, res);
    }
});
 //Modificar Restaurante 
 router.put('/restaurantes/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const { categoria_id, nombre, correo, password_restaurante, direccion, foto, aforo, hora_apertura, hora_cierre } = req.body;
    const resultado = await db.update(restaurantes)
                          .set({ categoria_id, nombre, correo, password_restaurante, direccion, foto, aforo, horaApertura: hora_apertura, horaCierre: hora_cierre })
                          .where(eq(restaurantes.id, +id))
                          .execute();

    if (resultado.rowCount > 0) {
      res.status(200).json({ message: 'Restaurante modificado correctamente' });
    } else {
      res.status(404).json({ error: 'No se encontró el restaurante' });
    }
  } catch (err) {
    handleQueryError(err, res);
  }
});

//Update: password del restaurante
router.put('/restaurantes/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const { password_restaurante } = req.body;

    const resultado = await db.update(restaurantes)
                          .set({ password_restaurante })
                          .where(eq(restaurantes.id, +id))
                          .execute();

    if (resultado && resultado.rowCount > 0) {
      res.status(200).json({ message: 'Contraseña actualizada' });
    } else {
      res.status(404).json({ error: 'No se encontró el restaurante o la contraseña no se pudo actualizar' });
    }
  } catch (err) {
    console.error('Error executing query:', err.message, err.stack);
    res.status(500).json({ error: 'An error occurred while executing the query.' });
  }
});

//Eliminar Restaurante

router.delete('/restaurantes/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const resultado = await db.delete(restaurantes)
                          .where(eq(restaurantes.id, +id))
                          .execute();

    if (resultado.rowCount > 0) {
      res.status(200).json({ message: 'Restaurante eliminado correctamente' });
    } else {
      res.status(404).json({ error: 'No se encontró el restaurante' });
    }
  } catch (err) {
    handleQueryError(err, res);
  }
});


//PLATOS

// Get all PLATOS
router.get('/platos', async (req: Request, res: Response) => {
res.header('Access-Control-Allow-Origin','*')
try {
  const rows = await db.select().from(platos);
  res.json(rows);
} catch (err) {
  handleQueryError(err, res);
}
});

// Get a single plato by ID
router.get('/platos/:id', async (req: Request, res: Response) => {
try {
  const { id } = req.params;
  const rows = await db.select().from(platos).where(eq(platos.id, +id));
  if (rows.length === 0) {
    return res.status(404).json({ error: 'Product not found.' });
  }
  res.json(rows[0]);
} catch (err) {
  handleQueryError(err, res);
}
}); 
// Get de todos los platos por Id de Restaurante
router.get('/platosRestaurante/:id', async (req: Request, res: Response) => {
try {
  const { id } = req.params;
  const rows = await db.select().from(platos).where(eq(platos.id_restaurante, +id));
  if (rows.length === 0) {
    return res.status(404).json({ error: 'No se encontraron platos para este restaurante.' });
  }
  res.json(rows);
} catch (err) {
  handleQueryError(err, res);
}
});


// Crea un nuevo plato
router.post('/platos', async (req: Request, res: Response) => {
try {
    
    const {id_restaurante, nombre, foto, precio}=req.body;
  const resultado = await db.insert(platos).values({id_restaurante:id_restaurante,nombre:nombre,foto:foto,precio:precio}).execute(); // Ejecuta la inserción en la base de datos

if (resultado.rowCount > 0) {
    res.status(201).json({ message: 'Plato creado correctamente'}); // Devuelve una respuesta con el ID del restaurante creado
  } else {
    res.status(500).json({ error: 'No se pudo crear el plato.' }); // Si no se pudo insertar, devuelve un error
  }
} catch (err) {
  handleQueryError(err, res);
}
});

//Modificar Plato 
router.put('/platos/:id', async (req: Request, res: Response) => {
try {
  const id = req.params.id;
  const { id_restaurante, nombre, foto, precio } = req.body;
  const resultado = await db.update(platos)
                        .set({ id_restaurante, nombre ,foto, precio })
                        .where(eq(platos.id, +id))
                        .execute();

  if (resultado.rowCount > 0) {
    res.status(200).json({ message: 'Plato modificado correctamente' });
  } else {
    res.status(404).json({ error: 'No se encontró el plato' });
  }
} catch (err) {
  handleQueryError(err, res);
}
});

//Eliminar Plato

router.delete('/platos/:id', async (req: Request, res: Response) => {
try {
  const id = req.params.id;
  const resultado = await db.delete(platos)
                        .where(eq(platos.id, +id))
                        .execute();

  if (resultado.rowCount > 0) {
    res.status(200).json({ message: 'Plato eliminado correctamente' });
  } else {
    res.status(404).json({ error: 'No se encontró el plato' });
  }
} catch (err) {
  handleQueryError(err, res);
}
});
// Reservas
router.get('/reservas', async(req:Request,res:Response)=>{
  try {
    const rows=await db.select().from(reservas);
    res.json(rows);
  } catch (error) {
    handleQueryError(error,res);
  }
});
// anterior post router.post('/reservas', async (req: Request, res: Response) => {
//   try {
//       const { id_restaurante, id_usuario, fecha, hora, num_personas,estado } = req.body;
      
//       const [restaurante] = await db.select().from(restaurantes).where(eq(restaurantes.id, +id_restaurante));
//       if(num_personas>restaurante.aforo){
//         throw new Error('El restaurante no tiene el suficiente aforo');
//       }
//       const reservasEnFechaHora = await db.select().from(reservas)
//       .where(
//         and(
//           eq(reservas.id_restaurante, id_restaurante),
//           eq(reservas.hora, hora),
//           eq(reservas.fecha, fecha),
//         )
//       )
//       const personasReservadas = reservasEnFechaHora.reduce((total, reserva) => total + reserva.num_personas, 0);
//       const aforoDisponible= restaurante.aforo-personasReservadas;
//       console.log(`Aforo disponible: Restaurante aforo= ${restaurante.aforo}- Reservas a esa hora=${personasReservadas}=`,aforoDisponible);
//       if(aforoDisponible<=0){
//         throw new Error('No hay suficiente aforo disponible en esta fecha y hora');
//       }
//       // Si hay suficiente aforo, crear la reserva
//       const resultado = await db.insert(reservas).values({id_restaurante:id_restaurante,id_usuario:id_usuario,fecha:fecha,hora:hora,num_personas:num_personas, estado:estado}).execute(); // Ejecuta la inserción en la base de datos
//       if (resultado.rowCount > 0) {
//         res.status(201).json({ message: 'Reserva creada correctamente'}); 
//       } else {
//         res.status(500).json({ error: 'No se pudo crear la reserva.' }); // Si no se pudo insertar, devuelve un error
//       }
//     } catch (err) {
//       handleQueryError(err, res);
//     }
// });
router.post('/reservas', async (req: Request, res: Response) => {
  try {
    const { id_restaurante, id_usuario, fecha, hora, num_personas, estado } = req.body;

    const reserva = await db.transaction(async (trx) => {
      const [restaurante] = await trx.select().from(restaurantes).where(eq(restaurantes.id, +id_restaurante));
      if (num_personas > restaurante.aforo) {
        throw new Error('El restaurante no tiene el suficiente aforo');
      }

      const reservasEnFechaHora = await trx.select().from(reservas)
       .where(
          and(
            eq(reservas.id_restaurante, id_restaurante),
            eq(reservas.hora, hora),
            eq(reservas.fecha, fecha),
          )
        );

      const personasReservadas = reservasEnFechaHora.reduce((total, reserva) => total + reserva.num_personas, 0);
      const aforoDisponible = restaurante.aforo - personasReservadas;
      console.log(`Aforo disponible: Restaurante aforo= ${restaurante.aforo}- Reservas a esa hora=${personasReservadas}=`, aforoDisponible);
      if (aforoDisponible <= 0) {
        throw new Error('No hay suficiente aforo disponible en esta fecha y hora');
      }

      // Si hay suficiente aforo, crear la reserva
      const [newReserva] = await trx.insert(reservas).values({ id_restaurante, id_usuario, fecha, hora, num_personas, estado }).returning();

      return newReserva;
    });

    res.status(201).json({ message: 'Reserva creada correctamente' });
  } catch (err) {
    handleQueryError(err, res);
  }
});
router.delete('/reservas/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const resultado = await db.delete(reservas).where(eq(reservas.id, +id));
    if (resultado.rowCount > 0) {
      res.status(201).json({ message: 'Reserva eliminada correctamente'}); 
    } else {
      res.status(500).json({ error: 'No se pudo eliminar la reserva.' }); // Si no se pudo insertar, devuelve un error
    }
  } catch (err) {
    handleQueryError(err, res);
  }
});
//Actualizar Reservas
router.put('/reservas/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const { id_restaurante, id_usuario, fecha, hora, num_personas, estado } = req.body;
    const resultado = await db.update(reservas)
                          .set({ id_restaurante, id_usuario, fecha, hora, num_personas, estado})
                          .where(eq(reservas.id, +id))
                          .execute();

    if (resultado.rowCount > 0) {
      res.status(200).json({ message: 'Reserva modificada correctamente' });
    } else {
      res.status(404).json({ error: 'No se encontró la reserva' });
    }
  } catch (err) {
    handleQueryError(err, res);
  }
});

// Crea un nuevo usuario
router.post('/usuario', async (req: Request, res: Response) => {
  try {
      
      const {nombre, apellido, telefono, correo, password_usuario}=req.body;
    const resultado = await db.insert(usuarios).values({nombre:nombre,apellido:apellido,telefono:telefono,correo:correo,password_usuario:password_usuario}).execute(); // Ejecuta la inserción en la base de datos
  
  if (resultado.rowCount > 0) {
      res.status(201).json({ message: 'Usuario creado correctamente'});
    } else {
      res.status(500).json({ error: 'No se pudo crear el Usuario.' }); // Si no se pudo insertar, devuelve un error
    }
  } catch (err) {
    handleQueryError(err, res);
  }
  });
  
  //Usuarios
  router.get('/usuarios', async(req:Request,res:Response)=>{
    try {
      const rows=await db.select().from(usuarios);
      res.json(rows);
    } catch (error) {
      handleQueryError(error,res);
    }
  });

  //Obtener Usuario por id
  router.get('/usuarios/:id', async (req: Request, res: Response) => { 
    const id = req.params.id;
    try { 
      const user = await db.select().from(usuarios).where(eq(usuarios.id, +id));
      if (user.length === 0) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }
      res.json(user[0]); 
    } catch (error) { 
      handleQueryError(error, res); 
    } 
  });

  //Update: info del usuario 
  router.put('/usuario/:id', async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const { nombre, apellido, telefono} = req.body;
      const resultado = await db.update(usuarios)
                            .set({ nombre, apellido, telefono})
                            .where(eq(usuarios.id, +id))
                            .execute();
    
      if (resultado.rowCount > 0) {
        res.status(200).json({ message: 'Usuario modificado correctamente' });
      } else {
        res.status(404).json({ error: 'No se encontró el usuario' });
      }
    } catch (err) {
      handleQueryError(err, res);
    }
  });
  
  //Update: password del usuario
  router.put('/usuarios/:id', async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const { password_usuario } = req.body;
  
      const resultado = await db.update(usuarios)
                            .set({ password_usuario })
                            .where(eq(usuarios.id, +id))
                            .execute();
  
      if (resultado && resultado.rowCount > 0) {
        res.status(200).json({ message: 'Contraseña actualizada' });
      } else {
        res.status(404).json({ error: 'No se encontró el usuario o la contraseña no se pudo actualizar' });
      }
    } catch (err) {
      console.error('Error executing query:', err.message, err.stack);
      res.status(500).json({ error: 'An error occurred while executing the query.' });
    }
  });
  
  //Obtener el id de Usuario por su correo
  router.get('/usuario/:correo', async (req: Request, res: Response) => {
    try {
      const { correo } = req.params;

      // Consulta para obtener el ID del usuario por su correo
      const usuarioResult = await db.select({ id: usuarios.id }).from(usuarios).where(eq(usuarios.correo, correo));
      
      if (usuarioResult.length > 0) {
        res.status(200).json({ id: usuarioResult[0].id });
      } else {
        res.status(404).json({ error: 'Usuario no encontrado' });
      }
    } catch (err) {
      handleQueryError(err, res);
    }
  });

  //Delete de usuario
  router.delete('/usuarios/:id', async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const resultado = await db.delete(usuarios).where(eq(usuarios.id, +id)).execute();
      if (resultado.rowCount > 0) {
        res.status(200).json({ message: 'Usuario eliminado correctamente' });
      } else {
        res.status(404).json({ error: 'No se encontró el usuario' });
      }
    } catch (err) {
      handleQueryError(err, res);
    }
  });


  router.get('/usuarioCorreo/:email', async (req: Request, res: Response) => {
    try {
      const { email } = req.params;
      const rows = await db.select().from(usuarios).where(eq(usuarios.correo, email));
      if (rows.length === 0) {
        return res.status(404).json({ error: 'Product not found.' });
      }
      res.json(rows[0]);
    } catch (err) {
      handleQueryError(err, res);
    }
  });


//Get Usuarios Admin Restaurante by email
router.get('/usuariosAdmin/:email', async (req: Request, res: Response) => {
  try {
    const { email } = req.params;
    const rows = await db.select().from(restaurantes).where(eq(restaurantes.correo, email));
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Product not found.' });
    }
    res.json(rows[0]);
  } catch (err) {
    handleQueryError(err, res);
  }
});


//Verificar si el correo es de Restaurante o de Usuario
router.get('/verificarCorreo/:correo', async (req: Request, res: Response) => {
  try {
    const { correo } = req.params;
    
    // Consulta para verificar si el correo pertenece a un restaurante
    const restauranteResult = await db.select().from(restaurantes).where(eq(restaurantes.correo, correo));
    const esRestaurante = restauranteResult.length > 0;
    
    // Consulta para verificar si el correo pertenece a un usuario
    const usuarioResult = await db.select().from(usuarios).where(eq(usuarios.correo, correo));
    const esUsuario = usuarioResult.length > 0;

    res.json({ esRestaurante, esUsuario });
  } catch (err) {
    handleQueryError(err, res);
  }
});




export default router;