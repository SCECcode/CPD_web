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

csvcut -l -c "1" ${EXCEL_NM}.csv |csvcut -K 1 | sort -n|uniq | sed "1i\\
id,name
"> id_fault_tb.csv 

#longitude,latitude,name >> Longitude,Latitude,SiteName
csvcut -l -c "4" ${EXCEL_NM}.csv |csvcut -K 1 | sort -n|uniq | sed "1i\\
id,name
"> id_name_tb.csv 

#longitude,latitude,min,max >> Longitude,Latitude,LowRate,HighRate
csvcut -l -c "13,14" ${EXCEL_NM}.csv |csvcut -K 1 | sort -n|uniq | sed "1i\\
id,min,max
"> id_rate_tb.csv

# Longitude,Latitude,
# FaultName,FaultID,
# State,SiteName,
# DataType,
# DistToCFMFault(km),
# CFM6.0-ObjectName,
# Observation,
# PrefRate,LowRate,HighRate,
# RateUnct,RateType,ReptReint,
# OffType,AgeType,NumEvents,RateAge
# QbinMin,QbinMax,
# Reference,AppB
#
# 6,7,1,2,3,4,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25
#Longitude,Latitude,FaultName,FaultID,State,SiteName,DataType,DistToCFMFault,CFM6ObjectName,Observation,PrefRate,LowRate,HighRate,RateUnct,RateType,ReptReint,OffType,AgeType,NumEvents,RateAge,QbinMin,QbinMax,Reference,AppB
#
csvcut -l -c "6,7,1,2,3,4,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25" ${EXCEL_NM}.csv |csvcut -K 1|sort -n|uniq | sed "1i\\
SliprateID,Longitude,Latitude,FaultName,FaultID,State,SiteName,DataType,DistToCFMFault,CFM6ObjectName,Observation,PrefRate,LowRate,HighRate,RateUnct,RateType,ReptReint,OffType,AgeType,NumEvents,RateAge,QbinMin,QbinMax,Reference,AppB
"> sliprate_site_tb.csv 
