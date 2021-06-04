require("dotenv").config({ path: "../.env" });
const fs = require("fs");
const parse = require("csv-parse/lib/sync");
const path = require("path");
const { Snowflake } = require("snowflake-promise");

const connectOptions = {
  account: process.env.GROUPAROO_OPTION__APP__SNOWFLAKE_ACCOUNT,
  username: process.env.GROUPAROO_OPTION__APP__SNOWFLAKE_USERNAME,
  password: process.env.GROUPAROO_OPTION__APP__SNOWFLAKE_PASSWORD,
  warehouse: process.env.GROUPAROO_OPTION__APP__SNOWFLAKE_WAREHOUSE,
  database: process.env.GROUPAROO_OPTION__APP__SNOWFLAKE_DATABASE,
  schema: process.env.GROUPAROO_OPTION__APP__SNOWFLAKE_SCHEMA,
};

// ---------------------------------------- | Checks

for (const key in connectOptions) {
  if (!connectOptions[key]) {
    console.log(
      `❌ environment variable GROUPAROO_OPTION__APP__SNOWFLAKE_${key.toUpperCase()} not set in .env file`
    );
    process.exit(1);
  }
}

// ---------------------------------------- | Refs

const client = new Snowflake(connectOptions);

const tableColumns = {
  USERS: `
    "ID" INTEGER NOT NULL,
    "FIRST_NAME" STRING,
    "LAST_NAME" STRING,
    "EMAIL" STRING,
    "GENDER" STRING,
    "IP_ADDRESS" STRING,
    "AVATAR" STRING,
    "LANGUAGE" STRING,
    "DEACTIVATED" BOOLEAN,
    "CREATED_AT" TIMESTAMP,
    "UPDATED_AT" TIMESTAMP
  `,
  PURCHASES: `
    "ID" INTEGER NOT NULL,
    "USER_ID" INTEGER,
    "ITEM" INTEGER,
    "CATEGORY" STRING,
    "PRICE" DOUBLE,
    "STATE" STRING,
    "CREATED_AT" STRING
  `,
};

// // ---------------------------------------- | Utils

const runQuery = async (query) => {
  await client.execute(query);
};

const buildKeyList = (obj) =>
  Object.keys(obj)
    .map((k) => k.toUpperCase())
    .join(",");

const buildValueList = (obj) => {
  const out = [];
  for (const key in obj) {
    const value = obj[key];
    if (!value) {
      out.push("NULL");
    } else if (["id", "user_id", "item", "price"].includes(key)) {
      out.push(value);
    } else {
      out.push(`'${value.replace("'", "\\'")}'`);
    }
  }
  return out.join(",");
};

const dropTable = async (tableName) => {
  const query = `DROP TABLE IF EXISTS ${tableName}`;
  await runQuery(query);
  console.log(`✅ Dropped ${tableName} table`);
};

const createTable = async (tableName) => {
  const query = `CREATE TABLE ${tableName} (${tableColumns[tableName]})`;
  await runQuery(query);
  console.log(`✅ Created ${tableName} table`);
};

const importCsv = async (tableName) => {
  tableName = tableName.toLowerCase();
  const csvFilePath = path.resolve(path.join(__dirname, `./${tableName}.csv`));
  const rows = parse(fs.readFileSync(csvFilePath), { columns: true });

  let keys = null;
  const values = [];
  for (const row of rows) {
    keys = keys ?? buildKeyList(row);
    const list = buildValueList(row);
    values.push(`(${list})`);
  }

  await runQuery(
    `INSERT INTO ${tableName} (${keys}) VALUES ${values.join(",\n")}`
  );
  console.log(`✅ Imported ${tableName}.csv`);
};

const doImport = async (tableName) => {
  await dropTable(tableName);
  await createTable(tableName);
  await importCsv(tableName);
};

// ---------------------------------------- | Run!

const run = async () => {
  await client.connect();
  await doImport("USERS");
  await doImport("PURCHASES");
  await client.destroy();
};

run();
