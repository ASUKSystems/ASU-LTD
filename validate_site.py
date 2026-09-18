from html.parser import HTMLParser
from pathlib import Path
import sys
import xml.etree.ElementTree as ET

root=Path(__file__).parent
errors=[]

class Page(HTMLParser):
    def __init__(self):
        super().__init__(); self.ids=set(); self.refs=[]; self.title=""; self._title=False
    def handle_starttag(self,tag,attrs):
        data=dict(attrs)
        if data.get("id"):
            if data["id"] in self.ids: errors.append(f"duplicate id: {data['id']}")
            self.ids.add(data["id"])
        for key in ("href","src"):
            if data.get(key): self.refs.append(data[key])
        if tag=="title": self._title=True
    def handle_endtag(self,tag):
        if tag=="title": self._title=False
    def handle_data(self,data):
        if self._title:self.title+=data

for file in root.glob("*.html"):
    page=Page(); page.feed(file.read_text(encoding="utf-8"))
    if not page.title.strip(): errors.append(f"{file.name}: missing title")
    for ref in page.refs:
        if ref.startswith("#"):
            if ref[1:] and ref[1:] not in page.ids: errors.append(f"{file.name}: missing anchor {ref}")
        elif ref.startswith(("http:","https:","mailto:","tel:","data:","javascript:")):
            continue
        else:
            clean=ref.split("#")[0].split("?")[0]
            if not clean: continue
            target=(root/clean.lstrip("/")) if ref.startswith("/") else (file.parent/clean)
            if clean.endswith("/"): target=target/"index.html"
            if not target.exists(): errors.append(f"{file.name}: missing target {ref}")

for xml in root.rglob("*.xml"):
    try: ET.parse(xml)
    except Exception as exc: errors.append(f"{xml.relative_to(root)}: {exc}")

for required in ("index.html","robots.txt","sitemap.xml","assets/favicon.svg","assets/social-card.svg","provenance-manifest.json"):
    if not (root/required).exists(): errors.append(f"missing required file: {required}")

if errors:
    print("\n".join(errors)); sys.exit(1)
print("Site validation passed")
