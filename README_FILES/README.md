# Northcoders Backend Project: NC_News

## Initial setup

To set up this project's environment:
1. Install the required node modules listed in the ``package.json`` file by running the following command in the terminal ``npm install``.
2. Create a ``.env`` file for your test and development databases.
3. Within each ``.env`` file link to the relevant database for the environment by placing the following text within the file ``PGDATABASE=your_database_name_here``.
4. Run the following scripts as defined in the ``package.json`` file using the terminal command ``npm run script_name_to_run_here``.
- ``prepare`` - Installs the husky npm package.
- ``setup-dbs`` - Drops the psql database if it exists and creates a new database. 
- ``seed`` - Runs the database seed file to seed a new database.
- ``test`` - Runs the code tests as defined in the ``__tests__`` directory using jest.