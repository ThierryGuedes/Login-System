const express = require('express');
const { session } = require('passport');
const router = express.Router()
const passport = require('passport')


/* GET login page. */
router.get('/', (req, res, next) => {
    if (req.query.fail)
        res.render('login', { message: 'Usuário e/ou senha incorretos!' })

    

    else
        res.render('login', { message: null })
        session: true;
        return next

        
});

/* POST login page */
router.post('/',
    passport.authenticate('local', { 
        successRedirect: '/alunos', 
        failureRedirect: '/login',
        session: false
    })
);

module.exports = router;
