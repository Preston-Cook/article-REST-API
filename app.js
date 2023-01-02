const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

dotenv.config();

mongoose.set("strictQuery", false);
mongoose.connect(process.env.CONNECTION_STR);

app = express();
app.use(bodyParser.urlencoded({ extended: true }));

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
});

const Article = mongoose.model("Article", articleSchema);

app
  .route("/articles")
  .get((req, res) => {
    Article.find({}, (err, results) => {
      if (!err) {
        res.send(results);
      } else {
        res.send(err);
      }
    });
  })
  .post((req, res) => {
    const article = new Article({
      title: req.body.title,
      content: req.body.content,
    });

    article.save((err) => {
      if (!err) {
        res.send("Successfully added article");
      } else {
        res.send(err);
      }
    });
  })
  .delete((req, res) => {
    Article.deleteMany({}, (err) => {
      if (!err) {
        res.send("Successfully deleted articles");
      } else {
        res.send(err);
      }
    });
  });

app
  .route("/articles/:title")
  .get((req, res) => {
    Article.findOne({ title: req.params.title }, (err, result) => {
      if (result) {
        res.send(result);
      } else {
        res.send("No match found");
      }
    });
  })
  .put((req, res) => {
    Article.replaceOne(
      { title: req.params.title },
      { title: req.body.title, content: req.body.content },
      { overwrite: true },
      (err) => {
        if (!err) {
          res.send("Successfully updated article");
        } else {
          console.log(err)
          res.send(err);
        }
      }
    );
  })
  .patch((req, res) => {
    Article.updateOne(
      { title: req.params.title },
      { $set: req.body },
      (err) => {
        if (!err) {
          res.send("Successfully updated article");
        } else {
          res.send(err);
        }
      }
    );
  })
  .delete((req, res) => {
    Article.deleteOne({ title: req.params.title }, (err) => {
      if (!err) {
        res.send("Successfully deleted article");
      } else {
        res.send(err);
      }
    });
  });

app.listen(3000, () => {
  console.log("Running locally at http://localhost:3000");
});
