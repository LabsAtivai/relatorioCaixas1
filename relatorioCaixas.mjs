import axios from 'axios';
import { google } from 'googleapis';

const credentials = {
  "type": "service_account",
  "project_id": "relatoriolistas",
  "private_key_id": "64a6d54341cf1bcb8c1786436fcb782d2f5abd9c",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDZsEHQywpruYEw\nJkfY4weq1TqI3R0o/nJvSL6xKDNGcU/6Yixc6Je4455GnLC8hfF960Pm624PVkPJ\nC4HJvwaD3pSz2HNl9FRHnBAJXaGGz/eax1jTbdvzBxpZ+W3GceA8mPODazP5tETx\nSCU8ExWkPdYd3GLoz5NrpBuVvUnRx927f+/2qrVh122F70JJ2NPfEITcOLJNluJC\n3tYoNKIkUkELqdP7FaxsPprW5Ug0O0n32pWQv0LjVyzJb0JP7mbAPIV5hBVV4Ajs\nIt2k+QuJRCPGEdEc2OvFD9HBgxEc6CBST97nra1FyQRbYX6AUBHTfsFzZFxgVH0d\nAMxJam11AgMBAAECggEACsksEaYlxN2i9C70C1/VqZYOuZOfFhYOtyCBwPGuzLQ2\nPr/Y1oejENhHp38Bq22a4Al6n/k/8ZxCwouClEDrQo284hunksB5i+IZ0fpPfl2q\nioLgY1AZAEsfTUr0W0tEItcp5Z6NAOJ43K2dmVg8D8W36LCFPrzI30yjyJZhjyEX\nwulYtFp8XCCLp2Limy45K9BprllAeCpGAIcaDNQfz8l8M6tzc7BdTDV77os1BblG\n6jakWLFhAfAaOyC8DrRovd9G7loUeEt9zZ3jOJf7Qr+oc96iN5G7poDN/lUJt6QK\nXFbwGWKmn7ZuwtjtdETOtPDWAcv4q75iF9bHXCmmQQKBgQD5GCxMkyREcbE4QtAQ\nCUrOQO15MAFOer0AH3UF+fRX+hzJAHAa79Fr8IQ9hdgLJK05caOmwvD5kmoRpKtN\nfMboPGF9iVyGGMRHQSpNh6cQ9bl4awq+Y+atwH9z/03AlJLg1MGd1sYD1qoFcUzg\n5Z97FqGMfvLnLIsnzXutBrhbVQKBgQDfuTIcHQQQ1r6efW6+kL8VgCihXYqXap8O\nmwCZCfwtAHeP8iE76sllqasVy5TLkNoUZrbedUQiIowza7Iwp4vfTk9b2devN6U3\nRb25I1XadT9+oEDyTdXvbI4DtwLDLNWYmZXXL/yebw0JMZxxXFWqD0yHuWiNOx03\ncJbpITcJoQKBgQCwKg1iVonGshVgsbfOL5QtDDQmifHSm/FAvf6YLG9HLQbgjKO8\nGTElwmLz0824C8dKofjYPnQIPSkwsyHHWmCd694S12uNFsTxk7+kNzTLRM1XwXRG\ntAZ3iXVaBwvpD+pUgYMw6qz+F/oEgV2ajCre9WFpKHsHTTRZAPTfqKoHRQKBgCe3\nBpA7Dme212vnNGub4m/8qjnLEzlB8i5zka2ZOiz68j6ZaxDp4wqrDfX2h9mDQ1Nv\n0HK5OnkczOqr6Zv9gjUH/8p8Z29xX2Dqfn2JKkp3mefuptjcvGeeS6+ZI2JmaRyH\n1zO2DxBJAnVpWy48h/CCesF1RnwbzFn1ILUN8mlBAoGAMipMiz2mSDWiz2B3AeV9\n9yAt4WSSdX3JJrN60MIZAySFCokatzaF2wa611/lzdYn/XCa79GyOWT2TWs4jibj\nt4S8RlCMNTCU97SAtgwXksBK2WbXtORmgTLJRRdmz+/GCSIfuwzXr/uaR7NY1uoh\nIwdLfzHHnPbRJFmNi9xgiPU=\n-----END PRIVATE KEY-----\n".split(String.raw`\n`).join('\n'),
  "client_email": "ativarelatorio@relatoriolistas.iam.gserviceaccount.com",
  "client_id": "101717739329184491985",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/ativarelatorio%40relatoriolistas.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
};

// Função para obter o token de acesso do Snov.io para cada cliente
async function getAccessToken(clientId, clientSecret) {
  try {
    const response = await axios.post('https://api.snov.io/v1/oauth/access_token', {
      grant_type: 'client_credentials',
      client_id: clientId,
      client_secret: clientSecret,
    });
    return response.data.access_token;
  } catch (error) {
    console.error('Erro ao obter o token de acesso:', error.response ? error.response.data : error);
    throw error;
  }
}

// Função para ler os dados dos clientes da planilha
async function readClientDataFromSheet(auth) {
  const sheets = google.sheets({ version: 'v4', auth });
  const spreadsheetId = '1JkyBNkeQTap2afjxMTC-eoo1CjrW59buK-0ivuTfbvo';
  const range = 'contas';

  try {
    const response = await sheets.spreadsheets.values.get({ spreadsheetId, range });
    const rows = response.data.values;

    if (!rows.length) {
      console.log('Nenhum dado encontrado.');
      return [];
    }

    return rows.slice(1).map(row => ({
      email: row[1],
      clientId: row[2],
      clientSecret: row[3],
      emailSnovio: row[4],
      senha: row[5]
    }));
  } catch (error) {
    console.error('Erro ao ler dados do Google Sheets:', error);
    throw error;
  }
}

