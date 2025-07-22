const prisma = require('../../prisma/client');

const searchRecords = async (req, res) => {
    const { query } = req.query;

    if (!query) {
        return res.status(400).json({ error: 'Parâmetro de busca "query" é obrigatório.' });
    }

    try {

        const datasets = await prisma.dataset.findMany({
            where: {
                usuarioId: req.userId
            },
            select: { id: true }
        });

        const datasetIds = datasets.map(d => d.id);

        const records = await prisma.record.findMany({
            where: {
                datasetId: {
                    in: datasetIds
                }
            }
        });

        const resultados = records.filter(record => {
            const json = record.dadosJson;
            const string = JSON.stringify(json).toLowerCase();
            return string.includes(query.toLowerCase());
        });

        res.status(200).json(resultados);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao buscar registros.' });
    }
};

module.exports = {
    searchRecords
};
