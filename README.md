# YESEUL HAN — Editable Book Portfolio

A lightweight static portfolio website. Five books rotate in a perspective carousel; clicking the centred book opens its project page. No build step, database, login, or paid hosting required.

## Preview
1. Unzip the download.
2. Double-click `index.html` to open in Chrome or Safari.
3. Drag sideways on the books, use the arrow buttons, or use the keyboard arrow keys. Click the centre book or **OPEN SELECTED BOOK**.

## Edit (beginner friendly)
Open `content.js` in any text editor (or edit on GitHub using the pencil icon). You can change:
- `title`, `short`, `description` and `sections` under each project.
- `cover` and `ink` colours, using hex colours e.g. `#d6d1c7`.
- your email, LinkedIn, Instagram, CV path, or portrait path at the top.

**Add artwork:** Put an image into the `media/` folder, e.g. `media/character.png`. In a project's section, replace `media:[]` with:

```js
media: [
  {type:'image',src:'media/character.png',caption:'Character sketch'},
  {type:'video',src:'media/animation.mp4',caption:'Animation experiment'}
]
```

You can add multiple images or videos. Avoid very large video files; for bigger videos consider external hosting in a future revision.

**Portrait:** Put `portrait.jpg` in `media/`, then update `portrait:'media/portrait.jpg'`.

**CV:** Put the actual `Yeseul_Han_CV.pdf` file in `media/`, then set `cv:'media/Yeseul_Han_CV.pdf'`. The CV link will automatically appear on About.

**Add a project:** Duplicate an existing project object in the `projects` array, change its `id` (must be unique) and details. The carousel automatically includes it.

## Publish on GitHub Pages
1. Create a **public** repository at https://github.com/new (e.g. `yeseul-portfolio`).
2. Upload the *contents* of this folder, not the ZIP itself, to the repository root.
3. In the repository go to **Settings → Pages → Build and deployment → Deploy from a branch**.
4. Choose **main** and **/(root)**, then **Save**.
5. Once deployed, your address is generally `https://YOUR-USERNAME.github.io/yeseul-portfolio/`.

Updating `content.js` or media files through GitHub will publish an updated website after deployment completes.

## DES221 assessment reminder
The site is a starting framework, **not a completed assessment**. Replace sample section descriptions with your real three-week DES221 activity and reflections. Add actual peer website feedback, a social media post and bio, CV, portrait, contact links, and screenshots of online work. Don't represent projects from other courses as DES221 practice. Acknowledge AI assistance with website code appropriately.

## Files
- `index.html` — main page shell
- `style.css` — design, layout, colours and transitions
- `script.js` — carousel and page interactions
- `content.js` — editable project text and media
- `media/` — put your images, videos and PDF here


## Version 2 — profile first, one-page navigation
- The homepage now opens with portrait placeholder, Bio, What I Do, Approach, Experience, Contact.
- Below is the rotating book carousel. Menu links HOME, CASE STUDY, ABOUT, CV, CONTACT scroll to sections on the same webpage.
- Clicking the featured case study or a book opens a detailed project view within the same website; use Back to Library to return.
- Add your picture to `media/` and set `portrait: 'media/portrait.jpg'` in `content.js`.
- Add your CV PDF to `media/` and set `cv: 'media/Yeseul_Han_CV.pdf'`.
- Add LinkedIn URL in `content.js` to activate the external link.
- Blank artwork placeholders are intentional.
