import json
import requests


def get_access_token():
    params = {
        'grant_type': 'client_credentials',
        'client_id': '7f509cf68c194f5f2599c437f4064a4f',
        'client_secret': '047249716db21ced289094a358f8d3e9'
    }

    # Fazendo a requisição POST para obter o token de acesso
    res = requests.post('https://api.snov.io/v1/oauth/access_token', data=params)
    
    # Verificando se a resposta foi bem-sucedida
    if res.status_code == 200:
        return res.json()['access_token']
    else:
        print("Erro ao obter o token de acesso:", res.status_code, res.text)
        return None


def get_emails_opened(token, campaign_id):
    headers = {
        'Authorization': f'Bearer {token}'
    }
    params = {
        'campaignId': campaign_id
    }

    # Fazendo a requisição GET para obter emails abertos
    res = requests.get('https://api.snov.io/v1/get-emails-opened', headers=headers, params=params)

    if res.status_code == 200:
        data = res.json()
        return data
    else:
        print("Erro ao obter a lista de emails abertos:", res.status_code, res.text)
        return []


def get_emails_replies(token, campaign_id):
    headers = {
        'Authorization': f'Bearer {token}'
    }
    params = {
        'campaignId': campaign_id
    }

    # Fazendo a requisição GET para obter emails com respostas
    res = requests.get('https://api.snov.io/v1/get-emails-replies', headers=headers, params=params)

    if res.status_code == 200:
        data = res.json()
        return data
    else:
        print("Erro ao obter a lista de emails com respostas:", res.status_code, res.text)
        return []


def user_lists():
    token = get_access_token()
    
    if token:
        campaign_id = 2147789
        
        # Obter emails abertos
        emails_opened = get_emails_opened(token, campaign_id)
        if emails_opened:
            contador_abertos = len(emails_opened)
            print(f"Quantidade de emails abertos: {contador_abertos:,}".replace(",", "."))

            for email in emails_opened:
                print(f"Prospect Name: {email['prospectName']}, Email: {email['prospectEmail']}, Visited At: {email['visitedAt']}")
        
        # Obter emails com respostas
        emails_replies = get_emails_replies(token, campaign_id)
        if emails_replies:
            contador_respostas = len(emails_replies)
            print(f"\nQuantidade de emails com respostas: {contador_respostas:,}".replace(",", "."))

            for email in emails_replies:
                # Verificar se 'repliedAt' está presente no dicionário antes de acessá-lo
                replied_at = email.get('repliedAt', 'N/A')  # Define 'N/A' se 'repliedAt' não estiver presente
                print(f"Prospect Name: {email['prospectName']}, Email: {email['prospectEmail']}, Replied At: {replied_at}")

    else:
        print("Não foi possível obter o token de acesso")


# Executa a função
user_lists()
