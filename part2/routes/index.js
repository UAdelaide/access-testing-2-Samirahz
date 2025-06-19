const express = require('express');
const router = express.Router();
/* GET home page */
router.get('/', function (req, res) {
  res.render('index', { title: 'Express' });
});
/* GET posts */
router.get('/posts', function (req, res) {
  if (req.session && req.session.user) {
    console.log(req.session.user);
  }
  req.pool.getConnection(function (err, connection) {
    if (err) {
      res.sendStatus(500);
      return;
    }
    const query = `
      SELECT q_tags.tags,
             users.given_name AS author,
             questions.title,
             questions.content,
             questions.timestamp,
             questions.q_id,
             IFNULL(q_up.tally, 0) AS upvotes
      FROM questions
      INNER JOIN users ON questions.author = users.u_id
      LEFT JOIN q_tags ON q_tags.question = questions.q_id
      LEFT JOIN q_up ON q_up.question = questions.q_id;
    `;
    connection.query(query, function (err, rows) {
      connection.release();
      if (err) {
        res.sendStatus(500);
        return;
      }
      for (const row of rows) {
        row.tags = row.tags ? row.tags.split(',') : [];
      }
      res.json(rows);
    });
  });
});
/* POST add post */
router.post('/addpost', function (req, res) {
  const { title, content, tags } = req.body;
  if (title && content && Array.isArray(tags) && req.session && req.session.user) {
    const author = req.session.user;
    req.pool.getConnection(function (err, connection) {
      if (err) {
        console.error(err);
        res.sendStatus(500);
        return;
      }
      const insertQuestionQuery = `
        INSERT INTO questions (author, title, content, timestamp)
        VALUES (?, ?, ?, NOW());
      `;
      connection.query(insertQuestionQuery, [author.u_id, title, content], function (err) {
        if (err) {
          console.error(err);
          connection.release();
          res.sendStatus(500);
          return;
        }
        if (tags.length === 0) {
          connection.release();
          res.end();
          return;
        }
        const tagValues = tags.map(tag => `('${tag}', LAST_INSERT_ID())`).join(',');
        const insertTagsQuery = `INSERT INTO question_tags (tagname, question) VALUES ${tagValues};`;
        connection.query(insertTagsQuery, function (err) {
          connection.release();
          if (err) {
            console.error(err);
            res.sendStatus(500);
            return;
          }
          res.end();
        }),
       res.end();
        }),
      });
    });
    });
  } else {
    res.sendStatus(400);
  }
});
module.exports = router;
