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
    <div className="min-h-screen bg-background">
      <div className="container py-10">
        <div className="flex flex-col items-center mb-8">
          <img 
            src="/signature-design/signature-template/image001.png" 
            alt="Company Logo" 
            className="h-16 mb-4"
          />
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-center">
            Email Signature Generator
          </h1>
          <p className="text-muted-foreground mt-2 text-center max-w-[700px]">
            Generate your professional email signature with your personal information while maintaining the company's branding.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <SignatureForm 
            signatureData={signatureData} 
            setSignatureData={setSignatureData} 
          />
          <SignaturePreview signatureData={signatureData} />
        </div>
      </div>
    </div>
  )
}

export default App 