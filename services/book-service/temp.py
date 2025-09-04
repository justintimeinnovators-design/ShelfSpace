import json

link_missing_count = 0
url_missing_count = 0
with open("src/data/complete_goodreads_books_authors2.json", 'r', encoding='utf-8') as f:
    # Iterate through each line in the file
    for line in f:
        # Check if the line is not empty before parsing
        if line.strip():
            # Parse the JSON object from the current line
            data = json.loads(line)
            link = data.get('link')
            url = data.get('url')
            if not link or link=='':
                link_missing_count+=1
            if not url or url=='':
                url_missing_count+=1
            # fields = [x for x in data.keys()]

print(f"link missing: {link_missing_count}")
print(f"url missing: {url_missing_count}")