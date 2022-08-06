# Northcoders Backend Project: NC_News

## Summary

A Node.JS web server project coded using the express.js framework to provide an api to fetch data from a postgres (psql) database with appropriate error handling.

Please follow the link to try for yourself: https://northcoders-backend-project-jg.herokuapp.com/api

## Local setup

To download this project:

1. On the project's homepage click fork and wait for permission to fork.
2. In your CLI navigate to your chosen directory and type `git clone <url_of_fork>`.

## Environment setup

To set up this project's environment:

1. Install the required node modules listed in the `package.json` file by running the following command in the terminal `npm install`.
2. Create a `.env` file for your test, development and production databases.
3. Within each `.env` file link to the relevant database for the environment by placing the following text within the file `PGDATABASE=<your_database_name_here>`.
4. Run the following scripts as defined in the `package.json` file using the terminal command `npm run <script_name_to_run_here>`.

- `prepare` - Installs the husky npm package.
- `setup-dbs` - Drops the psql database if it exists and creates a new database.
- `seed` - Runs the database seed file to seed a new database.
- `seed:prod` - Runs the production database seed file to seed a new database.
- `test` - Runs the code tests as defined in the `__tests__` directory using jest.

## Endpoints

1. `GET /api` - Returns a response object representing all api endpoints with endpoint information on a key of the endpoint path.

```
{
  api_endpoints : {
    'PATH, String: {
          description: String,
          queries: Array,
          exampleResponse: Object
        },

}

```

2. `GET /api/topics` - Returns a response object of news topics.

```
{
        topics: [
          { slug: STRING , description: STRING },
        ]
      }
```

3. `GET /api/articles/:article_id` - Returns a response object with a article object of a given article_id.

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

4. `PATCH /api/articles/:article_id` - Returns a response object with a article object of a given article_id updating the votes key to add the value of the request body supplied.

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

5. `GET /api/users` - Returns an object with a array of objects representing users on key of users.

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

6. `GET /api/articles` - Returns an object with an array of objects representing articles on key of articles.

- Queries
- ?sort_by=:sort_by : Sorts by a specific table column. Default = created_at
- &order=:order : Specifies sort in a specific order. Default = DESC
- &topic=:topic : Filters returned results by a specific article topic.

```
{
  articles : [
    {
          article_id: Number,
          title: String,
          topic: String,
          author: String,,
          created_at: String,
          votes: Number,
          comment_count: Number
        }

  ]
}
```

7. `GET /api/articles/:article_id/comments` - Returns an array of objects representing the comments on a specific article on a key of comments.

```
{
  comments :
  [
    {
      comment_id : Number,
      author : String,
      body : String,
      created_at : String,
      votes : Number
    },
  ]
}
```

8. `POST /api/articles/:article_id/comments` - Posts a new comment to comments table and returns an object representing the new comment posted to a specific article.

```
{
  comment :

    {
      comment_id : Number,
      author : String,
      body : String,
      created_at : String,
      votes : Number,
      article_id : Number
    },

}
```

9. `DELETE /api/comments/:comment_id` - Deletes a comment from the database by comment_id.

## Minimum requirements to run locally

- Node.js 18.3.0 +
- Postgres 14.4 +