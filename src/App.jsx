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
      <div className="mx-auto w-[min(100%-1rem,1280px)] py-6 sm:py-10">
        <div className="flex flex-col items-center mb-6 sm:mb-8">
          <img 
            src="/signature-design/signature-template/image001.png" 
            alt="Company Logo" 
            className="h-12 sm:h-16 mb-6 sm:mb-8"
          />
          <h1 className="scroll-m-20 text-3xl sm:text-4xl font-extrabold tracking-tight lg:text-5xl text-center">
            Gerar Assinatura de Email
          </h1>
        </div>

        <div className="grid lg:grid-cols-2 gap-4 sm:gap-8 w-full">
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