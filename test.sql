\c nc_news_test

SELECT articles.article_id,
articles.title,
articles.topic,
articles.author,
articles.body,
articles.created_at,
articles.votes,
COUNT(articles.article_id) AS comment_count FROM articles
INNER JOIN comments
ON articles.article_id = comments.article_id
WHERE articles.article_id = 3
GROUP BY articles.article_id;