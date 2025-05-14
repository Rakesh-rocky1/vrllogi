
import boto3
import os
from datetime import datetime

class DynamoDBHandler:
    def __init__(self):
        self.dynamodb = boto3.resource('dynamodb',
            aws_access_key_id=os.environ.get('AWS_ACCESS_KEY_ID'),
            aws_secret_access_key=os.environ.get('AWS_SECRET_ACCESS_KEY'),
            region_name=os.environ.get('AWS_REGION', 'us-east-1')
        )
        self.table = self.dynamodb.Table('vr_logistics_contacts')

    def save_contact(self, name, email, message):
        try:
            response = self.table.put_item(
                Item={
                    'email': email,
                    'name': name,
                    'message': message,
                    'timestamp': datetime.now().isoformat()
                }
            )
            return True
        except Exception as e:
            print(f"Error saving to DynamoDB: {str(e)}")
            return False
