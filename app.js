//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
require('dotenv').config(); 
const { default: mongoose } = require("mongoose");



var ObjectId = require('mongoose').Types.ObjectId;  // This is for checking that a string is an id or not
const { result } = require("lodash");
// mongoose.connect("mongodb://localhost:27017/blogDB");
mongoose.connect("mongodb+srv://"+process.env.USER_NAME+":"+process.env.PASSWORD+"@cluster0.aen287c.mongodb.net/blogDB");


function checkObjectIdValid(id) {  // Function of checking that the passed string is an id type or not
  if (ObjectId.isValid(id)) {

    return true;

  } else { return false }
}




const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";




const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));




// Creating the Database
const postSchema = mongoose.Schema({
  title: String,
  content: String
});

const Post = mongoose.model("Post", postSchema);





app.get("/", function (req, res) {
  // Finding all the documents in the posts collection and printing it by iterating(in home.ejs)
  Post.find((err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.render("home", {
        startingContent: homeStartingContent,
        posts: result
      });
    }
  })

});

app.get("/about", function (req, res) {
  res.render("about", { aboutContent: aboutContent });
});

app.get("/contact", function (req, res) {
  res.render("contact", { contactContent: contactContent });
});

app.get("/compose", function (req, res) {
  res.render("compose");
});

app.get("/posts/:postName", function (req, res) {
  // adding the ahref of post.id in read more so that id got passed  
  const request = req.params.postName;

  // if input type is id then find the element by id and show it
  if (checkObjectIdValid(request)) { 
    Post.findById(request, (error, result) => {
      if (!error) {
        if (!result) {
          res.redirect("/compose");
        } else {
          res.render("post", {
            title: result.title,
            content: result.content
          })
        }
      } else {
        console.log(error);
      }
    })
  } else {
    // if the input type is not an id then search the document by name and show the results
    const requestedTitle = _.capitalize(req.params.postName);
    console.log(requestedTitle);

    Post.findOne({ title: requestedTitle }, (err, foundOne) => {
      if (!err) {
        if (!foundOne) {
          console.log("Searched post does'nt exists so compose new post");
          res.redirect("/compose")
        } else {
          res.render("post", {
            title: foundOne.title,
            content: foundOne.content
          })
        }
      } else {
        console.log(err);
      }
    })
  }

});







app.post("/compose", (req, res) => {
  const postTitle = _.capitalize(req.body.postTitle);
  const postContent = req.body.postBody;

  Post.findOne({ title: postTitle }, (err, foundOne) => {
    if (!err) {
      if (!foundOne) {
        const newPost = new Post({
          title: postTitle,
          content: postContent
        })

        newPost.save();

        res.redirect("/");
      } else {
        console.log("The post with given title already exsists !!");
        res.redirect("/");
      }
    } else {
      console.log(err);
    }
  })


})




app.listen(process.env.PORT || 3000, function () {
  console.log("Server started on port 3000");
});
