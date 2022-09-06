import express from "express";
import exphbs from "express-handlebars";
import pool from "./db/conn.js";

const app = express();

app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());
app.use(express.static("public"));

app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");





app.post("/books/insertbooks", (req, res) => {
  const title = req.body.title;
  const pages = req.body.pages;

  const sqlQuery = `INSERT INTO books (??, ??) VALUES (?, ?)`;
  const data = ["book_name", "pages", title, pages];

  pool.query(sqlQuery, data, (err) => {
    if (err) throw err;
    res.redirect("/books");
  });
});

app.get("/books/edit/:id", (req, res) => {
  const id = req.params.id;
  const sql = `SELECT * FROM books WHERE ?? = ?`;
  const data = ['id', id];

  pool.query(sql, data, (err, data) => {
    if (err) throw err;
    const book = data[0];
    res.render("editbook", { book });
  });
});

app.post("/books/update", (req, res) => {
  const id = req.body.id;
  const title = req.body.title;
  const pages = req.body.pages;

  const sql = `UPDATE books SET ?? = ?, ?? = ? WHERE ?? = ?`;
  const data = ['book_name', title, 'pages', pages, 'id', id]

  pool.query(sql, data, (err) => {
    if (err) throw err;
    res.redirect("/books");
  });
});

app.post("/books/remove/:id", (req, res) => {
  const id = req.params.id;
  const sql = `DELETE FROM books WHERE ?? = ?`;
  const data = ['id', id];

  pool.query(sql, data, (err) => {
    if (err) throw err;
    res.redirect("/books");
  });
});

app.get("/books/:id", (req, res) => {
  const id = req.params.id;
  const sql = `SELECT * FROM books WHERE ?? = ?`;
  const data = ['id', id];

  pool.query(sql, data, (err, data) => {
    if (err) throw err;
    const book = data[0];
    if (data[0] !== undefined) {
      res.render("book", { book });
    } else {
      res.render("404");
      res.statusCode = 404;
    }
  });
});

app.get("/books", (req, res) => {
  const sql = `SELECT * FROM ??`;
  const data = ['books']

  pool.query(sql, data, (err, data) => {
    if (err) throw err;
    const books = data;
    res.render("books", { books });
  });
});

app.get("/", (req, res) => {
  res.render("home");
});

app.listen(3000);