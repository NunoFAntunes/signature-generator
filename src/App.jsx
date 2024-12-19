import { useState } from 'react'
import SignatureForm from './components/SignatureForm'
import SignaturePreview from './components/SignaturePreview'

function App() {
  const [signatureData, setSignatureData] = useState({
    name: '',
    positionPT: '',
    positionEN: '',
    otherPositions: '',
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        Email Signature Generator
      </h1>
      <div className="grid md:grid-cols-2 gap-8">
        <SignatureForm 
          signatureData={signatureData} 
          setSignatureData={setSignatureData} 
        />
        <SignaturePreview signatureData={signatureData} />
      </div>
    </div>
  )
}

export default App 