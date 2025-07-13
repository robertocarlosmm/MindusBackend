import { Migration } from '@mikro-orm/migrations';

export class Migration20250713004911 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "producto_extension" ("id" text not null, "codigoReferencia" text null, "descripcionTecnica" text null, "fotosAltaCalidad" text[] null, "unidadVenta" text null, "pesoVolumen" text null, "tiempoEstimadoEntrega" text null, "disponibilidadStock" integer not null default 0, "politicasGarantiaDevoluciones" text null, "imagenesContextoIndustrial" text[] null, "videosDemostrativos" text[] null, "condicionesAlmacenamientoTransporte" text null, "descuentosPorVolumen" text null, "certificacionesIndustriales" text[] null, "manualesUsuarioMantenimiento" text[] null, "canalPostventaRepuestos" text null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "producto_extension_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_producto_extension_deleted_at" ON "producto_extension" (deleted_at) WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "producto_extension" cascade;`);
  }

}
