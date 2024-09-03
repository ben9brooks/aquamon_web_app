import ReactDOM from 'react-dom/client'
import { App } from './App'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import * as React from 'react'

const router = createBrowserRouter([
  {
    path: '/main_window',
    element: <App />,
  },
  {
    path: '/temp',
    element: <div>temp page </div>,
  },
  {
    path: '/ph',
    element: <div>ph page </div>,
  },
  {
    path: '/tds',
    element: <div>tds page </div>,
  },
])

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)

// ReactDOM.render(<App />, document.getElementById('root'))
