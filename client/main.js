import ReactDOM from 'react-dom';
import React from 'react';
import App from './App';
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:3000/';

ReactDOM.render(<App />, document.getElementById('root'));
