const btnAdicionarTarefa = document.querySelector('.app__button--add-task');
const btnExcluirTarefa = document.querySelector('.app__form-footer__button--cancel');
const formAdicionarTarefa = document.querySelector('.app__form-add-task');
const textArea = document.querySelector('.app__form-textarea');
const ulTarefas = document.querySelector('.app__section-task-list');
const paragrafoDescricaoTarefa = document.querySelector('.app__section-active-task-description')

const btnRemoverConcluidas = document.querySelector('#btn-remover-concluidas')
const btnRemoverTodas = document.querySelector('#btn-remover-todas')

let tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];
let tarefaSelecionada = null;
let liTarefaSelecionada = null;

function atualizarTarefas() {
    localStorage.setItem('tarefas', JSON.stringify(tarefas))// localStorage.setItem('tarefas', tarefasString): Este método salva a string no localStorage com a chave 'tarefas'. O localStorage é um espaço de armazenamento no navegador que permite salvar dados que persistem mesmo depois que a página é recarregada.
}

function criarElementoTarefa(tarefa) {

    const li = document.createElement('li')// O método createElement é essencial para dinamicamente criar e manipular elementos na página web com JavaScript.
    li.classList.add('app__section-task-list-item')

    const svg = document.createElement('svg')
    svg.innerHTML = `
    <svg class="app__section-task-icon-status" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="12" fill="white"></circle>
        <path d="M9 16.1719L19.5938 5.57812L21 6.98438L9 18.9844L3.42188 13.4062L4.82812 12L9 16.1719Z" fill="#01080E"></path>
    </svg>    
    `
    const paragrafo = document.createElement('p')
    paragrafo.textContent = tarefa.descricao
    paragrafo.classList.add('app__section-task-list-item-description')

    const botao = document.createElement('button')
    botao.classList.add('app_button-edit')

    botao.onclick = () => {
        const novaDescrição = prompt("Qual é a nova descrição da tarefa?")
        if (novaDescrição) {
            paragrafo.textContent = novaDescrição
            tarefa.descricao = novaDescrição
            atualizarTarefas()
        }
    }


    // o código está configurando a imagem para um botão e adicionando essa imagem ao botão, fazendo com que o botão mostre a imagem especificada
    const imagemButton = document.createElement('img')
    imagemButton.setAttribute('src', './imagens/edit.png')
    botao.append(imagemButton)// O método append pode adicionar elementos HTML, texto ou ambos ao final do conteúdo do elemento pai. Ele também pode adicionar múltiplos elementos ao mesmo tempo se passados como argumentos separados.

    li.append(svg)
    li.append(paragrafo)
    li.append(botao)

    if(tarefa.completa) {
        li.classList.add('app__section-task-list-item-complete')
        botao.setAttribute('disabled', 'disabled')
    }else {
    // Aqui esta definindo uma função que será executada quando for cilcada.
        li.onclick = () => {
            document.querySelectorAll('.app__section-task-list-item-active')
                .forEach(element => {// Garanti que apenas um item de lista possa ser marcado como "ativo" ou "selecionado" de cada vez. 
                    element.classList.remove('app__section-task-list-item-active')
                })
            if (tarefaSelecionada == tarefa) {// Quando é clicado novamente na mesma tarefa, ele limpa a descrição exibida e desmarca a tarefa, definindo tarefaSelecionada como null.
                paragrafoDescricaoTarefa.textContent = ''
                tarefaSelecionada = null
                liTarefaSelecionada = null
                return
            }
            tarefaSelecionada = tarefa
            liTarefaSelecionada = li
            paragrafoDescricaoTarefa.textContent = tarefa.descricao // Exibi a descrição da tarefa em outro lugar da interface, por exemplo, em uma área de detalhes ou resumo da tarefa.
    
            li.classList.add('app__section-task-list-item-active')// Adiciona a classe .app__section-task-list-item-active ao elemento li que foi clicado.
        }
    }

    

    return li
}

btnAdicionarTarefa.addEventListener('click', () => {
    // se o formulário estiver escondido ele remove esta situação, tornando o form visivel.
    if (formAdicionarTarefa.classList.contains('hidden')) {// O contains verifica se o elemento formAdicionarTarefa possui a classe hidden em sua lista de classes. 
        formAdicionarTarefa.classList.remove('hidden');
    }
})

btnExcluirTarefa.addEventListener('click', () => {
    textArea.value = '';// Limpa o conteúdo do textarea.
    formAdicionarTarefa.classList.add('hidden')// Esconde o formulário.
});

formAdicionarTarefa.addEventListener('submit', (evento) => {
    evento.preventDefault();// Este método previne o comportamento padrão do evento. No caso de um formulário, isso significa impedir que o formulário seja enviado(submit) e a página seja recarregada.
    const tarefa = ({
        descricao: textArea.value,
    })
    tarefas.push(tarefa);
    const elementoTarefa = criarElementoTarefa(tarefa)
    ulTarefas.append(elementoTarefa)
    atualizarTarefas()
    textArea.value = ''
    formAdicionarTarefa.classList.add('hidden')
})
// O localStorage é o baú de tesouros que guarda informações sem data de validade. Uma vez que você armazena algo nele, a informação fica lá até que você decida removê-la ou o usuário limpe os dados de navegação.

tarefas.forEach(tarefa => {
    const elementoTarefa = criarElementoTarefa(tarefa)
    ulTarefas.append(elementoTarefa)
})

document.addEventListener('FocoFinalizado', () => {
    if (tarefaSelecionada && liTarefaSelecionada) {
        liTarefaSelecionada.classList.remove('app__section-task-list-item-active')
        liTarefaSelecionada.classList.add('app__section-task-list-item-complete')
        liTarefaSelecionada.querySelector('button').setAttribute('disabled', 'disabled')
        tarefaSelecionada.completa = true
        atualizarTarefas()
    }
})

const removerTarefas = (somenteCompleta) => {
    const seletor = somenteCompleta ? ".app__section-task-list-item-complete" : ".app__section-task-list-item "// condição ternario, é o mesmo que if/eslse
    document.querySelectorAll(seletor).forEach(elemento => {
        elemento.remove()
    })
    tarefas = somenteCompleta ? tarefas.filter(tarefa => !tarefa.completa) : []
    atualizarTarefas()
}

btnRemoverConcluidas.onclick = removerTarefas(true)
btnRemoverTodas.onclick = () => removerTarefas(false)

