const express = require('express')
const router = express.Router()
const passport = require('passport')
var dao = require('../database/dao')

router.get('/', async function(request, response){

    let row = {
        id:'',
        nome:'',
        login:'',
        email:'',
        senha:'',
        curso:''
    }

    if ( request.query.id){
        [result] = await dao.findById(request.query.id)
        console.log(result)
        row = result[0]
        console.log(row)
    }
    response.render('alunos/form', { aluno: row})    
});


module.exports = router;