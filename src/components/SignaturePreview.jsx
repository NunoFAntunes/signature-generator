import { useRef, useEffect, useState } from 'react'

const SignaturePreview = ({ signatureData }) => {
  const signatureRef = useRef(null)
  const [templateHtml, setTemplateHtml] = useState('')
  const [showInstructions, setShowInstructions] = useState(false)

  useEffect(() => {
    // Fetch the template file from the correct path
    fetch('/signature-design/signature-template.htm')
      .then(response => response.text())
      .then(html => {
        // Fix the image path in the template to match the current structure
        const fixedHtml = html.replace(
          /src="[^"]*image001\.png"/g,
          'src="/signature-design/signature-template/image001.png"'
        ).replace(
          /href="signature-template\//g,
          'href="/signature-design/signature-template/'
        ).replace(/charset=windows-1252/g, 'charset=utf-8')
        setTemplateHtml(fixedHtml)
      })
      .catch(error => {
        console.error('Error loading template:', error)
        signatureRef.current.innerHTML = '<p class="text-red-500">Error loading signature template</p>'
      })
  }, [])

  useEffect(() => {
    if (templateHtml && signatureRef.current) {
      let modifiedHtml = templateHtml

      // Replace placeholders with actual values
      const replacements = {
        '{{NAME}}': signatureData.name || 'Your Name',
        '{{POSITION_PT}}': signatureData.positionPT || 'Your Position (PT)',
        '{{POSITION_EN}}': signatureData.positionEN || 'Your Position (EN)'
      }

      // Replace all placeholders
      modifiedHtml = Object.entries(replacements).reduce(
        (html, [placeholder, value]) => html.replace(placeholder, value),
        modifiedHtml
      )

      // Add other positions if provided
      if (signatureData.otherPositions) {
        const positionEndIndex = modifiedHtml.indexOf('</div>', modifiedHtml.indexOf(replacements['{{POSITION_EN}}']))
        if (positionEndIndex !== -1) {
          modifiedHtml = modifiedHtml.slice(0, positionEndIndex) + 
            `<br><span style="font-style: italic;">${signatureData.otherPositions}</span>` +
            modifiedHtml.slice(positionEndIndex)
        }
      }

      // Update the preview
      signatureRef.current.innerHTML = modifiedHtml
    }
  }, [templateHtml, signatureData])

  const copySignature = () => {
    if (signatureRef.current) {
      const range = document.createRange()
      range.selectNode(signatureRef.current)
      window.getSelection().removeAllRanges()
      window.getSelection().addRange(range)
      document.execCommand('copy')
      window.getSelection().removeAllRanges()
      setShowInstructions(true)
    }
  }

  const downloadSignature = () => {
    if (signatureRef.current) {
      // Get the HTML content and fix the paths to be relative
      let htmlContent = signatureRef.current.innerHTML
        .replace(/src="\/signature-design\//g, 'src="')
        .replace(/href="\/signature-design\//g, 'href="')
      
      const blob = new Blob([htmlContent], { type: 'text/html' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'signature.htm'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">Signature Preview</h2>
      
      <div className="border p-4 mb-4 bg-gray-50 overflow-auto">
        <div ref={signatureRef} className="font-sans" />
      </div>

      <button
        onClick={copySignature}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
      >
        Copy Signature
      </button>

      {showInstructions && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full">
            <h3 className="text-xl font-semibold mb-2">Signature copied to clipboard!</h3>
            <p className="text-gray-600 mb-4">Want help setting up your signature? Choose your email client for detailed instructions:</p>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                'Gmail',
                'iPhone/iPad',
                'Outlook',
                'Apple Mail',
                'Samsung Mail',
                'Thunderbird',
                'Windows Mail'
              ].map((client) => (
                <button
                  key={client}
                  onClick={() => {
                    // Here you can add specific instructions for each client
                    alert(`Instructions for ${client} will be added soon!`)
                  }}
                  className="p-3 border rounded hover:bg-gray-50 text-center"
                >
                  {client}
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowInstructions(false)}
              className="mt-6 w-full bg-gray-200 text-gray-800 py-2 px-4 rounded hover:bg-gray-300"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default SignaturePreview 