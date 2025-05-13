// app/layout.js
import './globals.css'
import { UserProvider } from '../context/UserContext'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <UserProvider>
          {children}
        </UserProvider>
      </body>
    </html>
  )
}
