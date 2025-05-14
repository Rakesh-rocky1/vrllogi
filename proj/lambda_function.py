
import json
import boto3
from datetime import datetime

def lambda_handler(event, context):
    try:
        # Parse the incoming event
        body = json.loads(event['body']) if isinstance(event['body'], str) else event['body']
        
        name = body.get('name')
        email = body.get('email')
        message = body.get('message')
        phone = body.get('phone', '')  # Phone is optional
        
        # Validate required fields
        if not all([name, email, message]):
            return {
                'statusCode': 400,
                'body': json.dumps({'error': 'Missing required fields'})
            }
        
        # Initialize DynamoDB client
        dynamodb = boto3.resource('dynamodb')
        table = dynamodb.Table('vr_logistics_contacts')
        
        # Save to DynamoDB
        response = table.put_item(
            Item={
                'email': email,
                'name': name,
                'message': message,
                'phone': phone,
                'timestamp': datetime.now().isoformat()
            }
        )
        
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'OPTIONS,PUT,POST'
            },
            'body': json.dumps({'success': True})
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }
