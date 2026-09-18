const pets = document.querySelectorAll(".pet-card");
const servicos = document.querySelectorAll(".servico-card");
const horarios = document.querySelectorAll(".horario");

const dataInput = document.getElementById("data");
const veterinarioInput = document.getElementById("veterinario");


pets.forEach(function (pet) {

    pet.addEventListener("click", function () {

        pets.forEach(function (item) {

            item.classList.remove("selecionado");

            const check = item.querySelector(".check-pet");

            if (check) {
                check.textContent = "○";
            }

        });

        pet.classList.add("selecionado");

        const radio = pet.querySelector('input[type="radio"]');

        if (radio) {
            radio.checked = true;
        }

        const check = pet.querySelector(".check-pet");

        if (check) {
            check.textContent = "✓";
        }

    });

});


servicos.forEach(function (servico) {

    servico.addEventListener("click", function () {

        servicos.forEach(function (item) {
            item.classList.remove("selecionado");
        });

        servico.classList.add("selecionado");

        const radio = servico.querySelector('input[type="radio"]');

        if (radio) {
            radio.checked = true;
        }

    });

});


horarios.forEach(function (horario) {

    horario.addEventListener("click", function () {

        horarios.forEach(function (item) {
            item.classList.remove("selecionado");
        });

        horario.classList.add("selecionado");

    });

});


function definirDataMinima() {

    if (!dataInput) {
        return;
    }

    const hoje = new Date();

    const ano = hoje.getFullYear();

    const mes = String(
        hoje.getMonth() + 1
    ).padStart(2, "0");

    const dia = String(
        hoje.getDate()
    ).padStart(2, "0");

    const dataAtual = `${ano}-${mes}-${dia}`;

    dataInput.min = dataAtual;

}


async function obterAgendamentos() {

    try {

        const resposta = await fetch(
            "http://localhost:3000/consultas"
        );

        if (!resposta.ok) {
            throw new Error("Erro ao buscar os agendamentos.");
        }

        return await resposta.json();

    } catch (erro) {

        console.error(
            "Erro ao carregar os agendamentos:",
            erro
        );

        return [];

    }

}


function obterPetSelecionado() {

    const petSelecionado = document.querySelector(
        'input[name="pet"]:checked'
    );

    if (!petSelecionado) {
        return null;
    }

    const card = petSelecionado.closest(".pet-card");

    if (!card) {
        return null;
    }

    const nomeElemento = card.querySelector(
        ".dados-pet strong"
    );

    const especieElemento = card.querySelector(
        ".dados-pet span"
    );

    if (!nomeElemento || !especieElemento) {
        return null;
    }

    return {
        nome: nomeElemento.textContent.trim(),
        especie: especieElemento.textContent.trim()
    };

}


function obterServicoSelecionado() {

    const servicoSelecionado = document.querySelector(
        'input[name="servico"]:checked'
    );

    if (!servicoSelecionado) {
        return null;
    }

    const card = servicoSelecionado.closest(
        ".servico-card"
    );

    if (!card) {
        return null;
    }

    const nomeElemento = card.querySelector(
        ".dados-servico strong"
    );

    const precoElemento = card.querySelector(
        ".preco"
    );

    if (!nomeElemento || !precoElemento) {
        return null;
    }

    return {
        nome: nomeElemento.textContent.trim(),
        preco: precoElemento.textContent.trim()
    };

}


function obterHorarioSelecionado() {

    const horarioSelecionado = document.querySelector(
        ".horario.selecionado"
    );

    if (!horarioSelecionado) {
        return null;
    }

    return horarioSelecionado.textContent.trim();

}


function formatarData(data) {

    if (!data) {
        return "";
    }

    const partes = data.split("-");

    if (partes.length !== 3) {
        return data;
    }

    return `${partes[2]}/${partes[1]}/${partes[0]}`;

}


