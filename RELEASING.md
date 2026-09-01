# Publishing and Releasing

How to get this repository onto GitHub, publish it on GitHub Pages, and obtain a DOI from
Zenodo. Written for Windows. Follow it in order; the order is the part that matters.

---

## The three mistakes that cost the most

Read these first. Each one is recoverable only by making another release.

1. **Zenodo must be connected before you create the GitHub release.** Zenodo only sees
   releases made after the toggle is switched on. A release made first gets no DOI at all,
   and you cannot go back and attach one.

2. **Every file must be pushed before you create the release.** Zenodo archives whatever
   the tag points at. If files are still sitting on your desktop, the archive will contain
   only what was committed. This is exactly how the bottle jack v1.0.0 archive ended up
   holding nothing but a README.

3. **Never run `robocopy /MIR` into a folder that contains `.git`.** `/MIR` mirrors, which
   means it deletes anything in the destination that is not in the source, and that
   includes your entire repository history. Use `/E`.

---

## Phase 0 — Prerequisites, once only

- A GitHub account.
- Git for Windows: https://git-scm.com/download/win. Accept the defaults.
- A Zenodo account. **Sign in to Zenodo using the "Sign in with GitHub" button**, which
  links the two accounts in one step.
- Your ORCID connected to Zenodo, under profile menu → Settings → Linked accounts.

Set your identity once, in Command Prompt or PowerShell:

```
git config --global user.name "A. Bulent Koc"
git config --global user.email "your@email.address"
```

---

## Phase 1 — Decide the repository name

The name appears in five places in this package: `README.md`, `CITATION.cff`,
`.zenodo.json`, the link printed at the end of the student handout, and the Pages URL.
The files currently assume:

```
viscosity-measurement-lab
```

If you want something else, change it everywhere before pushing. Searching the folder for
`viscosity-measurement-lab` will find every occurrence.

---

## Phase 2 — Create the empty repository on GitHub

1. Go to https://github.com/new
2. Repository name: `viscosity-measurement-lab`
3. Description: `Interactive falling ball, Saybolt and rotary viscometers with laboratory materials`
4. Set it to **Public**. Zenodo cannot archive a private repository.
5. **Do not tick** "Add a README file", "Add .gitignore", or "Choose a license". This
   package already contains all three, and pre-creating them makes the first push
   conflict.
6. Click **Create repository**.

Leave the page open. GitHub shows you the repository URL, which you need in Phase 4.

---

## Phase 3 — Put the files in a working folder

Unzip the package. Then copy it into the folder you will use as the repository:

```
mkdir C:\repos\viscosity-measurement-lab
robocopy C:\Users\you\Downloads\viscosity-measurement-lab C:\repos\viscosity-measurement-lab /E
```

`/E` copies subdirectories including empty ones, and copies dotfiles such as `.gitignore`
and `.zenodo.json`, which are easy to lose with other copy methods. Confirm they arrived:

```
dir /a C:\repos\viscosity-measurement-lab
```

You should see `.gitignore` and `.zenodo.json` in the listing. If they are missing, Zenodo
will ignore your metadata and describe the record from GitHub's defaults instead.

---

## Phase 4 — First push

```
cd C:\repos\viscosity-measurement-lab
git init
git add .
git status
```

Read the `git status` output before going further. It lists exactly what will be
committed. You are looking for `index.html`, `lab/`, `handouts/`, `tests/`, `README.md`,
`LICENSE`, `LICENSE-CONTENT.md`, `CITATION.cff`, `.zenodo.json` and `RELEASING.md`. If
anything is missing, it will be missing from the DOI archive too.

```
git commit -m "Viscosity Measurement Laboratory: simulator, handout, answer sheet, grading tool"
git branch -M main
git remote add origin https://github.com/alibulentkoc/viscosity-measurement-lab.git
git push -u origin main
```

A browser window will open asking you to authorise Git. Accept it.

Now reload the repository page on GitHub and confirm the file list matches what you
expect. **Do not proceed until it does.**

---

## Phase 5 — Turn on GitHub Pages

1. In the repository, click **Settings**.
2. In the left sidebar, click **Pages**.
3. Under "Build and deployment", set Source to **Deploy from a branch**.
4. Branch: **main**, folder: **/ (root)**. Click **Save**.
5. Wait two or three minutes, then reload the Pages settings page. It will show the live
   URL.

Your links will be:

```
https://alibulentkoc.github.io/viscosity-measurement-lab/
https://alibulentkoc.github.io/viscosity-measurement-lab/lab/viscosity-lab.html
https://alibulentkoc.github.io/viscosity-measurement-lab/handouts/viscosity-lab-handout.html
```

Open the simulator link and click through all eight tabs before continuing. Pages serves
files exactly as committed, so anything broken here is broken in the archive as well.

---

## Phase 6 — Connect Zenodo, before any release exists

This is the step that cannot be done retroactively.

1. Go to https://zenodo.org and sign in.
2. Click the **profile menu** in the top right, then click **GitHub**.
3. Click **Sync now** in the header. This asks GitHub for your current repository list.
4. Find `viscosity-measurement-lab` in the list and **toggle the slider on**.
5. Refresh the page and confirm it now appears under your enabled repositories.

If the repository is not in the list: it is either private, or was created after your last
sync. Make it public, then click Sync now again.

---

## Phase 7 — Create the release

Only now.

1. On the repository page, find **Releases** in the right sidebar, then **Create a new
   release**.
