import { Migration } from '@mikro-orm/migrations';

export class Migration20250722233024 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "publicidad" ("id" text not null, "fechaInicio" timestamptz not null, "fechaFin" timestamptz not null, "observacion" text null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "publicidad_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_publicidad_deleted_at" ON "publicidad" (deleted_at) WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "publicidad" cascade;`);
  }

}
