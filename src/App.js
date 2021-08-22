import React, { useRef, useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';

import * as tf from "@tensorflow/tfjs";
import * as qna from "@tensorflow-models/qna";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";
import {Fragment} from "react";

const App = () => {

  const passageRef = useRef(null);
  const questionRef = useRef(null);
  const [answer, setAnswer] = useState();
  const [model, setModel] = useState(null);

  // Async function loading the tensorflow Q&A model
  const loadModel = async () => {
    const loadedModel = await qna.load()
    setModel(loadedModel);
    console.log('Model loaded')
  }

  // Runs the async function for loading the model with an empty array after to stop it from reloading during rerendering
  useEffect(() => { loadModel() }, [])

  const answerQuestion = async (e) => {
    if (e.which === 13 && model !== null) { // If the event of enter button AKA "13" is pressed and the model has loaded..
      console.log('Question has been submitted') 
      const passage = passageRef.current.value 
      const question = questionRef.current.value

      const answers = await model.findAnswers(question, passage) // Passing the passage and question as references to the Q&A model
      setAnswer(answers) // Takes the answers and pushes the information to the answer state
      console.log(answers)
    }
  }


  return (
    <div className="App">
      <header className="App-header">
      { model == null ? 
      // Ternary operator checking if the model is null -> if model is null, loader spinner function appears
        <div> 
          <div>Machine Learning Model is Loading..</div>
          <Loader
            type="Puff"
            color="#00BFFF"
            height={100}
            width={100}/>
        </div>
        :
        // -> if model is not null (has loaded) fragment function runs to define UI
        <Fragment>
          Passage
          <textarea ref={passageRef} rows="30" cols="100"></textarea>
          Ask a Question
          <input ref={questionRef} onKeyPress={answerQuestion} size="80"></input>
          Answers
          {answer ? answer.map((answer, index) => <div> <b> Answer {index + 1} - </b> {answer.text} ({ Math.floor(answer.score * 100) / 100 }) </div>) : ""}
        </Fragment> 
    }
    
        </header>
    </div>
  );
}

export default App