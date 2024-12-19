import { useRef, useEffect, useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { Mail, X, CheckCircle2 } from 'lucide-react'

const emailClients = [
  {
    name: 'Gmail',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/7/7e/Gmail_icon_%282020%29.svg',
    instructions: `
      <h3>How to add your signature in Gmail:</h3>
      <ol>
        <li>Step 1: Instructions will be added here</li>
        <li>Step 2: Instructions will be added here</li>
        <li>Step 3: Instructions will be added here</li>
      </ol>
    `
  },
  {
    name: 'Outlook',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/d/df/Microsoft_Office_Outlook_%282018%E2%80%93present%29.svg',
    instructions: `
      <h3>How to add your signature in Outlook:</h3>
      <ol>
        <li>Step 1: Instructions will be added here</li>
        <li>Step 2: Instructions will be added here</li>
        <li>Step 3: Instructions will be added here</li>
      </ol>
    `
  },
  {
    name: 'Apple Mail',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/2/21/Apple_Mail.svg',
    instructions: `
      <h3>How to add your signature in Apple Mail:</h3>
      <ol>
        <li>Step 1: Instructions will be added here</li>
        <li>Step 2: Instructions will be added here</li>
        <li>Step 3: Instructions will be added here</li>
      </ol>
    `
  },
  {
    name: 'iPhone/iPad',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg',
    instructions: `
      <h3>How to add your signature on iPhone/iPad:</h3>
      <ol>
        <li>Step 1: Instructions will be added here</li>
        <li>Step 2: Instructions will be added here</li>
        <li>Step 3: Instructions will be added here</li>
      </ol>
    `
  },
  {
    name: 'Samsung Mail',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/2/27/Samsung_Logo.svg',
    instructions: `
      <h3>How to add your signature in Samsung Mail:</h3>
      <ol>
        <li>Step 1: Instructions will be added here</li>
        <li>Step 2: Instructions will be added here</li>
        <li>Step 3: Instructions will be added here</li>
      </ol>
    `
  },
  {
    name: 'Thunderbird',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/e/e1/Thunderbird_Logo%2C_2018.svg',
    instructions: `
      <h3>How to add your signature in Thunderbird:</h3>
      <ol>
        <li>Step 1: Instructions will be added here</li>
        <li>Step 2: Instructions will be added here</li>
        <li>Step 3: Instructions will be added here</li>
      </ol>
    `
  },
  {
    name: 'Windows Mail',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/5/5f/Windows_logo_-_2012.svg',
    instructions: `
      <h3>How to add your signature in Windows Mail:</h3>
      <ol>
        <li>Step 1: Instructions will be added here</li>
        <li>Step 2: Instructions will be added here</li>
        <li>Step 3: Instructions will be added here</li>
      </ol>
    `
  }
]

const SignaturePreview = ({ signatureData }) => {
  const signatureRef = useRef(null)
  const previewWrapperRef = useRef(null)
  const [templateHtml, setTemplateHtml] = useState('')
  const [showInstructions, setShowInstructions] = useState(false)
  const [logoBase64, setLogoBase64] = useState('')
  const [selectedClient, setSelectedClient] = useState(null)

  // Function to convert image to base64
  const getImageAsBase64 = async (url) => {
    try {
      const response = await fetch(url)
      const blob = await response.blob()
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onloadend = () => resolve(reader.result)
        reader.onerror = reject
        reader.readAsDataURL(blob)
      })
    } catch (error) {
      console.error('Error converting image to base64:', error)
      return null
    }
  }

  useEffect(() => {
    // Load both the template and the logo
    Promise.all([
      fetch('/signature-design/signature-template.htm').then(res => res.text()),
      getImageAsBase64('/signature-design/signature-template/image001.png')
    ]).then(([html, base64Logo]) => {
      setLogoBase64(base64Logo)
      const fixedHtml = html
        .replace(/charset=windows-1252/g, 'charset=utf-8')
        .replace(/href="signature-template\//g, 'href="/signature-design/signature-template/"')
      setTemplateHtml(fixedHtml)
    }).catch(error => {
      console.error('Error loading template or logo:', error)
      if (previewWrapperRef.current) {
        previewWrapperRef.current.innerHTML = '<p class="text-destructive">Error loading signature template</p>'
      }
    })
  }, [])

  useEffect(() => {
    if (templateHtml && signatureRef.current && previewWrapperRef.current && logoBase64) {
      let modifiedHtml = templateHtml

      // Replace the image source with base64 data
      modifiedHtml = modifiedHtml.replace(
        /src="[^"]*image001\.png"/g,
        `src="${logoBase64}"`
      )

      // Capitalize positions and handle empty states
      const positionPT = signatureData.positionPT ? signatureData.positionPT.toUpperCase() : 'YOUR POSITION (PT)'
      const positionEN = signatureData.positionEN ? signatureData.positionEN.toUpperCase() : 'YOUR POSITION (EN)'
      const otherPositions = signatureData.otherPositions ? signatureData.otherPositions.toUpperCase() : ''

      const replacements = {
        '{{NAME}}': signatureData.name || 'Your Name',
        '{{POSITION_PT}}': positionPT,
        '{{POSITION_EN}}': positionEN
      }

      modifiedHtml = Object.entries(replacements).reduce(
        (html, [placeholder, value]) => html.replace(placeholder, value),
        modifiedHtml
      )

      // Handle other positions placeholder
      if (otherPositions) {
        modifiedHtml = modifiedHtml.replace(
          '{{OTHER_POSITIONS}}',
          `<span style='font-size:10.0pt;font-family:"Helvetica",sans-serif;color:#777777;letter-spacing:1.5pt;mso-font-kerning:0pt;mso-ligatures:none'>${otherPositions}</span>`
        )
      } else {
        // Remove the placeholder if no other positions
        modifiedHtml = modifiedHtml.replace('{{OTHER_POSITIONS}}', '')
      }

      // Extract only the body content
      const bodyContent = modifiedHtml.match(/<body[^>]*>([\s\S]*)<\/body>/i)?.[1] || modifiedHtml
      
      // Update both refs with the body content
      signatureRef.current.innerHTML = bodyContent
      previewWrapperRef.current.innerHTML = bodyContent
    }
  }, [templateHtml, signatureData, logoBase64])

  const copySignature = () => {
    if (signatureRef.current) {
      try {
        const range = document.createRange()
        range.selectNode(signatureRef.current)
        window.getSelection().removeAllRanges()
        window.getSelection().addRange(range)
        document.execCommand('copy')
        window.getSelection().removeAllRanges()
        setShowInstructions(true)
      } catch (err) {
        console.error('Failed to copy:', err)
        alert('Failed to copy signature. Please try again.')
      }
    }
  }

  const handleClientClick = (client) => {
    setSelectedClient(client)
  }

  const handleBackToClients = () => {
    setSelectedClient(null)
  }

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="flex flex-col space-y-1.5 p-6">
        <h3 className="text-2xl font-semibold leading-none tracking-tight">Signature Preview</h3>
        <p className="text-sm text-muted-foreground">
          Preview how your signature will look in your email client.
        </p>
      </div>
      
      <div className="p-6 pt-0">
        {/* Hidden element for copying - contains the same content as preview */}
        <div ref={signatureRef} style={{ position: 'absolute', left: '-9999px' }} />
        
        {/* Preview wrapper showing the signature content */}
        <div className="rounded-md border p-4 mb-4 overflow-auto">
          <div ref={previewWrapperRef} />
        </div>

        <button
          onClick={copySignature}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full"
        >
          <Mail className="mr-2 h-4 w-4" /> Copy Signature
        </button>
      </div>

      <Dialog.Root open={showInstructions} onOpenChange={setShowInstructions}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
          <Dialog.Content className="fixed left-[50%] top-[50%] max-h-[85vh] w-[90vw] max-w-[500px] translate-x-[-50%] translate-y-[-50%] rounded-lg bg-white shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] overflow-hidden">
            {!selectedClient ? (
              <>
                <div className="flex items-center gap-2 text-emerald-600 p-6">
                  <CheckCircle2 className="h-5 w-5" />
                  <Dialog.Title className="text-lg font-semibold">
                    Signature copied to clipboard!
                  </Dialog.Title>
                </div>
                <Dialog.Description className="px-6 text-sm text-muted-foreground mb-6">
                  Want help setting up your signature? Choose your email client for detailed instructions:
                </Dialog.Description>
                
                <div className="px-6 pb-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {emailClients.map((client) => (
                    <button
                      key={client.name}
                      onClick={() => handleClientClick(client)}
                      className="flex flex-col items-center justify-center p-3 rounded-lg border bg-white hover:bg-gray-50 transition-colors"
                    >
                      <img src={client.icon} alt={client.name} className="w-8 h-8 mb-2" />
                      <span className="text-sm">{client.name}</span>
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center bg-[#F3F3F3] px-4 py-3">
                  <button
                    onClick={handleBackToClients}
                    className="flex items-center text-sm text-gray-600 hover:text-gray-900 bg-transparent border-none outline-none cursor-pointer"
                    style={{ padding: 0 }}
                  >
                    <span className="mr-1">←</span>
                    <span>back</span>
                  </button>
                  <div className="flex items-center gap-2 ml-4">
                    <img src={selectedClient.icon} alt={selectedClient.name} className="w-5 h-5" />
                    <Dialog.Title className="text-base font-normal">
                      {selectedClient.name}
                    </Dialog.Title>
                  </div>
                </div>
                <div className="p-6">
                  {selectedClient.name === 'Outlook' ? (
                    <ol className="list-decimal pl-5 space-y-4">
                      <li>Copy the signature from this website or your inbox, then within "New" Outlook select the Settings Gear icon near the top right of the window.</li>
                      <li>Select Accounts &gt; Signatures.</li>
                      <li>Click "New Signature" and give it a name.</li>
                      <li>In the large white box paste your signature using Ctrl+V on Windows or Command+V on Mac.</li>
                      <li>Select Save when you are done.</li>
                      <li>If you want your signature to appear at the bottom of emails automatically, select which signature you would want for New Messages, and for Replies/Forwards. Then save again</li>
                    </ol>
                  ) : (
                    <div 
                      className="prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: selectedClient.instructions }}
                    />
                  )}
                </div>
              </>
            )}

            <Dialog.Close asChild>
              <button
                className="absolute right-4 top-4 p-1.5 rounded-full bg-white hover:bg-red-50 transition-colors border"
              >
                <X className="h-4 w-4 text-gray-500 hover:text-red-500" />
                <span className="sr-only">Close</span>
              </button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  )
}

export default SignaturePreview 