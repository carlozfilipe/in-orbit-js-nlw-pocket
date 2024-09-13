import { select, input, checkbox } from '@inquirer/prompts';

const goal1 = {
  value: 'Ser um programador fullstack JS',
  checked: true,
};

let goals = [];

const registerGoal = async () => {
  const goal = await input({
    message: 'Digite a meta:',
  });

  if (goal.length === 0) {
    console.log('A meta não pode ser vazia!');
    return;
  }

  goals.push({ value: goal, checked: false });
};

const showGoals = async () => {
  const responses = await checkbox({
    message:
      'Use as SETAS para navegar, o ESPAÇO para marcar/desmarcar e o ENTER para finalizar:',
    choices: [...goals],
    instructions: false,
  });

  if (responses.length === 0) {
    console.log('Nenhuma meta foi selecionada!');
    return;
  }

  goals.forEach((goal) => {
    goal.checked = false;
  });

  responses.forEach((response) => {
    const goal = goals.find((g) => {
      return g.value === response;
    });

    goal.checked = true;
  });

  console.log('Meta(s) marcada(a) como concluída(s)');
};

const start = async () => {
  while (true) {
    const option = await select({
      message: 'Menu >',
      choices: [
        { name: 'Cadastrar Metas', value: 'cadastrar' },
        { name: 'Listar Metas', value: 'listar' },
        { name: 'Buscar Metas', value: 'buscar' },
        { name: 'Sair', value: 'sair' },
      ],
    });

    switch (option) {
      case 'cadastrar':
        await registerGoal();
        break;
      case 'listar':
        await showGoals();
        break;
      case 'buscar':
        console.log('Buscou com sucesso!');
        break;
      case 'sair':
        console.log('Até a próxima!');
        return;
    }
  }
};

start();
