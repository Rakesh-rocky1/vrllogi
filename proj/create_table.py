
import boto3
import os

def create_contacts_table():
    try:
        dynamodb = boto3.resource('dynamodb',
            aws_access_key_id=os.environ.get('AWS_ACCESS_KEY_ID'),
            aws_secret_access_key=os.environ.get('AWS_SECRET_ACCESS_KEY'),
            region_name=os.environ.get('AWS_REGION', 'us-east-1')
        )
        
        table = dynamodb.create_table(
            TableName='vr_logistics_contacts',
            KeySchema=[
                {
                    'AttributeName': 'email',
                    'KeyType': 'HASH'  # Partition key
                }
            ],
            AttributeDefinitions=[
                {
                    'AttributeName': 'email',
                    'AttributeType': 'S'
                }
            ],
            ProvisionedThroughput={
                'ReadCapacityUnits': 5,
                'WriteCapacityUnits': 5
            }
        )
        
        table.meta.client.get_waiter('table_exists').wait(TableName='vr_logistics_contacts')
        print("Table created successfully!")
        return True
    except Exception as e:
        print(f"Error creating table: {str(e)}")
        return False

if __name__ == "__main__":
    create_contacts_table()
