import React, { Component } from  'react';
import config from '../config'
// import './UpdateBookmark.css';
import { Redirect } from 'react-router-dom';

class UpdateBookmark extends Component {
    state = {
        redirect: false,
        title: '',
        url: '',
        description: '',
        rating: 1
    }

    componentDidMount() {
        const bookmarkId = this.props.match.params.id;
        fetch(`http://localhost:8000/api/bookmarks/${bookmarkId}`, {
            method: 'GET',
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${config.API_KEY}`
            }
        })
            .then(response => response.json())
            .then(responseJson => {
                this.setState({
                    ...responseJson
                })
            })
            .catch(error => console.log(error))
    }

    setTitle = (title) => {
        this.setState({
            title: title
        })
    }

    setUrl = (url) => {
        this.setState({
            url: url
        })
    }

    setDescription = (description) => {
        this.setState({
            description: description
        })
    }

    setRating = (rating) => {
        this.setState({
            rating: rating
        })
    }

    handleSubmit = (e) => {
        e.preventDefault();

        const bookmarkId = this.props.match.params.id;
        fetch(`http://localhost:8000/api/bookmarks/${bookmarkId}`, {
            method: 'PATCH',
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${config.API_KEY}`
            },
            body: JSON.stringify(this.state)
        })
            .then(res => {
                if (!res.ok) {
                    // get the error message from the response,
                    return res.json().then(error => {
                        // then throw it
                        throw error
                    })
                }
                this.setState({ redirect: true })
                const updatedBookmark = {
                    title: this.state.title,
                    url: this.state.url,
                    // Manish. How does this exist?
                    // key: this.state.id,
                    // why is this necessary? since the state of App changes then BookmarkList and BookmarkItem gets reran and BookmarkItem should set the key to equal the id
                    description: this.state.description,
                    rating: this.state.rating,
                }
                return updatedBookmark
            })
            .then(updatedBookmark => {
                this.props.onUpdateBookmark(updatedBookmark)
            })
            .catch(error => console.log(error))
    }

    render() {
        const { redirect, title, url, description, rating } = this.state;

        if (redirect) {
            return <Redirect to={'/'} />
        }

        return (
            <section className='UpdateBookmark'>
                <h2>Edit Bookmark</h2>
                <form 
                    onSubmit={this.handleSubmit}
                    className='UpdateBookmark__form' 
                >
                    <div className='UpdateBookmark__error'></div>
                    <div>
                        <label htmlFor='title'>
                            Title
                        </label>
                        <input
                            type='text'
                            name='title'
                            id='title'
                            value={title}
                            onChange={(e) => this.setTitle(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor='url'>
                            Url
                        </label>
                        <input
                            type='text'
                            name='url'
                            id='url'
                            value={url}
                            onChange={(e) => this.setUrl(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor='description'>
                            Description
                        </label>
                        <input
                            type='text'
                            name='description'
                            id='description'
                            value={description ? description : ''}
                            onChange={(e) => this.setDescription(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor='rating'>
                            Rating
                        </label>
                        <input
                            type='number'
                            name='rating'
                            id='rating'
                            value={rating}
                            onChange={(e) => this.setRating(e.target.value)}
                            required
                        />
                    </div>
                    <div className='UpdateBookmark__buttons'>
                        <button type='button' onClick={this.props.onClickCancel}>
                            Cancel
                        </button>
                        {' '}
                        <button type='submit'>
                            Save
                        </button>
                    </div>
                </form>
            </section>
        )
    }
}

export default UpdateBookmark;