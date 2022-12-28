let bcrypt = require('bcryptjs')
password = '1234'

var salt = bcrypt.genSaltSync(10);
var hash = bcrypt.hashSync(password, salt)


console.log(password)
console.log(hash)
console.log(bcrypt.compareSync(password, hash))

