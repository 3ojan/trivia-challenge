import React, { useEffect } from 'react';
import { connect, useSelector } from "react-redux";
import { fetchData } from '../../actions/apiQuestions';

function Home(props) {
  const { fetchData } = props;
  const loading = useSelector(state => state.quizApi.loading);
  useEffect(() => {
    fetchData();
    return () => {
    };
  }, []);

  return (
    loading ? <div className="tile is-parent is-vertical text-centered">
      <article className="streched">
        <p className="subtitle">Loading.....</p>
      </article>
    </div> : <div className="home-wrapper">
        <div className="tile is-parent is-vertical text-centered">
          <article className="streched">
            <p className="title">WELCOME</p>
            <p className="subtitle">You will be preseneted with 10 true or false questions.</p>
          </article>
        </div>
        <div className="tile is-parent is-vertical text-centered">
          <article className="tile is-child notification is-custom streched">
            <p className="title">Can you score 100% ?</p>
          </article>
        </div>
        <div className="tile is-parent is-vertical text-centered">
          <article className="streched">
            <a className="button is-warning is-outlined" onClick={() => {
              props.history.push('/quiz');
            }}>BEGIN</a>
          </article>
        </div>
      </div>
  );
}

const mapStateToProps = state => {
  const { questions } = state;
  return { questions: questions };
};

const mapDispatchToProps = dispatch => ({
  fetchData: () => dispatch(fetchData(dispatch)),
});


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);

