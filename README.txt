UTSAV AGARWAL PORTFOLIO - static site (no build step)

FILES
index.html       Home: hero, about, skills, contact
experience.html  My Journey + the 4 company sections
projects.html    LBE VR, Enemy AI, Fight Arena
styles.css       All styling. Colours are in the :root block at the top
script.js        Menu + "Read more" toggles
assets/          Images (replace a file, keep its name)
resume.pdf       The Resume button opens this

EDIT: open any .html file in a text editor (VS Code, Notepad) and change the text.
Each section starts with a comment like <!-- COMPANY: Anstric Games -->.
To copy a section, copy from its <section ...> to </section>.
Preview: double-click index.html, or use the VS Code "Live Server" extension.
Visual editors that can open these files: Pinegrow, GrapesJS.

HOST ON GITHUB PAGES
1. Create a repo named <username>.github.io
2. Upload everything in this folder (index.html at the top level)
3. Settings > Pages > Deploy from a branch > main / (root)
