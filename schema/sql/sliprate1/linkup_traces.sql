
UPDATE sliprate_tb SET geom = ST_SetSRID(ST_MakePoint(X,Y),4326); 
CREATE INDEX ON sliprate_tb USING GIST ("geom");

