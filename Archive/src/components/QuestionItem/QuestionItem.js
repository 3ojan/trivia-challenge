
import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap/gsap-core';
import { rotateY, show, hide, goRed, goGreen } from '../animation';
import { connect, useSelector } from "react-redux";
import { stopGame, startGame, correctAnswer, nextLevel } from '../../actions/gameLogic';

function QuestionItem(props) {
  const { category, question, history, progress, onClick } = props;
  const { stopGame, startGame, correctAnswer, nextLevel, correct_answer } = props;

  let titleRefElement = useRef(null);
  let questionRefElement = useRef(null);
  let buttonsRefElement = useRef(null);
  let questionBGRefElement = useRef(null);
  let rotateTween;

  const gameActive = useSelector(state => state.gameLogic.gameActive);
  const [titleAnimation, setTitleAnimation] = useState();
  const [questionTextAnimation, setQuestionTextAnimation] = useState();
  const [cardAnimation, setCardAnimation] = useState();
  const [buttonsAnimation, setButtonsAnimation] = useState();

  useEffect(() => {
    //animations
    const rotateTween = rotateY(titleRefElement.current, 1);
    const showQuestionTween = show(questionRefElement.current, 1);
    showQuestionTween.pause();
    const showButtonsAnimation = show(buttonsRefElement.current, 1);
    showButtonsAnimation.pause();

    //animate title
    setTitleAnimation(
      rotateTween
    );

    //start game
    setTimeout(() => {
      //show question
      setQuestionTextAnimation(showQuestionTween);
      showQuestionTween.play();
      //show buttons
      setButtonsAnimation(showButtonsAnimation);
      showButtonsAnimation.play();
      startGame();
    }, 1000);

    return () => {
    };
  }, []);

  const animateQuestion = (isGood) => {
    isGood ? goGreen(questionBGRefElement.current, 1) : goRed(questionBGRefElement.current, 1);
  }

  const element = document.createElement("div");
  element.innerHTML = question;

  return (
    <div className="home-wrapper" >
      <div className="tile is-parent is-vertical text-centered not-streched">
        <article className="tile is-child is-custom notification ">
          <p className="subtitle" ref={titleRefElement}>{category}</p>
        </article>
      </div>
      <div className="tile is-parent is-vertical text-centered" >
        <article className="tile is-child notification is-custom streched" ref={questionBGRefElement} >
          <p className="subtitle" ref={questionRefElement}>{element.innerHTML}</p>
        </article>
      </div >
      <div className="tile is-parent is-vertical text-centered" ref={buttonsRefElement}>
        <article className="tile is-child answer-box">
          {gameActive && <a className="button is-success is-outlined" onClick={(e) => {
            stopGame();
            gsap.killTweensOf(rotateTween)
            titleAnimation.pause(0, true)
            titleAnimation.play();
            animateQuestion(correct_answer === "True")
            onClick(e, true)
          }}>TRUE</a>}
          {gameActive && <a className="button is-danger is-outlined" onClick={(e) => {
            animateQuestion(correct_answer !== "True")
            stopGame();
            onClick(e)
          }}>FALSE</a>}
        </article>
        {/* <progress class="progress is-primary" value={progress} max="100">{progress}%</progress> */}
      </div >

    </div >
  );
}

const mapStateToProps = state => {
  const { questions, gameLogic } = state;
  return { questions, gameLogic };
};

const mapDispatchToProps = dispatch => ({
  stopGame: (payload) => dispatch(stopGame(payload)),
  startGame: (payload) => dispatch(startGame(payload)),
});


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(QuestionItem);