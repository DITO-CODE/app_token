import React from 'react';
import ReactDOM from 'react-dom';
import firebase from 'firebase';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

var config = {
    apiKey: "AIzaSyBb1H45Qg5H9v0fntRRi27OjkzEIJLCSZc",
    authDomain: "ditocodeexamples.firebaseapp.com",
    databaseURL: "https://ditocodeexamples.firebaseio.com",
    projectId: "ditocodeexamples",
    storageBucket: "ditocodeexamples.appspot.com",
    messagingSenderId: "96482041943"
  };
  firebase.initializeApp(config);

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
