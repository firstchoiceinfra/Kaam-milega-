import os
import glob
import streamlit as st
import streamlit.components.v1 as components

st.set_page_config(page_title="KaamMilega — Job Portal", page_icon="🧰", layout="wide")

# Resolve paths relative to THIS file's folder first. If not found there
# (e.g. index.html/style.css/script.js live in a sub-folder on GitHub
# while streamlit_app.py sits elsewhere), fall back to searching the
# whole repo recursively so this works regardless of folder layout.
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
REPO_ROOT = os.path.abspath(os.path.join(BASE_DIR, ".."))  # one level up, just in case

def find_file(name):
    direct = os.path.join(BASE_DIR, name)
    if os.path.exists(direct):
        return direct
    # search a couple of likely roots recursively
    for root in {BASE_DIR, REPO_ROOT, os.getcwd()}:
        matches = glob.glob(os.path.join(root, "**", name), recursive=True)
        if matches:
            return matches[0]
    return None

def read(name):
    path = find_file(name)
    if not path:
        st.error(f"Missing file: {name}. Searched near {BASE_DIR}. "
                 f"Make sure index.html, style.css and script.js are pushed "
                 f"to your GitHub repo (check they aren't in .gitignore or "
                 f"an empty/un-pushed folder).")
        st.stop()
    with open(path, encoding="utf-8") as f:
        return f.read()

# Read the static single-page app files
html = read("index.html")
css = read("style.css")
js = read("script.js")

# Inline the CSS and JS into the HTML so it renders correctly
# inside Streamlit's sandboxed iframe (components.html does not
# fetch external relative files on its own).
html = html.replace('<link rel="stylesheet" href="style.css">', f"<style>{css}</style>")
html = html.replace('<script src="script.js"></script>', f"<script>{js}</script>")

components.html(html, height=950, scrolling=True)
