#!/bin/sh

##
## create db specific sql files
##
## setup_sliprate_tb.sql setup_schema.sql
##

. ./common.sh

## no changes
cat sql_template/setup_schema.sql > setup_schema.sql

cat sql_template/setup_sliprate_tb.sql | sed "s/DATATYPE/${DATATYPE}/" > setup_sliprate_tb.sql

