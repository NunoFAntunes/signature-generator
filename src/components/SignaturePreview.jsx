import { useRef } from 'react'

const SignaturePreview = ({ signatureData }) => {
  const signatureRef = useRef(null)

  const copySignature = () => {
    const range = document.createRange()
    range.selectNode(signatureRef.current)
    window.getSelection().removeAllRanges()
    window.getSelection().addRange(range)
    document.execCommand('copy')
    window.getSelection().removeAllRanges()
    alert('Signature copied to clipboard!')
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">Signature Preview</h2>
      
      <div className="border p-4 mb-4 bg-gray-50">
        <div ref={signatureRef} className="font-sans">
          <div className="mb-4">
            <div className="font-bold text-gray-800 text-lg">
              {signatureData.name || 'Your Name'}
            </div>
            <div className="text-gray-700 font-semibold">
              {signatureData.positionPT || 'Your Position (PT)'} | {signatureData.positionEN || 'Your Position (EN)'}
            </div>
            {signatureData.otherPositions && (
              <div className="text-gray-600 mt-1">{signatureData.otherPositions}</div>
            )}
          </div>
          
          <div className="text-gray-700 space-y-1">
            <div className="font-semibold">
              Luís Silva Morais & ASSOCIADOS,<br />
              Sociedade de Advogados, SP,RL
            </div>
            <div>T: +351 217 166 615</div>
            <div>Avenida da Liberdade, 258 – 3º andar</div>
            <div>1250-149 Lisboa</div>
            <div className="mt-2">
              <a href="http://www.lsmadvogados.com" className="text-blue-600 hover:underline">www.lsmadvogados.com</a>
              {' | '}
              <a href="https://www.linkedin.com/company/lu%C3%ADs-silva-morais-&-associados/" className="text-blue-600 hover:underline">Follow us on LinkedIn</a>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={copySignature}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
      >
        Copy Signature
      </button>
    </div>
  )
}

export default SignaturePreview 