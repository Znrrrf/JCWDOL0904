const { Transaction } = require('../models');

module.exports = {
    uploadPaymentProof: async (req, res) => {
        try {
            const transactionId = req.params.id;
            const transaction = await Transaction.findOne({ where: { id: transactionId } });

            if (transaction.status === "Canceled") {
                return res.status(400).send({ message: "Cannot upload payment proof for a canceled transaction" });
            }

            const { file } = req
            const filepath = file ? "/" + file.filename : null

            await Transaction.update(
                { payment_proof: process.env.IMAGE_URL + filepath, status: "Waiting For Payment Confirmation" },
                { where: { id: transactionId } }
            );

            res.status(200).send({ message: 'Payment proof uploaded successfully' });
        } catch (error) {
            console.error(error);
        }
    },
    getPaymentProof: async (req, res) => {
        const { id } = req.params;

        try {
            const transaction = await Transaction.findByPk(id, {
                attributes: ['payment_proof'],
            });

            if (!transaction) {
                return res.status(404).json({ message: 'Transaction not found' });
            }

            if (!transaction.payment_proof) {
                return res.status(404).json({ message: 'Payment proof not found' });
            }

            res.json({ payment_proof: transaction.payment_proof });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },
}