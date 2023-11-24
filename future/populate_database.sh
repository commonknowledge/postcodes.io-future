cat ./latest_future | xargs wget -O postcodesio.future.sql.gz;
gunzip postcodesio.future.sql.gz postcodesio.future.sql;
psql ${POSTGRES_PROD_URL} < postcodesio.future.sql;
rm postcodesio.future.sql;
 