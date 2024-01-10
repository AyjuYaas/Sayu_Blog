import express from "express";
import bodyParser from "body-parser";
import { fileURLToPath } from "url";
import { dirname } from "path";
import _ from "lodash";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const homeStartingContext =
  "Lorem ipsum dolor sit amet consectetur adipisicing elit. Iste quas eveniet dicta est ullam sequi cupiditate atque, ab maiores nulla, praesentium perspiciatis, nobis mollitia libero ipsum totam earum expedita sed. Lorem ipsum dolor sit amet consectetur adipisicing elit. Reiciendis aliquid libero expedita aut consequatur, quas fugit porro pariatur temporibus nostrum nobis laudantium. Debitis magni aperiam impedit laudantium amet, dolorum est.";

const posts = [];

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("home", { startingContext: homeStartingContext, posts: posts });
});

app.get("/about", (req, res) => {
  res.render("about");
});
app.get("/contact", (req, res) => {
  res.render("contact");
});
app.get("/compose", (req, res) => {
  res.render("compose");
});

app.post("/compose", (req, res) => {
  let flag = 0;
  const post = {
    title: req.body.postTitle,
    content: req.body.postBody,
  };
  posts.forEach((indPost) => {
    if (_.lowerCase(post.title) === _.lowerCase(indPost.title)) {
      res.redirect("/error");
      flag++;
    }
  });
  if (flag === 0) {
    posts.push(post);
    res.redirect("/");
  }
});

app.get("/posts/:title", (req, res) => {
  const reqTitle = _.lowerCase(req.params.title);
  posts.forEach((post) => {
    if (reqTitle === _.lowerCase(post.title)) {
      res.render("post", { title: post.title, content: post.content });
    }
  });
});

app.get("/error", (req, res) => {
  res.render("error");
});

app.listen(3000, () => {
  console.log("Server Running on port 3000");
});
