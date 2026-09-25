import streamlit as st
import streamlit.components.v1 as components

st.set_page_config(page_title="KaamMilega — Job Portal", page_icon="🧰", layout="wide")

# Read the static single-page app files
with open("index.html", encoding="utf-8") as f:
    html = f.read()
with open("style.css", encoding="utf-8") as f:
    css = f.read()
with open("script.js", encoding="utf-8") as f:
    js = f.read()

# Inline the CSS and JS into the HTML so it renders correctly
# inside Streamlit's sandboxed iframe (components.html does not
# fetch external relative files on its own).
html = html.replace('<link rel="stylesheet" href="style.css">', f"<style>{css}</style>")
html = html.replace('<script src="script.js"></script>', f"<script>{js}</script>")

components.html(html, height=950, scrolling=True)
