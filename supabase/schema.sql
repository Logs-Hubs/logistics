-- Port Trucking OS — schema + seed data (stesso contenuto di lib/data.ts)
-- Da eseguire una volta nel SQL Editor di Supabase (dashboard > SQL Editor > New query).

create table if not exists terminals (
  id text primary key,
  nome text not null,
  breve text not null
);

create table if not exists vettori (
  id text primary key,
  nome text not null,
  autista text not null,
  telefono text not null,
  targa text not null
);

create table if not exists spedizioni (
  id text primary key,
  cliente text not null,
  container_id text not null,
  terminal_id text not null references terminals(id),
  stato text not null check (stato in ('confermato', 'da_pianificare', 'in_ritardo')),
  vettore_id text not null references vettori(id),
  scadenza_demurrage date not null,
  ora_appuntamento text,
  data_appuntamento date,
  tipo text not null check (tipo in ('import', 'export')),
  merce text not null
);

-- Tracking ritiro / rientro container vuoto (il gap che il PCS oggi non copre).
-- `alter ... add column if not exists` cosi' e' sicuro da rieseguire sia su un DB
-- appena creato sia su uno gia' inizializzato con lo schema precedente.
alter table spedizioni add column if not exists fase_operativa text
  check (fase_operativa in ('ritirato', 'rientro_vuoto'));
alter table spedizioni add column if not exists ora_ritiro text;
alter table spedizioni add column if not exists ora_rientro_vuoto text;

-- RLS abilitata senza policy: solo la secret key lato server (che bypassa RLS)
-- puo' leggere/scrivere. La publishable/anon key non ha accesso a queste tabelle.
alter table terminals enable row level security;
alter table vettori enable row level security;
alter table spedizioni enable row level security;

insert into terminals (id, nome, breve) values
  ('porto-vecchio', 'Genova Porto Vecchio', 'Porto Vecchio'),
  ('psa-pra', 'PSA Genova Prà', 'PSA Prà'),
  ('savona-vado', 'Savona-Vado Ligure', 'Savona-Vado')
on conflict (id) do nothing;

insert into vettori (id, nome, autista, telefono, targa) values
  ('v1', 'Autotrasporti Bruzzone srl', 'Marco Bruzzone', '+39 335 012 3456', 'GE AZ912'),
  ('v2', 'Trans Liguria Cargo', 'Ismail Diallo', '+39 347 890 1122', 'SV BF204'),
  ('v3', 'F.lli Ferrando Autotrasporti', 'Luca Ferrando', '+39 328 445 7789', 'GE CD558'),
  ('v4', 'Sestri Log Trans', 'Andrei Popescu', '+39 351 220 9081', 'GE EF330')
on conflict (id) do nothing;

insert into spedizioni (id, cliente, container_id, terminal_id, stato, vettore_id, scadenza_demurrage, ora_appuntamento, data_appuntamento, tipo, merce) values
  ('SP-2461', 'Ansaldo Componenti SpA', 'MSCU 771230-4', 'psa-pra', 'confermato', 'v1', '2026-08-29', '08:00', '2026-08-26', 'import', 'Componenti meccanici'),
  ('SP-2462', 'Costa Caffè Import', 'TCLU 550981-2', 'porto-vecchio', 'da_pianificare', 'v2', '2026-08-27', null, null, 'import', 'Caffè in grani'),
  ('SP-2463', 'Recchi Marmi Export', 'MSCU 118820-9', 'savona-vado', 'in_ritardo', 'v3', '2026-08-25', null, null, 'export', 'Marmo lavorato'),
  ('SP-2464', 'Ligure Tessuti Srl', 'HLXU 990112-7', 'psa-pra', 'confermato', 'v4', '2026-08-30', '14:00', '2026-08-26', 'export', 'Tessuti tecnici'),
  ('SP-2465', 'Ansaldo Componenti SpA', 'MSCU 220441-3', 'porto-vecchio', 'da_pianificare', 'v1', '2026-08-28', null, null, 'import', 'Componenti elettronici'),
  ('SP-2466', 'Genova Food Trade', 'CMAU 334765-1', 'savona-vado', 'confermato', 'v2', '2026-09-01', '10:00', '2026-08-27', 'import', 'Prodotti alimentari confezionati'),
  ('SP-2467', 'Sestri Meccanica Export', 'MSCU 887321-6', 'psa-pra', 'in_ritardo', 'v3', '2026-08-25', null, null, 'export', 'Macchinari industriali')
on conflict (id) do nothing;
