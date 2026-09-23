import express from "express";
import type { Express, Request, Response } from "express";
import {z} from "zod";

const app: Express = express();
const PORT: number = 8081;

app.use(express.json());

const createProdutoShema = z.object({
    nomeProduto: z.string().min(3),
    precoProduto: z.coerce.number().positive()
});

type Produto ={
    id: string,
    nome: string,
    preco: number
}

app.post("/produtos", (req: Request, res: Response)=>{
    try {
        
        const {nomeProduto, precoProduto} = createProdutoShema.parse(req.body);

        res.status(201).json({
            message: `Produto ${nomeProduto} - R$ ${precoProduto} foi criado com sucesso!`
        });

    } catch (error) {
        
        if (error instanceof z.ZodError) {
            return res.status(400).json({
                erro: "Os parâmetros enviados são inválidos"
            })
        }

        console.error("Erro ao salvar o produto:", error);
        res.status(500).json({
            erro: "Erro interno no servidor ao cadastrar produto"
        });

    }
});

app.listen(PORT, ()=>{
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});