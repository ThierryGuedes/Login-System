const { request, response } = require('express');
var express = require('express')
var router = express.Router();
var dao = require('../database/dao')



router.get('/', function(request, response){
    dao.list().then( ([rows]) => {
        response.render('alunos/list', {alunos: rows})
    }).catch( err => {
        console.log(err)
        response.render('alunos/list', {alunos: [] })
    })   
});

router.post('/delete', function(request, response){
    dao.remove(request.body.id)
    .then( ([result]) => {
        if (result.affectedRows > 0)
            request.flash('sucess', 'Aluno excluido com sucesso')
        else
            request.flash('sucess', 'Já foi apagado')
        response.redirect('/alunos')

    }).catch(err =>{
        console.log(err)
        request.flash('error', 'Ocorreu um erro.')
        response.redirect('/alunos')
    })
    
})




router.post('/save', function (request, response){
    console.log(request.body)

    
    if (request.body.id){
        operacao = dao.update
        success = 'Edicão feita com sucesso'
    }else{
        operacao = dao.save
        success = 'Cadastro feito com sucesso'

    }


    operacao(request.body)
    .then( ([result]) => {
        request.flash('sucess', success)
        response.redirect('/alunos')
    }).catch( err =>{
        request.flash('error', 'Cadastro nao finalizado')
        response.redirect('/alunos')
    })

    
})

router.get('/search', function(request, response) {
    
    if (request.query.nome){
        dao.search(request.query.nome)
        .then( ([rows]) =>{
            response.render('alunos/list', { alunos: rows })
        }).catch( err => {
            console.log(err)
            request.flash('error','Nao foi possivel')
            response.redirect('/alunos')
        })
    }else{
        response.redirect('/alunos')

    }

    
})


module.exports = router;