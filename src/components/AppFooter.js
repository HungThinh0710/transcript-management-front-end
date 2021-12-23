import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  return (
    <CFooter>
      <div>
        <a href="https://transcript.hungthinhit.com" target="_blank" rel="noopener noreferrer">
          Transcript Management
        </a>
        <span className="ms-1"> | Diploma Project &copy; 2021.</span>
      </div>
      <div className="ms-auto">
        <span className="me-1">Powered by</span>
        <a href="https://hungthinhit.com" target="_blank" rel="noopener noreferrer">
          Hưng Thịnh aka Phoenix
        </a>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
