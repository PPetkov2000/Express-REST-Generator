module.exports = `module.exports = function (error) {
  const errors = Object.values(error.errors).reduce((acc, { properties }) => {
    acc.push(properties.message)
    return acc
  }, [])
  return errors
}
`