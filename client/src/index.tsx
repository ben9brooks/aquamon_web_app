import ReactDOM from 'react-dom/client'
import { App } from './App'
import { Temp } from './Temp'
import { PH } from './PH'
import { Tds } from './Tds'
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
    element: <Temp />,
    errorElement: <p>see index.tsx for errors - temp page</p>,
  },
  {
    path: '/ph',
    element: <PH />,
    errorElement: <p>see index.tsx for errors - ph page</p>,
  },
  {
    path: '/tds',
    element: <Tds />,
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
