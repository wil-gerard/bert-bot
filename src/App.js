import React, { useRef, useEffect, useState } from 'react'
import logo from './logo.svg'
import './App.css'

import * as tf from "@tensorflow/tfjs"
import * as qna from "@tensorflow-models/qna"
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"
import Loader from "react-loader-spinner"

const App = () => {

  const passageRef = useRef(null)
  const questionRef = useRef(null);
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

  // e.which === 13 // does the event handler (e) have a key code property (which) of 13?

  // const handleKeyPress = e => {
  //   if (e.keyCode === 13) {
  //     this.btn.click()
  //   }
  // } 

  const answerQuestion = async () => {
    if (model !== null) { // If the event of enter button AKA "13" is pressed and the model has loaded..
      console.log('Question has been submitted') 
      const passage = passageRef.current.value 
      const question = questionRef.current.value

      const answers = await model.findAnswers(question, passage) // Passing the passage and question as references to the Q&A model
      setAnswer(answers) // Takes the answers and pushes the information to the answer state. Console logging the results
      console.log(answers)
    }
  }


  return (
    <div className="App">
      <header className="App-header">
      { model == null ? 
      // Ternary operator checking if the model is null -> if model is null, loader spinner function appears
        <div> 
          <div className="loader-text">BERT is Loading...</div>
          <Loader
            type="Puff"
            color="#2886E7"
            height={100}
            width={100}
            />
        </div>
        :
        // -> if model is not null (has loaded) fragment function runs to define UI
        <>
        <h1>{`BERT Q&A`}</h1>
          <textarea ref={passageRef} rows="30" cols="100" defaultValue={`The discography of Black Sabbath, an English heavy metal band, includes 19 studio albums, eight live albums, 16 compilation albums, seven video albums, one extended play and 30 singles. The band was formed in 1968 by John "Ozzy" Osbourne (vocals), Tony Iommi (lead guitar), Terence "Geezer" Butler (bass guitar), and Bill Ward (drums). Throughout their history, the band experienced multiple lineup changes.[1] Though the second most recent line-up of the band to work together were Ronnie James Dio, Vinny Appice, Iommi, and Butler, for three new songs for a compilation in 2007, the original line-up was still considered the "current" lineup at the time and had been since their reunion in 1997. The 2007 sessions were deemed a one-off which led to the Heaven and Hell side project, resulting in a new studio album in 2009 titled The Devil You Know. In June 2013, a partial reformation of the original line-up released 13, which was the first album to feature Osbourne on vocals since 1978's Never Say Die!. After 49 years together, Black Sabbath announced their breakup in March 2017.`}></textarea>
          <div>Ask a Question</div>
          <input ref={questionRef} size="80" type="text" placeholder="Ask BERT a question" defaultValue="When was Black Sabbath formed?"></input>
          <button onClick={answerQuestion} type="submit">submit</button>
          <div>
            <div>Answers</div>
            <div>
              {answer ? answer.map((answer, index) => <div> <b> Answer {index + 1} - </b> {answer.text} Confidence level: { Math.floor(answer.score * 100) / 100 } </div>) : ""}
            </div>
          </div> 
        </> 
    }
    
        </header>
    </div>
  )
}

export default App