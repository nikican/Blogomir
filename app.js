var bodyParser  = require("body-parser"),
mongoose        = require("mongoose"),
express         = require("express"),
app             = express();

//DB connection
mongoose.connect("mongodb://localhost/blogomir");

//template engine
app.set("view engine", "ejs");

//body parser
app.use(bodyParser.urlencoded({encoded:true}));

//serve "public" folder
app.use(express.static("public"));

//mongoose/model config
var blogSchema = new mongoose.Schema({
    title:String,
    image: {type: String, default: "https://source.unsplash.com/category/nature/1600x900"},
    body:String,
    date: {type: Date, default: Date.now}
});

var Blog = mongoose.model("Blog", blogSchema);

// RESTful routes
//landing
app.get("/", function(req, res){
    res.redirect("/blogs");
});

//index
app.get("/blogs", function(req, res){
    Blog.find({},function(error, blogs){
        if(!error){
            console.log("Blogs retrieved")
            res.render("blogIndex", {blogs:blogs});
        }else{
            console.log("Retrieve error!");
        }
    });  
});

//new route
app.get("/blogs/new", function(req, res){
    res.render("newBlog");
});

//create route
app.post("/blogs", function(req, res){
    var newBlog = req.body.blog;
    
    console.log(newBlog);
    
    Blog.create(newBlog, function(error, blog){
        if(!error){
            console.log(`Blog ${blog.title} saved.`);
            res.redirect("/blogs");
        }else{
            console.log("Save error!");
        }
    });
});

//show
app.get("/blogs/:id", function(req, res){
    var blogId = req.params.id;
    
    Blog.findById(blogId,function(error, blog){
        if(!error){
            console.log(`Blog ${blog.title} found.`)
            res.render("showBlog", {blog:blog});
        }else{
            console.log("Blog not found!");
        }
    });
});

//start server with C9 IP and port
app.listen(process.env.PORT, process.env.IP, function (){
    console.log(`Server started at ${process.env.IP}:${process.env.PORT}`);
});