2. Click **Choose a tag**, type `v1.0.0`, and select **Create new tag: v1.0.0 on
   publish**.
3. Release title: `v1.0.0 — Initial release`
4. In the description, say what it contains. For example:

   > Interactive viscosity measurement laboratory covering falling ball, Saybolt and
   > rotary viscometers, with a student handout, an instructor answer sheet with live
   > calculation, and a grading tool. Includes verification suites covering the physics,
   > unit conversions and interface behaviour.

5. Leave "Set as a pre-release" unticked.
6. Click **Publish release**.

Zenodo picks this up within a minute or two. It downloads the repository as a zip at that
tag, reads `.zenodo.json` and `CITATION.cff`, and mints two DOIs.

---

## Phase 8 — Collect the DOIs

1. Back on Zenodo, profile menu → **GitHub**. Your repository now shows a DOI badge.
2. Click through to the record.
3. On the right-hand side, find the **Versions** box. It gives you two different DOIs:

   - **Version DOI** — points at v1.0.0 specifically and never changes.
   - **Concept DOI**, shown under "Cite all versions" — always resolves to the newest
     version. **This is the one to put in papers and on the handout**, because it will not
     go stale when you release v1.1.0.

Write both down. They look like `10.5281/zenodo.XXXXXXXX`, and the concept DOI is usually
one number lower than the first version DOI.

### Verify the archive is complete

Before doing anything else, on the Zenodo record page click into the **Files** section and
check the archive size and contents. It should be roughly 100 kB and contain the whole
tree. If it is a few kilobytes, only the README was captured, and mistake number 2 above
has happened. The fix is to commit the missing files and cut a v1.0.1 release; the empty
v1.0.0 record cannot be repaired.

---

## Phase 9 — Put the DOI back into the repository

The v1.0.0 archive cannot contain its own DOI, because the DOI did not exist until the
release was made. That is normal. Add it now and it will be present in every later
archive.

1. Add the badge at the top of `README.md`, under the existing badges, replacing the
   number with your **concept** DOI:

   ```
   [![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.XXXXXXXX.svg)](https://doi.org/10.5281/zenodo.XXXXXXXX)
   ```

2. Add the concept DOI to `CITATION.cff`, as a top-level field:

   ```
   doi: "10.5281/zenodo.XXXXXXXX"
   ```

3. Add it to `.zenodo.json` so future records carry the relation:

   ```
   "related_identifiers": [
     {"identifier": "10.5281/zenodo.XXXXXXXX", "relation": "isVersionOf", "scheme": "doi"}
   ]
   ```

4. Update the citation footer in the three handout files and the simulator, replacing the
   ORCID-only line with the DOI.

5. Commit and push:

   ```
   git add .
   git commit -m "Add Zenodo DOI badge and citation metadata"
   git push
   ```

Pushing does **not** create a new release or a new DOI. Only publishing a release does
that.

---

## Current DOIs

Assigned at the v1.0.0 release on 1 September 2026:

| DOI | What it points at | Use it for |
|---|---|---|
| `10.5281/zenodo.22218165` | all versions, always resolving to the newest | **papers, handouts, the README badge** |
| `10.5281/zenodo.22218166` | release v1.0.0 specifically, forever | reproducing a result against that exact version |

The concept DOI is already written into `README.md`, `CITATION.cff`, `index.html`, the
simulator and all three handouts. It does not change when you release a new version, so
none of those files need touching again for DOI reasons.

`.zenodo.json` deliberately contains no `related_identifiers` entry for the concept DOI.
Zenodo maintains the concept-to-version relation itself, and declaring it by hand would
duplicate a link the platform already owns.

The Zenodo settings page at zenodo.org/account/settings/github lists **releases**, so it
shows only version DOIs, one per release. The concept DOI is not a release and never
appears there. Find it on the record itself, in the Versions card, under "Cite all
versions?".

## Phase 10 — Every release after the first

The order never changes:

```
1. Make the changes
2. Run the tests:      cd tests && npm install jsdom && node verify.js && node smoke.js
3. git add . && git commit -m "..." && git push
4. Confirm on github.com that every file is there
5. Update the version in CITATION.cff and the date-released field
6. Commit and push that too
7. Only then: Releases -> Create a new release -> new tag -> Publish
```

Zenodo automatically creates a new version of the same record, with a new version DOI. The
concept DOI keeps resolving to the newest one, so anything you have already cited or
printed stays correct.

Use semantic version numbers: `v1.0.1` for a fix, `v1.1.0` for new capability, `v2.0.0`
for something that changes how the activity is used.

---

## If something goes wrong

**The release published but no Zenodo record appeared.** The integration was not enabled
at the moment of publishing. Enable it, then publish a new release; the old tag will not
be picked up retroactively.

**The Zenodo record is missing files.** Commit them, push, and cut a new release. Records
cannot be edited to add files, but you can edit the record's metadata.

**The metadata is wrong (title, author, description).** On the Zenodo record, click
**Edit**, correct it, and click **Publish**. Then fix `.zenodo.json` in the repository so
the next release is right at the source.

**Pages shows a 404.** Give it five minutes after the first save. If it persists, check
that the branch is `main` and the folder is `/ (root)`, and that `index.html` is in the
top level of the repository.

**You pushed something you should not have.** Files remain in Git history even after
deletion. For anything sensitive, ask before trying to rewrite history.
