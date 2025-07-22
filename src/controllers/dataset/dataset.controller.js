const prisma = require('../../../prisma/client');
const path = require('path');
const { processCSV, processPDF } = require('./dataset.service')


const upload = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'Nenhum arquivo enviado' });
    }

    try {
        const { originalname, size, filename } = req.file;
        const ext = path.extname(originalname).toLowerCase();
        const filePath = path.join('uploads', filename);

        const novoDataset = await prisma.dataset.create({
            data: {
                nome: originalname,
                nomeArquivo: filename,
                tamanho: size,
                usuarioId: req.userId
            }
        });

        if (ext === '.csv') {
            await processCSV(path.join('uploads', filename), novoDataset.id);
        }

        if (ext === '.pdf') {
            await processPDF(path.join('uploads', filename), novoDataset.id);
        }

        res.status(201).json({
            message: 'Arquivo enviado com sucesso',
            dataset: novoDataset
        });

    } catch (err) {
        console.error(err);
        res.status(400).json({ error: err.message });
    }
};


const getUserDatasets = async (req, res) => {
    try {
        const datasets = await prisma.dataset.findMany({
            where: {
                usuarioId: req.userId
            },
            orderBy: {
                criadoEm: 'desc'
            }
        });

        res.status(200).json(datasets);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar datasets' });
    }
};

const getDatasetRecords = async (req, res) => {

    try {
        const datasetId = parseInt(req.params.id);

        const datasetExists = await prisma.dataset.count({
            where: {
                id: datasetId,
                usuarioId: req.userId
            }
        });

        if (!datasetExists) {
            return res.status(404).json({ error: 'Dataset não encontrado' });
        }

        const records = await prisma.record.findMany({
            where: { datasetId },
            orderBy: { criadoEm: 'asc' },
            take: 1000 // Limite para evitar sobrecarga
        });
        res.status(200).json(records);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar os registros.' });
    }
};



module.exports = {
    upload, getUserDatasets, getDatasetRecords
};