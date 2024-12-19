const SignatureForm = ({ signatureData, setSignatureData }) => {
  const handleChange = (e) => {
    const { name, value } = e.target
    setSignatureData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">Enter Your Information</h2>
      <form className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Full Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={signatureData.name}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
            placeholder="John Doe"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="positionPT" className="block text-sm font-medium text-gray-700">
              Position (Portuguese)
            </label>
            <input
              type="text"
              id="positionPT"
              name="positionPT"
              value={signatureData.positionPT}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
              placeholder="Desenvolvedor Senior"
            />
          </div>

          <div>
            <label htmlFor="positionEN" className="block text-sm font-medium text-gray-700">
              Position (English)
            </label>
            <input
              type="text"
              id="positionEN"
              name="positionEN"
              value={signatureData.positionEN}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
              placeholder="Senior Developer"
            />
          </div>
        </div>

        <div>
          <label htmlFor="otherPositions" className="block text-sm font-medium text-gray-700">
            Other Positions
          </label>
          <input
            type="text"
            id="otherPositions"
            name="otherPositions"
            value={signatureData.otherPositions}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
            placeholder="PhD, Professor"
          />
        </div>
      </form>
    </div>
  )
}

export default SignatureForm 