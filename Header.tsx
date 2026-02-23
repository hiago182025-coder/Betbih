import React from 'react';

const FootballIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 16.93c-1.68-.34-3.18-1.25-4.24-2.58l1.37-.8c.79.98 1.93 1.66 3.19 1.95V18.93zM12 10c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm0-3c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm0 6c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm3.83-5.24c-.63.9-1.58 1.48-2.66 1.69l.74 1.28c1.58-.3 2.99-1.16 3.93-2.4l-1.01-.65c-.24-.16-.54-.08-.7.16zm-7.66 0c.24.31.52.58.82.81l.74-1.28c-1.08-.21-2.03-.79-2.66-1.69-.16-.24-.46-.32-.7-.16l-1.01.65c.94 1.24 2.35 2.1 3.93 2.4l.74-1.28c.3-.23.58-.5.82-.81zM13 4.07c1.26.29 2.4.97 3.19 1.95l1.37.8C16.3 5.52 14.8 4.61 13.12 4.27l-.12-.2zM6.76 6.61l1.37-.8c.79-.98 1.93-1.66 3.19-1.95V4.07c-1.68.34-3.18 1.25-4.24 2.58l1.37.8zM4.07 13c.29-1.26.97-2.4 1.95-3.19l.8 1.37c-.98.79-1.66 1.93-1.95 3.19H4.07zm13.19-3.19c.98.79 1.66 1.93 1.95 3.19h-1.8c-.29-1.26-.97-2.4-1.95-3.19l.8-1.37zM11 19.93v-2.81c-1.26-.29-2.4-.97-3.19-1.95l-1.37-.8c1.13 1.61 2.79 2.76 4.56 3.19zM15.44 16.36c-.79.98-1.93 1.66-3.19 1.95v2.81c1.77-.43 3.43-1.58 4.56-3.19l-1.37.8z" />
    </svg>
);

const Header: React.FC = () => {
  return (
    <header className="text-center p-6 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-10 border-b border-green-500/20 shadow-lg">
      <div className="flex items-center justify-center gap-4 mb-2">
        <FootballIcon className="w-10 h-10 text-green-400" />
        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
          Gerador Preditivo de Odds
        </h1>
      </div>
      <p className="text-lg text-gray-400 max-w-3xl mx-auto">
        Use a IA para analisar features estatísticas avançadas e gerar odds de apostas em futebol.
      </p>
    </header>
  );
};

export default Header;
