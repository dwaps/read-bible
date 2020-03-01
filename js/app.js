import { Book } from './book.js';
import { BookService } from './book-service.js';

export class App {

  constructor() {
    this.books = [];

    setTimeout(() => document.querySelector('.container').style.display = 'block', 50);
    setTimeout(() => document.querySelector('.loading').classList.add('fade-out'), 1000);
    setTimeout(() => document.querySelector('.loading').remove(), 1100);

    this.init();
  }

  init() {
    const savedBooks = BookService.getSavedBooks();
    if (savedBooks) this.updateViewAfterDOMLoaded(savedBooks);
    
    const bookTags = document.querySelectorAll('.book');
    let currentBook = null;

    for (let i = 0; i < bookTags.length; i++) {
      const bookTag = bookTags[i];

      if (!savedBooks) {
        this.books.push(new Book(bookTag));
      }
      else {
        const b = savedBooks[i];
        this.books.push(b);
        Book.updateChapterTags(b, bookTag.querySelectorAll('input'));
      }

      currentBook = this.books[this.books.length-1];
      currentBook.html = bookTag;
      this.listenEventOnChapterCheckbox(
        currentBook,
        bookTag.querySelectorAll('[type=checkbox]')
      );
    }
      
    if (!savedBooks) BookService.saveBooks(this.books);
  }

  listenEventOnChapterCheckbox(book, chapterTags) {
    for (let i = 0; i < chapterTags.length; i++) {
      const chap = chapterTags[i];
      chap.addEventListener('click', () => {
        book.chapters.checkedChapters = new Map(book.chapters.checkedChapters);
        book.chapters.checkedChapters.set(i, chap.checked);

        const readChapters = Array.from(book.chapters.checkedChapters).filter(done => done[1])
        if (readChapters.length === book.chapters.total) {
          this.disapears(book);
        }
        BookService.saveBooks(this.books);
      });
    }
  }

  disapearsFromHTML(el) {
    el.classList.add('split');
    setTimeout(() => {
      el.style.height = 0;
    }, 700);
  }

  disapears(b) {
    this.disapearsFromHTML(b.html);
    b.state.done = true;
  }

  checkAllChaptersDone(chapters) {
    for (let chapter of chapters) {
      if (!chapter.checked) return false;
    }
    return true;
  }

  updateViewAfterDOMLoaded(savedBooks) {
    let doneBooks = [];

    if (savedBooks.length > 0) doneBooks = savedBooks.filter(b => b.state.done);

    const books = document.querySelectorAll('.book');
    books.forEach(b => {
      doneBooks.map(doneBook => {
        if (doneBook.name === b.firstElementChild.textContent) {
          b.remove();
          savedBooks.splice(savedBooks.indexOf(doneBook), 1);
        }
      });
    });
  }
}
