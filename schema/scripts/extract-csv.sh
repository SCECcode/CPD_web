#!/bin/sh

## extract csv files from user supplied xlsx file
##
## in2csv and csvcut are from https://csvkit.readthedocs.io/en/latest/index.html
##
## sudo pip install csvkit

. ./common.sh

rm -f *.csv
#in2csv --sheet "${EXCEL_NM_SHEET}" ${EXCEL_NM_FILE} | csvcut -c 1-26 > ${EXCEL_NM}_raw.csv

cat ${CPDPATH}/${EXCEL_NM}.csv | csvcut -c 1-26 > ${EXCEL_NM}_raw.csv
cat ${EXCEL_NM}_raw.csv |sed "s/  / /g" | sed "s/, E/,E/"  > ${EXCEL_NM}.csv
csvcut -n ${EXCEL_NM}.csv > ${EXCEL_NM}_column_labels

#sid,whatever
csvcut -c "3,18" ${EXCEL_NM}.csv |csvcut -K 1 | sort |uniq | sed "1i\\
sid,whatever
"> test_tb.csv 

#sid,name >> SlipRateID,FaultName
csvcut -c "3,5" ${EXCEL_NM}.csv |csvcut -K 1 | sort |uniq | sed "1i\\
sid,name
"> slipid_fault_tb.csv 

#sid,name >> SlipRateID,SiteName
csvcut -c "3,7" ${EXCEL_NM}.csv |csvcut -K 1 | sort |uniq | sed "1i\\
sid,name
"> slipid_name_tb.csv 

#sid,min,max >> SlipRateID,LowRate,HighRate
csvcut -c "3,11,12" ${EXCEL_NM}.csv |csvcut -K 1 | sort |uniq | sed "1i\\
sid,min,max
"> slipid_rate_tb.csv

#sid,x,y >> SlipRateID,X,Y
csvcut -c "3,1,2" ${EXCEL_NM}.csv |csvcut -K 1|sort |uniq | sed "1i\\
sid,x,y
"> slipid_loc_tb.csv

# SlipRateID,X,Y,FaultName,SiteName,LowRate,HighRate,State,DataType,QbinMin,QbinMax,x2014dip,x2014rake,x2014rate,Reference
csvcut -c "3,1,2,5,7,11,12,6,8,20,21,22,23,24,25" ${EXCEL_NM}.csv |csvcut -K 1|sort |uniq | sed "1i\\
SlipRateID,X,Y,FaultName,SiteName,LowRate,HighRate,State,DataType,QbinMin,QbinMax,x2014dip,x2014rake,x2014rate,Reference
"> sliprate_site_tb.csv 
