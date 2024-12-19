import { Input } from "./ui/input"

const SignatureForm = ({ signatureData, setSignatureData }) => {
  const handleChange = (e) => {
    const { name, value } = e.target
    setSignatureData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="flex flex-col space-y-1.5 p-6">
        <h3 className="text-2xl font-semibold leading-none tracking-tight">Informação Pessoal</h3>
        <p className="text-sm text-muted-foreground">
          Preencha suas informações para gerar sua assinatura de email.
        </p>
      </div>
      <div className="p-6 pt-0 space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Nome Completo
          </label>
          <Input
            id="name"
            name="name"
            value={signatureData.name}
            onChange={handleChange}
            placeholder="John Doe"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Posição (Português)
            </label>
            <Input
              id="positionPT"
              name="positionPT"
              value={signatureData.positionPT}
              onChange={handleChange}
              placeholder="Advogado"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Posição (Inglês)
            </label>
            <Input
              id="positionEN"
              name="positionEN"
              value={signatureData.positionEN}
              onChange={handleChange}
              placeholder="Lawyer"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Outras Posições
          </label>
          <Input
            id="otherPositions"
            name="otherPositions"
            value={signatureData.otherPositions}
            onChange={handleChange}
            placeholder="Doutorado, Professor"
          />
        </div>
      </div>
    </div>
  )
}

export default SignatureForm 