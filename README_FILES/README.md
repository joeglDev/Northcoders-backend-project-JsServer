# Northcoders Backend Project: NC_News

## Initial setup

To set up this project's environment:

1. Install the required node modules listed in the `package.json` file by running the following command in the terminal `npm install`.
2. Create a `.env` file for your test and development databases.
3. Within each `.env` file link to the relevant database for the environment by placing the following text within the file `PGDATABASE=your_database_name_here`.
4. Run the following scripts as defined in the `package.json` file using the terminal command `npm run script_name_to_run_here`.

- `prepare` - Installs the husky npm package.
- `setup-dbs` - Drops the psql database if it exists and creates a new database.
- `seed` - Runs the database seed file to seed a new database.
- `test` - Runs the code tests as defined in the `__tests__` directory using jest.

## Endpoints

1. `GET /api/topics` - Returns a response object of news topics.

```
{
        topics: [
          { slug: STRING , description: STRING },
        ]
      }
```

2. `GET /api/articles/:article_id` - Returns a response object with a article object of a given article_id.

```
 {
        article: [
          {
            article_id: Number,
            title: String,
            topic: String,
            author: String,
            body: String,
            created_at: String,
            votes: Number
          }
        ]
      }
```

3. `PATCH /api/articles/:article_id` - Returns a response object with a article object of a given article_id updating the votes key to add the value of the request body supplied.

```
 {
        article: [
          {
            article_id: Number,
            title: String,
            topic: String,
            author: String,
            body: String,
            created_at: String,
            votes: Number
          }
        ]
      }
```
4. `GET /api/users` - Returns an object with a array of objects representing users on key of users.

```
{
  users : [
    {
      username : String,
      name: String,
      avatar_url : String
    },
  ]
}
```