// Função para ler os IDs de campanha da planilha
async function readCampaignIdsFromSheet(auth) {
  const sheets = google.sheets({ version: 'v4', auth });
  const spreadsheetId = '1IMH9GB0lmksuobxjGQmsVe1C2t04d1g-v9xEspnMKTY';
  const range = 'campanhas!A2:D';

  try {
    const response = await sheets.spreadsheets.values.get({ spreadsheetId, range });
    const rows = response.data.values;

    if (!rows.length) {
      console.log('Nenhum dado de campanha encontrado.');
      return [];
    }

    return rows.map(row => ({
      email: row[1],
      campaignId: row[2],
      campaignName: row[3],
    }));
  } catch (error) {
    console.error('Erro ao ler os IDs de campanhas:', error);
    throw error;
  }
}

// Função para adicionar atraso (sleep) entre as requisições
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Funções para obter estatísticas de campanhas do Snov.io
async function getEmailsOpened(token, campaignId) {
  try {
    const res = await axios.get('https://api.snov.io/v1/get-emails-opened', {
      headers: { Authorization: `Bearer ${token}` },
      params: { campaignId },
    });
    return res.data.length;
  } catch (error) {
    console.error('Erro ao obter emails abertos:', error);
    return 0;
  }
}

async function getEmailsReplies(token, campaignId) {
  try {
    const res = await axios.get('https://api.snov.io/v1/get-emails-replies', {
      headers: { Authorization: `Bearer ${token}` },
      params: { campaignId },
    });
    return res.data.length;
  } catch (error) {
    console.error('Erro ao obter emails com respostas:', error);
    return 0;
  }
}

// Função para obter emails enviados com suporte a paginação e respeitando o limite da API
async function getEmailsSent(token, campaignId) {
  let offset = 0;
  let totalEmailsSent = 0;
  const limit = 10000;

  try {
    while (true) {
      console.log(`Obtendo emails enviados para a campanha: ${campaignId}, com offset: ${offset}`);
      const res = await axios.get('https://api.snov.io/v1/emails-sent', {
        headers: { Authorization: `Bearer ${token}` },
        params: { campaignId, offset },
      });

      const emails = res.data;
      totalEmailsSent += emails.length;

      if (emails.length < limit) break;
      offset += limit;

      await sleep(1000); // Respeitando o limite da API
    }

    return totalEmailsSent;
  } catch (error) {
    console.error(`Erro ao obter emails enviados para a campanha ${campaignId}:`, error.response ? error.response.data : error);
    return 0;
  }
}

// Função para adicionar os dados ao Google Sheets
async function addToGoogleSheets(auth, campaignData) {
  const sheets = google.sheets({ version: 'v4', auth });
  const spreadsheetId = '1JkyBNkeQTap2afjxMTC-eoo1CjrW59buK-0ivuTfbvo';
  const range = 'Resultados';

  const today = new Date().toISOString().split('T')[0];

  const values = campaignData.map(campaign => [
    today,
    campaign.email,
    campaign.campaignName,
    campaign.campaignId,
    campaign.emailsSent,
    campaign.emailsOpened,
    campaign.emailsReplied,
  ]);

  if (values.length > 0) {
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      resource: { values },
    });
    console.log('Dados adicionados ao Google Sheets.');
  } else {
    console.log('Nenhuma campanha ativa para adicionar ao Google Sheets.');
  }
}

// Função principal para processar campanhas com controle de limite de requisições
async function processCampaigns() {
  try {
    const auth = await google.auth.getClient({
      credentials,
      scopes: 'https://www.googleapis.com/auth/spreadsheets',
    });

    const [campaigns, clients] = await Promise.all([
      readCampaignIdsFromSheet(auth),
      readClientDataFromSheet(auth),
    ]);

    if (!campaigns.length) {
      console.log('Nenhuma campanha para processar.');
      return;
    }

    let requestCount = 0; // Contador de requisições

    for (const campaign of campaigns) {
      try {
        const client = clients.find(c => c.email === campaign.email);
        if (!client) {
          console.error(`Cliente com email ${campaign.email} não encontrado.`);
          continue;
        }

        const token = await getAccessToken(client.clientId, client.clientSecret);

        if (requestCount >= 55) {
          console.log('Atingiu o limite de requisições, aguardando 60 segundos...');
          await sleep(60000);
          requestCount = 0;
        }

        const [emailsSent, emailsOpened, emailsReplied] = await Promise.all([
          getEmailsSent(token, campaign.campaignId),
          getEmailsOpened(token, campaign.campaignId),
          getEmailsReplies(token, campaign.campaignId),
        ]);

        const campaignData = {
          email: campaign.email,
          campaignName: campaign.campaignName,
          campaignId: campaign.campaignId,
          emailsSent,
          emailsOpened,
          emailsReplied,
        };

        await addToGoogleSheets(auth, [campaignData]);
        console.log(`Processamento da campanha ID: ${campaign.campaignId} concluído.`);

        requestCount += 3;
      } catch (error) {
        console.error(`Erro ao processar campanha ID: ${campaign.campaignId}:`, error);
      }
    }
  } catch (error) {
    console.error('Erro ao processar campanhas:', error);
  }
}

// Execute o script
processCampaigns();
