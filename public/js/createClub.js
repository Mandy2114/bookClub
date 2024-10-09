const books = document.querySelectorAll(".books");
const bookTag = document.querySelector("#bookTag");

books.forEach((book) => {
  book.addEventListener("click", (e) => {
    bookTag.value = e.target.dataset.bookid;
  });
});
