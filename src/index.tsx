import ReactDOM from 'react-dom/client'
import { App } from './App'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import * as React from 'react'

const router = createBrowserRouter([
  {
    path: '/main_window',
    element: <App />,
    errorElement: <p>see index.tsx for errors - home page</p>,
  },
  {
    path: '/temp',
    element: <div>temp page </div>,
    errorElement: <p>see index.tsx for errors - temp page</p>,
  },
  {
    path: '/ph',
    element: <div>ph page </div>,
    errorElement: <p>see index.tsx for errors - ph page</p>,
  },
  {
    path: '/tds',
    element: <div>tds page </div>,
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
