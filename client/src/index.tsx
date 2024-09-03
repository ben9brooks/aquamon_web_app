import ReactDOM from 'react-dom/client'
import { App } from './App'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import * as React from 'react'
import { Link } from 'react-router-dom'

const router = createBrowserRouter([
  {
    path: '/main_window',
    element: <App />,
    errorElement: <p>see index.tsx for errors - home page</p>,
  },
  {
    path: '/temp',
    element: <Link to={`/main_window`}>temp page </Link>,
    errorElement: <p>see index.tsx for errors - temp page</p>,
  },
  {
    path: '/ph',
    element: <Link to={`/main_window`}>ph page </Link>,
    errorElement: <p>see index.tsx for errors - ph page</p>,
  },
  {
    path: '/tds',
    element: <Link to={`/main_window`}>tds page </Link>,
    errorElement: <p>see index.tsx for errors - tds page</p>,
  },
])

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)

// ReactDOM.render(<App />, document.getElementById('root'))
