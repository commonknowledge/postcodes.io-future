## Future UK constituency boundary changes

This repo exists to serve campaigners during the interim period between now and the creation of the next UK government, some time after the next general election (2024/2025).
The new constituency boundaries have been announced, but they aren't 'live' yet - the existing MPs sitting in their constituencies will serve their existing constituents until the result of the next election.
For electoral purposes though, the new constituency data is very much alive and essential for the work of campaigners.

## Deployment

### Deploy the API

Use a service like Digital Ocean, Render, Fly.io etc. to deploy a docker container using the `Dockerfile` in the root of this repo.

### Deploy the database

#### Create an empty production Postgres database

Create a publicly accessible postgres database and copy the connection string to `.env.local` as POSTGRES_PROD_URL.

#### Insert the schema and data

Restore the database from the dump file contained in `./latest_future`. Run the following:

```
export $(cat .env.local | xargs)
sh future/populate_database.sh
```

## Development

Requirements: Docker / Docker Desktop, node

### Running the app & database

```
cd docker/live-test
docker compose up -d
```

### Pulling in new database changes from postcodes.io

#### Synchronise the fork

- Use the Github dashboard to synchronise the fork with the main postcodes.io repository.
- Merge this branch (`future-2025`) into `master`.

#### Reset the database

```
docker rm db
docker rmi live-test-db
docker compose up -d
```

#### Generate a new pg_dump file

Download the file from the link contained in `future/parl_constituencies_2025.url`.
Then download the new shape files and data:

```
cat future/parl_constituencies_2025.url | xargs wget -O future/parl_constituencies_2025.gpkg
```

Then update the database schema

```
export $(cat .env.local | xargs)
psql ${POSTGRES_URL} < future/future.columns
```

And pull the new constituency data into the local database

```
sh future/import_new_constituency_shapes.sh
node future/update_postcodes.js
sh ./bin/dumpdb
rm postcodesio.future.sql future/parl_constituencies_2025.gpkg
```

This compressed file should be uploaded to a file/blob store, and the URL for the blob copied into `./latest_future`
