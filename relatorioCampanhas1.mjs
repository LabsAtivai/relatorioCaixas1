import axios from 'axios';
import { google } from 'googleapis';

const credentials = {
  "type": "service_account",
  "project_id": "relatoriolistas",
  "private_key_id": "64a6d54341cf1bcb8c1786436fcb782d2f5abd9c",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDZsEHQywpruYEw\nJkfY4weq1TqI3R0o/nJvSL6xKDNGcU/6Yixc6Je4455GnLC8hfF960Pm624PVkPJ\nC4HJvwaD3pSz2HNl9FRHnBAJXaGGz/eax1jTbdvzBxpZ+W3GceA8mPODazP5tETx\nSCU8ExWkPdYd3GLoz5NrpBuVvUnRx927f+/2qrVh122F70JJ2NPfEITcOLJNluJC\n3tYoNKIkUkELqdP7FaxsPprW5Ug0O0n32pWQv0LjVyzJb0JP7mbAPIV5hBVV4Ajs\nIt2k+QuJRCPGEdEc2OvFD9HBgxEc6CBST97nra1FyQRbYX6AUBHTfsFzZFxgVH0d\nAMxJam11AgMBAAECggEACsksEaYlxN2i9C70C1/VqZYOuZOfFhYOtyCBwPGuzLQ2\nPr/Y1oejENhHp38Bq22a4Al6n/k/8ZxCwouClEDrQo284hunksB5i+IZ0fpPfl2q\nioLgY1AZAEsfTUr0W0tEItcp5Z6NAOJ43K2dmVg8D8W36LCFPrzI30yjyJZhjyEX\nwulYtFp8XCCLp2Limy45K9BprllAeCpGAIcaDNQfz8l8M6tzc7BdTDV77os1BblG\n6jakWLFhAfAaOyC8DrRovd9G7loUeEt9zZ3jOJf7Qr+oc96iN5G7poDN/lUJt6QK\nXFbwGWKmn7ZuwtjtdETOtPDWAcv4q75iF9bHXCmmQQKBgQD5GCxMkyREcbE4QtAQ\nCUrOQO15MAFOer0AH3UF+fRX+hzJAHAa79Fr8IQ9hdgLJK05caOmwvD5kmoRpKtN\nfMboPGF9iVyGGMRHQSpNh6cQ9bl4awq+Y+atwH9z/03AlJLg1MGd1sYD1qoFcUzg\n5Z97FqGMfvLnLIsnzXutBrhbVQKBgQDfuTIcHQQQ1r6efW6+kL8VgCihXYqXap8O\nmwCZCfwtAHeP8iE76sllqasVy5TLkNoUZrbedUQiIowza7Iwp4vfTk9b2devN6U3\nRb25I1XadT9+oEDyTdXvbI4DtwLDLNWYmZXXL/yebw0JMZxxXFWqD0yHuWiNOx03\ncJbpITcJoQKBgQCwKg1iVonGshVgsbfOL5QtDDQmifHSm/FAvf6YLG9HLQbgjKO8\nGTElwmLz0824C8dKofjYPnQIPSkwsyHHWmCd694S12uNFsTxk7+kNzTLRM1XwXRG\ntAZ3iXVaBwvpD+pUgYMw6qz+F/oEgV2ajCre9WFpKHsHTTRZAPTfqKoHRQKBgCe3\nBpA7Dme212vnNGub4m/8qjnLEzlB8i5zka2ZOiz68j6ZaxDp4wqrDfX2h9mDQ1Nv\n0HK5OnkczOqr6Zv9gjUH/8p8Z29xX2Dqfn2JKkp3mefuptjcvGeeS6+ZI2JmaRyH\n1zO2DxBJAnVpWy48h/CCesF1RnwbzFn1ILUN8mlBAoGAMipMiz2mSDWiz2B3AeV9\n9yAt4WSSdX3JJrN60MIZAySFCokatzaF2wa611/lzdYn/XCa79GyOWT2TWs4jibj\nt4S8RlCMNTCU97SAtgwXksBK2WbXtORmgTLJRRdmz+/GCSIfuwzXr/uaR7NY1uoh\nIwdLfzHHnPbRJFmNi9xgiPU=\n-----END PRIVATE KEY-----\n",
  "client_email": "ativarelatorio@relatoriolistas.iam.gserviceaccount.com",
  "client_id": "101717739329184491985",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/ativarelatorio%40relatoriolistas.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
};

