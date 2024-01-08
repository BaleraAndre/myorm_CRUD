import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import Context from './dbcontext/dbcontext';
import PGDBManager from 'myorm_pg/lib/implementations/PGDBManager';
import { User } from './model/ent/user';

const app = express();
const port = process.env.PORT || 8080;
const context = new Context(PGDBManager.Build("localhost", 5432, "API_CRUD", "postgres", "03021955"));

app.use(bodyParser.json());

app.get('/', async (req: Request, res: Response) => {
  try {
    let pessoas = await context.users.ToListAsync();
    
    res.json(pessoas);
  } catch (error) {
    console.error('Erro ao obter dados:', error);
    res.status(500).json({ mensagem: 'Erro ao obter dados' });
  }
});

app.post('/', async (req: Request, res: Response) => {
  const { nome, email } = req.body;
  try {
    
    const user = new User( nome, email );
    await context.users.AddAsync(user);
    res.json({ mensagem: 'Pessoa adicionada com sucesso' });
  } catch (error) {
    console.error('Erro ao adicionar pessoa:', error);
    res.status(500).json({ mensagem: 'Erro ao adicionar pessoa' });
  }
});

app.put('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { nome, email } = req.body;
  try {
    
    let user = await context.users.Where({
      Field: 'Id',
      Value: parseInt(id),
    }).FirstOrDefaultAsync();

   
    if (user) {
      user.Nome = nome;
      user.Email = email;

      res.json({ mensagem: 'Pessoa atualizada com sucesso' });
    } else {
      res.status(404).json({ mensagem: 'Usuário não encontrado' });
    }
  } catch (error) {
    console.error('Erro ao atualizar pessoa:', error);
    res.status(500).json({ mensagem: 'Erro ao atualizar pessoa' });
  }
});

app.delete('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    
    await context.users.Where({
      Field: 'Id',
      Value: parseInt(id),
    }).DeleteSelectionAsync();

    res.json({ mensagem: 'Pessoa excluída com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir pessoa:', error);
    res.status(500).json({ mensagem: 'Erro ao excluir pessoa' });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});