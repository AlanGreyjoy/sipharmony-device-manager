module.exports.showEndpoint = data => {
  const headersSection = data.slice(
    1,
    data.indexOf(
      '=========================================================================================='
    )
  )
  const valuesSectionStart =
    data.indexOf(
      '=========================================================================================='
    ) + 1
  const valuesSectionEnd = data.indexOf(' ParameterName                      : ParameterValue')
  const valuesSection = data
    .slice(valuesSectionStart, valuesSectionEnd)
    .filter(line => line.trim() !== '')
  const parametersSectionStart =
    data.indexOf(' ParameterName                      : ParameterValue') + 1
  const parametersSection = data.slice(parametersSectionStart)

  const headers = headersSection.reduce((acc, line) => {
    const match = line.match(/^\s*(\S+):\s*(.*)$/)
    if (match) {
      const [, key, value] = match
      acc[key.trim()] = value.trim()
    }
    return acc
  }, {})

  const combinedHeadersValues = {}
  Object.keys(headers).forEach(key => {
    combinedHeadersValues[key] = {}
  })

  valuesSection.forEach(line => {
    const match = line.match(/^\s*(\S+):\s*(.*)$/)
    if (match) {
      const [, key, value] = match
      if (key in combinedHeadersValues) {
        const parts = headers[key].split(/\s\s+/)
        const values = value.split(/\s\s+/)
        parts.forEach((part, index) => {
          combinedHeadersValues[key][part.trim()] = values[index] ? values[index].trim() : ''
        })
      } else {
        combinedHeadersValues[key] = value.trim()
      }
    }
  })

  const parameters = parametersSection.reduce((acc, line) => {
    const match = line.match(/^\s*(\S.*?)\s*:\s*(.*?)\s*$/)
    if (match) {
      const [, paramName, paramValue] = match
      acc[paramName.trim()] = paramValue.trim()
    }
    return acc
  }, {})

  return {
    ...combinedHeadersValues,
    ...parameters
  }
}
