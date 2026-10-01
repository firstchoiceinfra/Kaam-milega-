import os
import streamlit as st
import streamlit.components.v1 as components

st.set_page_config(page_title="KaamMilega — Job Portal", page_icon="🧰", layout="wide")

# Resolve paths relative to THIS file's folder, not the process's
# current working directory — Streamlit Cloud does not always run
# with the repo root as the working directory, which is what was
# causing the FileNotFoundError.
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

def read(name):
    path = os.path.join(BASE_DIR, name)
    if not os.path.exists(path):
        st.error(f"Missing file: {name} (looked in {BASE_DIR}). "
                 f"Make sure index.html, style.css and script.js sit in the "
                 f"SAME folder as streamlit_app.py in your repo.")
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