async function confirmarAgendamento() {

    const pet = obterPetSelecionado();

    if (!pet) {

        alert(
            "Selecione um pet para continuar."
        );

        return;

    }

    const servico = obterServicoSelecionado();

    if (!servico) {

        alert(
            "Selecione um serviço para continuar."
        );

        return;

    }

    if (!veterinarioInput) {

        alert(
            "Selecione um veterinário."
        );

        return;

    }

    if (veterinarioInput.value === "") {

        alert(
            "Selecione um veterinário."
        );

        return;

    }

    const veterinario =
        veterinarioInput.options[
            veterinarioInput.selectedIndex
        ].textContent.trim();

    if (!dataInput || dataInput.value === "") {

        alert(
            "Selecione uma data para a consulta."
        );

        return;

    }

    const hoje = new Date();

    hoje.setHours(0, 0, 0, 0);

    const dataSelecionada = new Date(
        dataInput.value + "T00:00:00"
    );

    if (dataSelecionada < hoje) {

        alert(
            "Não é possível agendar uma consulta para uma data passada."
        );

        return;

    }

    const horario = obterHorarioSelecionado();

    if (!horario) {

        alert(
            "Selecione um horário para a consulta."
        );

        return;

    }

    const novoAgendamento = {

        pet: pet.nome,

        especie: pet.especie,

        servico: servico.nome,

        preco: servico.preco,

        veterinario: veterinario,

        data: dataInput.value,

        dataFormatada:
            formatarData(dataInput.value),

        horario: horario

    };

    const agendamentos =
        await obterAgendamentos();

    const horarioOcupado =
        agendamentos.some(function (agendamento) {

            return (
                agendamento.data === novoAgendamento.data &&
                agendamento.horario === novoAgendamento.horario &&
                agendamento.veterinario === novoAgendamento.veterinario
            );

        });

    if (horarioOcupado) {

        alert(
            "Esse horário já está ocupado para esse veterinário.\n\nEscolha outro horário."
        );

        return;

    }

    try {

        const resposta = await fetch(
            "http://localhost:3000/consultas",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(novoAgendamento)

            }
        );

        if (!resposta.ok) {
            throw new Error(
                "Erro ao salvar o agendamento."
            );
        }

        const agendamentoSalvo =
            await resposta.json();

        alert(
            `Agendamento confirmado! 🐾\n\n` +
            `Pet: ${agendamentoSalvo.pet}\n` +
            `Serviço: ${agendamentoSalvo.servico}\n` +
            `Veterinário: ${agendamentoSalvo.veterinario}\n` +
            `Data: ${agendamentoSalvo.dataFormatada}\n` +
            `Horário: ${agendamentoSalvo.horario}`
        );

        if (dataInput) {
            dataInput.value = "";
        }

        horarios.forEach(function (item) {
            item.classList.remove("selecionado");
        });

        pets.forEach(function (item) {
            item.classList.remove("selecionado");

            const check = item.querySelector(".check-pet");

            if (check) {
                check.textContent = "○";
            }

            const radio = item.querySelector(
                'input[type="radio"]'
            );

            if (radio) {
                radio.checked = false;
            }
        });

        servicos.forEach(function (item) {
            item.classList.remove("selecionado");

            const radio = item.querySelector(
                'input[type="radio"]'
            );

            if (radio) {
                radio.checked = false;
            }
        });

        console.log(
            "Agendamento salvo:",
            agendamentoSalvo
        );

    } catch (erro) {

        console.error(
            "Erro ao salvar o agendamento:",
            erro
        );

        alert(
            "Não foi possível salvar o agendamento. Verifique se o JSON Server está funcionando."
        );

    }

}


async function mostrarAgendamentosSalvos() {

    const agendamentos =
        await obterAgendamentos();

    console.log(
        "Agendamentos cadastrados:",
        agendamentos
    );

}


document.addEventListener(
    "DOMContentLoaded",
    function () {

        definirDataMinima();

        mostrarAgendamentosSalvos();

    }
);