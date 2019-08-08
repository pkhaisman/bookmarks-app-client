import React, { Component } from 'react';
import AddBookmark from './AddBookmark/AddBookmark';
import BookmarkList from './BookmarkList/BookmarkList';
import UpdateBookmark from './UpdateBookmark/UpdateBookmark'
import Nav from './Nav/Nav';
import config from './config';
import './App.css';
// import { runInContext } from 'vm';
import { Route } from 'react-router-dom'

const bookmarks = [];

class App extends Component {
  state = {
    page: 'list',
    bookmarks,
    error: null,
  };

  changePage = (page) => {
    this.setState({ page })
  }

  setBookmarks = bookmarks => {
    this.setState({
      bookmarks,
      error: null,
      page: 'list',
    })
  }

  addBookmark = bookmark => {
    this.setState({
      bookmarks: [ ...this.state.bookmarks, bookmark ],
    })
  }
  // check to see if this code works
  updateBookmark = updatedBookmark => {
    const bookmarks = this.state.bookmarks;
    const indexOfUpdatedBookmark = bookmarks.findIndex(bookmark => bookmark.id === updatedBookmark.id);
    bookmarks.splice(indexOfUpdatedBookmark, 1, updatedBookmark)
    this.setState({
      bookmarks: bookmarks
    })
  };

  componentDidMount() {
    fetch(config.API_ENDPOINT, {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        'Authorization': `Bearer ${config.API_KEY}`
      }
    })
      .then(res => {
        if (!res.ok) {
          throw new Error(res.status)
        }
        return res.json()
      })
      .then(this.setBookmarks)
      .catch(error => this.setState({ error }))
  }

  render() {
    const { bookmarks } = this.state
    return (
      <main className='App'>
        <h1>Bookmarks!</h1>
        <Nav clickPage={this.changePage} />
        <div className='content' aria-live='polite'>
          <Route
            exact
            path='/'
            render={() =>
              <BookmarkList
                bookmarks={bookmarks} 
              />}
          />
          
          <Route
            path='/add-bookmark'
            render={({ history }) => 
              <AddBookmark
                onAddBookmark={this.addBookmark}
                onClickCancel={() => history.push('/')}
              />}
          />

          <Route
            path='/update-bookmark/:id'
            render={({ history, match }) => 
              <UpdateBookmark
                match={match}
                onUpdateBookmark={this.updateBookmark}
                onClickCancel={() => history.push('/')} />
            }
          />
        </div>
      </main>
    );
  }
}

export default App;
