#####  processing schema/data
#####  cp target_data's  target.csv here
#####  unmark the data type at the bottom
#####
#####    ./extract-csv.sh
#####        mv *.csv to  schema/data/target
#####    ./create-sql.sh
#####        mv *.sql to  schema/sql/target
#####

TOGGLE_S1=1
TOGGLE_C1=0

PWD=`pwd`


if [ $TOGGLE_S1 == 1 ]
then
  CPDPATH=${PWD}"/../CPD_1_slip_rates/"
  CPDTYPE="CPD1_sliprates"
  EXCEL_NM="CPD_SlipRatesSites"
  DATATYPE="sliprate1"
  EXCEL_NM_SHEET="CPD1 Slip Rates"
#  EXCEL_NM_FILE=${CPDPATH}"/CPD_SlipRates.xlsx"
fi

if [ $TOGGLE_C1 == 1 ]
then
  CPDPATH=${PWD}"/../CPD_1_chronology/"
  CPDTYPE="CPD1_chronology"
  EXCEL_NM="CPD1_Metadata_C"
  DATATYPE="chronology1"
  EXCEL_NM_SHEET="CPD1 Chronology"
  EXCEL_NM_FILE=${PWD}"/CPD_Chronology_Metadata.xlsx"
fi

