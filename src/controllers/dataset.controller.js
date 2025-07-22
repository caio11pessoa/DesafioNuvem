const prisma = require('../../prisma/client');
const fs = require('fs');
const path = require('path');

const upload = async (req, res) => {
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

            const data = fs.readFileSync(filePath, 'utf-8');

            const lines = data.trim().split('\n');
            const headers = lines[0].split(',');

            const records = [];

            for (let i = 1; i < lines.length; i++) {
                const record = {};
                const values = lines[i].split(',');
                headers.forEach((header, index) => {
                    record[header.trim()] = values[index]?.trim();
                });
                records.push(record);
            }

            if (lines.length == 1) {
                const record = {};
                headers.forEach((header, index) => {
                    record[header.trim()] = "";
                });
                records.push(record);
            }

            await Promise.all(
                records.map(r =>
                    prisma.record.create({
                        data: {
                            datasetId: novoDataset.id,
                            dadosJson: r
                        }
                    })
                )
            );
        }

        if (ext === '.pdf') {

            const pdfBuffer = fs.readFileSync(filePath);
            const pdfParse = require('pdf-parse');

            const data = await pdfParse(pdfBuffer);

            await prisma.record.create({
                data: {
                    datasetId: novoDataset.id,
                    dadosJson: {
                        conteudo: data.text.trim()
                    }
                }
            });
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
    const datasetId = parseInt(req.params.id);

    try {
        const dataset = await prisma.dataset.findFirst({
            where: {
                id: datasetId,
                usuarioId: req.userId
            }
        });

        if (!dataset) {
            return res.status(404).json({ error: 'Dataset não encontrado ou não pertence ao usuário.' });
        }

        const records = await prisma.record.findMany({
            where: {
                datasetId: dataset.id
            }
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