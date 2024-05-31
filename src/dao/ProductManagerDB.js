import productModel from './models/productModel.js';

class ProductManagerDB {
    
    async addProduct(product){
        const { title, description, code, price, stock, category, thumbnails } = product;
        
        if(!title || !description || !code || !price || !stock || ! category){
            throw new Error(`Error creating product.....`);
        }

        try {
            const result = await productModel.create({ title, description, code, price, stock, category, thumbnails: thumbnails ?? [] });
            //console.log(result);
            console.log(`Product created successfully.`);
            return result;
        } catch (error) {
            console.error(error.message);
            throw new Error(`Error creating product.`);
        }
    }

    async getProducts(criteria, options){
        try {
            //return await productModel.find();
            return await productModel.paginate(criteria, options);
        } catch (error) {
            console.error(error.message);
            throw new Error(`Error trying to find products.`);
        }
    }

    async getProductById(pid){
        const product = await productModel.findOne({ _id: pid });

        if (!product)
            throw new Error(`Product with id: ${pid} do not exist.`);

        return product;
    }

    async updateProduct(pid, updatedProduct){
        try {
            const result = await productModel.updateOne({ _id: pid }, updatedProduct);
            console.log(`Product with id: ${pid} updated successfully ♻️`);
            return result;
        } catch (error) {
            console.error(error.message);
            throw new Error(`Error updating product.`);
        }
    }

    async deleteProduct(pid){
        try {
            const result = await productModel.deleteOne({ _id: pid })

            if(result.deletedCount === 0){
                throw new Error(`Product with id: ${pid} do not exist.`);
            }else{
              console.log(`Product with id: ${pid} deleted successfully.`);  
            }

            return result;
        } catch (error) {
            console.log(error.message);
            throw new Error(`Error deleting product ${pid}.`);
        }
    }
}

export default ProductManagerDB;