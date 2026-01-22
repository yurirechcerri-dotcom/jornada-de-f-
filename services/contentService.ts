
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { ContentItem, ContentType } from '../types';

const STORAGE_KEY_PREFIX = 'jornada_fe_cache_';

export const contentService = {
  async getJourneyContent(journeyId: string): Promise<ContentItem[]> {
    const cacheKey = `${STORAGE_KEY_PREFIX}${journeyId}`;
    
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {
        console.error("Erro ao ler cache", e);
      }
    }

    if (!isSupabaseConfigured()) {
      // Dicionário de conteúdos temáticos expandido
      const themeContents: Record<string, { titles: string[], verses: {t: string, r: string}[], tasks: string[] }> = {
        'gratitude_7': {
          titles: ["Despertar da Gratidão", "Beleza no Simples", "O Pão Nosso", "Graça Imerecida", "Coração Contente", "Legado de Gratidão", "Viver em Agradecimento"],
          verses: [
            { t: "Em tudo dai graças.", r: "1 Tess. 5:18" },
            { t: "Bom é louvar ao Senhor.", r: "Salmos 92:1" },
            { t: "Bendize, ó minha alma, ao Senhor.", r: "Salmos 103:1" },
            { t: "A tua graça me basta.", r: "2 Cor. 12:9" },
            { t: "O Senhor é bom.", r: "Salmos 100:5" },
            { t: "Grande é a tua fidelidade.", r: "Lam. 3:23" },
            { t: "Damos graças, ó Deus.", r: "Salmos 75:1" }
          ],
          tasks: ["Liste 5 pequenas bênçãos.", "Agradeça a alguém hoje.", "Ore apenas agradecendo.", "Observe a natureza.", "Escreva uma carta de gratidão.", "Sorria para um estranho.", "Medite no Salmo 100."]
        },
        'pardon_7': {
          titles: ["O Peso da Mágoa", "A Fonte do Perdão", "Lavar as Mãos", "Setenta Vezes Sete", "Perdoar-se", "Cura de Memórias", "Libertar o Prisioneiro"],
          verses: [
            { t: "Perdoa as nossas dívidas.", r: "Mateus 6:12" },
            { t: "Sede uns para com os outros benignos.", r: "Efésios 4:32" },
            { t: "Lança sobre ele toda ansiedade.", r: "1 Pedro 5:7" },
            { t: "O amor cobre multidão de pecados.", r: "1 Pedro 4:8" },
            { t: "Não julgueis, e não sereis julgados.", r: "Lucas 6:37" },
            { t: "Tira a trave do teu olho.", r: "Mateus 7:5" },
            { t: "Pai, perdoa-lhes.", r: "Lucas 23:34" }
          ],
          tasks: ["Identifique uma mágoa antiga.", "Ore pela pessoa que te feriu.", "Visualize-se soltando um peso.", "Peça perdão a alguém.", "Escreva o que te dói e rasgue.", "Foque no seu crescimento.", "Respire fundo ao lembrar do passado."]
        },
        'service_7': {
          titles: ["Mãos que Servem", "O Menor de Todos", "Sal e Luz", "Amor em Ação", "O Bom Samaritano", "Talentos Dobrados", "Viver para Outros"],
          verses: [
            { t: "Servi uns aos outros pelo amor.", r: "Gálatas 5:13" },
            { t: "Vós sois a luz do mundo.", r: "Mateus 5:14" },
            { t: "A fé sem obras é morta.", r: "Tiago 2:26" },
            { t: "Amai-vos uns aos outros.", r: "João 13:34" },
            { t: "Mais bem-aventurada coisa é dar.", r: "Atos 20:35" },
            { t: "Ide por todo o mundo.", r: "Marcos 16:15" },
            { t: "O que serve é o maior.", r: "Lucas 22:26" }
          ],
          tasks: ["Ajude alguém anonimamente.", "Dê um cupo de água com amor.", "Escute alguém com atenção.", "Doe algo que você estima.", "Ofereça seu talento hoje.", "Ore por uma causa social.", "Seja voluntário por 30 min."]
        },
        'patience_7': {
          titles: ["O Tempo de Esperar", "Cultivando a Mansidão", "Paz no Atraso", "A Virtude da Calma", "Cronômetro de Deus", "O Fruto do Espírito", "Colheita na Hora Certa"],
          verses: [
            { t: "Esperei com paciência no Senhor.", r: "Salmos 40:1" },
            { t: "O fruto do Espírito é... paciência.", r: "Gálatas 5:22" },
            { t: "Sede pacientes na tribulação.", r: "Romanos 12:12" },
            { t: "A prova da vossa fé produz paciência.", r: "Tiago 1:3" },
            { t: "Espera pelo Senhor e tem bom ânimo.", r: "Salmos 27:14" },
            { t: "A visão se apressa para o fim.", r: "Habacuque 2:3" },
            { t: "Os que esperam no Senhor renovam forças.", r: "Isaías 40:31" }
          ],
          tasks: ["Espere 10s antes de responder.", "Não use o celular em uma fila.", "Ore pedindo calma.", "Respire fundo 3 vezes agora.", "Agradeça por algo demorado.", "Assista ao pôr do sol.", "Fique 5 min em silêncio absoluto."]
        },
        'hope_7': {
          titles: ["Luz na Escuridão", "Âncora da Alma", "O Amanhã de Deus", "Promessas Inabaláveis", "Cantando na Prisão", "Visão de Futuro", "Firmado na Rocha"],
          verses: [
            { t: "Esperança é âncora da alma.", r: "Hebreus 6:19" },
            { t: "O Deus da esperança vos encha.", r: "Romanos 15:13" },
            { t: "Eu sei os planos que tenho.", r: "Jeremias 29:11" },
            { t: "A minha porção é o Senhor.", r: "Lam. 3:24" },
            { t: "Tu és a minha esperança.", r: "Salmos 71:5" },
            { t: "Nascidos para viva esperança.", r: "1 Pedro 1:3" },
            { t: "O Senhor se agrada dos que esperam.", r: "Salmos 147:11" }
          ],
          tasks: ["Escreva um sonho para o futuro.", "Sorria para o espelho.", "Lembre de uma vitória passada.", "Compartilhe esperança com alguém.", "Faça uma oração de entrega.", "Ouça uma canção de vitória.", "Olhe para o céu e agradeça."]
        },
        'adversity_21': {
          titles: [
            "O Vale de Sombras", "Fé no Furacão", "A Arca na Tormenta", "Muralhas de Jericó", "O Gigante Cai", 
            "Fogo que Não Queima", "Deserto que Floresce", "A Rocha Mais Alta", "Força na Fraqueza", "Vitória no Invisível",
            "O Silêncio de Deus", "Portas que se Abrem", "Azeite que Não Acaba", "Caminhando Sobre Águas", "Cova dos Leões",
            "Mãos Levantadas", "Armadura de Deus", "Amanhecer no Cárcere", "A Mesa no Deserto", "Âncora Firme", "O Triunfo da Fé"
          ],
          verses: [
            { t: "Ainda que eu ande pelo vale.", r: "Salmos 23:4" },
            { t: "Não temas, porque eu sou contigo.", r: "Isaías 41:10" },
            { t: "Sossega, emudece!", r: "Marcos 4:39" },
            { t: "Pela fé caíram os muros.", r: "Hebreus 11:30" },
            { t: "O Senhor é minha luz.", r: "Salmos 27:1" },
            { t: "Passei pelo fogo e não me queimei.", r: "Isaías 43:2" },
            { t: "Minha graça te basta.", r: "2 Cor. 12:9" }
          ],
          tasks: [
            "Ore de joelhos por 2 minutos.", "Louve em meio à dor.", "Declare: 'Deus é fiel'.", "Abençoe quem te persegue.", "Confie no invisível hoje.", "Agradeça pela tempestade.", "Compartilhe um testemunho."
          ]
        }
      };

      const theme = themeContents[journeyId] || themeContents['gratitude_7'];
      const type: ContentType = journeyId.includes('21') ? '21_days' : '7_days';
      const dayCount = type === '7_days' ? 7 : 21;

      const mockData: ContentItem[] = Array.from({ length: dayCount }, (_, i) => ({
        id: `mock-${journeyId}-${i + 1}`,
        journey_id: journeyId,
        type,
        day_number: i + 1,
        title: theme.titles[i % theme.titles.length],
        verse: theme.verses[i % theme.verses.length].t,
        reference: theme.verses[i % theme.verses.length].r,
        reflection: `Neste dia ${i + 1} da jornada tematica de ${journeyId.split('_')[0]}, mergulhamos na essência de ${theme.titles[i % theme.titles.length].toLowerCase()}. Em tempos de prova ou de calma, a constância da sua busca por Deus determina a profundidade da sua paz.`,
        prayer: `Pai Celestial, no dia ${i + 1} desta caminhada, entrego minhas ansiedades e medos. Que o tema de hoje transforme minha mente e renove meu espírito. Amém.`,
        task_json: { task: theme.tasks[i % theme.tasks.length] }
      }));
      
      localStorage.setItem(cacheKey, JSON.stringify(mockData));
      return mockData;
    }

    const { data, error } = await supabase
      .from('content_library')
      .select('*')
      .eq('journey_id', journeyId)
      .order('day_number', { ascending: true });

    if (error) throw error;
    localStorage.setItem(cacheKey, JSON.stringify(data));
    return data;
  }
};
