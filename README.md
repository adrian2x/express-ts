# Express TypeScript boilerplate

This project is a starting point for creating an express application using typescript and sane defaults.

## Overview

- [Express v5](https://expressjs.com/en/5x/api.html)
- `async/await` support
- TypeScript
- [dotenv](https://github.com/motdotla/dotenv#readme) configs
- security middleware via [helmet](https://github.com/helmetjs/helmet) and CORS
- commonly used middlewares
- cluster setup
- graceful shutdown by [http-terminator](https://github.com/gajus/http-terminator/tree/master/.README#readme)
- `unhandledRejection` handler by [make-promises-safe](https://github.com/mcollina/make-promises-safe/blob/master/README.md)
- Pino logging
- basic rate limiting
- eslint
- prettier

## Get Started

- make a `.env` file with variables (eg. PORT=3000)
- update the prisma schema to connect to the database
- npm run migrate (needs a DATABASE_URL setting in .env)
- npm run dbseed

Copyright © 2020 Adrian Cruz

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.
