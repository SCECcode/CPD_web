CREATE TABLE SLIPRATE_tb (
   gid serial PRIMARY KEY,

   SlipRateID  VARCHAR(10) UNIQUE NOT NULL,
   X           float DEFAULT 0.0,  
   Y           float DEFAULT 0.0,
   FaultName   VARCHAR(200) NOT NULL,
   SiteName    VARCHAR(200) NOT NULL,
   LowRate     float default 0.0,
   HighRate    float default 0.0,
   State       VARCHAR(6) NOT NULL,
   DataType    VARCHAR(100) NOT NULL,
   QbinMin     float default 0.0,
   QbinMax     float default 0.0,
   x2014dip    float default 0, 
   x2014rake   float default 0,
   x2014rate   float default 0.0,
   Reference   VARCHAR(200) NOT NULl
);

SELECT AddGeometryColumn('','sliprate_tb','geom','0','POINT',2);
