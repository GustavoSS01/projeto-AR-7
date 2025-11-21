<div align="center">

# TatuAR

*Aplicação web de realidade aumentada para pré-visualização de tatuagens*

</div>

## Sobre o projeto
TatuAR é um protótipo acadêmico que permite testar artes de tatuagem diretamente pelo navegador usando realidade aumentada. O usuário escolhe um modelo, aponta a câmera para um marcador impresso e visualiza o desenho aplicado ao corpo em tempo real. O projeto foi desenvolvido em Vue 3 + Vite e utiliza A-Frame/AR.js para lidar com a renderização WebXR.

## Principais recursos
- Visualização AR baseada em marcadores (`public/marker/marker.patt`).
- Catálogo com 11 tatuagens trocadas em tempo real pelo componente `TattooSelector`.
- Controles de navegação (próxima/anterior) e indicador do marcador em tempo real.
- Interface responsiva com tela cheia e experiência mobile-first.
- Estrutura simples para adicionar novas artes (`public/tattoos`).

## Tecnologias
- Vue 3 + Vite
- Vue Router
- A-Frame 1.3.0 + AR.js 3.4.5 (carregados via CDN)
- HTML5, CSS3 e JavaScript

## Pré-requisitos
- Node.js 18+ e npm
- Navegador moderno com WebGL/WebXR habilitado (Chrome, Edge ou Firefox)
- Webcam ou câmera do dispositivo
- Marcador físico referente ao arquivo `public/marker/marker.patt`

## Como executar localmente
```bash
# 1. Vá até o projeto Vite
cd osguri-PI-7

# 2. Instale as dependências
npm install

# 3. Rode em modo desenvolvimento
npm run dev

# 4. Acesse a URL exibida no terminal e permita o uso da câmera
```

### Build de produção
https://projeto-tatuar.onrender.com

## Estrutura resumida
```
osguri-PI-7/
├─ public/
│  ├─ marker/marker.patt
│  └─ tattoos/tatuagemteste{1..10}.png
├─ src/
│  ├─ components/
│  │  ├─ Home.vue
│  │  ├─ AppPage.vue       # Cena AR + controles e carregamento de scripts
│  │  └─ TattooSelector.vue
│  ├─ router.js            # Rotas / e /app
│  ├─ main.js              # Bootstrap da aplicação
│  └─ style.css
└─ package.json            # Scripts dev/build/preview do Vite
```

## Como usar
1. Com a aplicação em execução, acesse a rota inicial (`/`).
2. Clique em **Acessar Aplicativo** para abrir a tela AR.
3. Selecione uma tatuagem no grid ou use os botões **Anterior/Próxima** durante a visualização.
4. Permita o uso da câmera e aponte para o marcador impresso correspondente ao arquivo `marker.patt`.
5. Ajuste a distância/iluminação até que o indicador "Marker detectado" fique ativo.

### Adicionando novas tatuagens
1. Salve o PNG/transparent no diretório `osguri-PI-7/public/tattoos`.
2. Inclua o novo item nos arrays `tattoos` existentes em `AppPage.vue` e `TattooSelector.vue` (id, nome e caminho).
3. Reinicie o servidor de desenvolvimento, se necessário.

## Equipe
- Adrian Modesto Lauzid
- Artur Vinícius Lima Ramos da Silva
- Celso Gabriel Bezerra Sampietri Pinton
- Gustavo dos Santos Silva
- Lucas Pereira de Souza

## Próximos passos
1. Implementar suporte a tatuagens personalizadas enviadas pelo usuário.
2. Permitir ajuste de escala da arte diretamente na cena.

---

Projeto desenvolvido na disciplina de Projeto Integrador (7º período).
