const express = require("express");
const app = express();
const port = 8080;
const path = require("path");
const methodOverride = require('method-override');
const { v4: uuidv4 } = require('uuid');

// ==============================================
//       MIDDLEWARE CONFIGURATION
// ==============================================

// Parse URL-encoded bodies (for form data)
app.use(express.urlencoded({ extended: true }));

// Set up EJS as view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Serve static files from public directory
app.use(express.static(path.join(__dirname, "public")));

// Enable method override for PUT/DELETE in forms
app.use(methodOverride('_method'));

// ==============================================
//       IN-MEMORY DATABASE (TEMPORARY)
// ==============================================

/**
 * Array of post objects with:
 * - username: Author of the post
 * - id: Unique identifier (UUID)
 * - content: Post content
 */
let posts = [
    {
        username: "tech_enthusiast42",
        id: uuidv4(),
        content: "Just switched from Mac to Windows after 10 years. The WSL (Windows Subsystem for Linux) integration is a game-changer for development work. Anyone else made this transition recently?"
    },
    {
        username: "code_newbie",
        id: uuidv4(),
        content: "Struggling with async/await in JavaScript. Can someone explain why my promises aren't resolving in the order I expect? #javascript #help"
    },
    {
        username: "senior_dev_amy",
        id: uuidv4(),
        content: "After 5 years with React, I'm finally giving Vue a serious try. The composition API feels so intuitive! What are your experiences with Vue vs React?"
    },
    {
        username: "cloud_architect",
        id: uuidv4(),
        content: "Just deployed our microservices architecture on Kubernetes. The auto-scaling features saved us during our product launch traffic spike! #kubernetes #devops"
    },
    {
        username: "ai_researcher",
        id: uuidv4(),
        content: "Published our new paper on transformer models today. The results show 15% improvement in few-shot learning tasks. Excited to share the code soon! #machinelearning"
    }
];

// ==============================================
//              ROUTE HANDLERS
// ==============================================

/**
 * GET / - Health check endpoint
 */
app.get("/", (req, res) => {
    res.send("Server is running");
});

/**
 * GET /posts - List all posts
 */
app.get("/posts", (req, res) => {
    res.render("index.ejs", { posts });
});

/**
 * GET /posts/new - Show form to create new post
 */
app.get("/posts/new", (req, res) => {
    res.render("new.ejs");
});

/**
 * POST /posts - Create a new post
 */
app.post("/posts", (req, res) => {
    const { username, content } = req.body;
    const id = uuidv4();
    posts.push({ username, content, id });
    res.redirect("/posts");
});

/**
 * GET /posts/:id - Show a specific post
 */
app.get("/posts/:id", (req, res) => {
    const { id } = req.params;
    const post = posts.find((p) => id === p.id);
    
    if (!post) {
        return res.status(404).render("error.ejs", { message: "Post not found" });
    }
    
    res.render("show.ejs", { post });
});

/**
 * GET /posts/:id/edit - Show edit form for a post
 */
app.get("/posts/:id/edit", (req, res) => {
    const { id } = req.params;
    const post = posts.find((p) => id === p.id);
    
    if (!post) {
        return res.status(404).render("error.ejs", { message: "Post not found" });
    }
    
    res.render("edit.ejs", { post });
});

/**
 * PATCH /posts/:id - Update a post
 */
app.patch("/posts/:id", (req, res) => {
    const { id } = req.params;
    const { content } = req.body;
    
    const post = posts.find((p) => id === p.id);
    if (!post) {
        return res.status(404).render("error.ejs", { message: "Post not found" });
    }
    
    post.content = content;
    res.redirect("/posts");
});

/**
 * DELETE /posts/:id - Delete a post
 */
app.delete("/posts/:id", (req, res) => {
    const { id } = req.params;
    const initialLength = posts.length;
    
    posts = posts.filter((p) => id !== p.id);
    
    if (posts.length === initialLength) {
        return res.status(404).render("error.ejs", { message: "Post not found" });
    }
    
    res.redirect("/posts");
});

// ==============================================
//              SERVER STARTUP
// ==============================================

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});