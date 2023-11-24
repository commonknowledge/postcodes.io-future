ALTER TABLE postcodes ADD COLUMN constituency_id_2025 varchar(50);
ALTER TABLE outcodes ADD COLUMN parliamentary_constituency_2025 varchar(200)[];
CREATE TABLE constituencies_2025 (
  code varchar(50) NOT NULL,
  name varchar(255)
);
ALTER TABLE ONLY public.constituencies_2025
    ADD CONSTRAINT constituencies_2025_code_key UNIQUE (code);
CREATE UNIQUE INDEX constituencies_2025_code_idx ON public.constituencies_2025 USING btree (code);
CREATE INDEX postcodes_pc_compact ON postcodes(pc_compact);
CREATE INDEX postcodes_outcode ON postcodes(outcode);
CREATE INDEX postcodes_postcode ON postcodes(postcode);
