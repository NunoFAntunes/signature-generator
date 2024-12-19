import { useRef, useEffect, useState } from 'react'

const SignaturePreview = ({ signatureData }) => {
  const signatureRef = useRef(null)
  const [templateHtml, setTemplateHtml] = useState('')

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
        )
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
      alert('Signature copied to clipboard!')
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

      <div className="space-y-2">
        <button
          onClick={copySignature}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
        >
          Copy Signature
        </button>
        <button
          onClick={downloadSignature}
          className="w-full bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors"
        >
          Download Signature File
        </button>
      </div>
    </div>
  )
}

export default SignaturePreview 