const pool = require('./config')
const bcryptjs = require('bcryptjs')
var salt = bcryptjs.genSaltSync(10);


let operations = {

    list: function(){
        return pool.promise().query('select * from alunos')
    },
    findById(id) {
        return pool.promise().query('select * from alunos where id=?', [id])
    },
    findByUsername: function(username){
        return pool.promise().query('select * from alunos where login=?', [username])

    },
    save: function(aluno) {
        var hash = bcryptjs.hashSync(aluno.senha, salt)
        return pool.promise().execute('INSERT INTO alunos (nome, login, email, senha, curso) VALUES (?, ?, ?, ?, ?)', [aluno.nome, aluno.login, aluno.email, hash, aluno.curso])
    },
    update: function(aluno) {
        var hash = bcryptjs.hashSync(aluno.senha, salt)
        return pool.promise().execute('UPDATE alunos set nome=?, login =?, email=?, senha=?, curso=? where id=?',
        [aluno.nome, aluno.login, aluno.email, hash, aluno.curso, aluno.id])
    },
    remove: function(id) {
        return pool.promise().execute('delete from alunos where id= ?', [id])
    },
    search: function(nome) {
        return pool.promise().query('select * from alunos where nome like ?', [ '%'+nome+'%'])
    }

}

module.exports = operations
