ALTER TABLE postcodes ADD COLUMN constituency_id_2025 varchar(50);
ALTER TABLE outcodes ADD COLUMN parliamentary_constituency_2025 varchar(200);
CREATE TABLE constituencies_2025 (
  code varchar(50) NOT NULL,
  name varchar(255)
);