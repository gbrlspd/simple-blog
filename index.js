const express = require('express');
const app = express();
const session = require('express-session');
const bodyParser = require('body-parser');
const connection = require('./database/database');
const UsersController = require('./users/UsersController');
const User = require('./users/User');
const CategoriesController = require('./categories/CategoriesController');
const Category = require('./categories/Category');
const ArticlesController = require('./articles/ArticlesController');
const Article = require('./articles/Article');
const {default: slugify} = require('slugify');

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(session({
    secret: 'test',
    cookie: {maxAge: 3600000}
}));

app.use('/', UsersController);
app.use('/', CategoriesController);
app.use('/', ArticlesController);

connection.authenticate().then(() => {
    console.log('Connected to database!');
}).catch((error) => {
    console.log(error);
});

app.get('/', (req, res) => {
    Article.findAll({
        order: [['id', 'desc']],
        limit: 5
    }).then(articles => {
        Category.findAll().then(categories => {
            res.render('index', {articles: articles, categories: categories});
        });
    });
});

app.get('/:slug', (req, res) => {
    var slug = req.params.slug;
    Article.findOne({
        where: {slug: slug}
    }).then(article => {
        if(article != undefined) {
            Category.findAll().then(categories => {
                res.render('article', {article: article, categories: categories});
            });
        } else {
            res.redirect('/');
        }
    });
});

app.get('/category/:slug', (req, res) => {
    var slug = req.params.slug;
    Category.findOne({
        where: {slug: slug},
        include: [{model: Article}]
    }).then(category => {
        if(category != undefined) {
            Category.findAll().then(categories => {
                res.render('index', {articles: category.articles, categories: categories});
            });
        } else {
            res.redirect('/');
        }
    });
});

app.listen(3000, () => {
    console.log('Server running on port 3000...');
});