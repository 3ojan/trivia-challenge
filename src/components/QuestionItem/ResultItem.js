
import React, { useRef, useEffect } from 'react';
import { goColor } from '../animation';
import { connect } from "react-redux";

function ResultItem(props) {
  const { question, userReallyKnowsTheAnswer } = props;
  console.log(props)
  let questionRefElement = useRef(null);
  let questionBGRefElement = useRef(null);

  useEffect(() => {
    setTimeout(() => {
      animateQuestion(userReallyKnowsTheAnswer)
    }, 1000);
    return () => {
    };
  }, []);

  const animateQuestion = (isGood) => {
    isGood ? goColor(questionBGRefElement.current, 1, '#0A6F0A') : goColor(questionBGRefElement.current, 1, '#FF0000');
  }

  const element = document.createElement("div");
  element.innerHTML = question;

  return (
    <div className="home-wrapper" >
      <div className="tile is-parent is-vertical text-centered" >
        <article className="tile is-child notification is-custom streched" ref={questionBGRefElement} >
          <p className="subtitle" ref={questionRefElement}>{element.innerHTML}</p>
        </article>
      </div >
    </div >
  );
}

const mapStateToProps = state => {
  const { questions, gameLogic } = state;
  return { questions, gameLogic };
};

const mapDispatchToProps = dispatch => ({
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ResultItem);