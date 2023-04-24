
UPDATE sliprate_tb SET geom = ST_SetSRID(ST_MakePoint(Longitude,Latitude),4326); 
CREATE INDEX ON sliprate_tb USING GIST ("geom");

