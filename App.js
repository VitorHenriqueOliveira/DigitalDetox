import React, { useState, useEffect, createContext, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
  Dimensions,
  TextInput,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

// ==============================================
// Configuração Global do Timer
// ==============================================

const TimerContext = createContext();

const ProvedorTimer = ({ children }) => {
  const [tempoTela, setTempoTela] = useState(0);
  const [ativo, setAtivo] = useState(true);
  const [metaPersonalizada, setMetaPersonalizada] = useState(2 * 3600); // 2 horas em segundos
  const [tempoUsuario, setTempoUsuario] = useState(0);
  const [avaliacaoFeita, setAvaliacaoFeita] = useState(false);
  const [desafios, setDesafios] = useState([
    { id: 1, nome: "Sem redes sociais por 1h", completado: false, pontos: 50 },
    { id: 2, nome: "Ler um livro por 30min", completado: false, pontos: 75 },
    {
      id: 3,
      nome: "Fazer 2 atividades offline",
      completado: false,
      pontos: 100,
    },
    { id: 4, nome: "Meditar por 15min", completado: false, pontos: 60 },
    { id: 5, nome: "Caminhar sem celular", completado: false, pontos: 80 },
  ]);
  const [pontos, setPontos] = useState(0);
  const [rotinas, setRotinas] = useState([]);
  const [curiosidades] = useState([
    "Estudos mostram que reduzir o tempo de tela em 1h por dia pode melhorar a qualidade do sono em 30%",
    "O uso excessivo de celular está ligado ao aumento da ansiedade e depressão em jovens adultos",
    "Pessoas que desativam notificações relatam 40% mais produtividade no trabalho",
    "A luz azul das telas suprime a melatonina, hormônio crucial para o sono",
    "Intervalos de 5min a cada hora de tela reduzem a fadiga ocular em 60%",
    "Conversas presenciais ativam áreas do cérebro relacionadas à empatia que as digitais não alcançam",
  ]);

  useEffect(() => {
    let intervalo = null;
    if (ativo) {
      intervalo = setInterval(() => {
        setTempoTela((anterior) => anterior + 1);
      }, 1000);
    }
    return () => clearInterval(intervalo);
  }, [ativo]);

  const avaliarTempoUsuario = (horas) => {
    const tempoSegundos = horas * 3600;
    setTempoUsuario(tempoSegundos);
    setAvaliacaoFeita(true);

    // Definir meta personalizada baseada no tempo atual do usuário
    if (tempoSegundos > 6 * 3600) {
      // Mais de 6 horas
      setMetaPersonalizada(Math.floor(tempoSegundos * 0.7)); // Reduzir 30%
    } else if (tempoSegundos > 4 * 3600) {
      // Mais de 4 horas
      setMetaPersonalizada(Math.floor(tempoSegundos * 0.8)); // Reduzir 20%
    } else if (tempoSegundos > 2 * 3600) {
      // Mais de 2 horas
      setMetaPersonalizada(Math.floor(tempoSegundos * 0.9)); // Reduzir 10%
    } else {
      setMetaPersonalizada(tempoSegundos); // Manter o mesmo
    }
  };

  const completarDesafio = (id) => {
    const desafio = desafios.find((d) => d.id === id);
    if (desafio && !desafio.completado) {
      setPontos((anterior) => anterior + desafio.pontos);
      setDesafios((anterior) =>
        anterior.map((d) => (d.id === id ? { ...d, completado: true } : d))
      );
      Alert.alert("🎉 Parabéns!", `Você ganhou ${desafio.pontos} pontos!`);
    }
  };

  const adicionarRotina = (novaRotina) => {
    setRotinas([
      ...rotinas,
      { ...novaRotina, id: Date.now(), completada: false },
    ]);
  };

  const completarRotina = (id) => {
    setRotinas(
      rotinas.map((rotina) =>
        rotina.id === id ? { ...rotina, completada: true } : rotina
      )
    );
    setPontos(pontos + 25); // Pontos por completar rotina
  };

  return (
    <TimerContext.Provider
      value={{
        tempoTela,
        ativo,
        setAtivo,
        meta: metaPersonalizada,
        tempoUsuario,
        avaliacaoFeita,
        avaliarTempoUsuario,
        desafios,
        pontos,
        completarDesafio,
        rotinas,
        adicionarRotina,
        completarRotina,
        curiosidades,
      }}
    >
      {children}
    </TimerContext.Provider>
  );
};

const useTimer = () => useContext(TimerContext);

/*Componentes e cores*/

const cores = {
  primaria: "#5E8B7E",
  primariaClara: "#A7C4BC",
  primariaEscura: "#2F5D62",
  secundaria: "#FF7B54",
  secundariaClara: "#FFB26B",
  secundariaEscura: "#D5603F",
  branco: "#FFFFFF",
  cinzaClaro: "#F5F7FA",
  cinzaMedio: "#E1E5EE",
  cinzaEscuro: "#797B7E",
  preto: "#1F1F1F",
  sucesso: "#4CAF50",
  aviso: "#FFC107",
  perigo: "#F44336",
  info: "#2196F3",
};

/*Estilos globais*/
const estilosGlobais = StyleSheet.create({
  container: {
    backgroundColor: cores.cinzaClaro,
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  paddingTela: {
    paddingHorizontal: 20,
  },
  tituloSecao: {
    fontSize: 22,
    fontWeight: "700",
    color: cores.preto,
    marginBottom: 20,
    marginTop: 10,
    paddingHorizontal: 20,
  },
  sombra: {
    shadowColor: cores.preto,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  sombraSuave: {
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
    <StatusBar backgroundColor={cores.primaria} barStyle="light-content" />
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
  return `${horas.toString().padStart(2, "0")}:${minutos
    .toString()
    .padStart(2, "0")}:${segs.toString().padStart(2, "0")}`;
};

// ==============================================
// Telas do Aplicativo
// ==============================================

function TelaInicial({ navigation }) {
  const { tempoTela, pontos, avaliacaoFeita } = useTimer();

  const recursos = [
    { id: "avaliacao", titulo: "Avaliação", icone: "analytics" },
    { id: "rotinas", titulo: "Minhas Rotinas", icone: "list" },
    { id: "gamificacao", titulo: "Gamificação", icone: "game-controller" },
    { id: "curiosidades", titulo: "Curiosidades", icone: "bulb" },
    { id: "historico", titulo: "Histórico", icone: "calendar" },
  ];

  const dicasDiarias = [
    "Comece reduzindo 15min por dia do tempo de tela",
    "Estabeleça zonas livres de celular em casa",
    "Use o modo avião durante refeições",
    "Programe horários específicos para checar redes sociais",
  ];
  const [dicaDiaria] = useState(
    dicasDiarias[Math.floor(Math.random() * dicasDiarias.length)]
  );

  return (
    <View style={estilosGlobais.container}>
      <Cabecalho titulo="Digital Detox" />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[
          estilosGlobais.scrollContainer,
          { paddingHorizontal: 20 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={estilos.containerAviso}>
          <Ionicons name="warning" size={24} color={cores.aviso} />
          <Text style={estilos.textoAviso}>
            Este app auxilia no desmame digital. Resultados dependem do seu
            comprometimento.
          </Text>
        </View>

        <View style={estilos.containerHeroi}>
          <View style={estilos.iconeHeroi}>
            <Ionicons name="phone-portrait" size={80} color={cores.branco} />
          </View>
          <Text style={estilos.tituloHeroi}>Controle seu Tempo de Tela</Text>
          <Text style={estilos.subtituloHeroi}>
            Reduza distrações digitais e melhore seu bem-estar
          </Text>
        </View>

        {!avaliacaoFeita ? (
          <Cartao style={estilos.cartaoAvaliacao}>
            <Text style={estilos.tituloCartao}>Vamos Começar!</Text>
            <Text style={estilos.textoAvaliacao}>
              Para personalizar sua experiência, precisamos saber sobre seus
              hábitos atuais.
            </Text>
            <TouchableOpacity
              style={estilos.botaoPrimario}
              onPress={() => navigation.navigate("Avaliação")}
            >
              <Text style={estilos.textoBotaoPrimario}>Fazer Avaliação</Text>
            </TouchableOpacity>
          </Cartao>
        ) : (
          <Cartao style={estilos.cartaoTempo}>
            <Text style={estilos.tituloCartao}>Tempo Atual</Text>
            <Text style={estilos.valorTempo}>{formatarTempo(tempoTela)}</Text>
            <View style={estilos.containerMeta}>
              <Ionicons
                name="time-outline"
                size={16}
                color={cores.cinzaEscuro}
              />
              <Text style={estilos.textoMeta}>
                Meta personalizada para você
              </Text>
            </View>
          </Cartao>
        )}

        <Text style={estilosGlobais.tituloSecao}>Recursos</Text>

        <View style={estilos.gradeRecursos}>
          {recursos.map((recurso) => (
            <TouchableOpacity
              key={recurso.id}
              style={estilos.cartaoRecurso}
              onPress={() => navigation.navigate(recurso.titulo)}
            >
              <View style={estilos.iconeRecurso}>
                <Ionicons
                  name={recurso.icone}
                  size={28}
                  color={cores.primaria}
                />
              </View>
              <Text style={estilos.textoRecurso}>{recurso.titulo}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Cartao style={estilos.cartaoDica}>
          <View style={estilos.cabecalhoDica}>
            <Ionicons name="bulb-outline" size={24} color={cores.secundaria} />
            <Text style={estilos.tituloDica}>Dica do Dia</Text>
          </View>
          <Text style={estilos.textoDica}>{dicaDiaria}</Text>
        </Cartao>

        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}

function TelaAvaliacao({ navigation }) {
  const { avaliarTempoUsuario } = useTimer();
  const [horas, setHoras] = useState("");

  const avaliar = () => {
    const horasNum = parseFloat(horas);
    if (isNaN(horasNum) || horasNum < 0 || horasNum > 24) {
      Alert.alert("Erro", "Por favor, digite um número válido de horas (0-24)");
      return;
    }
    avaliarTempoUsuario(horasNum);
    navigation.navigate("Resultado Avaliação", { horas: horasNum });
  };

  return (
    <View style={estilosGlobais.container}>
      <Cabecalho
        titulo="Avaliação Inicial"
        voltar={() => navigation.goBack()}
      />
      <ScrollView
        contentContainerStyle={[
          estilosGlobais.scrollContainer,
          { paddingHorizontal: 20 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Cartao style={estilos.cartaoAvaliacao}>
          <Ionicons
            name="analytics"
            size={60}
            color={cores.primaria}
            style={estilos.iconeCentral}
          />
          <Text style={estilos.tituloAvaliacao}>
            Quantas horas por dia você usa o celular?
          </Text>
          <Text style={estilos.textoAvaliacao}>
            Esta informação nos ajudará a criar um plano personalizado para
            reduzir gradualmente seu tempo de tela.
          </Text>

          <View style={estilos.containerInput}>
            <TextInput
              style={estilos.input}
              placeholder="Ex: 4.5"
              keyboardType="numeric"
              value={horas}
              onChangeText={setHoras}
            />
            <Text style={estilos.textoInput}>horas por dia</Text>
          </View>

          <TouchableOpacity
            style={[estilos.botaoPrimario, !horas && estilos.botaoDesabilitado]}
            onPress={avaliar}
            disabled={!horas}
          >
            <Text style={estilos.textoBotaoPrimario}>Avaliar Meu Tempo</Text>
          </TouchableOpacity>
        </Cartao>
      </ScrollView>
    </View>
  );
}

function TelaResultadoAvaliacao({ route, navigation }) {
  const { horas } = route.params;
  const { meta } = useTimer();

  const getAvaliacao = () => {
    if (horas <= 2)
      return {
        status: "Excelente",
        cor: cores.sucesso,
        mensagem: "Seu tempo de tela está dentro do recomendado!",
      };
    if (horas <= 4)
      return {
        status: "Bom",
        cor: cores.info,
        mensagem: "Seu tempo está razoável, mas podemos melhorar!",
      };
    if (horas <= 6)
      return {
        status: "Preocupante",
        cor: cores.aviso,
        mensagem: "Vamos trabalhar para reduzir esse tempo!",
      };
    return {
      status: "Crítico",
      cor: cores.perigo,
      mensagem: "É importante reduzir significativamente seu tempo de tela!",
    };
  };

  const avaliacao = getAvaliacao();

  const recomendacoes = [
    "Estabeleça horários específicos para usar redes sociais",
    "Ative o modo não perturbe durante o trabalho",
    "Deixe o carregador fora do quarto à noite",
    "Substitua 30min de tela por leitura ou exercício",
    "Desative notificações de apps não essenciais",
  ];

  return (
    <View style={estilosGlobais.container}>
      <Cabecalho
        titulo="Resultado da Avaliação"
        voltar={() => navigation.goBack()}
      />
      <ScrollView
        contentContainerStyle={[
          estilosGlobais.scrollContainer,
          { paddingHorizontal: 20 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Cartao
          style={[estilos.cartaoResultado, { borderLeftColor: avaliacao.cor }]}
        >
          <Text style={estilos.tituloResultado}>Seu Tempo: {horas}h/dia</Text>
          <View
            style={[estilos.badgeStatus, { backgroundColor: avaliacao.cor }]}
          >
            <Text style={estilos.textoBadge}>{avaliacao.status}</Text>
          </View>
          <Text style={estilos.mensagemResultado}>{avaliacao.mensagem}</Text>

          <View style={estilos.containerMeta}>
            <Ionicons name="flag" size={20} color={cores.primaria} />
            <Text style={estilos.textoMeta}>
              Sua meta personalizada: {formatarTempo(meta)} por dia
            </Text>
          </View>
        </Cartao>

        <Text style={estilosGlobais.tituloSecao}>
          Recomendações Personalizadas
        </Text>

        {recomendacoes.map((recomendacao, index) => (
          <Cartao key={index} style={estilos.cartaoRecomendacao}>
            <View style={estilos.numeroRecomendacao}>
              <Text style={estilos.textoNumero}>{index + 1}</Text>
            </View>
            <Text style={estilos.textoRecomendacao}>{recomendacao}</Text>
          </Cartao>
        ))}

        <TouchableOpacity
          style={estilos.botaoPrimario}
          onPress={() => navigation.navigate("Minhas Rotinas")}
        >
          <Text style={estilos.textoBotaoPrimario}>Criar Minhas Rotinas</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

function TelaRotinas({ navigation }) {
  const { rotinas, adicionarRotina, completarRotina } = useTimer();
  const [novaRotina, setNovaRotina] = useState("");
  const [categoria, setCategoria] = useState("manha");

  const categorias = [
    { id: "manha", nome: "Manhã", icone: "sunny" },
    { id: "tarde", nome: "Tarde", icone: "partly-sunny" },
    { id: "noite", nome: "Noite", icone: "moon" },
  ];

  const adicionarNovaRotina = () => {
    if (novaRotina.trim()) {
      adicionarRotina({
        atividade: novaRotina.trim(),
        categoria: categoria,
        horario:
          categorias.find((cat) => cat.id === categoria)?.nome || "Geral",
      });
      setNovaRotina("");
      Alert.alert("Sucesso", "Rotina adicionada com sucesso!");
    }
  };

  return (
    <View style={estilosGlobais.container}>
      <Cabecalho titulo="Minhas Rotinas" voltar={() => navigation.goBack()} />
      <ScrollView
        contentContainerStyle={[
          estilosGlobais.scrollContainer,
          { paddingHorizontal: 20 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Cartao>
          <Text style={estilos.tituloCartao}>Adicionar Nova Rotina</Text>
          <TextInput
            style={estilos.inputRotina}
            placeholder="Ex: Ler 20min antes de dormir"
            value={novaRotina}
            onChangeText={setNovaRotina}
          />

          <Text style={estilos.subtituloRotina}>Período do dia:</Text>
          <View style={estilos.containerCategorias}>
            {categorias.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={[
                  estilos.botaoCategoria,
                  categoria === cat.id && estilos.botaoCategoriaSelecionado,
                ]}
                onPress={() => setCategoria(cat.id)}
              >
                <Ionicons
                  name={cat.icone}
                  size={20}
                  color={categoria === cat.id ? cores.branco : cores.primaria}
                />
                <Text
                  style={[
                    estilos.textoBotaoCategoria,
                    categoria === cat.id &&
                      estilos.textoBotaoCategoriaSelecionado,
                  ]}
                >
                  {cat.nome}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={[
              estilos.botaoPrimario,
              !novaRotina && estilos.botaoDesabilitado,
            ]}
            onPress={adicionarNovaRotina}
            disabled={!novaRotina}
          >
            <Text style={estilos.textoBotaoPrimario}>Adicionar Rotina</Text>
          </TouchableOpacity>
        </Cartao>

        <Text style={estilosGlobais.tituloSecao}>Suas Rotinas</Text>

        {rotinas.length === 0 ? (
          <Cartao style={estilos.cartaoVazio}>
            <Ionicons name="list" size={50} color={cores.cinzaMedio} />
            <Text style={estilos.textoVazio}>Nenhuma rotina cadastrada</Text>
            <Text style={estilos.subtextoVazio}>
              Adicione rotinas para substituir o tempo de tela
            </Text>
          </Cartao>
        ) : (
          categorias.map((categoria) => {
            const rotinasCategoria = rotinas.filter(
              (rotina) => rotina.categoria === categoria.id
            );
            if (rotinasCategoria.length === 0) return null;

            return (
              <View key={categoria.id}>
                <Text style={estilos.tituloCategoria}>{categoria.nome}</Text>
                {rotinasCategoria.map((rotina) => (
                  <Cartao key={rotina.id} style={estilos.cartaoRotina}>
                    <View style={estilos.cabecalhoRotina}>
                      <Text
                        style={[
                          estilos.textoRotina,
                          rotina.completada && estilos.textoRotinaCompletada,
                        ]}
                      >
                        {rotina.atividade}
                      </Text>
                      {!rotina.completada && (
                        <TouchableOpacity
                          style={estilos.botaoCompletarRotina}
                          onPress={() => completarRotina(rotina.id)}
                        >
                          <Ionicons
                            name="checkmark"
                            size={20}
                            color={cores.branco}
                          />
                        </TouchableOpacity>
                      )}
                    </View>
                    {rotina.completada && (
                      <View style={estilos.emblemaCompletada}>
                        <Text style={estilos.textoEmblemaCompletada}>
                          CONCLUÍDA
                        </Text>
                      </View>
                    )}
                  </Cartao>
                ))}
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

function TelaCuriosidades({ navigation }) {
  const { curiosidades } = useTimer();
  const [curiosidadeAtual, setCuriosidadeAtual] = useState(0);

  const proximaCuriosidade = () => {
    setCuriosidadeAtual((prev) => (prev + 1) % curiosidades.length);
  };

  return (
    <View style={estilosGlobais.container}>
      <Cabecalho
        titulo="Curiosidades Científicas"
        voltar={() => navigation.goBack()}
      />
      <ScrollView
        contentContainerStyle={[
          estilosGlobais.scrollContainer,
          { paddingHorizontal: 20 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Cartao style={estilos.cartaoCuriosidade}>
          <View style={estilos.cabecalhoCuriosidade}>
            <Ionicons name="school" size={30} color={cores.primaria} />
            <Text style={estilos.tituloCuriosidade}>Fato Científico</Text>
          </View>
          <Text style={estilos.textoCuriosidade}>
            {curiosidades[curiosidadeAtual]}
          </Text>
          <View style={estilos.containerContador}>
            <Text style={estilos.textoContador}>
              {curiosidadeAtual + 1} / {curiosidades.length}
            </Text>
          </View>
        </Cartao>

        <TouchableOpacity
          style={estilos.botaoSecundario}
          onPress={proximaCuriosidade}
        >
          <Ionicons name="arrow-forward" size={20} color={cores.primaria} />
          <Text style={estilos.textoBotaoSecundario}>Próxima Curiosidade</Text>
        </TouchableOpacity>

        <Cartao style={estilos.cartaoInfo}>
          <Ionicons name="information-circle" size={24} color={cores.info} />
          <Text style={estilos.textoInfo}>
            Estas informações são baseadas em pesquisas científicas sobre os
            efeitos do uso de tecnologia na saúde mental e física.
          </Text>
        </Cartao>
      </ScrollView>
    </View>
  );
}

// Mantenho as telas de Gamificação e Histórico similares às anteriores, mas ajustadas ao novo contexto
function TelaGamificacao({ navigation }) {
  const { tempoTela, pontos, desafios, completarDesafio } = useTimer();

  return (
    <View style={estilosGlobais.container}>
      <Cabecalho titulo="Gamificação" voltar={() => navigation.goBack()} />
      <ScrollView
        contentContainerStyle={[
          estilosGlobais.scrollContainer,
          { paddingHorizontal: 20 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Cartao style={estilos.cartaoPontos}>
          <View style={estilos.containerPontos}>
            <View style={estilos.itemPontos}>
              <Ionicons name="trophy" size={24} color={cores.secundaria} />
              <Text style={estilos.rotuloPontos}>Seus Pontos</Text>
              <Text style={estilos.valorPontos}>{pontos}</Text>
            </View>
            <View style={estilos.separadorPontos} />
            <View style={estilos.itemPontos}>
              <Ionicons name="time" size={24} color={cores.primaria} />
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
                  desafio.completado ? "checkmark-circle" : "ellipse-outline"
                }
                size={28}
                color={desafio.completado ? cores.sucesso : cores.cinzaMedio}
              />
              <View style={estilos.infoDesafio}>
                <Text
                  style={[
                    estilos.nomeDesafio,
                    desafio.completado && estilos.desafioCompletado,
                  ]}
                >
                  {desafio.nome}
                </Text>
                <Text style={estilos.pontosDesafio}>+{desafio.pontos} pts</Text>
              </View>
            </View>

            {!desafio.completado && (
              <TouchableOpacity
                style={estilos.botaoCompletar}
                onPress={() => completarDesafio(desafio.id)}
              >
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
            {
              pontos: 100,
              recompensa: "Pacote de wallpapers exclusivos",
              icone: "images",
            },
            {
              pontos: 250,
              recompensa: "Desconto em app de meditação",
              icone: "medkit",
            },
            {
              pontos: 500,
              recompensa: "E-book grátis à sua escolha",
              icone: "book",
            },
          ].map((item, index) => (
            <View
              key={index}
              style={[
                estilos.itemRecompensa,
                index !== 2 && estilos.bordaItemRecompensa,
              ]}
            >
              <View style={estilos.infoRecompensa}>
                <Ionicons
                  name={item.icone}
                  size={20}
                  color={
                    pontos >= item.pontos ? cores.primaria : cores.cinzaMedio
                  }
                />
                <View>
                  <Text style={estilos.pontosRecompensa}>
                    {item.pontos} pts
                  </Text>
                  <Text style={estilos.textoRecompensa}>{item.recompensa}</Text>
                </View>
              </View>
              <Ionicons
                name={pontos >= item.pontos ? "trophy" : "lock-closed"}
                size={24}
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

function TelaHistorico({ navigation }) {
  const { tempoTela, meta } = useTimer();

  // Dados simulados do histórico
  const dadosHistorico = [
    { data: "2023-06-12", tempoTela: 145, meta: meta },
    { data: "2023-06-11", tempoTela: 132, meta: meta },
    { data: "2023-06-10", tempoTela: 98, meta: meta },
    { data: "2023-06-09", tempoTela: 156, meta: meta },
    { data: "2023-06-08", tempoTela: 110, meta: meta },
  ];

  return (
    <View style={estilosGlobais.container}>
      <Cabecalho titulo="Histórico" voltar={() => navigation.goBack()} />
      <ScrollView
        contentContainerStyle={[
          estilosGlobais.scrollContainer,
          { paddingHorizontal: 20 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Cartao style={estilos.cartaoResumo}>
          <Text style={estilos.tituloCartao}>Semana Atual</Text>
          <Text style={estilos.valorTempo}>{formatarTempo(tempoTela)}</Text>
          <Text style={estilos.textoMeta}>Tempo total de tela</Text>
        </Cartao>

        <Text style={estilosGlobais.tituloSecao}>Seu Progresso</Text>

        {dadosHistorico.map((dia, index) => {
          const porcentagem = Math.min(100, (dia.tempoTela / dia.meta) * 100);
          return (
            <Cartao key={index} style={estilos.cartaoDia}>
              <View style={estilos.cabecalhoDia}>
                <View>
                  <Text style={estilos.dataDia}>
                    {new Date(dia.data).toLocaleDateString("pt-BR", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                    })}
                  </Text>
                  <Text style={estilos.tempoDia}>
                    {formatarTempo(dia.tempoTela)}
                  </Text>
                </View>
                <View
                  style={[
                    estilos.indicadorStatus,
                    {
                      backgroundColor:
                        dia.tempoTela > dia.meta ? cores.perigo : cores.sucesso,
                    },
                  ]}
                >
                  <Ionicons
                    name={
                      dia.tempoTela > dia.meta ? "trending-up" : "trending-down"
                    }
                    size={16}
                    color={cores.branco}
                  />
                </View>
              </View>

              <View style={estilos.containerProgresso}>
                <View
                  style={[
                    estilos.barraProgresso,
                    {
                      width: `${porcentagem}%`,
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
                    {" "}
                    {formatarTempo(dia.tempoTela - dia.meta)} acima
                  </Text>
                ) : (
                  <Text style={estilos.textoAbaixo}>
                    {" "}
                    {formatarTempo(dia.meta - dia.tempoTela)} abaixo
                  </Text>
                )}
              </Text>
            </Cartao>
          );
        })}
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
    height: 100,
    backgroundColor: cores.primaria,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingBottom: 15,
    ...estilosGlobais.sombra,
  },
  textoCabecalho: {
    color: cores.branco,
    fontSize: 24,
    fontWeight: "700",
  },
  botaoVoltar: {
    position: "absolute",
    left: 20,
    bottom: 15,
    zIndex: 1,
  },
  containerAviso: {
    flexDirection: "row",
    backgroundColor: `${cores.aviso}20`,
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: "center",
  },
  textoAviso: {
    color: cores.preto,
    fontSize: 12,
    marginLeft: 8,
    flex: 1,
    lineHeight: 16,
  },
  containerHeroi: {
    alignItems: "center",
    marginVertical: 20,
  },
  iconeHeroi: {
    backgroundColor: cores.primaria,
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    ...estilosGlobais.sombra,
  },
  tituloHeroi: {
    fontSize: 28,
    fontWeight: "700",
    color: cores.preto,
    marginBottom: 12,
    textAlign: "center",
  },
  subtituloHeroi: {
    fontSize: 16,
    color: cores.cinzaEscuro,
    textAlign: "center",
    lineHeight: 24,
    maxWidth: "80%",
  },
  cartaoTempo: {
    alignItems: "center",
    paddingVertical: 30,
  },
  cartaoAvaliacao: {
    alignItems: "center",
    paddingVertical: 30,
  },
  containerMeta: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  gradeRecursos: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  cartaoRecurso: {
    width: "48%",
    backgroundColor: cores.branco,
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    marginBottom: 16,
    ...estilosGlobais.sombraSuave,
  },
  iconeRecurso: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: `${cores.primaria}10`,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  textoRecurso: {
    color: cores.preto,
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  cartao: {
    backgroundColor: cores.branco,
    borderRadius: 20,
    padding: 24,
    marginVertical: 8,
    ...estilosGlobais.sombraSuave,
  },
  cartaoDestaque: {
    alignItems: "center",
  },
  cartaoDica: {
    marginTop: 10,
  },
  cabecalhoDica: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  tituloDica: {
    fontSize: 18,
    fontWeight: "600",
    color: cores.preto,
    marginLeft: 8,
  },
  textoDica: {
    fontSize: 16,
    color: cores.cinzaEscuro,
    lineHeight: 24,
  },
  tituloCartao: {
    fontSize: 18,
    fontWeight: "600",
    color: cores.preto,
    marginBottom: 8,
  },
  valorTempo: {
    fontSize: 42,
    fontWeight: "700",
    color: cores.primaria,
    textAlign: "center",
    marginVertical: 8,
  },
  textoMeta: {
    fontSize: 14,
    color: cores.cinzaEscuro,
    textAlign: "center",
    marginLeft: 4,
  },
  // Novos estilos para avaliação
  iconeCentral: {
    marginBottom: 20,
  },
  tituloAvaliacao: {
    fontSize: 24,
    fontWeight: "700",
    color: cores.preto,
    textAlign: "center",
    marginBottom: 16,
  },
  textoAvaliacao: {
    fontSize: 16,
    color: cores.cinzaEscuro,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 24,
  },
  containerInput: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  input: {
    flex: 1,
    borderWidth: 2,
    borderColor: cores.primaria,
    borderRadius: 12,
    padding: 16,
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    marginRight: 8,
  },
  textoInput: {
    fontSize: 16,
    color: cores.cinzaEscuro,
    fontWeight: "500",
  },
  botaoPrimario: {
    backgroundColor: cores.primaria,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  botaoDesabilitado: {
    backgroundColor: cores.cinzaMedio,
  },
  textoBotaoPrimario: {
    color: cores.branco,
    fontSize: 16,
    fontWeight: "600",
  },
  // Estilos para resultado da avaliação
  cartaoResultado: {
    borderLeftWidth: 6,
    padding: 24,
  },
  tituloResultado: {
    fontSize: 20,
    fontWeight: "700",
    color: cores.preto,
    marginBottom: 12,
  },
  badgeStatus: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 16,
  },
  textoBadge: {
    color: cores.branco,
    fontSize: 14,
    fontWeight: "700",
  },
  mensagemResultado: {
    fontSize: 16,
    color: cores.cinzaEscuro,
    lineHeight: 24,
    marginBottom: 16,
  },
  cartaoRecomendacao: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    marginBottom: 8,
  },
  numeroRecomendacao: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: cores.primaria,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  textoNumero: {
    color: cores.branco,
    fontSize: 14,
    fontWeight: "700",
  },
  textoRecomendacao: {
    flex: 1,
    fontSize: 14,
    color: cores.preto,
    lineHeight: 20,
  },
  // Estilos para rotinas
  inputRotina: {
    borderWidth: 1,
    borderColor: cores.cinzaMedio,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  subtituloRotina: {
    fontSize: 16,
    fontWeight: "600",
    color: cores.preto,
    marginBottom: 12,
  },
  containerCategorias: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  botaoCategoria: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: cores.primaria,
    marginHorizontal: 4,
  },
  botaoCategoriaSelecionado: {
    backgroundColor: cores.primaria,
  },
  textoBotaoCategoria: {
    fontSize: 14,
    fontWeight: "600",
    color: cores.primaria,
    marginLeft: 4,
  },
  textoBotaoCategoriaSelecionado: {
    color: cores.branco,
  },
  cartaoVazio: {
    alignItems: "center",
    paddingVertical: 40,
  },
  textoVazio: {
    fontSize: 18,
    fontWeight: "600",
    color: cores.cinzaEscuro,
    marginTop: 12,
  },
  subtextoVazio: {
    fontSize: 14,
    color: cores.cinzaMedio,
    textAlign: "center",
    marginTop: 4,
  },
  tituloCategoria: {
    fontSize: 18,
    fontWeight: "700",
    color: cores.preto,
    marginTop: 16,
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  cartaoRotina: {
    padding: 16,
    marginBottom: 8,
  },
  cabecalhoRotina: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  textoRotina: {
    fontSize: 16,
    color: cores.preto,
    flex: 1,
  },
  textoRotinaCompletada: {
    textDecorationLine: "line-through",
    color: cores.cinzaEscuro,
  },
  botaoCompletarRotina: {
    backgroundColor: cores.sucesso,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 12,
  },
  emblemaCompletada: {
    backgroundColor: cores.sucesso,
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginTop: 8,
  },
  textoEmblemaCompletada: {
    color: cores.branco,
    fontSize: 10,
    fontWeight: "700",
  },
  // Estilos para curiosidades
  cartaoCuriosidade: {
    padding: 24,
  },
  cabecalhoCuriosidade: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  tituloCuriosidade: {
    fontSize: 20,
    fontWeight: "700",
    color: cores.preto,
    marginLeft: 8,
  },
  textoCuriosidade: {
    fontSize: 16,
    color: cores.cinzaEscuro,
    lineHeight: 24,
    textAlign: "center",
  },
  containerContador: {
    alignItems: "center",
    marginTop: 16,
  },
  textoContador: {
    fontSize: 14,
    color: cores.cinzaMedio,
    fontWeight: "500",
  },
  botaoSecundario: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderWidth: 2,
    borderColor: cores.primaria,
    borderRadius: 12,
    marginVertical: 16,
  },
  textoBotaoSecundario: {
    color: cores.primaria,
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  cartaoInfo: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 16,
  },
  textoInfo: {
    flex: 1,
    fontSize: 14,
    color: cores.cinzaEscuro,
    lineHeight: 20,
    marginLeft: 8,
  },
  // Estilos existentes mantidos
  containerProgresso: {
    marginVertical: 20,
    alignItems: "center",
  },
  barraProgressoFundo: {
    height: 12,
    backgroundColor: cores.cinzaClaro,
    borderRadius: 6,
    width: "100%",
    overflow: "hidden",
  },
  barraProgresso: {
    height: "100%",
    backgroundColor: cores.primaria,
    borderRadius: 6,
  },
  textoProgresso: {
    fontSize: 14,
    fontWeight: "600",
    color: cores.primaria,
    marginTop: 8,
  },
  botaoAcao: {
    flexDirection: "row",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    width: "100%",
  },
  textoBotaoAcao: {
    color: cores.branco,
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  linhaEstatistica: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  rotuloEstatistica: {
    flexDirection: "row",
    alignItems: "center",
  },
  textoRotuloEstatistica: {
    fontSize: 16,
    color: cores.cinzaEscuro,
    marginLeft: 8,
  },
  valorEstatistica: {
    fontSize: 16,
    fontWeight: "600",
    color: cores.preto,
  },
  cartaoPontos: {
    paddingVertical: 30,
  },
  containerPontos: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  itemPontos: {
    alignItems: "center",
    flex: 1,
  },
  separadorPontos: {
    width: 1,
    height: 40,
    backgroundColor: cores.cinzaMedio,
  },
  rotuloPontos: {
    fontSize: 14,
    color: cores.cinzaEscuro,
    marginTop: 8,
    marginBottom: 4,
  },
  valorPontos: {
    fontSize: 28,
    fontWeight: "700",
    color: cores.primaria,
  },
  cartaoDesafio: {
    marginBottom: 12,
    padding: 20,
  },
  cabecalhoDesafio: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoDesafio: {
    flex: 1,
    marginLeft: 12,
  },
  nomeDesafio: {
    fontSize: 16,
    color: cores.preto,
    marginBottom: 4,
  },
  desafioCompletado: {
    textDecorationLine: "line-through",
    color: cores.cinzaEscuro,
  },
  pontosDesafio: {
    fontSize: 14,
    fontWeight: "600",
    color: cores.secundaria,
  },
  botaoCompletar: {
    backgroundColor: cores.primaria,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 12,
  },
  textoBotaoCompletar: {
    color: cores.branco,
    fontSize: 16,
    fontWeight: "600",
  },
  itemRecompensa: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
  },
  bordaItemRecompensa: {
    borderBottomWidth: 1,
    borderBottomColor: cores.cinzaMedio,
  },
  infoRecompensa: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  pontosRecompensa: {
    fontSize: 16,
    fontWeight: "600",
    color: cores.secundaria,
    marginLeft: 12,
  },
  textoRecompensa: {
    fontSize: 14,
    color: cores.preto,
    marginLeft: 12,
    marginTop: 2,
  },
  cartaoResumo: {
    alignItems: "center",
    paddingVertical: 30,
  },
  cartaoDia: {
    marginBottom: 12,
    padding: 20,
  },
  cabecalhoDia: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  dataDia: {
    fontSize: 16,
    fontWeight: "600",
    color: cores.preto,
    textTransform: "capitalize",
  },
  tempoDia: {
    fontSize: 20,
    fontWeight: "700",
    color: cores.primaria,
    marginTop: 4,
  },
  indicadorStatus: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  textoAcima: {
    color: cores.perigo,
    fontWeight: "600",
  },
  textoAbaixo: {
    color: cores.sucesso,
    fontWeight: "600",
  },
});

export default function App() {
  return (
    <ProvedorTimer>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Início" component={TelaInicial} />
          <Stack.Screen name="Avaliação" component={TelaAvaliacao} />
          <Stack.Screen
            name="Resultado Avaliação"
            component={TelaResultadoAvaliacao}
          />
          <Stack.Screen name="Minhas Rotinas" component={TelaRotinas} />
          <Stack.Screen name="Curiosidades" component={TelaCuriosidades} />
          <Stack.Screen name="Gamificação" component={TelaGamificacao} />
          <Stack.Screen name="Histórico" component={TelaHistorico} />
        </Stack.Navigator>
      </NavigationContainer>
    </ProvedorTimer>
  );
}
