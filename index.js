import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const port = 3000;
const API_URL = "http://localhost:4500";

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// Route to render the main page
app.get("/", async (req, res) => {
  try {
    const response = await axios.get(`${API_URL}/allbooks`);
    res.render("index.ejs", { 
      categories: response.data.categories,
      books: response.data.books});
  } catch (error) {
    res.status(500).json({ message: "Error fetching books" });
  }
});

// Route to render the page with filter by title
app.get("/book/sort=title", async (req, res) => {
  try {
    const response = await axios.get(`${API_URL}/book/sort=title`);
    res.render("index.ejs", { 
      categories: response.data.categories,
      books: response.data.books});
  } catch (error) {
    res.status(500).json({ message: "Error fetching books" });
  }
});

// Route to render the page with filter by newest
app.get("/book/sort=date", async (req, res) => {
  try {
    const response = await axios.get(`${API_URL}/book/sort=date`);
    res.render("index.ejs", { 
      categories: response.data.categories,
      books: response.data.books});
  } catch (error) {
    res.status(500).json({ message: "Error fetching books" });
  }
});

// Route to Render the Page with a Rating Filter
app.get("/book/sort=rating", async (req, res) => {
  try {
    const response = await axios.get(`${API_URL}/book/sort=rating`);
    res.render("index.ejs", { 
      categories: response.data.categories,
      books: response.data.books});
  } catch (error) {
    res.status(500).json({ message: "Error fetching books" });
  }
});

// Route to render the page with a category filter
app.get("/category/:category_id", async (req, res) => {
  try {
    const response = await axios.get(`${API_URL}/category/${req.params.category_id}`);
    res.render("index.ejs", { 
      categories: response.data.categories,
      books: response.data.books});
  } catch (error) {
    res.status(500).json({ message: "Error fetching books" });
  }
});

// Route to add new book
app.get("/add", async (req, res) => {
  try {
    const response = await axios.get(`${API_URL}/add`);
    res.render("new.ejs", { 
      categories: response.data.categories,
      });
  } catch (error) {
    res.status(500).json({ message: "Error fetching categories" });
  }
});

// Route to search a book
app.post("/search", async (req, res) => {
  try {
    const response = await axios.post(`${API_URL}/search`, req.body);
    res.render("index.ejs", { 
      categories: response.data.categories,
      books: response.data.books});
  } catch (error) {
    res.status(500).json({ message: "Error fetching categories" });
  }
});

// Route to post a new book and add to the DB
app.post("/submit", async (req, res) => {
  try {
    const response = await axios.post(`${API_URL}/submit`, req.body);
    res.redirect("/");
  } catch (error) {
    res.status(500).json({ message: "Error fetching categories" });
  }
});

// Route to render the page with a selected book
app.get("/book_id=:id", async (req, res) => {
  const selectedBookId = req.params.id;
  try {
    const response = await axios.get(`${API_URL}/book_id=${selectedBookId}`);
    res.render("book.ejs", { 
      categories: response.data.categories,
      book: response.data.book});
  } catch (error) {
    res.status(500).json({ message: "Error fetching a book" });
  }
});

//Route to render the page to edit the book
app.get("/edit/:id", async (req, res) => {
  try {
    const response = await axios.get(`${API_URL}/edit/${req.params.id}`);
    res.render("new.ejs", {
      categories: response.data.categories,
      book: response.data.book
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching book" });
  }
});

// Partially update a book
app.post("/update/:id", async (req, res) => {
  console.log("called");
  try {
    const response = await axios.patch(`${API_URL}/update/${req.params.id}`, req.body);
    res.render("book.ejs", { 
      categories: response.data.categories,
      book: response.data.book});
  } catch (error) {
    res.status(500).json({ message: "Error updating book" });
  }
});

// Delete a book
app.get("/delete/:id", async (req, res) => {
  try {
    await axios.delete(`${API_URL}/delete/${req.params.id}`);
    res.redirect("/");
  } catch (error) {
    res.status(500).json({ message: "Error deleting book" });
  }
});


app.listen(port, () => {
  console.log(`Backend server is running on http://localhost:${port}`);
});