async function readClientDataFromSheet(auth) {
  const sheets = google.sheets({ version: 'v4', auth });
  const spreadsheetId = '1u4rMoTUQz0w_g92xmV8_pjtVc8JtKLLH7v090V5lq40';
  const range = 'contas';
  
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const rows = response.data.values;
    if (!rows.length) {
      console.log('No data found.');
      return [];
    }

    const clients = [];
    rows.forEach((row, index) => {
      if (index !== 0 && row[0] === "TRUE") {
        clients.push({
          email: row[1],
          clientId: row[2],
          clientSecret: row[3],
          emailSnovio: row[4],
          senha: row[5]
        });
      }
    });

    return clients;

  } catch (error) {
    console.error('Erro ao ler dados do Google Sheets:', error);
    throw error;
  }
}

async function getAccessToken(clientId, clientSecret) {
  try {
    const response = await axios.post('https://api.snov.io/v1/oauth/access_token', {
      grant_type: 'client_credentials',
      client_id: clientId,
      client_secret: clientSecret,
    });
    return response.data.access_token;
  } catch (error) {
    console.error('Erro ao obter o token de acesso:', error);
    throw error;
  }
}

async function addToGoogleSheets(client, campaignData) {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: 'https://www.googleapis.com/auth/spreadsheets',
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = '1JkyBNkeQTap2afjxMTC-eoo1CjrW59buK-0ivuTfbvo';
    const range = 'campanhas';

    const today = new Date();
    const dateWithoutTime = today.toISOString().split('T')[0];

    const values = campaignData.map((campaign) => [
      dateWithoutTime,
      client.email,
      campaign.id,
      campaign.campaign || campaign,
      campaign.list_id,
      campaign.status,
      campaign.created_at,
      campaign.updated_at,
      campaign.started_at,
      campaign.hash,
    ]);

    if (values.length > 0) {
      await sheets.spreadsheets.values.append({
        spreadsheetId,
        range,
        valueInputOption: 'RAW',
        insertDataOption: 'INSERT_ROWS',
        resource: {
          values,
        },
      });
      console.log('Dados de campanha adicionados com sucesso ao Google Sheets');
    } else {
      console.log('Nenhuma campanha ativa encontrada para adicionar ao Google Sheets');
    }

  } catch (error) {
    console.error('Erro ao adicionar dados de campanha ao Google Sheets:', error);
  }
}

async function getCampaignName(accessToken, clientEmail) {
  try {
    const response = await axios.get('https://api.snov.io/v1/get-user-campaigns', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Erro ao obter informações da campanha:', error.response.errors);
    throw error;
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


const usersHasError = [];
async function main() {
  try {
    debugger;
    const auth = await google.auth.getClient({
      credentials,
      scopes: 'https://www.googleapis.com/auth/spreadsheets',
    });

    const clients = await readClientDataFromSheet(auth);
    const batchSize = 59;

    for (let i = 0; i < clients.length; i += batchSize) {
      const batch = clients.slice(i, i + batchSize);
      console.log(`Processando lote de ${batch.length} clientes...`);
      
      for (const client of batch) {
        try {
          const accessToken = await getAccessToken(client.clientId, client.clientSecret);
          const campaignData = await getCampaignName(accessToken, client.email);
          await addToGoogleSheets(client, campaignData);
          

        } catch (error) {
          usersHasError.push(client)
          console.error('Erro na execução para cliente:',
             client.email, error);
          
        }
      }

      if (i + batchSize < clients.length) {
        console.log('Aguardando antes de processar o próximo lote...');
        await sleep(30000);  // Espera de 30 segundos antes do próximo lote
      }
    }
    
    if (usersHasError.length) {
      console.warn("---------------------------------------------------------");
      console.warn("Usuários com erros: ");
      usersHasError.map((x) => {
        console.warn(`${x.email}`);
      });
      console.warn("---------------------------------------------------------");
    }

  } catch (error) {
    console.error('Erro na execução principal:',error);
  }
}

main();
