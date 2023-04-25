#!/bin/sh

## extract csv files from user supplied xlsx file
##
## in2csv and csvcut are from https://csvkit.readthedocs.io/en/latest/index.html
##
## sudo pip install csvkit

. ./common.sh

rm -f *.csv
#in2csv --sheet "${EXCEL_NM_SHEET}" ${EXCEL_NM_FILE} | csvcut -c 1-26 > ${EXCEL_NM}_raw.csv

cat ${CPDPATH}/${EXCEL_NM}.csv | csvcut -c 1-25 > ${EXCEL_NM}_raw.csv
cat ${EXCEL_NM}_raw.csv |sed "s/  / /g" | sed "s/, E/,E/"  > ${EXCEL_NM}.csv
csvcut -n ${EXCEL_NM}.csv > ${EXCEL_NM}_column_labels

#csvcut -l -c 21 ${EXCEL_NM}.csv |csvcut -K 1 | sort -n|uniq | sed "1i\\
#sliprate_id,test
#"> my_tb.csv 

csvcut -l -c "9" ${EXCEL_NM}.csv |csvcut -K 1 | sort -n|uniq | sed "1i\\
id,test
"> id_test_tb.csv 

# 1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25
#FaultName,FaultID,State,SiteName,
#CPDId,SliprateId,
#Longitude,Latitude,
#DistToCFMFault,CFM6ObjectName,
#DataType,
#Observation,PrefRate,LowRate,HighRate,RateUncertainty,RateType,ReptReint,
#OffsetType,AgeType,NumEvents,RateAge,QbinMin,QbinMax,Reference
#
csvcut -l -c "1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25" ${EXCEL_NM}.csv |csvcut -K 1|sort -n|uniq | sed "1i\\
FaultName,FaultID,State,SiteName,CPDId,SliprateId,Longitude,Latitude,DistToCFMFault,CFM6ObjectName,DataType,Observation,PrefRate,LowRate,HighRate,RateUncr,RateType,ReptReint,OffsetType,AgeType,NumEvents,RateAge,QbinMin,QbinMax,Reference
"> sliprate_site_tb.csv 
