import React, { useEffect, useState, useRef } from 'react';

import { fetchData } from '../../actions/apiQuestions';
import { restart, stopGame } from '../../actions/gameLogic';
import { connect, useSelector } from "react-redux";
import ThreeLayer from '../ThreeLayer/ThreeLayer';
import ResultItem from '../QuestionItem/ResultItem';
import { goGreen, goRed } from '../animation';

const generateQuestions = (items, level, props, callback) => {
  return items.map((questionItem, index) => {
    return <ResultItem key={index} category={questionItem.category} question={questionItem.question} {...props} {...questionItem}></ResultItem >
  })
}

function Results(props) {

  const { stopGame, restart, history } = props;
  const currentLevel = useSelector(state => state.gameLogic.currentLevel);
  const points = useSelector(state => state.gameLogic.points);
  const data = useSelector(state => state.quizApi.questions);

  const questions = generateQuestions(data, currentLevel, props);
  return (
    <>
      <div className="tile is-parent is-vertical text-centered fixed-scroll">
        <div className="home-wrapper">
          <div className="tile is-child notification">
            <p className="subtitle">YOU SCORED</p>
            <p className="subtitle">{points} / 10</p>
          </div>
        </div>
        {questions}
        <div className="home-wrapper">
          <a className="button is-warning is-outlined" onClick={() => {
            restart();
            stopGame();
            history.push('/');
          }}>Play Again?</a>
        </div>
      </div>
    </>
  );
}


const mapStateToProps = state => {
  const { questions, gameLogic } = state;
  return { questions, gameLogic };
};

const mapDispatchToProps = dispatch => ({
  restart: (payload) => dispatch(restart(payload)),
  stopGame: (payload) => dispatch(stopGame(payload)),
});


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Results);