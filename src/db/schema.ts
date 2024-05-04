import { doublePrecision, integer, pgTable, serial, varchar } from "drizzle-orm/pg-core";
import { InferSelectModel,} from 'drizzle-orm';
export const usuarios = pgTable('usuario', {
    id: serial('id').primaryKey(),
    nombre: varchar('nombre', { length: 25 }),
    apellido: varchar('apellido', { length: 25 }),
    telefono: integer('telefono'),
    correo: varchar('correo', { length: 60 }),
    password_usuario: varchar('password_usuario', { length: 20 })
});
export const categorias=pgTable('categoria',{
    id: serial('id').primaryKey(),
    nombre: varchar('nombre',{length:50}).notNull()
});

export const restaurantes = pgTable('restaurante', {
    id: serial('id').primaryKey(),
    categoria_id: integer('categoria_id').notNull().references(() => categorias.id),
    nombre: varchar('nombre', {length:100}).notNull(),
    correo: varchar('correo', { length: 100 }).notNull(),
    password_restaurante: varchar('password_restaurante', { length: 20 }).notNull(),
    direccion: varchar('direccion', { length: 255 }).notNull(),
    foto: varchar('foto', { length: 255 }).notNull(),
    aforo: integer('aforo').notNull(),
    horaApertura: varchar('hora_apertura', { length: 60 }).notNull(),
    horaCierre: varchar('hora_cierre', { length: 60 }).notNull()
});


export const platos = pgTable('plato', {
    id: serial('id').primaryKey(),
    id_restaurante: integer('id_restaurante').notNull().references(() => restaurantes.id),
    nombre: varchar('nombre', { length: 30 }),
    foto: varchar('foto', { length: 255 }),
    precio: doublePrecision('precio').default(0),
});

export const reservas = pgTable('reserva', {
    id: serial('id').primaryKey(),
    id_restaurante: integer('id_restaurante').notNull().references(() => restaurantes.id),
    id_usuario: integer('id_usuario').notNull().references(() => usuarios.id),
    fecha: varchar('fecha', { length: 30 }),
    hora: varchar('hora', { length: 30 }),
    num_personas: integer('num_personas'),
    estado: varchar('estado', { length: 60 }),
});

export type Restaurante=InferSelectModel<typeof restaurantes>
export type Plato=InferSelectModel<typeof platos>
export type Reserva=InferSelectModel<typeof reservas>
export type Categoria=InferSelectModel<typeof categorias>
export type Usuario=InferSelectModel<typeof usuarios>




