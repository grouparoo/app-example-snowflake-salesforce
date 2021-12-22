# Grouparoo `app-example-snowflake-salesforce`

_An example project for using Grouparoo to connect Snowflake to Salesforce._

This project shows and example how to use [Grouparoo](https://www.grouparoo.com/) to integrate a [Snowflake](https://www.snowflake.com/) data warehouse with [Salesforce](https://www.salesforce.com).

With this setup, when user and purchase data changes is Snowflake, it will be automatically synced to Salesforce. It is set up to make Contacts and Campaigns, but could be configured to populate any other Salesforce Objects.

## Setup

You will need to install Node.js for Grouparoo to use. This project is tested with Node.js version 15.

Then we can install Grouparoo packages.

```
npm install
```

Let's set up the Grouparoo `.env` file. These can also be set in the system `ENV`.

```
cp .env.example .env
```

You will need to edit the following environment variables to real ones for the connections to Snowflake and Salesforce to work correctly:

```
###############
## SNOWFLAKE ##
###############

GROUPAROO_OPTION__APP__SNOWFLAKE_ACCOUNT = "yla56382.us-east-1"
GROUPAROO_OPTION__APP__SNOWFLAKE_USERNAME = "DEMO"
GROUPAROO_OPTION__APP__SNOWFLAKE_PASSWORD = "JXF3JdiLMZb3r"
GROUPAROO_OPTION__APP__SNOWFLAKE_WAREHOUSE = "COMPUTE_WH"
GROUPAROO_OPTION__APP__SNOWFLAKE_DATABASE = "DEMO_SOURCE"
GROUPAROO_OPTION__APP__SNOWFLAKE_SCHEMA = "PUBLIC"

################
## SALESFORCE ##
################

GROUPAROO_OPTION__APP__SALESFORCE_USERNAME = "demo@grouparoo.com"
GROUPAROO_OPTION__APP__SALESFORCE_PASSWORD = "m7wyDx6uT-o!QFyXe"
GROUPAROO_OPTION__APP__SALESFORCE_SECURITY_TOKEN = "Xxxyzz34i1b7RNqdP6xoKSniX"
```

You can also seed the data in Snowflake if you like with demo data.

```
./data/import
```


## Run

You can edit the configuration and test importing and exporting data:

```
grouparoo config
```

If you want export all of the data, run the command you'd use in production:

```
grouparoo start
```

## Deploy

Without any other changes, this project will run with a SQLite database in a single thread. To deploy and scale a Grouparoo app to production, you will want to provision Postgres and Redis databases and configure your ENV appropriately.

See [the documentation](https://www.grouparoo.com/docs/deployment) for deployment examples.

---

Visit https://github.com/grouparoo/app-examples to see other Grouparoo Example Projects.
