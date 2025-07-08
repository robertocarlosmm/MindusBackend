import { Migration } from '@mikro-orm/migrations';

export class Migration20250708040513 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "empresa" ("id" text not null, "ruc" text not null, "razonSocial" text not null, "descripcionBreve" text not null, "descripcionExtensa" text null, "logo" text null, "cantidadTrabajadores" integer null, "categorias" text[] not null, "redesSociales" text[] null, "ubicacion" text not null, "telefono" text not null, "email" text not null, "canalesDeAtencion" text[] null, "politicaDeGarantia" text not null, "politicaDeDevolucion" text not null, "website" text null, "horarioAtencion" text not null, "certificaciones" text[] null, "premios" text[] null, "procesosProductivos" text null, "procesosControlCalidad" text null, "anhoFundacion" integer not null, "idiomas" text[] null, "paisesAtencion" text[] null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "empresa_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_empresa_deleted_at" ON "empresa" (deleted_at) WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "empresa" cascade;`);
  }

}
