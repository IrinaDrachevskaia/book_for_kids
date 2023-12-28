import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 4500;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Get an access to database
const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "books",
  password: "Your Password",
  port: 5432,
});
db.connect();

//get data from categories table
async function getCategories() {
    try {
        let data = await db.query("SELECT * FROM categories;");
        let categories = [];
        data.rows.forEach((category) => {
            categories.push({category: category.category, category_id: category.id});
        });
        return categories;
    } catch (error) {
        console.error('Error getting categories:', error);
        throw error;
    }
}

  // get data from books table
  async function getAllBooks(order) {
    try {
        const result = await db.query(`SELECT books.id AS book_id, books.title, books.author, books.description, books.rating, books.image, categories.id AS category_id, categories.category FROM books JOIN categories ON category_id = categories.id ORDER BY ${order}`);
        let books = result.rows;
        return books;
    } catch (error) {
        console.error('Error getting books:', error);
        throw error;
    }
}

  // get data from the books table with a condition where
  async function getBooksBy(order) {
    try {
        const result = await db.query(`SELECT books.id AS book_id, books.title, books.author, books.description, books.rating, books.image, categories.id AS category_id, categories.category FROM books JOIN categories ON category_id = categories.id WHERE ${order}`);
        let books = result.rows;
        return books;
    } catch (error) {
        console.error('Error getting books:', error);
        throw error;
    }
}

// get  all data from the table and send it to the client
app.get("/allbooks", async (req, res) => {
    try {
        const categories = await getCategories();
        const books = await getAllBooks("book_id ASC");

        const dataToSend = {
            categories: categories,
            books: books
        };
        res.json(dataToSend);
    } catch (error) {
        console.error('Error handling request:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// get all data sorted by title from the table and send it to the client
app.get("/book/sort=title", async (req, res) => {
    try {
        const categories = await getCategories();
        const books = await getAllBooks("title ASC");
        const dataToSend = {
            categories: categories,
            books: books
        };
        res.json(dataToSend);
    } catch (error) {
        console.error('Error handling request:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

/// get all data sorted by date from the table and send it to the client
app.get("/book/sort=date", async (req, res) => {
    try {
        const categories = await getCategories();
        const books = await getAllBooks("book_id DESC");
        const dataToSend = {
            categories: categories,
            books: books
        };
        res.json(dataToSend);
    } catch (error) {
        console.error('Error handling request:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// get all data sorted by rating from the table and send it to the client
app.get("/book/sort=rating", async (req, res) => {
    try {
        const categories = await getCategories();
        const books = await getAllBooks("rating DESC");
        const dataToSend = {
            categories: categories,
            books: books
        };
        res.json(dataToSend);
    } catch (error) {
        console.error('Error handling request:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// get all data filtred by category from the table and send it to the client
app.get("/category/:category_id", async (req, res) => {
    const selectedCategoryId = req.params.category_id;
    try {
        const categories = await getCategories();
        const books = await getBooksBy(`category_id=${selectedCategoryId}`);
        const dataToSend = {
            categories: categories,
            books: books
        };
        res.json(dataToSend);
    } catch (error) {
        console.error('Error handling request:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//Navigate to the page to add a new book
app.get("/add", async (req, res) => {
    try {
        const categories = await getCategories();
        const dataToSend = {
            categories: categories
        };
        res.json(dataToSend);
    } catch (error) {
        console.error('Error handling request:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// search all data by partial book title from the table and send it to the client
app.post("/search", async (req, res) => {
    const searchBookTitle = req.body.search;

    try {
        const categories = await getCategories();
        const books = await getBooksBy(`LOWER(title) LIKE LOWER('%${searchBookTitle}%')`);
        const dataToSend = {
            categories: categories,
            books: books
        };
        res.json(dataToSend);
    } catch (error) {
        console.error('Error handling request:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


//add new book to the DB and send all book data to the client
app.post("/submit", async (req, res) => {
    const newBookTitle = req.body.title;
    const newBookAuthor = req.body.author;
    const newBookRating = req.body.rating;
    const newBookCategory = req.body.category;
    const newBookImage = req.body.image;
    const newBookDescription = req.body.description;

    try {
        await db.query("INSERT INTO books (title, author, description, rating, image, category_id) VALUES ($1, $2, $3, $4, $5, $6)", 
        [newBookTitle, newBookAuthor, newBookDescription, Number(newBookRating), newBookImage, newBookCategory]);
        const newBook = {
            title: newBookTitle,
            author: newBookAuthor,
            description: newBookDescription,
            rating: newBookRating,
            image: newBookImage,
            category_id: newBookCategory
        };
        res.status(201).json(newBook);
    } catch (error) {
        console.error('Error handling request:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//get a book by id and send it to the client
app.get("/book_id=:id", async (req, res) => {
    const selectedBookId = req.params.id;
    try {
        const categories = await getCategories();
        const result = await db.query("SELECT books.id AS book_id, books.title, books.author, books.description, books.rating, books.image, categories.id AS category_id, categories.category FROM books JOIN categories ON category_id = categories.id WHERE books.id=$1", [selectedBookId]);
        const book = result.rows;

        const dataToSend = {
            categories: categories,
            book: book
        };
        res.json(dataToSend);
    } catch (error) {
        console.error('Error handling request:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// get a book by id a send it to edit
app.get("/edit/:id", async (req, res) => {
    const selectedBookId = req.params.id;
    try {
        const categories = await getCategories();
        const result = await db.query("SELECT books.id AS book_id, books.title, books.author, books.description, books.rating, books.image, categories.id AS category_id, categories.category FROM books JOIN categories ON category_id = categories.id WHERE books.id=$1", [selectedBookId]);
        const book = result.rows;

        const dataToSend = {
            categories: categories,
            book: book
        };
        res.json(dataToSend);
    } catch (error) {
        console.error('Error handling request:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
 
// Update the database with new book data received from the client
app.patch("/update/:id", async (req, res) => {
    const selectedBookId = req.params.id;

    const newBookTitle = req.body.title;
    const newBookAuthor = req.body.author;
    const newBookRating = req.body.rating;
    const newBookCategory = req.body.category;
    const newBookImage = req.body.image;
    const newBookDescription = req.body.description;

    try {
        await db.query(`UPDATE books SET title = $1 , author = $2 , description = $3, rating = $4, image = $5, category_id = $6 WHERE books.id =${selectedBookId}`, 
        [newBookTitle, newBookAuthor, newBookDescription, Number(newBookRating), newBookImage, newBookCategory]);

        const categories = await getCategories();
        const result = await db.query("SELECT books.id AS book_id, books.title, books.author, books.description, books.rating, books.image, categories.id AS category_id, categories.category FROM books JOIN categories ON category_id = categories.id WHERE books.id=$1", [selectedBookId]);
        const book = result.rows;

        const dataToSend = {
            categories: categories,
            book: book
        };
        res.json(dataToSend);
    } catch (error) {
        console.error('Error handling request:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// DELETE a specific book by providing the book id.
app.delete("/delete/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        await db.query("DELETE FROM books WHERE books.id = $1", [id]);

        const categories = await getCategories();
        const books = await getAllBooks();

        const dataToSend = {
            categories: categories,
            books: books
        };
        res.json(dataToSend);
    } catch (error) {
        console.error('Error handling request:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
  });

app.listen(port, () => {
    console.log(`API is running at http://localhost:${port}`);
  });
