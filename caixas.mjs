const { GoogleSpreadsheet } = require('google-spreadsheet');
const axios = require('axios');
const moment = require('moment');
const fs = require('node:fs');

// **Credenciais do Google Sheets - Substitua pelos seus valores**
const GOOGLE_SHEETS_CREDENTIALS = require('./credentials.json'); // Arquivo JSON com as credenciais do Google Sheets
const GOOGLE_SHEETS_ID = 'YOUR_GOOGLE_SHEET_ID'; // ID da sua planilha
const CREDENTIALS_SHEET_NAME = 'Credenciais'; // Nome da aba com as credenciais

// **Credenciais do Snov.io - Substitua pelos seus valores**
const SNOV_IO_API_URL = 'https://api.snov.io/v1';


async function main() {
    // 1. Ler credenciais do Google Sheets
    const doc = new GoogleSpreadsheet(GOOGLE_SHEETS_ID);
    await doc.useServiceAccountAuth(GOOGLE_SHEETS_CREDENTIALS);
    await doc.loadInfo(); // loads document properties and worksheets

    const sheet = doc.sheetsByTitle[CREDENTIALS_SHEET_NAME];
    const rows = await sheet.getRows();
    const snovCredentials = rows[0]; // Assumindo que as credenciais estão na primeira linha
    const snovClientId = snovCredentials.clientID;
    const snovClientSecret = snovCredentials.clientSecret;

    // 2. Autenticação no Snov.io (simplificado - usar OAuth2 completo para produção)
    const response = await axios.post(`${SNOV_IO_API_URL}/auth/token`, {
        client_id: snovClientId,
        client_secret: snovClientSecret,
        grant_type: 'client_credentials'
    });
    const accessToken = response.data.access_token;


    // 3. Obter dados das campanhas
    const campaignsResponse = await axios.get(`${SNOV_IO_API_URL}/campaigns`, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    });
    const campaigns = campaignsResponse.data.campaigns;

    // 4. Processar e acumular dados
    const today = moment().format('YYYY-MM-DD');
    const campaignData = {};

    for (const campaign of campaigns) {
        if (campaign.status === 'active'){ //somente campanhas ativas
            const campaignId = campaign.id;
            campaignData[campaignId] = campaignData[campaignId] || {};
            campaignData[campaignId][today] = {
                emailsSent: campaign.emails_sent,
                repliesReceived: campaign.replies_received,
                emailsOpened: campaign.emails_opened
            };

            // Acumular dados de dias anteriores (implementação simplificada - otimize para grandes conjuntos de dados)
            const previousData = await getPreviousDataFromSheet(doc, campaignId);
            campaignData[campaignId] = { ...previousData, ...campaignData[campaignId] };

        }
    }

    // 5. Armazenar dados na planilha (ou gerar CSV)
    await updateSheet(doc, campaignData);
    // ou gerar CSV: await generateCSV(campaignData);


    console.log('Dados coletados e armazenados com sucesso!');
}



async function getPreviousDataFromSheet(doc, campaignId) {
    //implemente a leitura dos dados anteriores da planilha
    return {}; //retorna um objeto vazio por enquanto
}

async function updateSheet(doc, campaignData){
    //implemente a atualização da planilha
    return;
}

async function generateCSV(campaignData) {
    //implemente a geração do arquivo CSV
    return;
}



main().catch(error => {
    console.error('Erro:', error);
});
