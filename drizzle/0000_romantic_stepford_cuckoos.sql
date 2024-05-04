CREATE TABLE IF NOT EXISTS "categoria" (
	"id" serial PRIMARY KEY NOT NULL,
	"nombre" varchar(50) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "plato" (
	"id" serial PRIMARY KEY NOT NULL,
	"id_restaurante" integer NOT NULL,
	"nombre" varchar(30),
	"foto" varchar(60),
	"precio" double precision DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "reserva" (
	"id" serial PRIMARY KEY NOT NULL,
	"id_restaurante" integer NOT NULL,
	"id_usuario" integer NOT NULL,
	"fecha" varchar(30),
	"hora" varchar(30),
	"num_personas" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "restaurante" (
	"id" serial PRIMARY KEY NOT NULL,
	"categoria_id" integer NOT NULL,
	"nombre" varchar(100) NOT NULL,
	"correo" varchar(100) NOT NULL,
	"password_restaurante" varchar(20) NOT NULL,
	"direccion" varchar(255) NOT NULL,
	"foto" varchar(255) NOT NULL,
	"aforo" integer NOT NULL,
	"hora_apertura" varchar(60) NOT NULL,
	"hora_cierre" varchar(60) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "usuario" (
	"id" serial PRIMARY KEY NOT NULL,
	"nombre" varchar(25),
	"apellido" varchar(25),
	"telefono" integer,
	"correo" varchar(60),
	"password_usuario" varchar(20)
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "plato" ADD CONSTRAINT "plato_id_restaurante_restaurante_id_fk" FOREIGN KEY ("id_restaurante") REFERENCES "restaurante"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reserva" ADD CONSTRAINT "reserva_id_restaurante_restaurante_id_fk" FOREIGN KEY ("id_restaurante") REFERENCES "restaurante"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "reserva" ADD CONSTRAINT "reserva_id_usuario_usuario_id_fk" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "restaurante" ADD CONSTRAINT "restaurante_categoria_id_categoria_id_fk" FOREIGN KEY ("categoria_id") REFERENCES "categoria"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
