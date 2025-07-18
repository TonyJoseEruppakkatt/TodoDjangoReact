import csv
from io import TextIOWrapper
from apiapp.models import Task  # adjust app name if different

def import_csv(file, user):
    try:
        data = TextIOWrapper(file, encoding='utf-8')
        reader = csv.DictReader(data)
        for row in reader:
            Task.objects.create(
                title=row.get('title', '').strip(),
                description=row.get('description', '').strip(),
                due_date=row.get('due_date', None),
                completed=row.get('completed', '').lower() in ['true', '1'],
                user=user
            )
        return True, "CSV imported successfully"
    except Exception as e:
        return False, str(e)

