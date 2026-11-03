"""Builds self-contained pages (CSS, JS and images inlined) into ../dist.
Edit files in css/, js/, images/ and *.html here, then run:  python3 build.py"""
import base64, glob, json, os, re
here = os.path.dirname(os.path.abspath(__file__)); os.chdir(here)
out = os.path.join(here, "dist"); os.makedirs(out, exist_ok=True)
uri = lambda f: "data:image/svg+xml;base64," + base64.b64encode(open(f, "rb").read()).decode()
images = {os.path.basename(f)[:-4]: uri(f) for f in glob.glob("images/*.svg")}
css = open("css/style.css").read()
js = "window.IMAGES=" + json.dumps(images) + ";\n" + open("js/data.js").read() + "\n" + open("js/app.js").read()
for f in glob.glob("*.html"):
    h = open(f).read()
    h = re.sub(r'<link rel="stylesheet" href="css/style.css">', lambda m: "<style>\n" + css + "\n</style>", h)
    h = re.sub(r'<script src="js/data.js"></script>\s*<script src="js/app.js"></script>', lambda m: "<script>\n" + js.replace("</script>", "<\\/script>") + "\n</script>", h)
    h = re.sub(r'src="images/([\w-]+)\.svg"', lambda m: f'src="{images[m.group(1)]}"', h)
    open(os.path.join(out, f), "w").write(h)
print("built", len(glob.glob(out + "/*.html")), "pages")
