let express = require("express");
let morgan = require("morgan");
let bodyParser = require('body-parser');
let uuid = require('uuid/v4');

let app = express();
let jsonParser = bodyParser.json();

app.use(express.static('public'));
app.use(morgan("dev"));

let posts = [{
	id: uuid(),
	title: "Post 1",
	content: "This is the first post of the day!",
	author: "George",
	publishDate: "1/10/2019"
},
{
	id: uuid(),
	title: "Post 2",
	content: "This is the second post of the day!",
	author: "Stevie",
	publishDate: "10/10/2019"
},
{
	id: uuid(),
	title: "Post 3",
	content: "This is the third and final post of the day!",
	author: "Jay-Z",
	publishDate: "20/10/2019"
}
];

app.get("/blog-posts", (req, res, next) => {
    return res.status(200).json(posts);
});

app.get("/blog-post", (req, res, next) => {
    let author = req.query.author;
    if (! author) {
        res.statusMessage = "Missing author in params";
        return res.status(406).json({
            message: "Missing author in params",
            status: 406
        });
    }
    posts.forEach(function(post) {
        if (post.author == author) {
            return res.status(200).json(post);
        }
    });
    res.statusMessage = "Author not found";
    return res.status(404).json({
        message: "Author not found",
        status: 404
    });
});

app.post("/blog-posts", jsonParser, (req, res, next) => {
    let title = req.body.title;
    let content = req.body.content;
    let author = req.body.author;
    let publishDate = req.body.publishDate;

    if ( !title || !content || !author || !publishDate ) {
        return res.status(406).json({
            message: "Missing data",
            status: 406
        });
    }

    let newPost = {
        id: uuid(),
        title: title,
        content: content,
        author: author,
        publishDate: publishDate,
    }
    posts.push(newPost);
    return res.status(201).json({
        message: "Blog post added",
        post: newPost,
        status: 201
    })
});

app.delete("/blog-posts/:id", (req, res, next) => {
    let id = req.params.id;

    for( var i = 0; i < posts.length; i++){ 
        if (posts[i].id === id) {
            posts.splice(i, 1);
            return res.status(200).json({
                message: "Deleted Successfully!",
                status: 200
            });
        }
    }
    res.statusMessage = "ID not found";
    return res.status(404).json({
        message: "ID not found",
        status: 404
    });
});


app.put("/blog-posts/:id", jsonParser, (req, res, next) => {
    let id = req.body.id;
    let paramId = req.params.id;
    let title = req.body.title;
    let content = req.body.content;
    let author = req.body.author;
    let publishDate = req.body.publishDate;

    if (!id) {
        return res.status(406).json({
            message: "Missing id in body",
            status: 406
        });
    }
    if (id != paramId) {
        return res.status(409).json({
            message: "Ids do not match",
            status: 409
        })
    }

    for( var i = 0; i < posts.length; i++){ 
        if (posts[i].id === id) {
            if (title) {
                posts[i].title = title;
            }
            if (content) {
                posts[i].content = content;
            }
            if (author) {
                posts[i].author = author;
            }
            if (publishDate) {
                posts[i].publishDate = publishDate;
            }
            return res.status(202).json(posts[i]);
        }
    }
});


app.listen("8080", () => {
    console.log("App is running on port 8080");
})