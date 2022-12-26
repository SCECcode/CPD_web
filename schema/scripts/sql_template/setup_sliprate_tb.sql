
COPY SLIPRATE_tb(SlipRateID,X,Y,FaultName,SiteName,LowRate,HighRate,State,DataType,QbinMin,QbinMax,x2014dip,x2014rake,x2014rate,Reference) FROM '/home/postgres/CPD/schema/data/DATATYPE/slip_site_tb.csv' DELIMITER ',' CSV HEADER;
