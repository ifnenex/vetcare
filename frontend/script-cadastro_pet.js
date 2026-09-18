const formPet = document.getElementById("formPet");

async function obterPets() {
    try {
        const resposta = await fetch("http://localhost:3000/pets");

        if (!resposta.ok) {
            throw new Error("Erro ao buscar pets.");
        }

        return await resposta.json();

    } catch (erro) {
        console.error("Erro:", erro);
        return [];
    }
}

const inputFoto = document.getElementById("foto");
const areaFoto = document.querySelector(".area-foto");

if (inputFoto && areaFoto) {

    inputFoto.addEventListener("change", function () {

        const arquivo = this.files[0];

        if (!arquivo) {
            return;
        }

        if (
            arquivo.type !== "image/jpeg" &&
            arquivo.type !== "image/png"
        ) {

            alert("Escolha uma imagem JPG ou PNG.");

            this.value = "";

            return;
        }

        if (arquivo.size > 5 * 1024 * 1024) {

            alert("A imagem deve ter no máximo 5MB.");

            this.value = "";

            return;
        }

        const leitor = new FileReader();

        leitor.onload = function (evento) {

            areaFoto.style.backgroundImage =
                `url("${evento.target.result}")`;

            areaFoto.style.backgroundSize = "cover";
            areaFoto.style.backgroundPosition = "center";
            areaFoto.style.backgroundRepeat = "no-repeat";

            const camera = areaFoto.querySelector(".camera");
            const strong = areaFoto.querySelector("strong");
            const small = areaFoto.querySelector("small");

            if (camera) {
                camera.style.display = "none";
            }

            if (strong) {
                strong.style.display = "none";
            }

            if (small) {
                small.style.display = "none";
            }

        };

        leitor.readAsDataURL(arquivo);

    });

}

if (formPet) {

    formPet.addEventListener("submit", function (event) {

        event.preventDefault();

        const nome = document
            .getElementById("nomePet")
            .value
            .trim();

        const especie = document
            .getElementById("especie")
            .value;

        const raca = document
            .getElementById("raca")
            .value
            .trim();

        const dataNascimento = document
            .getElementById("dataNascimento")
            .value;

        const peso = document
            .getElementById("peso")
            .value;

        const cor = document
            .getElementById("cor")
            .value
            .trim();

        const observacoes = document
            .getElementById("observacoes")
            .value
            .trim();

        const sexoSelecionado =
            document.querySelector(
                'input[name="sexo"]:checked'
            );

        const sexo = sexoSelecionado
            ? sexoSelecionado.value
            : "";

        if (nome === "") {

            alert("Digite o nome do pet.");

            document
                .getElementById("nomePet")
                .focus();

            return;
        }

        if (especie === "") {

            alert("Selecione a espécie do pet.");

            document
                .getElementById("especie")
                .focus();

            return;
        }

        if (sexo === "") {

            alert("Selecione o sexo do pet.");

            return;
        }

        if (peso !== "") {

            const pesoNumero = Number(peso);

            if (pesoNumero <= 0) {

                alert("Digite um peso válido.");

                document
                    .getElementById("peso")
                    .focus();

                return;
            }
        }

        let fotoPet = "";

        if (inputFoto && inputFoto.files.length > 0) {

            const arquivo = inputFoto.files[0];

            const leitor = new FileReader();

            leitor.onload = function (evento) {

                fotoPet = evento.target.result;

                finalizarCadastro(
                    nome,
                    especie,
                    raca,
                    sexo,
                    dataNascimento,
                    peso,
                    cor,
                    observacoes,
                    fotoPet
                );

            };

            leitor.readAsDataURL(arquivo);

        } else {

            finalizarCadastro(
                nome,
                especie,
                raca,
                sexo,
                dataNascimento,
                peso,
                cor,
                observacoes,
                fotoPet
            );

        }

    });

}

async function finalizarCadastro(
    nome,
    especie,
    raca,
    sexo,
    dataNascimento,
    peso,
    cor,
    observacoes,
    foto
) {

    const novoPet = {
        nome: nome,
        especie: especie,
        raca: raca,
        sexo: sexo,
        dataNascimento: dataNascimento,
        peso: peso,
        cor: cor,
        observacoes: observacoes,
        foto: foto
    };

    try {

        const resposta = await fetch(
            "http://localhost:3000/pets",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(novoPet)
            }
        );

        if (!resposta.ok) {
            throw new Error("Erro ao cadastrar o pet.");
        }

        const petCadastrado = await resposta.json();

        alert(
            `Pet "${nome}" cadastrado com sucesso! 🐾`
        );

        formPet.reset();

        restaurarAreaFoto();

        console.log("Pet cadastrado:", petCadastrado);

    } catch (erro) {

        console.error("Erro:", erro);

        alert(
            "Não foi possível cadastrar o pet. Verifique se o JSON Server está funcionando."
        );

    }

}

function restaurarAreaFoto() {

    if (!areaFoto) {
        return;
    }

    areaFoto.style.backgroundImage = "none";

    const camera = areaFoto.querySelector(".camera");
    const strong = areaFoto.querySelector("strong");
    const small = areaFoto.querySelector("small");

    if (camera) {
        camera.style.display = "block";
    }

    if (strong) {
        strong.style.display = "block";
    }

    if (small) {
        small.style.display = "block";
    }

}

const botaoCancelar =
    document.querySelector(".btn-cancelar");

if (botaoCancelar) {

    botaoCancelar.addEventListener("click", function () {

        const confirmar = confirm(
            "Deseja cancelar o cadastro do pet?"
        );

        if (confirmar) {

            formPet.reset();

            restaurarAreaFoto();

            history.back();

        }

    });

}

async function mostrarPetsSalvos() {

    const pets = await obterPets();

    console.log("Pets cadastrados:", pets);

}

document.addEventListener(
    "DOMContentLoaded",
    function () {

        mostrarPetsSalvos();

    }
);