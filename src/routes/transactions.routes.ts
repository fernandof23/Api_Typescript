import { Router } from 'express';

import multer from 'multer';
import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';

import uploadConfig from '../config/upload';

const upload = multer(uploadConfig);

interface MulterFile {
  fieldname: string;
  originalname: string;
  filename: string;
}

const transactionsRouter = Router();

transactionsRouter.get('/', async (request, response) => {
  const transactionRepository = new TransactionsRepository();

  const balance = await transactionRepository.getBalance();
  const transactions = await transactionRepository.getTransactions();

  return response.json({ transactions, balance });
});

transactionsRouter.post('/', async (request, response) => {
  const { title, value, type, category } = request.body;

  const createTransactionService = new CreateTransactionService();

  const transaction = await createTransactionService.execute({
    title,
    value,
    type,
    category,
  });

  return response.json(transaction);
});

transactionsRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;
  const deleteTransactionService = new DeleteTransactionService();

  await deleteTransactionService.execute({ id });

  return response.send();
});

transactionsRouter.post(
  '/import',
  upload.single('file'),
  async (request, response) => {
    const importTransactionService = new ImportTransactionsService();

    const { file }: MulterFile | any = request;

    const result = await importTransactionService.execute(file.filename);

    return response.json(result);
  },
);

export default transactionsRouter;
