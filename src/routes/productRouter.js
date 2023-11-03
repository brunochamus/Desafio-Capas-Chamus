import { Router } from "express";
const router = Router();
import ProductManager from "../dao/controller/productManager.js";

const pm = new ProductManager();


router.get('/products/', async (req, res) => {
    const { limit, page, sort, query } = req.query;

    const sortObject = {
        asc: { price: 1 },
        desc: { price: -1 },
    };

    const modelQuery = query ? JSON.parse(query) : {};
    const modelLimit = limit ? parseInt(limit, 10) : 10;
    const modelPage = page ? parseInt(page, 10) : 1;
    const modelSort = sortObject[sort] ?? undefined;

    const product = await pm.pageProducts(modelQuery, modelLimit, modelPage, modelSort);
    res.send(product)
})



router.get('/products/:pid', async (req, res) => {
    const pid = req.params.pid;
    const prod = await pm.getProductsById(pid);

    if (prod) {
        res.send(prod)
    } else {
        res.status(404).send();
    }
})

router.post('/products/', async (req, res) => {
    const { title, description, category, price, thumbnail, code, stock } = req.body;

    if (pm) {
        try {
            const newProduct = await pm.addProduct(title, description, category, price, thumbnail, code, stock);
            res.send(newProduct);
        } catch (error) {
            res.status(500).send("Error adding product");
        }
    } else {
        res.status(400).send("Incomplete or no product manager");
    }
});

router.put('/products/:pid', async (req, res) => {
    const pid = req.params.pid;
    const update = req.body;

    await pm.updateProducts(pid, update);

    res.send('Updated successfully')
})

router.delete('/products/:pid', async (req, res) => {
    const pid = req.params.pid;
    await pm.deleteProducts(pid);
    res.send('Delete Product')
})

export default router;
