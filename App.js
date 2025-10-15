import React, { useState, useEffect, createContext, useContext } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// ==============================================
// Configuração Global do Timer
// ==============================================

const TimerContext = createContext();

const ProvedorTimer = ({ children }) => {
  const [tempoTela, setTempoTela] = useState(0);
  const [ativo, setAtivo] = useState(true);
  const [meta] = useState(2 * 3600); // 2 horas em segundos
  const [desafios, setDesafios] = useState([
    { id: 1, nome: 'Sem redes sociais por 1h', completado: false, pontos: 50 },
    { id: 2, nome: 'Ativar Modo Foco 3x', completado: false, pontos: 75 },
    {
      id: 3,
      nome: 'Fazer 2 atividades offline',
      completado: false,
      pontos: 100,
    },
  ]);
  const [pontos, setPontos] = useState(0);

  useEffect(() => {
    let intervalo = null;
    if (ativo) {
      intervalo = setInterval(() => {
        setTempoTela((anterior) => anterior + 1);
      }, 1000);
    }
    return () => clearInterval(intervalo);
  }, [ativo]);

  const completarDesafio = (id) => {
    const desafio = desafios.find((d) => d.id === id);
    if (desafio && !desafio.completado) {
      setPontos((anterior) => anterior + desafio.pontos);
      setDesafios((anterior) =>
        anterior.map((d) => (d.id === id ? { ...d, completado: true } : d))
      );
    }
  };

  return (
    <TimerContext.Provider
      value={{
        tempoTela,
        ativo,
        setAtivo,
        meta,
        desafios,
        pontos,
        completarDesafio,
      }}>
      {children}
    </TimerContext.Provider>
  );
};

const useTimer = () => useContext(TimerContext);

/*Componentes e cores*/

const cores = {
  primaria: '#5E8B7E',
  primariaClara: '#A7C4BC',
  primariaEscura: '#2F5D62',
  secundaria: '#FF7B54',
  secundariaClara: '#FFB26B',
  secundariaEscura: '#D5603F',
  branco: '#FFFFFF',
  cinzaClaro: '#F5F7FA',
  cinzaMedio: '#E1E5EE',
  cinzaEscuro: '#797B7E',
  preto: '#1F1F1F',
  sucesso: '#4CAF50',
  aviso: '#FFC107',
  perigo: '#F44336',
  info: '#2196F3',
};

