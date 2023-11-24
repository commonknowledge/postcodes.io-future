## Future UK constituency boundary changes

This repo exists to serve campaigners during the interim period between now and the creation of the next UK government, some time after the next general election (2024/2025).
The new constituency boundaries have been announced, but they won't come into effect until the new government is formed - the existing MPs sitting in their existing constituencies will serve their existing constituents until that time.
For electoral purposes though, the new constituency data is very much alive and essential for the work of campaigners.

### Deploy the API

Use a service like Digital Ocean, Render, Fly.io etc. to launch a docker container using the `Dockerfile` in the root of this repo.

### Create an empty Postgres database

Create a publicly accessible postgres database and copy the connection string to `.env.local` as POSTGRES_PROD_URL.

### Populating an empty Postgres instance from the dump file

Restore the database from the dump file contained in `./latest_future`. Run the following:

`

### Generating a pg_dump file from scratch

Download the file from the link contained in `future/parl_constituencies_2025.url`.
Then run

```
export $(cat .env | xargs)
psql ${POSTGRES_URL} < future/future.columns
sh future/import_new_constituency_shapes.sh
node future/update_postcodes.js
```
