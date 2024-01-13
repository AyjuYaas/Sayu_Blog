import express from "express";
import bodyParser from "body-parser";
import { fileURLToPath } from "url";
import { dirname } from "path";
import _ from "lodash";
import mongoose from "mongoose";
const { Schema } = mongoose;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const homeStartingContext =
  "Lorem ipsum dolor sit amet consectetur adipisicing elit. Iste quas eveniet dicta est ullam sequi cupiditate atque, ab maiores nulla, praesentium perspiciatis, nobis mollitia libero ipsum totam earum expedita sed. Lorem ipsum dolor sit amet consectetur adipisicing elit. Reiciendis aliquid libero expedita aut consequatur, quas fugit porro pariatur temporibus nostrum nobis laudantium. Debitis magni aperiam impedit laudantium amet, dolorum est.";

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/blogDB");
}

const blogSchema = new Schema({
  title: String,
  content: String,
  time: String,
});

//Collection Create
const Blog = mongoose.model("Blog", blogSchema);

const _default = new Blog({
  title: "Home",
  content: homeStartingContext,
  time: dateToday(),
});

if ((await Blog.countDocuments({})) === 0) {
  await _default.save();
}

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", async (req, res) => {
  const posts = await Blog.find({});
  res.render("home", { posts: posts });
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

app.post("/compose", async (req, res) => {
  let body = req.body.postBody;

  const post = new Blog({
    title: req.body.postTitle,
    content: body,
    time: dateToday(),
  });
  await post.save();

  res.redirect("/");
});

app.get("/posts/:title", async (req, res) => {
  const foundBlog = await Blog.findById(req.params.title);

  res.render("post", { title: foundBlog.title, content: foundBlog.content, time: foundBlog.time });
});

app.get("/error", (req, res) => {
  res.render("error");
});

app.listen(3000, () => {
  console.log("Server Running on port 3000");
});

function dateToday() {
  let date = new Date();

  const currentDate = date
    .toLocaleDateString()
    .split("/")
    .map((d) => (d.length <= 1 ? "0" + d : d));
  const hours = date.getHours().toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: false });
  const minutes = date.getMinutes().toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: false });

  let newDate = `${currentDate[1]}/${currentDate[0]}/${currentDate[2]} ${hours}:${minutes}`;

  return newDate;
}
