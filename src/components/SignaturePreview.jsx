import { useRef, useEffect, useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { Mail, X } from 'lucide-react'

const emailClients = [
  {
    name: 'Gmail',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/7/7e/Gmail_icon_%282020%29.svg'
  },
  {
    name: 'Outlook',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/d/df/Microsoft_Office_Outlook_%282018%E2%80%93present%29.svg'
  },
  {
    name: 'Apple Mail',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/2/21/Apple_Mail.svg'
  },
  {
    name: 'iPhone/iPad',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg'
  },
  {
    name: 'Samsung Mail',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/2/27/Samsung_Logo.svg'
  },
  {
    name: 'Thunderbird',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/e/e1/Thunderbird_Logo%2C_2018.svg'
  },
  {
    name: 'Windows Mail',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/5/5f/Windows_logo_-_2012.svg'
  }
]

const SignaturePreview = ({ signatureData }) => {
  const signatureRef = useRef(null)
  const [templateHtml, setTemplateHtml] = useState('')
  const [showInstructions, setShowInstructions] = useState(false)

  useEffect(() => {
    fetch('/signature-design/signature-template.htm')
      .then(response => response.text())
      .then(html => {
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
        signatureRef.current.innerHTML = '<p class="text-destructive">Error loading signature template</p>'
      })
  }, [])

  useEffect(() => {
    if (templateHtml && signatureRef.current) {
      let modifiedHtml = templateHtml

      const replacements = {
        '{{NAME}}': signatureData.name || 'Your Name',
        '{{POSITION_PT}}': signatureData.positionPT || 'Your Position (PT)',
        '{{POSITION_EN}}': signatureData.positionEN || 'Your Position (EN)'
      }

      modifiedHtml = Object.entries(replacements).reduce(
        (html, [placeholder, value]) => html.replace(placeholder, value),
        modifiedHtml
      )

      if (signatureData.otherPositions) {
        const positionEndIndex = modifiedHtml.indexOf('</div>', modifiedHtml.indexOf(replacements['{{POSITION_EN}}']))
        if (positionEndIndex !== -1) {
          modifiedHtml = modifiedHtml.slice(0, positionEndIndex) + 
            `<br><span style="font-style: italic;">${signatureData.otherPositions}</span>` +
            modifiedHtml.slice(positionEndIndex)
        }
      }

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

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="flex flex-col space-y-1.5 p-6">
        <h3 className="text-2xl font-semibold leading-none tracking-tight">Signature Preview</h3>
        <p className="text-sm text-muted-foreground">
          Preview how your signature will look in your email client.
        </p>
      </div>
      
      <div className="p-6 pt-0">
        <div className="rounded-md border bg-muted p-4 mb-4">
          <div ref={signatureRef} className="font-sans" />
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
          <Dialog.Content className="fixed left-[50%] top-[50%] max-h-[85vh] w-[90vw] max-w-[500px] translate-x-[-50%] translate-y-[-50%] rounded-lg bg-white p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]">
            <Dialog.Title className="text-lg font-semibold">
              Signature copied to clipboard!
            </Dialog.Title>
            <Dialog.Description className="mt-2 mb-4 text-sm text-muted-foreground">
              Want help setting up your signature? Choose your email client for detailed instructions:
            </Dialog.Description>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {emailClients.map((client) => (
                <button
                  key={client.name}
                  onClick={() => {
                    // Add specific instructions for each client
                    alert(`Instructions for ${client.name} will be added soon!`)
                  }}
                  className="flex flex-col items-center justify-center p-3 rounded-lg border hover:bg-accent transition-colors"
                >
                  <img src={client.icon} alt={client.name} className="w-8 h-8 mb-2" />
                  <span className="text-sm">{client.name}</span>
                </button>
              ))}
            </div>

            <Dialog.Close asChild>
              <button
                className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
              >
                <X className="h-4 w-4" />
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