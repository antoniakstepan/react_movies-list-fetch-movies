import PropTypes from 'prop-types';
import React, { useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';

import { MovieCard } from '../MovieCard';
import { request } from '../../api/api';

export const FindMovie = ({ addMovie, movies }) => {
  const [newMovie, setMovie] = useState('');
  const [buttonVisible, setButtonVisible] = useState(true);
  const [title, setTitle] = useState('');
  const [error, setError] = useState(true);
  const [isdisable, setIsdisable] = useState(false);

  const findMovie = async() => {
    const movie = await request(title);

    if (movie.Title) {
      const selectMovie = {
        title: movie.Title,
        imdbId: movie.imdbID,
        imgUrl: movie.Poster,
        description: movie.Plot,
        imbdUrl: `https://www.imdb.com/title/${movie.imdbID}`,
      };

      const movieCheck = movies.some(
        item => item.imdbId === selectMovie.imdbId,
      );

      setTitle('');
      setIsdisable(movieCheck);
      setMovie(selectMovie);
      setButtonVisible(false);
    } else {
      setError(true);
    }
  };

  const changeTitle = (event) => {
    setTitle(event.target.value);
    setError(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    setMovie('');
    setButtonVisible(true);

    if (isdisable) {
      return;
    }

    addMovie(newMovie);
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={handleSubmit}
      >
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={classNames('input', { 'is-danger': error })}
              value={title}
              onChange={changeTitle}
            />
          </div>

          <p className={classNames(
            'help', 'is-danger', { 'is-hidden': !error },
          )}
          >
            Can&apos;t find a movie with such a title
          </p>
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              className="button is-light"
              onClick={findMovie}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              disabled={buttonVisible}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        { newMovie && (<MovieCard {...newMovie} />)}
      </div>
    </>
  );
};

FindMovie.propTypes = {
  addMovie: PropTypes.func.isRequired,
  movies: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      imgUrl: PropTypes.string,
      imdbUrl: PropTypes.string,
      imdbId: PropTypes.string.isRequired,
    }),
  ),
};

FindMovie.defaultProps = {
  movies: [],
};
