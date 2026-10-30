# Project structure

- Routes and layouts are in `app/`, including grouped routes such as `app/(auth)/` and the modal slot in `app/@modal/`.
- Reusable UI, hooks, contexts, entities, types, and utilities are organized under `src/`.
- Shared data-fetching helpers are in `lib/`.
- Global styles are in `styles/`.
- Static assets belong in `public/`; post images, for example, are in `public/images/posts/`.
- Tests are colocated with the code they cover.
