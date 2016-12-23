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
    name:String,
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
            console.log(`Blog retrieved ${blogs}`)
            res.render("blogIndex", {blogs:blogs});
        }else{
            console.log("Retrieve error!");
        }
    });  
});



//start server with C9 IP and port
app.listen(process.env.PORT, process.env.IP, function (){
    console.log(`Server started at ${process.env.IP}:${process.env.PORT}`);
});