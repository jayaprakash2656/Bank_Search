import React from 'react';
import ReactDOM from 'react-dom';
import Bank from './bankSearch/index';
import * as serviceWorker from './serviceWorker';

//import css
import './index.css';
import 'bootstrap/dist/css/bootstrap.css';

ReactDOM.render(<Bank />, document.getElementById('root'));

serviceWorker.unregister();
