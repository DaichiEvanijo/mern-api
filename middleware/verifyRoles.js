const verifyRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if(!req?.roles) return res.sendStatus(401)
    const allowedRolesArray = [...allowedRoles]
    console.log(allowedRolesArray)
    console.log(`${req.roles} is about to verify`)
    const result = req.roles.map(role => allowedRolesArray.includes(role)).find(val => val===true )
    if(!result) return res.sendStatus(401)
    next()
    console.log(`${req.roles} is verified`)
  }
}

module.exports = verifyRoles