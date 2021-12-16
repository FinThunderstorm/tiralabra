import React from 'react'
import ReactDOM from 'react-dom'
import { applyMiddleware, combineReducers, createStore } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import { BrowserRouter } from 'react-router-dom'
import thunk from 'redux-thunk'
import { Provider } from 'react-redux'

import App from './App'
import departuresReducer from './reducers/departuresReducer'
import routeReducer from './reducers/routeReducer'
import loadingReducer from './reducers/loadingReducer'

const reducer = combineReducers({
    departures: departuresReducer,
    route: routeReducer,
    loading: loadingReducer,
})

const store = createStore(reducer, composeWithDevTools(applyMiddleware(thunk)))

ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </Provider>
    </React.StrictMode>,
    document.getElementById('root')
)
