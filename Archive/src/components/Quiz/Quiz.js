import React, { useEffect, useState, useRef } from 'react';

import { fetchData } from '../../actions/apiQuestions';
import { stopGame, startGame, correctAnswer, nextLevel } from '../../actions/gameLogic';
import { connect, useSelector } from "react-redux";
import ThreeLayer from '../ThreeLayer/ThreeLayer';
import QuestionItem from '../QuestionItem/QuestionItem';
import { goGreen, goRed } from '../animation';

const generateQuestions = (items, level, props, callback) => {
  return items.map((questionItem, index) => {
    return index === level && <QuestionItem key={index} category={questionItem.category} question={questionItem.question} {...props} {...questionItem} onClick={(e, isTrueButton) => { callback(e, questionItem, isTrueButton) }}></QuestionItem >
  })
}

function Quiz(props) {

  const { stopGame, startGame, correctAnswer, nextLevel, history } = props;
  const currentLevel = useSelector(state => state.gameLogic.currentLevel);
  const lastLevel = useSelector(state => state.gameLogic.lastLevel);
  const points = useSelector(state => state.gameLogic.points);
  const data = useSelector(state => state.quizApi.questions);


  const onClick = (e, item, isTrueButton) => {
    stopGame();
    setTimeout(() => {
      if (item.correct_answer === "True") {
        correctAnswer({ currentLevel, points, item });
        if (currentLevel === lastLevel) {
          history.push('/results')
        }
      }
      else {
        if (currentLevel === lastLevel) {
          history.push('/results')
          return;
        }
        nextLevel({ currentLevel });

      }
      startGame();
    }, 1500)

  }
  //UI
  const questions = generateQuestions(data, currentLevel, props, onClick);

  return (
    <>
      {questions}
      <div className="game-padding">
        <div className="tile is-parent is-vertical text-centered">
          <article className="tile is-child notification">
            <p className="subtitle">{currentLevel + 1} of 10</p>
          </article>
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
  fetchData: () => dispatch(fetchData(dispatch)),
  stopGame,
  startGame,
  correctAnswer: (payload) => dispatch(correctAnswer(payload)),
  nextLevel: (payload) => dispatch(nextLevel(payload)),
});


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Quiz);