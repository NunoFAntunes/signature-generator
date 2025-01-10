import { useRef, useEffect, useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { Mail, X, CheckCircle2, Eye } from 'lucide-react'

const emailClients = [
  {
    name: 'Gmail',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/7/7e/Gmail_icon_%282020%29.svg',
    instructions: `
      <ol>
        <li>Copie a assinatura deste Web site ou da sua caixa de entrada e, em seguida, no Gmail, clique no ícone de engrenagem no canto superior direito do ecrã e escolha Definições.</li>
        <li>Clique no botão “Ver todas as definições”</li>
        <li>No separador Geral, desloque-se para baixo até à secção “Assinatura”.</li>
        <li>Clique em “Criar novo” e dê um nome à sua assinatura.</li>
        <li>No campo de texto, cole sua assinatura usando Ctrl+V no Windows ou Command+V no Mac.</li>
        <li>Na parte inferior da página, clique em Guardar alterações.</li>
      </ol>
    `
  },
  {
    name: 'Outlook',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/d/df/Microsoft_Office_Outlook_%282018%E2%80%93present%29.svg',
    instructions: {
      classic: {
        title: 'Outlook (Classic)',
        steps: [
          'No Microsoft Outlook, no canto superior esquerdo, carregar em Ficheiro > Opções (canto inferior esquerdo) > Correio > Assinaturas.',
          'No popup, selecionar Mail (correio) > Assinaturas (botão à direita).',
          'Clique em "Nova" e dê um nome à assinatura (por exemplo: "Assinatura LSMAdvogados").',
          'No campo de texto, cole sua assinatura usando Ctrl+V no Windows ou Command+V no Mac.',
          'Selecione Salvar quando estiver pronto.',
          'Selecione a nova assinatura salva para ser usada em novas mensagens e respostas, nos dois campos de seleção e salve novamente.'
        ]
      },
      new: {
        title: 'Outlook (New)',
        steps: [
          'No Outlook, selecione o ícone de configurações, junto ao canto superior direito da janela.',
          'Selecione Contas > Assinaturas.',
          'Clique em "Nova Assinatura" e renomeie a assinatura (por exemplo: "Assinatura LSMAdvogados").',
          'No campo de texto, cole sua assinatura usando Ctrl+V no Windows ou Command+V no Mac.',
          'Selecione Salvar.',
          'Selecione a nova assinatura salva para ser usada em novas mensagens e respostas, nos dois campos de seleção e salve novamente.'
        ]
      },
      web: {
        title: 'Outlook (Web)',
        steps: [
          'No Web site do Outlook, selecione o ícone da engrenagem de definições junto ao canto superior direito da página.',
          'Selecione Correio > Compor e responder.',
          'Clique em “Nova assinatura” e dê-lhe um nome.',
          'Na caixa branca grande, cole a sua assinatura utilizando Ctrl+V no Windows ou Command+V no Mac.',
          'Selecione Guardar quando tiver terminado.',
          'Selecione a assinatura que pretende para Novas mensagens e para Respostas/Reencaminhamentos e, em seguida, guarde novamente.'
        ]
      }
    }
  },
  {
    name: 'Apple Mail',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/4/4e/Mail_%28iOS%29.svg',
    instructions: `
      <ol>
        <li>Na aplicação Mail do seu Mac, selecione Mail > Preferências.</li>
        <li>Clique no separador “Assinaturas”.</li>
        <li>Na coluna da esquerda, selecione a conta de e-mail onde pretende utilizar a assinatura.</li>
        <li>Clique no botão “Mais” abaixo da coluna do meio.</li>
        <li>Na coluna do meio, escreva um nome para a assinatura.</li>
        <li>Desmarque a caixa “Corresponder sempre ao tipo de letra predefinido da minha mensagem”</li>
        <li>Na coluna da direita (a pré-visualização), cole a assinatura utilizando as teclas Command+V.</li>
        <li>Pode acontecer que as imagens não sejam exibidas corretamente. Isto trata-se de um erro do Apple Mail. Quando começar a compor uma nova mensagem de correio eletrónico, as imagens funcionarão.</li>
      </ol>
    `
  },
  {
    name: 'Samsung Mail',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/d/de/Samsung_Email_icon.png',
    instructions: `
      <ol>
        <li>Na aplicação Samsung Mail, toque no ícone do menu superior esquerdo com três barras.</li>
        <li>Toque no ícone de engrenagem das definições no canto superior direito.</li>
        <li>Toque na conta onde pretende aplicar a assinatura.</li>
        <li>Nas definições da conta, active a assinatura e toque em para a editar.</li>
        <li>Para colar a assinatura, no canto superior direito do teclado, toque nos três pontos e selecione a área de transferência e, em seguida, procure a assinatura a colar.</li>
      </ol>
    `
  },
  {
    name: 'Thunderbird',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/e/e1/Thunderbird_Logo%2C_2018.svg',
    instructions: `
      <ol>
        <li>No Thunderbird, selecione Ferramentas > Definições de conta.</li>
        <li>No painel esquerdo, clique em selecionar a conta para a qual pretende utilizar a assinatura.</li>
        <li>Localize a área “Texto da assinatura”.</li>
        <li>Selecione a caixa “Utilizar HTML”.</li>
        <li>Cole a sua assinatura na caixa de texto utilizando Ctrl+V no Windows ou Command+V no Mac.</li>
        <li>Ela aparecerá como código HTML, o que é o correto.</li>
        <li>As margens vermelhas à volta da sua assinatura são apenas da pré-visualização! Quando a mensagem de correio eletrónico for enviada, não aparecerá para o destinatário da mensagem.</li>
      </ol>
    `
  },
  {
    name: 'Windows Mail',
    icon: 'https://static.wikia.nocookie.net/logopedia/images/c/c9/Mail_Win10X.png',
    instructions: `
      <ol>
        <li>Copie a assinatura deste sítio Web ou da sua caixa de entrada e, em seguida, no Windows Mail, perto da parte inferior da barra lateral esquerda, clique no ícone “Engrenagem”.</li>
        <li>Isto fará aparecer uma barra de “Definições”, perto do meio da qual deverá encontrar “Assinatura”.</li>
        <li>O Windows Mail só suporta uma única assinatura. Coloque a opção “Utilizar uma assinatura de e-mail” em “Ligado”.</li>
        <li>Cole a assinatura na caixa Editar assinatura utilizando Ctrl+V.</li>
        <li>Escolha “Guardar” para manter a nova assinatura e regressar à caixa de entrada.</li>
      </ol>
    `
  }
]

const SignaturePreview = ({ signatureData }) => {
  const signatureRef = useRef(null)
  const previewWrapperRef = useRef(null)
  const emailPreviewRef = useRef(null)
  const [templateHtml, setTemplateHtml] = useState('')
  const [showInstructions, setShowInstructions] = useState(false)
  const [logoBase64, setLogoBase64] = useState('')
  const [selectedClient, setSelectedClient] = useState(null)
  const [outlookVersion, setOutlookVersion] = useState('new')
  const [showEmailPreview, setShowEmailPreview] = useState(false)
  const [processedSignature, setProcessedSignature] = useState('')

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

  // Function to minify HTML by removing unnecessary whitespace and newlines
  const minifyHtml = (html) => {
    return html
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .replace(/>\s+</g, '><') // Remove spaces between tags
      .replace(/\s+>/g, '>') // Remove spaces before closing bracket
      .replace(/<\s+/g, '<') // Remove spaces after closing bracket
      .trim() // Remove leading/trailing whitespace
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
    if (templateHtml && logoBase64) {
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
          `${otherPositions}`
        )
      } else {
        // Remove the placeholder if no other positions
        modifiedHtml = modifiedHtml.replace('{{OTHER_POSITIONS}}', '')
      }

      // Extract only the body content
      const bodyContent = modifiedHtml.match(/<body[^>]*>([\s\S]*)<\/body>/i)?.[1] || modifiedHtml
      
      // Update refs with the body content
      if (signatureRef.current) {
        signatureRef.current.innerHTML = bodyContent
      }
      if (previewWrapperRef.current) {
        previewWrapperRef.current.innerHTML = bodyContent
      }
      if (emailPreviewRef.current) {
        emailPreviewRef.current.innerHTML = bodyContent
      }

      // Store the processed HTML for later use
      setProcessedSignature(bodyContent)
    }
  }, [templateHtml, signatureData, logoBase64])

  const copySignature = () => {
    if (signatureRef.current) {
      try {
        const minifiedHtml = minifyHtml(signatureRef.current.innerHTML)
        
        // Create a blob with HTML content
        const blob = new Blob([minifiedHtml], { type: 'text/html' })
        const htmlItem = new ClipboardItem({
          'text/html': blob,
          'text/plain': new Blob([minifiedHtml], { type: 'text/plain' })
        })

        // Use the new Clipboard API to write both HTML and plain text
        navigator.clipboard.write([htmlItem]).then(() => {
          setShowInstructions(true)
        }).catch((err) => {
          console.error('Failed to copy using Clipboard API:', err)
          // Fallback for older browsers
          const container = document.createElement('div')
          container.innerHTML = minifiedHtml
          document.body.appendChild(container)
          const range = document.createRange()
          range.selectNodeContents(container)
          const selection = window.getSelection()
          selection.removeAllRanges()
          selection.addRange(range)
          document.execCommand('copy')
          document.body.removeChild(container)
          setShowInstructions(true)
        })
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

  const renderInstructions = (client) => {
    if (client.name === 'Outlook') {
      return (
        <div className="space-y-4">
          <div className="flex justify-center border-b mb-6">
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
              {['new', 'classic', 'web'].map((version) => (
                <button
                  key={version}
                  onClick={() => setOutlookVersion(version)}
                  className={`px-3 py-2 text-sm bg-transparent border-none outline-none cursor-pointer relative whitespace-nowrap ${
                    outlookVersion === version 
                      ? 'text-[#00A4EF] after:absolute after:bottom-[-1px] after:left-0 after:right-0 after:h-[2px] after:bg-[#00A4EF]' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {client.instructions[version].title}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-6">
            {client.instructions[outlookVersion].steps.map((step, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full border-2 border-[#00A4EF] text-[#00A4EF] flex items-center justify-center font-medium bg-white">
                  {index + 1}
                </div>
                <div className="flex-1 pt-1">
                  <p className="text-gray-700">{step}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    }

    return (
      <div className="space-y-6">
        {client.instructions.split('</li>').map((step, index) => {
          if (!step.includes('<li>')) return null;
          const content = step.split('<li>')[1];
          if (!content) return null;
          
          return (
            <div key={index} className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full border-2 border-[#00A4EF] text-[#00A4EF] flex items-center justify-center font-medium bg-white">
                {index + 1}
              </div>
              <div className="flex-1 pt-1">
                <p className="text-gray-700">{content}</p>
              </div>
            </div>
          );
        }).filter(Boolean)}
      </div>
    )
  }

  // Update email preview when dialog opens
  useEffect(() => {
    if (showEmailPreview && emailPreviewRef.current && processedSignature) {
      setTimeout(() => {
        if (emailPreviewRef.current) {
          emailPreviewRef.current.innerHTML = processedSignature
        }
      }, 100)
    }
  }, [showEmailPreview, processedSignature])

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm w-full overflow-hidden">
      <div className="flex flex-col space-y-1.5 p-3 sm:p-6">
        <h3 className="text-2xl font-semibold leading-none tracking-tight">Pré-visualização da Assinatura</h3>
        <p className="text-sm text-muted-foreground">
          Veja como sua assinatura vai ficar no seu email.
        </p>
      </div>
      
      <div className="p-3 sm:p-6 pt-0">
        {/* Hidden element for copying - contains the same content as preview */}
        <div ref={signatureRef} style={{ position: 'absolute', left: '-9999px' }} />
        
        {/* Preview wrapper showing the signature content */}
        <div className="rounded-md border p-2 sm:p-4 mb-4 overflow-x-auto">
          <div ref={previewWrapperRef} style={{ width: 'min(fit-content, 100%)', minWidth: '300px' }} />
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={copySignature}
            className="flex-1 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
          >
            <Mail className="mr-2 h-4 w-4" /> Copiar Assinatura
          </button>
          <button
            onClick={() => setShowEmailPreview(true)}
            className="sm:w-1/3 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground hover:bg-secondary/90 h-10 px-4 py-2"
          >
            <Eye className="mr-2 h-4 w-4" /> Ver em Email
          </button>
        </div>
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
                    Assinatura copiada!
                  </Dialog.Title>
                </div>
                <Dialog.Description className="px-6 text-sm text-muted-foreground mb-6">
                  Precisa de ajuda para configurar sua assinatura? Escolha seu email para ver as instruções detalhadas:
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
                <div className="flex items-center justify-between px-4 py-3 border-b">
                  <button
                    onClick={handleBackToClients}
                    className="flex items-center text-sm text-gray-600 hover:text-gray-900 bg-transparent border-none outline-none cursor-pointer"
                    style={{ padding: 0 }}
                  >
                    <span className="mr-1">←</span>
                    <span>Voltar</span>
                  </button>
                  <div className="flex items-center gap-2 absolute left-1/2 -translate-x-1/2">
                    <img src={selectedClient.icon} alt={selectedClient.name} className="w-5 h-5" />
                    <Dialog.Title className="text-base font-normal">
                      {selectedClient.name}
                    </Dialog.Title>
                  </div>
                  <Dialog.Close asChild>
                    <button
                      className="p-1.5 rounded-full bg-white hover:bg-red-50 transition-colors border"
                    >
                      <X className="h-4 w-4 text-gray-500 hover:text-red-500" />
                      <span className="sr-only">Close</span>
                    </button>
                  </Dialog.Close>
                </div>
                <div className="p-6">
                  {renderInstructions(selectedClient)}
                </div>
              </>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Email Preview Dialog */}
      <Dialog.Root open={showEmailPreview} onOpenChange={setShowEmailPreview}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
          <Dialog.Content className="fixed left-[50%] top-[50%] max-h-[85vh] w-[90vw] max-w-[800px] translate-x-[-50%] translate-y-[-50%] rounded-lg bg-white shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50">
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-gray-500" />
                <Dialog.Title className="text-base font-medium">
                  Nova Mensagem
                </Dialog.Title>
              </div>
              <Dialog.Close asChild>
                <button
                  className="p-1.5 rounded-full hover:bg-gray-200 transition-colors"
                >
                  <X className="h-4 w-4 text-gray-500" />
                  <span className="sr-only">Close</span>
                </button>
              </Dialog.Close>
            </div>
            <div className="p-4 space-y-3 border-b">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 w-16">Para:</span>
                <div className="flex-1 text-sm text-gray-800 px-2 py-1 bg-gray-100 rounded">
                  destinatario@email.com
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 w-16">Assunto:</span>
                <div className="flex-1 text-sm text-gray-800 px-2 py-1 bg-gray-100 rounded">
                  Exemplo de Email com Assinatura
                </div>
              </div>
            </div>
            <div className="p-4 space-y-4 max-h-[50vh] overflow-y-auto">
              <div className="text-sm text-gray-800">
                Prezado(a),<br /><br />
                Este é um exemplo de como a sua assinatura aparecerá num email.<br /><br />
                Atenciosamente,
              </div>
              <div className="border-t pt-4">
                <div 
                  ref={emailPreviewRef}
                  className="signature-preview"
                  dangerouslySetInnerHTML={{ __html: processedSignature }}
                />
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  )
}

export default SignaturePreview 