import React from 'react'
import ReactDOM from 'react-dom'
import { applyMiddleware, combineReducers, createStore } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import { BrowserRouter } from 'react-router-dom'
import thunk from 'redux-thunk'
import { Provider } from 'react-redux'
import { ThemeProvider, createTheme } from '@mui/material/styles'

import App from './App'
import departuresReducer from './reducers/departuresReducer'
import routeReducer from './reducers/routeReducer'
import loadingReducer from './reducers/loadingReducer'
import errorReducer from './reducers/errorReducer'

const reducer = combineReducers({
    departures: departuresReducer,
    route: routeReducer,
    loading: loadingReducer,
    error: errorReducer,
})

const store = createStore(reducer, composeWithDevTools(applyMiddleware(thunk)))
const theme = createTheme({
    palette: {
        type: 'dark',
        primary: {
            main: '#00bfa5',
        },
        secondary: {
            main: '#dd2c00',
        },
        error: {
            main: '#ff0000',
        },
        warning: {
            main: '#ffff00',
        },
        info: {
            main: '#03a9f4',
        },
        success: {
            main: '#00ea00',
        },
    },
})

ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <BrowserRouter>
                <ThemeProvider theme={theme}>
                    <App />
                </ThemeProvider>
            </BrowserRouter>
        </Provider>
    </React.StrictMode>,
    document.getElementById('root')
)
