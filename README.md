# Anthony’s portfolio

A personal portfolio with editable content files. GitHub Pages deployment is configured; the site contains placeholder content while it is being developed.

## Editing

- `content/home.json`: introduction/bio, header name (`brand`), education, experience, skills, and contact links.
- `content/about.json`: About Me page title and longer bio. Separate paragraphs with `\n\n`.
- `content/projects/*.json`: one file per project. Copy a file to add a project; change `order` to reorder it. The gallery and navigation are generated together.
- `content/hobbies.json`: hobby cards and links.
- `assets/styles.css`: appearance and responsive layout.
- `build.mjs`: shared page templates.

Content is JSON: keep quotation marks and commas intact. Empty resume/contact links display labeled placeholders rather than broken buttons. Put a resume in `assets/` and set `resume` to `./assets/your-resume.pdf`. Put photos in `assets/` when ready; this first version deliberately uses image placeholders.

## Preview

Run `node build.mjs` after editing content. Then run `python -m http.server 4321 --directory dist` and open http://localhost:4321. Reload the browser after rebuilding.

The project has no package dependencies. Node is needed to rebuild; Python is used only for the local preview server. `dist/` is generated output; edit the source content instead.

## Pages

- Home: introduction/bio and photos, resume/contact, education, experience, and skills, with a matching contents sidebar.
- Projects: four placeholder tiles with individual detail pages, plus a hover/click/keyboard dropdown.
- Fun Stuff: climbing and hobby placeholders.

On narrow screens the contents navigation moves above the page content. Fonts load from Google Fonts when online, with local system fallbacks.

## Optional project demos

Project 1 demonstrates the optional **Demo videos & images** section. Other projects set `demos` to `null`, which hides both the section and its contents link. To enable it, copy Project 1’s `demos` object into another project file. Remove it or set it to `null` to hide it again.

- `videos`: each item can have `src` for a local video (for example `../assets/demo.mp4`), or `url` for an external demo such as YouTube, plus `caption`. Empty links show a video placeholder.
- `images`: each item has `src` (for example `../assets/prototype.jpg`), `alt`, and `caption`. Empty `src` shows an image placeholder.

Put the actual files in `assets/` and rebuild. The project pages show **Overview & Learnings** and **Design & process**, with demos appended only when enabled.

## Appearance and skills

The header offers UIUC orange (`#FF5F05`), Georgia Tech gold (`#B39051`), and a slate dark mode. Orange/light is the initial default. Choices are remembered in this browser and apply across all pages. The selected school color also highlights new skills; light-mode text uses a darker tone to remain readable.

In `content/home.json`, each education entry has an optional `gpa` field shown beneath the degree. Set it to an empty string to hide it. Skill entries can be plain strings or objects like `{ "name": "Add skill", "isNew": true }`. Set `isNew` to `true` to show **NEW:** and a colored highlight. `skillsIntro`, `footerVerse`, and `footerReference` are also editable in that file.

`fullName` and `chineseName` control the introduction’s name lines. `cv` links to the supplied CV in `assets/anthony-ng-cv.pdf`; replace that file to update the CV. `resume` is a separate link for a shorter resume.

`resume` and `cv` point to separate public PDFs in `assets/anthony-ng-resume.pdf` and `assets/anthony-ng-cv.pdf`. Both open in a new tab. Replace either file and rebuild to update it.

Each education and experience entry has a `logo` field. Leave it empty for a logo placeholder, or set it to an image path such as `./assets/university-logo.png`. Put the image in `assets/` and rebuild.

Experience is grouped under `experience.research` and `experience.industry`. Each entry has an organization, role, date, logo, and a `highlights` array for bullet points. Education and experience were populated from the supplied public resume and CV. The Georgia Tech degree uses **M.S. Robotics**, matching the resume and requested introduction; the CV instead names Mechanical Engineering. No graduate GPA was supplied, so that field is empty.

Each research and industry entry also has a `skills` array, shown as the same tags used on project cards. Edit those strings to update the tags; leave the array empty to hide them for a role.

Supplied logos are in `assets/logos/`. Endovascular Engineering uses `logoCrop: "e2"` to frame only the left symbol from the original image. Georgia Tech’s education entry uses the supplied SVG logo.

## Publish on GitHub Pages

Repository: https://github.com/AnthonyNgCodes/portfolio

1. Upload the source files and folders to the repository’s `main` branch, including `.github/workflows/static.yml`, `assets/`, `content/`, `build.mjs`, and `package.json`. Do not upload `tmp/`, `.git/`, or `dist/`.
2. In the repository, open **Settings → Pages** and select **GitHub Actions** as the build source.
3. Open **Actions → Deploy portfolio to GitHub Pages → Run workflow** if the initial deployment did not complete before Pages was enabled.
4. Once the workflow succeeds, the site will be available at https://anthonyngcodes.github.io/portfolio/ .

The workflow builds `dist/` from the source and deploys it. After setup, every push to `main` automatically updates the live site. You can edit `content/home.json` or any project file directly on GitHub and commit the change to publish it. Relative links support GitHub Pages’ `/portfolio/` subdirectory.

