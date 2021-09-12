import React, { useRef, useEffect, useState } from 'react'
import './App.css'

import * as tf from "@tensorflow/tfjs"
import * as qna from "@tensorflow-models/qna"
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"
import { TextField, Button, Typography } from "@material-ui/core"
import Loader from "react-loader-spinner"

const App = () => {

  const passageRef = useRef(null)
  const questionRef = useRef(null)
  const [answer, setAnswer] = useState()
  const [model, setModel] = useState(null)

  // Async function loading the tensorflow Q&A model
  const loadModel = async () => {
    const loadedModel = await qna.load()
    setModel(loadedModel)
    console.log('Model loaded')
  }

  // Runs the async function for loading the model with an empty array after to stop it from reloading during rerendering
  useEffect(() => { loadModel() }, [])

  const answerQuestion = async () => {
    if (model !== null) {
      // If the event of enter button AKA "13" is pressed and the model has loaded..
      console.log('Question has been submitted')
      const passage = passageRef.current.value
      const question = questionRef.current.value

      const answers = await model.findAnswers(question, passage)
      // Passing the passage and question as references to the Q&A model

      setAnswer(answers)
      // Takes the answers and pushes the information to the answer state. Console logging the results
      console.log(answers)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      answerQuestion()
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        {model == null ?
          // Ternary operator checking if the model is null -> if model is null, loader spinner function appears
          <div>
            <Typography variant="h3" color="textPrimary" style={{ fontWeight: 600 }}>loading BERT model...</Typography>
            <Loader
              type="Puff"
              color="#2886E7"
              height={200}
              width={200}
            />
          </div>
          :
          // -> if model is not null (has loaded) fragment function runs to define UI
          <>
            <Typography variant="h2" style={{ fontWeight: 600 }}>{`BERT Bot`}</Typography>
            <TextField
              label="Text passage (paste your own content here)"
              variant="outlined"
              multiline
              maxRows={10}
              margin="dense"
              inputRef={passageRef}
              style={{ width: 700 }}
              defaultValue={`In probability theory and statistics, Bayes' theorem (alternatively Bayes' law or Bayes' rule; recently Bayes–Price theorem[1]:44, 45, 46 and 67), named after the Reverend Thomas Bayes, describes the probability of an event, based on prior knowledge of conditions that might be related to the event.[2] For example, if the risk of developing health problems is known to increase with age, Bayes' theorem allows the risk to an individual of a known age to be assessed more accurately (by conditioning it on their age) than simply assuming that the individual is typical of the population as a whole. One of the many applications of Bayes' theorem is Bayesian inference, a particular approach to statistical inference. When applied, the probabilities involved in the theorem may have different probability interpretations. With Bayesian probability interpretation, the theorem expresses how a degree of belief, expressed as a probability, should rationally change to account for the availability of related evidence. Bayesian inference is fundamental to Bayesian statistics.`}
            />

            <div className="question">
              <TextField
                margin="dense"
                variant="outlined"
                label="Ask a question"
                inputRef={questionRef}
                style={{ width: 600 }}
                type="text"
                defaultValue="What is Bayes' theorem?"
                onKeyPress={handleKeyPress}
              />
              <Button style={{ margin: "8px 0 4px 6px" }} variant="outlined" onClick={answerQuestion} type="submit">submit</Button>
            </div>


            <div className="answer-container">
              <Typography variant="h4" style={{ fontWeight: 600 }}>Answers</Typography>
              <div>
                {answer ? answer.map((answer, index) => <Typography align="left" paragraph="true"> <b>{index + 1}.</b> {answer.text}  (Confidence level: {Math.floor(answer.score * 100) / 100}) </Typography>) : ""}
              </div>
            </div>
          </>
        }

      </header>
    </div>
  )
}

export default App