const prisma = require('../../prisma/client');
const { pipeline } = require('@xenova/transformers');

// function gerarRespostaSimulada(pergunta) {
//     const respostasMock = [
//         "Não tenho certeza, mas acredito que sim.",
//         "Essa informação está no dataset!",
//         "A resposta é 42.",
//         "Talvez seja necessário mais contexto.",
//         "Essa é uma excelente pergunta, pense nisso!"
//     ];

//     // Usa palavra-chave da pergunta (mock)
//     if (pergunta.toLowerCase().includes("população")) {
//         return "A população estimada é de 74 mil habitantes.";
//     }

//     const aleatoria = respostasMock[Math.floor(Math.random() * respostasMock.length)];
//     return aleatoria;
// }

const registerQuery = async (req, res) => {
    const { pergunta, datasetId } = req.body;

    if (!pergunta) {
        return res.status(400).json({ error: 'Campo "pergunta" é obrigatório.' });
    }

    try {

        const records = await prisma.record.findMany({
            where: { datasetId },
            take: 300
        });

        if (records.length === 0) {
            return res.status(404).json({ error: 'Nenhum dado encontrado no dataset.' });
        }
        // const contexto = records.map(r => JSON.stringify(r.dadosJson)).join(' ');
        var contexto = records.map(r => {
            if (typeof r.dadosJson === 'string') {
                return r.dadosJson;
            }
            return JSON.stringify(r.dadosJson);
        }).join(' ');
        contexto = contexto.replaceAll("{", "");
        contexto = contexto.replaceAll("}", "");
        contexto = contexto.replace("\"", "");
        console.log({ contexto }, { pergunta })
        const questionAnswerer = await pipeline(
            'question-answering',
            'Xenova/distilbert-base-cased-distilled-squad'
        );

        const resposta = await questionAnswerer(pergunta, contexto)

        console.log({ resposta })

        const novaQuery = await prisma.query.create({
            data: {
                pergunta: pergunta,
                resposta: resposta.answer,
                datasetId: datasetId,
                usuarioId: req.userId
            }
        });

        res.status(201).json(novaQuery);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao registrar a consulta.' });
    }
};

const listQueries = async (req, res) => {
    try {
        const consultas = await prisma.query.findMany({
            where: { usuarioId: req.userId },
            orderBy: { createdAt: 'desc' }
        });

        res.status(200).json(consultas);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao buscar histórico de consultas.' });
    }
};

module.exports = {
    registerQuery,
    listQueries
};
