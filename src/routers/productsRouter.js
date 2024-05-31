import { Router } from 'express';
//import ProductManagerFS from '../clases/ProductManagerFS.js';
import ProductManagerDB from '../dao/ProductManagerDB.js';
import { uploader } from '../utils/multerUtil.js';
import productModel from '../dao/models/productModel.js';

const productsRouter = Router();

const productManager = new ProductManagerDB();

const buildResponse = (data) => { 
    return {
        status: 'success',
        payload: data.docs.map( (product) => product.toJSON()),
        totalPages: data.totalPages,
        prevPage: data.prevPage,
        nextPage: data.nextPage,
        page: data.page,
        hasPrevPage: data.hasPrevPage,
        hasNextPage: data.nextPage,
        prevLink: data.hasPrevPage ? `http://localhost:8080/api/products?limit=${data.limit}&page=${data.prevPage}${data.category ? `&category=${data.category}` : ""}${data.stock ? `&stock=${data.stock}` : ""}` : "",
        nextLink: data.hasNextPage ? `http://localhost:8080/api/products?limit=${data.limit}&page=${data.nextPage}${data.category ? `&category=${data.category}` : ""}${data.stock ? `&stock=${data.stock}` : ""}` : ""
    };
};

// -Get products-
productsRouter.get('/', async (req, res) =>{
    try {
        const { page = 1, limit = 10, category, stock, query, sort } = req.query;
        const options = { page, limit, sort: { price: sort || "asc"} };
        const criteria = {};
        const user = req.session.user;
        //console.log(user);

        if(category){
            criteria.category = category;
        }

        if(query){
            query = JSON.parse(query);
            criteria.query = query;
        }

        const products = await productManager.getProducts(criteria, options);
        const response = buildResponse({ ...products, category, stock });
        //const products = await productModel.paginate(criteria, options);
    
        res.render("products", { ...response, user });
        //res.render("products", buildResponse({ ...products, category, stock }), user);

    } catch (error) {
        res.status(500).send('Internal server error.');
    }
    
});

// -Get product by id-
productsRouter.get('/:pid', async (req, res) =>{ 
    try {
        const { pid } = req.params;
        const product = await productManager.getProductById(pid);
        
        if(product){
            res.status(200).send(product);
        }else{
            res.status(404).send({
                status: 'error',
                message: `Product ${pid} not found.`
            });
        }
    } catch (error) {
        res.status(400).send({
            status: 'error',
            message: error.message
        });
    }
});

// -Add product
productsRouter.post('/', uploader.array('thumbnails', 3), async (req, res) => {
    if(req.files){
        req.body.thumbnails = [];
        req.files.forEach( (file) => {
            req.body.thumbnails.push(file.filename);
        });
    }
    console.log(req.body);
    try {
        const result = await productManager.addProduct(req.body);
        
        res.status(200).send({
            status: 'success',
            payload: result
        });
    } catch (error) {
        res.status(400).send({
            status: 'error',
            message: error.message
        });
    }
});

// -Update product
productsRouter.put('/:pid', uploader.array('thumbnails', 3), async (req, res) => {
    if(req.files){
        req.body.thumbnails = [];
        req.files.forEach( (file) => {
            req.body.thumbnails.push(file.filename);
        });
    }

    try{
        const { pid } = req.params;
        const updated = await productManager.updateProduct(pid, req.body);
        res.status(200).send({
            status: 'success',
            payload: updated
        });
    } catch(error){
        res.status(400).send({
            status: 'error',
            message: error.message
        });
    }
});

// -Delete product
productsRouter.delete('/:pid', async (req, res) => {
    try{
        const { pid } = req.params;
        await productManager.deleteProduct(pid);
        res.status(200).send({
            status: 'Product successfully deleted.'});
    }catch (error){
        res.status(404).send({
            status: 'error',
            message: error.message
        });
    }
});

export default productsRouter;