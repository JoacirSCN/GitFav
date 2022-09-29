import { GithubUser } from "./GithubUser.js";

// Classe que vai conter a lógica dos dados
// como os dados serão estruturados
const background = document.querySelector('none-favorites');

export class Favorites {
  constructor(root) {
    this.root = document.querySelector(root);
    this.load();
  }

  load() {
    this.entries = JSON.parse(localStorage.getItem('@github-favorites:')) || [];
  }

  save() {
    localStorage.setItem('@github-favorites:', JSON.stringify(this.entries))
  }

  async add(username) {
    try {

      const userExists = this.entries.find(entry => entry.login === username);
      if (userExists) {
        throw new Error('Usuário já cadastrado!');
      }

      const user = await GithubUser.search(username);

      if (user.login === undefined) {
        throw new Error('Usuário não encontrado!');
      }

      this.entries = [user, ...this.entries];
      this.update();
      this.save();

    } catch (error) {
      alert(error.message)
    }
  }

  delete(user) {
    // Filter é uma higher-order function e funciona da mesma forma que o forEach
    const filteredEntries = this.entries
      .filter(entry => entry.login !== user.login);

    this.entries = filteredEntries; // Apaga todo array antigo e colocando um novo array
    this.update();
    this.save();
  }
}

// Classe que vai criar a visualização e eventos do HTML
export class FavoritesView extends Favorites {
  constructor(root) {
    super(root);

    //const tbody = this.root.querySelector('table tbody');
    this.tbody = this.root.querySelector('table tbody');
    this.update();
    this.onadd();
  }

  onadd() {
    const addButton = this.root.querySelector('.search button');
    addButton.onclick = () => {
      const { value } = this.root.querySelector('.search input');

      this.add(value)
    }
  }

  update() {
    this.removeAllTr();

    this.entries.forEach(user => {
      const row = this.creatRow();
      console.log(row)

      row.querySelector('.user img').src = `https://github.com/${user.login}.png`;
      row.querySelector('.user img').alt = `Imagem de ${user.name}`;
      row.querySelector('.user a').href = `https://github.com/${user.login}`
      row.querySelector('.user p').textContent = user.name;
      row.querySelector('.user span').textContent = user.login;
      row.querySelector('.respositories').textContent = user.public_repos;
      row.querySelector('.followers').textContent = user.followers;

      row.querySelector('.remove').onclick = () => {
        const isOk = confirm('Tem certeza que deseja deletar essa linha?');

        if (isOk) {
          this.delete(user)
        }
      }

      this.tbody.append(row);
    });


  }

  creatRow() {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="user">
        <img src="https://github.com/JoacirSCN.png" alt="Imagem de JoacirSCN">
        <a href="https://github.com/JoacirSCN">
          <p>Joacir Sampaio</p>
          <span>JoacirSCN</span>
        </a>
      </td>

      <td class="respositories">
        0
      </td>

      <td class="followers">
        3
      </td>

      <td>
        <button class="remove" >Remover</button>
      </td>
    `;

    return tr;
  }

  removeAllTr() {
    if (this.entries.length !== 0) {
      this.root.querySelector('.none-favorites').classList.add('none')
    } else {
      this.root.querySelector('.none-favorites').classList.remove('none')
    }
    // Retorna uma nodelist ou arraylike(em forma de matriz)
    // Para cade tr do nodelist, execute a função
    this.tbody.querySelectorAll('tr')
      .forEach((tr) => {
        tr.remove();
      });
  }
}