/*Estilos globais*/
const estilosGlobais = StyleSheet.create({
  container: {
    backgroundColor: cores.cinzaClaro,
    flex: 1,
  },
  scrollContainer: {
    paddingBottom: 20,
    paddingHorizontal: 40,
  },
  paddingTela: {
    paddingHorizontal: 20,
  },
  tituloSecao: {
    fontSize: 20,
    fontWeight: '600',
    color: cores.preto,
    marginBottom: 16,
  },
  sombra: {
    shadowColor: cores.preto,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});

/*Cabeçalho*/

const Cabecalho = ({ titulo, voltar }) => (
  <View style={estilos.cabecalho}>
    {voltar && (
      <TouchableOpacity onPress={voltar} style={estilos.botaoVoltar}>
        <Ionicons name="arrow-back" size={24} color={cores.branco} />
      </TouchableOpacity>
    )}
    <Text style={estilos.textoCabecalho}>{titulo}</Text>
  </View>
);

const Cartao = ({ children, style }) => (
  <View style={[estilos.cartao, style]}>{children}</View>
);

const formatarTempo = (segundos) => {
  const horas = Math.floor(segundos / 3600);
  const minutos = Math.floor((segundos % 3600) / 60);
  const segs = segundos % 60;
  return `${horas.toString().padStart(2, '0')}:${minutos
    .toString()
    .padStart(2, '0')}:${segs.toString().padStart(2, '0')}`;
};

// ==============================================
// Telas do Aplicativo
// ==============================================

function TelaInicial({ navigation }) {
  const { tempoTela } = useTimer();

  const recursos = [
    { id: 'monitoramento', titulo: 'Monitoramento', icone: 'stats-chart' },
    { id: 'modos', titulo: 'Modos Detox', icone: 'moon' },
    { id: 'gamificacao', titulo: 'Gamificação', icone: 'game-controller' },
    { id: 'atividades', titulo: 'Atividades', icone: 'walk' },
    { id: 'historico', titulo: 'Histórico', icone: 'calendar' },
  ];

  const dicasDiarias = [
    'Desative notificações de redes sociais durante o trabalho',
    'Estabeleça zonas livres de celular em casa',
    'Use o modo avião durante refeições',
    'Programe horários específicos para checar e-mails',
  ];
  const [dicaDiaria] = useState(
    dicasDiarias[Math.floor(Math.random() * dicasDiarias.length)]
  );

  return (
    <View style={estilosGlobais.container}>
      <Cabecalho titulo="Digital Detox" />
      <ScrollView
        contentContainerStyle={[
          estilosGlobais.scrollContainer,
          estilosGlobais.paddingTela,
        ]}>
        <View style={estilos.containerHeroi}>
          <Ionicons name="phone-portrait" size={100} color={cores.primaria} />
          <Text style={estilos.tituloHeroi}>Controle seu Tempo de Tela</Text>
          <Text style={estilos.subtituloHeroi}>
            Reduza distrações digitais e melhore seu bem-estar
          </Text>
        </View>

        <Cartao>
          <Text style={estilos.tituloCartao}>Tempo Atual</Text>
          <Text style={estilos.valorTempo}>{formatarTempo(tempoTela)}</Text>
        </Cartao>

        <Text style={estilosGlobais.tituloSecao}>Recursos</Text>

        <View style={estilos.gradeRecursos}>
          {recursos.map((recurso) => (
            <TouchableOpacity
              key={recurso.id}
              style={[
                estilos.cartaoRecurso,
                { backgroundColor: cores.primaria },
              ]}
              onPress={() => navigation.navigate(recurso.titulo)}>
              <Ionicons name={recurso.icone} size={32} color={cores.branco} />
              <Text style={estilos.textoRecurso}>{recurso.titulo}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Cartao style={estilos.cartaoDica}>
          <Text style={estilos.tituloDica}>Dica do Dia</Text>
          <Text style={estilos.textoDica}>{dicaDiaria}</Text>
        </Cartao>
      </ScrollView>
    </View>
  );
}

function TelaMonitoramento({ navigation }) {
  const { tempoTela, ativo, setAtivo, meta } = useTimer();
  const progresso = Math.min(100, (tempoTela / meta) * 100);

  return (
    <View style={estilosGlobais.container}>
      <Cabecalho titulo="Monitoramento" voltar={() => navigation.goBack()} />
      <ScrollView
        contentContainerStyle={[
          estilosGlobais.scrollContainer,
          estilosGlobais.paddingTela,
        ]}>
        <Cartao>
          <Text style={estilos.tituloCartao}>Tempo de Tela Hoje</Text>
          <Text style={estilos.valorTempo}>{formatarTempo(tempoTela)}</Text>
          <Text style={estilos.textoMeta}>
            Meta diária: {formatarTempo(meta)}
          </Text>

          <View style={estilos.containerProgresso}>
            <View
              style={[estilos.barraProgresso, { width: `${progresso}%` }]}
            />
          </View>

          <TouchableOpacity
            style={[
              estilos.botaoAcao,
              {
                backgroundColor: ativo ? cores.perigo : cores.sucesso,
              },
            ]}
            onPress={() => setAtivo(!ativo)}>
            <Text style={estilos.textoBotaoAcao}>
              {ativo ? 'Pausar' : 'Continuar'}
            </Text>
          </TouchableOpacity>
        </Cartao>

        <Cartao>
          <Text style={estilos.tituloCartao}>Estatísticas</Text>
          <View style={estilos.linhaEstatistica}>
            <Text style={estilos.rotuloEstatistica}>Tempo restante:</Text>
            <Text style={estilos.valorEstatistica}>
              {formatarTempo(Math.max(0, meta - tempoTela))}
            </Text>
          </View>
          <View style={estilos.linhaEstatistica}>
            <Text style={estilos.rotuloEstatistica}>Porcentagem:</Text>
            <Text style={estilos.valorEstatistica}>
              {Math.round(progresso)}%
            </Text>
          </View>
        </Cartao>
      </ScrollView>
    </View>
  );
}

function TelaModos({ navigation }) {
  const [modoAtivo, setModoAtivo] = useState(null);

  const modos = [
    {
      id: 'foco',
      nome: 'Modo Foco',
      descricao: 'Bloqueia apps distrativos para melhorar concentração',
      icone: 'md-school',
      cor: cores.primaria,
    },
    {
      id: 'sono',
      nome: 'Modo Sono',
      descricao: 'Reduz notificações e luz azul para melhorar o sono',
      icone: 'md-moon',
      cor: cores.secundariaEscura,
    },
    {
      id: 'social',
      nome: 'Modo Social',
      descricao: 'Incentiva interações offline com amigos e família',
      icone: 'md-people',
      cor: cores.secundaria,
    },
  ];

  return (
    <View style={estilosGlobais.container}>
      <Cabecalho titulo="Modos Detox" voltar={() => navigation.goBack()} />
      <ScrollView
        contentContainerStyle={[
          estilosGlobais.scrollContainer,
          estilosGlobais.paddingTela,
        ]}>
        <Text style={estilosGlobais.tituloSecao}>Modos Disponíveis</Text>

        {modos.map((modo) => (
          <TouchableOpacity
            key={modo.id}
            onPress={() =>
              setModoAtivo(modoAtivo === modo.id ? null : modo.id)
            }>
            <Cartao
              style={[
                estilos.cartaoModo,
                modoAtivo === modo.id && {
                  borderLeftWidth: 6,
                  borderLeftColor: modo.cor,
                },
              ]}>
              <View style={estilos.cabecalhoModo}>
                <Ionicons name={modo.icone} size={28} color={modo.cor} />
                <Text style={estilos.nomeModo}>{modo.nome}</Text>
                {modoAtivo === modo.id && (
                  <View style={estilos.emblemaAtivo}>
                    <Text style={estilos.textoEmblemaAtivo}>ATIVO</Text>
                  </View>
                )}
              </View>

              <Text style={estilos.descricaoModo}>{modo.descricao}</Text>

              <TouchableOpacity
                style={[estilos.botaoAtivar, { backgroundColor: modo.cor }]}
                onPress={() =>
                  setModoAtivo(modoAtivo === modo.id ? null : modo.id)
                }>
                <Text style={estilos.textoBotaoAtivar}>
                  {modoAtivo === modo.id ? 'Desativar' : 'Ativar'}
                </Text>
              </TouchableOpacity>
            </Cartao>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

function TelaGamificacao({ navigation }) {
  const { tempoTela, pontos, desafios, completarDesafio } = useTimer();

  return (
    <View style={estilosGlobais.container}>
      <Cabecalho titulo="Gamificação" voltar={() => navigation.goBack()} />
      <ScrollView
        contentContainerStyle={[
          estilosGlobais.scrollContainer,
          estilosGlobais.paddingTela,
        ]}>
        <Cartao>
          <View style={estilos.containerPontos}>
            <View>
              <Text style={estilos.rotuloPontos}>Seus Pontos</Text>
              <Text style={estilos.valorPontos}>{pontos}</Text>
            </View>
            <View>
              <Text style={estilos.rotuloPontos}>Tempo de Tela</Text>
              <Text style={estilos.valorPontos}>
                {formatarTempo(tempoTela)}
              </Text>
            </View>
          </View>
        </Cartao>

        <Text style={estilosGlobais.tituloSecao}>Desafios Diários</Text>

        {desafios.map((desafio) => (
          <Cartao key={desafio.id} style={estilos.cartaoDesafio}>
            <View style={estilos.cabecalhoDesafio}>
              <Ionicons
                name={
                  desafio.completado ? 'checkmark-circle' : 'ellipse-outline'
                }
                size={24}
                color={desafio.completado ? cores.sucesso : cores.cinzaMedio}
              />
              <Text
                style={[
                  estilos.nomeDesafio,
                  desafio.completado && estilos.desafioCompletado,
                ]}>
                {desafio.nome}
              </Text>
              <Text style={estilos.pontosDesafio}>+{desafio.pontos} pts</Text>
            </View>

            {!desafio.completado && (
              <TouchableOpacity
                style={estilos.botaoCompletar}
                onPress={() => completarDesafio(desafio.id)}>
                <Text style={estilos.textoBotaoCompletar}>
                  Completar Desafio
                </Text>
              </TouchableOpacity>
            )}
          </Cartao>
        ))}

        <Text style={estilosGlobais.tituloSecao}>Recompensas</Text>

        <Cartao>
          {[
            { pontos: 100, recompensa: 'Pacote de wallpapers exclusivos' },
            { pontos: 250, recompensa: 'Desconto em app de meditação' },
            { pontos: 500, recompensa: 'E-book grátis à sua escolha' },
          ].map((item, index) => (
            <View
              key={index}
              style={[
                estilos.itemRecompensa,
                index !== 2 && estilos.bordaItemRecompensa,
              ]}>
              <Text style={estilos.pontosRecompensa}>{item.pontos} pts</Text>
              <Text style={estilos.textoRecompensa}>{item.recompensa}</Text>
              <Ionicons
                name={pontos >= item.pontos ? 'trophy' : 'lock-closed'}
                size={20}
                color={
                  pontos >= item.pontos ? cores.secundaria : cores.cinzaMedio
                }
              />
            </View>
          ))}
        </Cartao>
      </ScrollView>
    </View>
  );
}

function TelaAtividades({ navigation }) {
  const [categoriaExpandida, setCategoriaExpandida] = useState(null);

  const categorias = [
    {
      id: 'relaxamento',
      nome: 'Relaxamento',
      icone: 'book',
      atividades: [
        { id: 1, nome: 'Ler um livro', duracao: '30-60 min' },
        { id: 2, nome: 'Ouvir música', duracao: '15-30 min' },
      ],
    },
    {
      id: 'fisico',
      nome: 'Físico',
      icone: 'walk',
      atividades: [
        { id: 3, nome: 'Fazer uma caminhada', duracao: '20-40 min' },
        { id: 4, nome: 'Praticar yoga', duracao: '30-45 min' },
      ],
    },
  ];

  return (
    <View style={estilosGlobais.container}>
      <Cabecalho titulo="Atividades" voltar={() => navigation.goBack()} />
      <ScrollView
        contentContainerStyle={[
          estilosGlobais.scrollContainer,
          estilosGlobais.paddingTela,
        ]}>
        <Text style={estilosGlobais.tituloSecao}>Atividades Sugeridas</Text>

        {categorias.map((categoria) => (
          <Cartao key={categoria.id}>
            <TouchableOpacity
              style={estilos.cabecalhoCategoria}
              onPress={() =>
                setCategoriaExpandida(
                  categoriaExpandida === categoria.id ? null : categoria.id
                )
              }>
              <Ionicons
                name={categoria.icone}
                size={24}
                color={cores.primaria}
              />
              <Text style={estilos.nomeCategoria}>{categoria.nome}</Text>
              <Ionicons
                name={
                  categoriaExpandida === categoria.id
                    ? 'chevron-up'
                    : 'chevron-down'
                }
                size={20}
                color={cores.cinzaEscuro}
              />
            </TouchableOpacity>

            {categoriaExpandida === categoria.id && (
              <View style={estilos.containerAtividades}>
                {categoria.atividades.map((atividade) => (
                  <TouchableOpacity
                    key={atividade.id}
                    style={estilos.itemAtividade}>
                    <View style={estilos.infoAtividade}>
                      <Text style={estilos.nomeAtividade}>
                        {atividade.nome}
                      </Text>
                      <Text style={estilos.duracaoAtividade}>
                        {atividade.duracao}
                      </Text>
                    </View>
                    <Ionicons
                      name="arrow-forward"
                      size={20}
                      color={cores.primaria}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </Cartao>
        ))}
      </ScrollView>
    </View>
  );
}

function TelaHistorico({ navigation }) {
  const { tempoTela } = useTimer();
  const [periodo, setPeriodo] = useState('semana');

  // Dados simulados do histórico
  const dadosHistorico = [
    { data: '2023-06-12', tempoTela: 145, meta: 120 },
    { data: '2023-06-11', tempoTela: 132, meta: 120 },
    { data: '2023-06-10', tempoTela: 98, meta: 120 },
  ];

  return (
    <View style={estilosGlobais.container}>
      <Cabecalho titulo="Histórico" voltar={() => navigation.goBack()} />
      <ScrollView
        contentContainerStyle={[
          estilosGlobais.scrollContainer,
          estilosGlobais.paddingTela,
        ]}>
        <Cartao>
          <Text style={estilos.tituloCartao}>Semana Atual</Text>
          <Text style={estilos.valorTempo}>{formatarTempo(tempoTela)}</Text>
          <Text style={estilos.textoMeta}>Tempo total de tela</Text>
        </Cartao>

        <Text style={estilosGlobais.tituloSecao}>Detalhes Diários</Text>

        {dadosHistorico.map((dia, index) => (
          <Cartao key={index}>
            <View style={estilos.cabecalhoDia}>
              <Text style={estilos.dataDia}>
                {new Date(dia.data).toLocaleDateString()}
              </Text>
              <Text style={estilos.tempoDia}>
                {formatarTempo(dia.tempoTela)}
              </Text>
            </View>
            <View style={estilos.containerProgresso}>
              <View
                style={[
                  estilos.barraProgresso,
                  {
                    width: `${Math.min(
                      100,
                      (dia.tempoTela / dia.meta) * 100
                    )}%`,
                    backgroundColor:
                      dia.tempoTela > dia.meta ? cores.perigo : cores.sucesso,
                  },
                ]}
              />
            </View>
            <Text style={estilos.textoMeta}>
              Meta: {formatarTempo(dia.meta)} •
              {dia.tempoTela > dia.meta ? (
                <Text style={estilos.textoAcima}>
                  {' '}
                  {formatarTempo(dia.tempoTela - dia.meta)} acima
                </Text>
              ) : (
                <Text style={estilos.textoAbaixo}>
                  {' '}
                  {formatarTempo(dia.meta - dia.tempoTela)} abaixo
                </Text>
              )}
            </Text>
          </Cartao>
        ))}
      </ScrollView>
    </View>
  );
}

// ==============================================
// Configuração de Navegação e Estilos
// ==============================================

const Stack = createStackNavigator();

const estilos = StyleSheet.create({
  cabecalho: {
    height: 60,
    backgroundColor: cores.primaria,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    ...estilosGlobais.sombra,
  },
  textoCabecalho: {
    color: cores.branco,
    fontSize: 20,
    fontWeight: '600',
  },
  botaoVoltar: {
    position: 'absolute',
    left: 16,
    zIndex: 1,
  },
  containerHeroi: {
    alignItems: 'center',
    marginTop: 20,
  },
  tituloHeroi: {
    fontSize: 24,
    fontWeight: '700',
    color: cores.preto,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtituloHeroi: {
    fontSize: 16,
    color: cores.cinzaEscuro,
    textAlign: 'center',
    lineHeight: 24,
  },
  gradeRecursos: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  cartaoRecurso: {
    width: '48%',
    aspectRatio: 1,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  textoRecurso: {
    color: cores.branco,
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
  },
  cartao: {
    backgroundColor: cores.branco,
    borderRadius: 12,
    padding: 20,
    marginVertical: 10, // top e bottom
    marginHorizontal: 0, // left e right
    ...estilosGlobais.sombra,
  },
  tituloDica: {
    fontSize: 18,
    fontWeight: '600',
    color: cores.preto,
    marginBottom: 8,
  },
  textoDica: {
    fontSize: 16,
    color: cores.cinzaEscuro,
    lineHeight: 24,
  },
  cartaoDica: {
    marginBottom: 16,
    marginTop: -0,
  },
  tituloCartao: {
    fontSize: 18,
    fontWeight: '600',
    color: cores.preto,
    marginBottom: 16,
  },
  valorTempo: {
    fontSize: 36,
    fontWeight: '700',
    color: cores.primaria,
    textAlign: 'center',
    marginVertical: 8,
  },
  textoMeta: {
    fontSize: 16,
    color: cores.cinzaEscuro,
    textAlign: 'center',
    marginBottom: 16,
  },
  containerProgresso: {
    height: 10,
    backgroundColor: cores.cinzaClaro,
    borderRadius: 5,
    marginVertical: 20,
    overflow: 'hidden',
  },
  barraProgresso: {
    height: '100%',
  },
  botaoAcao: {
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  textoBotaoAcao: {
    color: cores.branco,
    fontSize: 16,
    fontWeight: '600',
  },
  linhaEstatistica: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  rotuloEstatistica: {
    fontSize: 16,
    color: cores.cinzaEscuro,
  },
  valorEstatistica: {
    fontSize: 16,
    fontWeight: '600',
    color: cores.preto,
  },
  cartaoModo: {
    marginBottom: 16,
  },
  cabecalhoModo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  nomeModo: {
    fontSize: 18,
    fontWeight: '600',
    color: cores.preto,
    flex: 1,
    marginLeft: 12,
  },
  descricaoModo: {
    fontSize: 16,
    color: cores.cinzaEscuro,
    marginBottom: 16,
    lineHeight: 24,
  },
  botaoAtivar: {
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  textoBotaoAtivar: {
    color: cores.branco,
    fontSize: 16,
    fontWeight: '600',
  },
  emblemaAtivo: {
    backgroundColor: cores.sucesso,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  textoEmblemaAtivo: {
    color: cores.branco,
    fontSize: 12,
    fontWeight: 'bold',
  },
  containerPontos: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rotuloPontos: {
    fontSize: 16,
    color: cores.cinzaEscuro,
  },
  valorPontos: {
    fontSize: 24,
    fontWeight: '700',
    color: cores.secundaria,
  },
  cartaoDesafio: {
    marginBottom: 12,
  },
  cabecalhoDesafio: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  nomeDesafio: {
    flex: 1,
    fontSize: 16,
    color: cores.preto,
    marginLeft: 12,
  },
  desafioCompletado: {
    textDecorationLine: 'line-through',
    color: cores.cinzaEscuro,
  },
  pontosDesafio: {
    fontSize: 16,
    fontWeight: '600',
    color: cores.secundaria,
    marginLeft: 12,
  },
  botaoCompletar: {
    backgroundColor: cores.primaria,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  textoBotaoCompletar: {
    color: cores.branco,
    fontSize: 16,
    fontWeight: '600',
  },
  itemRecompensa: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  bordaItemRecompensa: {
    borderBottomWidth: 1,
    borderBottomColor: cores.cinzaMedio,
  },
  pontosRecompensa: {
    width: 80,
    fontSize: 16,
    fontWeight: '600',
    color: cores.secundaria,
  },
  textoRecompensa: {
    flex: 1,
    fontSize: 16,
    color: cores.preto,
  },
  cabecalhoCategoria: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  nomeCategoria: {
    fontSize: 18,
    fontWeight: '600',
    color: cores.preto,
    marginLeft: 12,
    flex: 1,
  },
  containerAtividades: {
    marginTop: 8,
  },
  itemAtividade: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: cores.cinzaMedio,
  },
  infoAtividade: {
    flex: 1,
  },
  nomeAtividade: {
    fontSize: 16,
    color: cores.preto,
  },
  duracaoAtividade: {
    fontSize: 14,
    color: cores.cinzaEscuro,
    marginTop: 4,
  },
  cabecalhoDia: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  dataDia: {
    fontSize: 16,
    fontWeight: '600',
    color: cores.preto,
  },
  tempoDia: {
    fontSize: 16,
    fontWeight: '600',
    color: cores.primaria,
  },
  textoAcima: {
    color: cores.perigo,
  },
  textoAbaixo: {
    color: cores.sucesso,
  },
});

export default function App() {
  return (
    <ProvedorTimer>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Início" component={TelaInicial} />
          <Stack.Screen name="Monitoramento" component={TelaMonitoramento} />
          <Stack.Screen name="Modos Detox" component={TelaModos} />
          <Stack.Screen name="Gamificação" component={TelaGamificacao} />
          <Stack.Screen name="Atividades" component={TelaAtividades} />
          <Stack.Screen name="Histórico" component={TelaHistorico} />
        </Stack.Navigator>
      </NavigationContainer>
    </ProvedorTimer>
  );
}
