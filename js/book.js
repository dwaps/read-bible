export class Book {
  constructor(html) {
    this.name = html.firstElementChild.textContent;
    this.chapters = {
      total: html.querySelectorAll('[type=checkbox]').length,
      checkedChapters: new Map()
    };
    this.state = { done: false };
  }

  static updateChapterTags({ chapters: { checkedChapters }}, chapterTags) {
    for (let [ num, chapterState ] of checkedChapters) {
      chapterTags[num].checked = chapterState;
    }
  }
  
  static updateChapterState(index, done) {
    this.state.chapters.checkedChapters[index] = done;
  }
}