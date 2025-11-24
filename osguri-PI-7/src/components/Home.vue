<template>
  <div class="homepage">
    <h1>TatuAR</h1>
    <section class="intro">
      <p>
        Bem-vindo ao TatuAR! Nossa aplicação web interativa permite que você visualize tatuagens em realidade aumentada diretamente pelo navegador, usando apenas a câmera do seu dispositivo. Experimente diferentes estilos e modelos de tatuagem de forma prática e inovadora.
      </p>
    </section>
    <section class="quem-somos">
      <h2>Quem Somos</h2>
      <ul>
        <li>Adrian Modesto Lauzid</li>
        <li>Artur Vinícius Lima Ramos da Silva</li>
        <li>Celso Gabriel Bezerra Sampietri Pinton</li>
        <li>Gustavo dos Santos Silva</li>
        <li>Lucas Pereira de Souza</li>
      </ul>
    </section>
    <section class="acesso-app">
      <button @click="irParaApp">Acessar Aplicativo</button>
    </section>
  </div>
</template>

<script>
export default {
  name: 'HomePage',
  mounted() {
    // Implementa a lógica DOMContentLoaded do professor
    // Pega o código da URL atual
    let userCode = window.location;
    userCode = userCode.search.replace("?", "");
    console.log("UserCode capturado na Home:", userCode);

    // Salva no localStorage
    if (userCode && userCode !== "") {
      localStorage.setItem("userCode", userCode);
      console.log("Código do usuário salvo:", userCode);
    } else {
      console.log("Nenhum código encontrado na URL - modo desenvolvimento");
    }
  },
  data() {
    return {
      pontos: 0
    };
  },
  methods: {
    irParaApp() {
      // Chama saveScores antes de redirecionar
      this.saveScores();
      // Redireciona para a rota do aplicativo principal
      this.$router.push('/app');
    },
    saveScores() {
      // Implementação exata da função do professor adaptada para Vue
      console.log("pontos", this.pontos);

      let user = localStorage.getItem("userCode");

      // Verifica se tem código válido antes de fazer requisição
      if (!user || user === '' || user === 'null') {
        console.log("Nenhum código de usuário válido encontrado. Pulando salvamento de pontos.");
        return;
      }

      fetch(
        `https://upgraded-happiness-9rvrr9w9ppj3v64-3000.app.github.dev/users?code=${user}`
      )
        .then(async (res) => {
          return await res.json();
        })
        .then((user) => {
          console.log("user", user);
          
          let scoreData = {
            userId: user[0].id,
            experienceId: 1,
            score: this.pontos
          };
        
          console.log('score', scoreData);

          fetch(
            `https://upgraded-happiness-9rvrr9w9ppj3v64-3000.app.github.dev/experienceScores`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(scoreData),
            }
          )
            .then((res) => res.json())
            .then((data) => {
              console.log("Dados enviados com sucesso:", data);
            })
            .catch((error) => {
              console.error("Erro ao salvar os dados:", error);
            });
        })
        .catch((error) => {
          console.error("Erro ao buscar usuário:", error);
        });
      
      // Não redireciona automaticamente - deixa o Vue router fazer isso
    }
  }
}
</script>

<style scoped>
.homepage {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}
.intro {
  margin-bottom: 2rem;
}
.quem-somos {
  margin-bottom: 2rem;
}
.quem-somos ul {
  list-style: none;
  padding: 0;
}
.quem-somos li {
  margin: 0.5rem 0;
}
.acesso-app button {
  padding: 0.75rem 2rem;
  font-size: 1rem;
  background: #222;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}
.acesso-app button:hover {
  background: #444;
}

/* Responsividade Mobile */
@media (max-width: 768px) {
  .homepage {
    padding: 1.5rem 1rem;
  }
  
  .homepage h1 {
    font-size: 2rem;
  }
  
  .intro p {
    font-size: 0.95rem;
    line-height: 1.4;
  }
  
  .quem-somos h2 {
    font-size: 1.5rem;
  }
  
  .quem-somos li {
    font-size: 0.9rem;
  }
  
  .acesso-app button {
    padding: 0.7rem 1.5rem;
    font-size: 0.95rem;
    width: 100%;
    max-width: 300px;
  }
}

@media (max-width: 480px) {
  .homepage {
    padding: 1rem 0.75rem;
  }
  
  .homepage h1 {
    font-size: 1.75rem;
  }
  
  .intro {
    margin-bottom: 1.5rem;
  }
  
  .intro p {
    font-size: 0.9rem;
  }
  
  .quem-somos {
    margin-bottom: 1.5rem;
  }
  
  .quem-somos h2 {
    font-size: 1.3rem;
  }
  
  .quem-somos li {
    font-size: 0.85rem;
    margin: 0.4rem 0;
  }
}
</style>