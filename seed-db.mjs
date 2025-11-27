import postgres from 'postgres';
import dotenv from 'dotenv';

dotenv.config();

const sql = postgres(process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/iesp_app');

const seedData = async () => {
  try {
    console.log('🌱 Iniciando seed de dados...');

    // Artigos
    const articles = [
      {
        title: 'A Importância da Fé',
        description: 'Entenda como a fé nos transforma',
        content: 'A fé é o fundamento de nossa relação com Deus. Ela nos permite acreditar no impossível e confiar em Sua vontade para nossas vidas.',
        imageUrl: 'https://via.placeholder.com/400x300?text=Fe',
      },
      {
        title: 'Vencendo Obstáculos',
        description: 'Como superar desafios com a graça de Deus',
        content: 'Todos enfrentamos obstáculos em nossas vidas. Mas com a graça de Deus, podemos vencer qualquer desafio que nos for apresentado.',
        imageUrl: 'https://via.placeholder.com/400x300?text=Obstaculos',
      },
    ];

    for (const article of articles) {
      await sql`INSERT INTO "articles" ("title", "description", "content", "imageUrl") VALUES (${article.title}, ${article.description}, ${article.content}, ${article.imageUrl}) ON CONFLICT DO NOTHING`;
    }
    console.log('✅ Artigos inseridos');

    // Notícias
    const news = [
      {
        title: 'Novo Culto de Oração',
        description: 'Iniciamos novo culto de oração às quartas-feiras',
        content: 'A partir de próxima semana, teremos um novo culto de oração dedicado às quartas-feiras à noite.',
        imageUrl: 'https://via.placeholder.com/400x300?text=Oracao',
      },
      {
        title: 'Retiro Espiritual 2024',
        description: 'Confira as datas do retiro espiritual',
        content: 'O retiro espiritual de 2024 será realizado em um local especial com atividades transformadoras.',
        imageUrl: 'https://via.placeholder.com/400x300?text=Retiro',
      },
    ];

    for (const item of news) {
      await sql`INSERT INTO "news" ("title", "description", "content", "imageUrl") VALUES (${item.title}, ${item.description}, ${item.content}, ${item.imageUrl}) ON CONFLICT DO NOTHING`;
    }
    console.log('✅ Notícias inseridas');

    // Eventos
    const events = [
      {
        title: 'Culto de Domingo',
        description: 'Culto principal da semana',
        content: 'Venha participar do nosso culto de domingo com louvor, oração e ministração da Palavra.',
        startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        location: 'Templo Principal',
        imageUrl: 'https://via.placeholder.com/400x300?text=Culto',
      },
      {
        title: 'Grupo de Jovens',
        description: 'Reunião do grupo de jovens',
        content: 'Encontro para jovens com louvor, comunhão e estudo bíblico.',
        startDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        location: 'Sala de Comunhão',
        imageUrl: 'https://via.placeholder.com/400x300?text=Jovens',
      },
    ];

    for (const event of events) {
      await sql`INSERT INTO "events" ("title", "description", "content", "startDate", "location", "imageUrl") VALUES (${event.title}, ${event.description}, ${event.content}, ${event.startDate}, ${event.location}, ${event.imageUrl}) ON CONFLICT DO NOTHING`;
    }
    console.log('✅ Eventos inseridos');

    // Hinário
    const hymns = [
      {
        number: 1,
        title: 'Jesus Vem Vindo',
        author: 'Compositor Desconhecido',
        lyrics: 'Jesus vem vindo, aleluia\nJesus vem vindo, aleluia\nEle vem buscar os seus\nOs filhos do Senhor',
      },
      {
        number: 2,
        title: 'Graça Maravilhosa',
        author: 'John Newton',
        lyrics: 'Graça maravilhosa, quão doce é o som\nQue salvou um desgraçado como eu\nUm dia fui perdido, mas agora fui achado\nEra cego, mas agora vejo',
      },
    ];

    for (const hymn of hymns) {
      await sql`INSERT INTO "hymns" ("number", "title", "author", "lyrics") VALUES (${hymn.number}, ${hymn.title}, ${hymn.author}, ${hymn.lyrics}) ON CONFLICT DO NOTHING`;
    }
    console.log('✅ Hinário inserido');

    // Palavra do Dia
    const dailyWord = {
      date: new Date().toISOString().slice(0, 10),
      title: 'Confie em Deus',
      reference: 'Salmos 37:5',
      content: 'Entrega o teu caminho ao Senhor, confia nele, e ele agirá.',
    };

    await sql`INSERT INTO "dailyWords" ("date", "title", "reference", "content") VALUES (${dailyWord.date}, ${dailyWord.title}, ${dailyWord.reference}, ${dailyWord.content}) ON CONFLICT DO NOTHING`;
    console.log('✅ Palavra do Dia inserida');

    // Motivos de Oração
    const prayerReasons = [
      {
        title: 'Pela Saúde da Comunidade',
        description: 'Oremos pela saúde e bem-estar de todos os membros da comunidade.',
        priority: 'high',
      },
      {
        title: 'Pelo Crescimento Espiritual',
        description: 'Intercedamos pelo crescimento espiritual de cada membro.',
        priority: 'medium',
      },
    ];

    for (const reason of prayerReasons) {
      await sql`INSERT INTO "prayerReasons" ("title", "description", "priority") VALUES (${reason.title}, ${reason.description}, ${reason.priority}) ON CONFLICT DO NOTHING`;
    }
    console.log('✅ Motivos de Oração inseridos');

    // Horário dos Cultos
    const schedules = [
      {
        dayOfWeek: 'Sunday',
        serviceName: 'Culto Principal',
        startTime: '10:00',
        endTime: '12:00',
        location: 'Templo Principal',
      },
      {
        dayOfWeek: 'Wednesday',
        serviceName: 'Culto de Oração',
        startTime: '19:30',
        endTime: '21:00',
        location: 'Templo Principal',
      },
      {
        dayOfWeek: 'Friday',
        serviceName: 'Grupo de Jovens',
        startTime: '19:00',
        endTime: '21:00',
        location: 'Sala de Comunhão',
      },
    ];

    for (const schedule of schedules) {
      await sql`INSERT INTO "serviceSchedules" ("dayOfWeek", "serviceName", "startTime", "endTime", "location") VALUES (${schedule.dayOfWeek}, ${schedule.serviceName}, ${schedule.startTime}, ${schedule.endTime}, ${schedule.location}) ON CONFLICT DO NOTHING`;
    }
    console.log('✅ Horários dos Cultos inseridos');

    // Campanhas
    const campaigns = [
      {
        title: 'Reforma do Templo',
        description: 'Ajude-nos a reformar e melhorar nosso templo',
        content: 'Estamos arrecadando fundos para reformar nosso templo e melhorar a experiência dos fiéis.',
        goal: 50000 * 100, // R$ 50.000 em centavos
        collected: 15000 * 100, // R$ 15.000 em centavos
        imageUrl: 'https://via.placeholder.com/400x300?text=Reforma',
        paymentMethods: 'pix,mercadopago,credit_card',
      },
      {
        title: 'Ajuda aos Necessitados',
        description: 'Campanha de arrecadação para ajudar famílias necessitadas',
        content: 'Juntos podemos fazer a diferença na vida de famílias que precisam de ajuda.',
        goal: 20000 * 100, // R$ 20.000 em centavos
        collected: 8000 * 100, // R$ 8.000 em centavos
        imageUrl: 'https://via.placeholder.com/400x300?text=Ajuda',
        paymentMethods: 'pix,mercadopago,credit_card',
      },
    ];

    for (const campaign of campaigns) {
      await sql`INSERT INTO "campaigns" ("title", "description", "content", "goal", "collected", "imageUrl", "paymentMethods") VALUES (${campaign.title}, ${campaign.description}, ${campaign.content}, ${campaign.goal}, ${campaign.collected}, ${campaign.imageUrl}, ${campaign.paymentMethods}) ON CONFLICT DO NOTHING`;
    }
    console.log('✅ Campanhas inseridas');

    console.log('🎉 Seed de dados concluído com sucesso!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao fazer seed:', error);
    process.exit(1);
  }
};

seedData();
