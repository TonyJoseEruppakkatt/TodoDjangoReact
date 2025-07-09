import csv
from io import TextIOWrapper
from ..models import Todo

def import_csv(file):
    decoded_file = TextIOWrapper(file, encoding='utf-8')
    reader = csv.DictReader(decoded_file)

    for row in reader:
        Todo.objects.create(
            title=row.get('title', ''),
            description=row.get('description', ''),
            due_date=row.get('due_date', None),
            completed=row.get('completed', '').lower() == 'true'
        )
