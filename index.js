import { select, input, checkbox } from "@inquirer/prompts";
import { promises as fs } from "fs";

let message = "Bem vindos ao App de Metas!";
let goals = [];

const loadingGoals = async () => {
  try {
    const data = await fs.readFile("goals.json", "utf8");
    goals = JSON.parse(data);
  } catch (error) {
    goals = [];
  }
};

const saveGoals = async () => {
  await fs.writeFile("goals.json", JSON.stringify(goals, null, 2));
};

const registerGoal = async () => {
  const goal = await input({
    message: "Digite a meta:",
  });

  if (goal.length === 0) {
    message = "A meta não pode ser vazia!";
    return;
  }

  goals.push({ value: goal, checked: false });

  message = "Meta cadastrada com sucesso!";
};

const showGoals = async () => {
  if (goals.length === 0) {
    message = "Não existem metas!";
    return;
  }

  const responses = await checkbox({
    message:
      "Use as SETAS para navegar, o ESPAÇO para marcar/desmarcar e o ENTER para finalizar:",
    choices: [...goals],
    instructions: false,
  });

  goals.forEach((goal) => {
    goal.checked = false;
  });

  if (responses.length === 0) {
    message = "Nenhuma meta foi selecionada!";
    return;
  }

  responses.forEach((response) => {
    const goal = goals.find((g) => {
      return g.value === response;
    });

    goal.checked = true;
  });

  message = "Meta(s) marcada(as) como concluída(s)";
};

const goalsAchieved = async () => {
  if (goals.length === 0) {
    message = "Não existem metas!";
    return;
  }

  const achievers = goals.filter((goal) => {
    return goal.checked;
  });

  if (achievers.length === 0) {
    message = "Nenhuma meta foi realizada! :(";
    return;
  }

  await select({
    message: "Metas realizadas: " + achievers.length,
    choices: [...achievers],
  });
};

const openGoals = async () => {
  if (goals.length === 0) {
    message = "Não existem metas!";
    return;
  }

  const open = goals.filter((goal) => {
    return !goal.checked;
  });

  if (open.length === 0) {
    message = "Nenhuma meta está aberta!";
    return;
  }

  await select({
    message: "Metas abertas: " + open.length,
    choices: [...open],
  });
};

const deleteGoals = async () => {
  if (goals.length === 0) {
    message = "Não existem metas!";
    return;
  }

  const unmarkedGoals = goals.map((goal) => {
    return { value: goal.value, checked: false };
  });

  const itemsToDelete = await checkbox({
    message: "Selecione uma meta para deletar:",
    choices: [...unmarkedGoals],
    instructions: false,
  });

  if (itemsToDelete.length === 0) {
    message = "Nenhuma meta para deletar!";
    return;
  }

  itemsToDelete.forEach((item) => {
    goals = goals.filter((goal) => {
      return goal.value !== item;
    });
  });
  message = "Meta(s) deletada(s) com sucesso!";
};

const showMessages = () => {
  console.clear();

  if (message !== "") {
    console.log(message);
    console.log("");
    message = "";
  }
};

const start = async () => {
  await loadingGoals();

  while (true) {
    showMessages();
    await saveGoals();

    const option = await select({
      message: "Menu >",
      choices: [
        { name: "Cadastrar Metas", value: "cadastrar" },
        { name: "Listar Metas", value: "listar" },
        { name: "Metas realizadas", value: "realizadas" },
        { name: "Metas abertas", value: "abertas" },
        { name: "Deletar metas", value: "deletar" },
        { name: "Sair", value: "sair" },
      ],
    });

    switch (option) {
      case "cadastrar":
        await registerGoal();
        break;
      case "listar":
        await showGoals();
        break;
      case "realizadas":
        await goalsAchieved();
        break;
      case "abertas":
        await openGoals();
        break;
      case "deletar":
        await deleteGoals();
        break;
      case "sair":
        console.log("Até a próxima!");
        return;
    }
  }
};

start();
