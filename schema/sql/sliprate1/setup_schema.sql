CREATE TABLE SLIPRATE_tb (
   gid           serial PRIMARY KEY,
   SliprateID    VARCHAR(4) UNIQUE NOT NULL,
   Longitude     float DEFAULT 0.0,  
   Latitude      float DEFAULT 0.0,  
   FaultName     VARCHAR(200) NOT NULL,
   FaultID       integer DEFAULT 0,  
   State         VARCHAR(10) NOT NULL,
   SiteName      VARCHAR(100) NOT NULL,
   DataType      VARCHAR(100) NOT NULL,
   DistToCFMFault float DEFAULT 0.0,
   CFM6ObjectName VARCHAR(20) NOT NULL,
   Observation   VARCHAR(400) NOT NULL,
   PrefRate      VARCHAR(50),
   LowRate       float default 0.0,
   HighRate      float default 0.0,
   RateUnct      VARCHAR(200) NOT NULL
   RateType      VARCHAR(100) NOT NULL
   ReptReint     VARCHAR(200) NOT NULL
   OffType       VARCHAR(200) NOT NULL
   AgeType       VARCHAR(100) NOT NULL
   NumEvents     VARCHAR(100) NOT NULL
   RateAge       VARCHAR(100) NOT NULL
   QbinMin       float default 0.0,
   QbinMax       float default 0.0,
   Reference     VARCHAR(200) NOT NULL,
   AppB          VARCHAR(200) NOT NULL
);

SELECT AddGeometryColumn('','sliprate_tb','geom','0','POINT',2);
