import React from "react"
import { RouterProvider, createHashRouter } from "react-router-dom"

import Root from "./routers/Root"

import "../index.css"

import PublishContent from "./routers/PublishContent"
import Settings from "./routers/Settings"
import PublishHistory from "./routers/PublishHistory"

const router = createHashRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        index: true,
        element: <PublishContent />
      },
      {
        path: "/setting",
        element: <Settings />
      },
      {
        path: "/history",
        element: <PublishHistory />
      },
    ]
  }
])

export default function options() {
  return (
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  )
}
