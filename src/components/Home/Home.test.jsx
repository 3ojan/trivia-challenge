import React from "react";
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';
import Home from "./Home";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import initalState from "../../reducers/quizApi"
import { act } from 'react-dom/test-utils';

let container = null;
const mockStore = configureStore();
const mockCallback = jest.fn();
const store = mockStore({
  fetchData: mockCallback,
  history: {
    push: mockCallback,
  },
  quizApi: initalState,
});

describe('Home component', () => {
  it("will render", () => {
    const component = renderer.create(
      <Provider store={store}>
        <Home></Home>
      </Provider>
    );

    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();

  });
  it("has button button", () => {
    container = document.createElement('div');
    ReactDOM.render(<Provider store={store}>
      <Home history={{ push: jest.fn }}></Home>
    </Provider >, container);
    const button = container.querySelector('.button');
    expect(button.className).toBe('button is-warning is-outlined')
  });

});
