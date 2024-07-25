import express, { Request, Response } from 'express';
import path from 'path';
import { CodeSonifier } from './codeSonifier';

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static('public'));

app.get('/', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/sonify', (req: Request, res: Response) => {
    const { code } = req.body;
    const sonifiedCode = new CodeSonifier();
    const result = sonifiedCode.sonify(code);
    res.json(result);
});

app.listen(port, () => {
    console.log(`koshi joor, bami ni port: ${port}`);
});
