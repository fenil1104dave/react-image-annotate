// import React from 'react'
// import ReactDOM from 'react-dom'
// import ReactAnnotator from './ReactAnnotator'
// import 'bootstrap/dist/css/bootstrap.css'
// ReactDOM.render(<ReactAnnotator />, document.getElementById('root'))
import React from 'react';
import Annotator from './Annotator';
export default (function (props) {
  return React.createElement(Annotator, props);
});