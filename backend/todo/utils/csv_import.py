import csv
from io import TextIOWrapper
from ..models import Todo
from datetime import datetime

def import_csv(file):
    decoded_file = TextIOWrapper(file, encoding='utf-8')
    reader = csv.DictReader(decoded_file)

    for row in reader:
        due_date = row.get('due_date', '').strip()
        due_date_obj = None
        if due_date:
            try:
                due_date_obj = datetime.strptime(due_date, '%Y-%m-%d').date()
            except ValueError:
                raise ValueError(f"Invalid date format: {due_date}. Expected YYYY-MM-DD.")

        Todo.objects.create(
            title=row.get('title', '').strip(),
            description=row.get('description', '').strip(),
            due_date=due_date_obj,
            completed=row.get('completed', '').strip().lower() == 'true'
        )
