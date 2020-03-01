export class BookService {
  static saveBooks(books) {
    books.map(b => b.chapters.checkedChapters = Array.from(b.chapters.checkedChapters));

    if (window.localStorage) {
      localStorage.setItem('books', JSON.stringify(books));
    }
  }

  static getSavedBooks() {
    return window.localStorage
          ? JSON.parse(localStorage.getItem('books'))
          : null;
  }
}