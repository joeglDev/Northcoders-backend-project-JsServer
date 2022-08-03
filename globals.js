class Endpoints {
    static ALL_TOPICS_END = "/api/topics";
    static INVALID_END = "/invalid";
    static ARTICLE_BY_ID_END = "/api/articles/:article_id";
    static ALL_USERS_END = "/api/users";
    static ALL_ARTICLES_END = "/api/articles";
    static ALL_COMMENTS_BY_ARTICLE_ID = "/api/articles/:article_id/comments";
};


module.exports.Endpoints = Endpoints;