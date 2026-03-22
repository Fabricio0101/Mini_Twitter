import type { TourStep } from "@/components/tour/GuidedTour";

export const TOUR_CONFIGS: Record<string, { label: string; description: string; path: string; steps: TourStep[] }> = {
  home: {
    label: "Página Inicial",
    description: "Aprenda a criar posts, curtir, comentar e navegar pelo feed",
    path: "/",
    steps: [
      {
        target: "[data-tour='post-form']",
        title: "Criar publicação",
        description: "Escreva o título e o conteúdo do seu post aqui. Você também pode adicionar imagens clicando no ícone de mídia.",
        placement: "bottom",
      },
      {
        target: "[data-tour='post-card']",
        title: "Feed de publicações",
        description: "Aqui você vê todas as publicações. Use os botões para curtir, comentar, repostar ou favoritar.",
        placement: "left",
      },
      {
        target: "[data-tour='sidebar']",
        title: "Menu de navegação",
        description: "Use o menu lateral para navegar entre as páginas. Passe o mouse para ver os nomes.",
        placement: "right",
      },
      {
        target: "[data-tour='chat-floating']",
        title: "Chat rápido",
        description: "Clique aqui para abrir o chat sem sair da página. Você pode enviar mensagens diretamente pelo popup.",
        placement: "top",
      },
    ],
  },
  profile: {
    label: "Perfil",
    description: "Veja como editar seu perfil, suas publicações e posts salvos",
    path: "/profile",
    steps: [
      {
        target: "[data-tour='profile-card']",
        title: "Seu perfil",
        description: "Este é o cartão do seu perfil. Aqui ficam suas informações principais visíveis para outros usuários.",
        placement: "bottom",
      },
      {
        target: "[data-tour='profile-avatar']",
        title: "Foto de perfil",
        description: "Clique no ícone de câmera para trocar sua foto. Formatos aceitos: JPEG, PNG, WebP e GIF.",
        placement: "right",
      },
      {
        target: "[data-tour='profile-info']",
        title: "Suas informações",
        description: "Aqui ficam seu nome, bio, e-mail, localização e data de entrada. Para editar, vá na aba Pessoal.",
        placement: "bottom",
      },
      {
        target: "[data-tour='profile-tabs']",
        title: "Abas do perfil",
        description: "Navegue entre as 4 seções do seu perfil usando estas abas.",
        placement: "bottom",
      },
      {
        target: "[data-tour='tab-posts']",
        title: "Publicações",
        description: "Veja todos os posts que você criou e repostou. Seus seguidores também veem esta aba no seu perfil público.",
        placement: "bottom",
        clickOnArrive: true,
      },
      {
        target: "[data-tour='tab-saved']",
        title: "Posts salvos",
        description: "Todos os posts que você favoritou ficam aqui. Só você pode ver esta lista.",
        placement: "bottom",
        clickOnArrive: true,
      },
      {
        target: "[data-tour='tab-personal']",
        title: "Informações pessoais",
        description: "Edite seu nome, bio e localização. O e-mail é fixo e não pode ser alterado.",
        placement: "bottom",
        clickOnArrive: true,
      },
      {
        target: "[data-tour='tab-security']",
        title: "Segurança",
        description: "Altere sua senha de acesso. Você precisará informar a senha atual para confirmar.",
        placement: "bottom",
        clickOnArrive: true,
      },
    ],
  },
  chat: {
    label: "Chat",
    description: "Descubra como enviar mensagens para outros usuários",
    path: "/chat",
    steps: [
      {
        target: "[data-tour='chat-area']",
        title: "Área de conversas",
        description: "Selecione uma conversa existente ou inicie uma nova para trocar mensagens com outros usuários.",
        placement: "bottom",
      },
    ],
  },
  search: {
    label: "Pesquisa",
    description: "Aprenda a buscar posts e usuários na plataforma",
    path: "/",
    steps: [
      {
        target: "[data-tour='user-search']",
        title: "Buscar usuários",
        description: "Clique neste botão para abrir o painel de busca de usuários. Você pode encontrar outros perfis na plataforma.",
        placement: "bottom",
      },
      {
        target: "[data-tour='user-search-sheet']",
        title: "Painel de usuários",
        description: "Este é o painel de busca de usuários. Aqui você encontra todos os usuários disponíveis na plataforma.",
        placement: "right",
        dispatchEvent: "tour:open-user-search",
      },
      {
        target: "[data-tour='user-search-input']",
        title: "Campo de busca",
        description: "Digite o nome de um usuário para filtrar a lista. A busca é feita em tempo real conforme você digita.",
        placement: "right",
      },
      {
        target: "[data-tour='user-search-list']",
        title: "Lista de usuários",
        description: "Aqui aparecem os usuários disponíveis. Clique em qualquer usuário para ser direcionado ao perfil dele.",
        placement: "right",
      },
    ],
  },
};
