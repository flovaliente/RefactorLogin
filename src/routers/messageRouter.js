import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
    try {
        res.render('message', { title: "Chat", style: "message.css" });
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Error retrieving messages.');
    }
    
});

export default router;