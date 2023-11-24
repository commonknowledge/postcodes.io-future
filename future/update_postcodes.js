const pg = require("pg");
const Cursor = require("pg-cursor");
require("dotenv").config();

const pool = new pg.Pool({
  connectionString: process.env.POSTGRES_URL,
});

const updatePostcodes = async () => {
  const text =
    "SELECT id, location FROM postcodes WHERE location IS NOT NULL order by id asc";

  try {
    const client = await pool.connect();
    const cursor = client.query(new Cursor(text));
    let rows = "start";

    while (rows) {
      rows = await cursor.read(1000);

      if (!rows?.length) {
        break;
      }

      for (const row of rows) {
        // Get constituency
        const constituency = await pool.query(
          "SELECT gss_code, name FROM parl_constituencies_2025 WHERE ST_Contains(geom, $1)",
          [row?.location]
        );
        // Insert gss_code into postcodes.constituency_id_2025
        await pool.query(
          "UPDATE postcodes SET constituency_id_2025 = $1 WHERE id = $2",
          [constituency.rows[0]?.gss_code, row?.id]
        );
      }
    }
    cursor.close(() => {
      client.release();
    });
    pool.end();
  } catch (err) {
    console.error(err);
  }
};

const addConstituencies = async () => {
  const newConstituencies = await pool.query(
    "SELECT gss_code, name FROM parl_constituencies_2025"
  );

  for (const constituency of newConstituencies.rows) {
    pool.query(
      "INSERT INTO constituencies (code, name) VALUES ($1, $2) ON CONFLICT DO NOTHING",
      [constituency.gss_code, constituency.name]
    );
  }
};

updatePostcodes();
addConstituencies();
