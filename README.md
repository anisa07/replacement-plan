### Description:

A frontend app shows a list of school ids where batteries in e-devices should be replaced.
Used Vue 3, Tailwind, json-server to mock response data, vitest for unit testing.

For measurements intervals weighted by duration mechanism was used

How it works:

1. When the application starts it gets data from mock from service.
2. Battery service prepare data for search: group data per battery and sort grouped data arrays by timestamp
3. If a battery has only one measure it will be skipped
4. For every battery the app collects all measures that are equal or less 24 hours (1 day) and all measures that more than 24 hours
5. After measure intervals collections it checks each interval comparing battery measures difference with battery level treshhold (0.3 = 30%) divided by day coefficient (equal 1 if interval is 24h, less if it is bigger than 24h). If battery measures difference bigger than battery threshold this battery needs to be replaced
6. When all batteries checked, the application groups all batteries to replace per school (academyId), and sort schools list by the biggest number of batteries to replace

### Assumptions:

If I had chance I would do the calculations on the BE side, so on FE I can only request bad batteries to display

### Future Improvements:

If had more time I would add more unit tests, create e2e tests, create better design, create proper env vars etc.

### Requirements:

use Node version >= v18.19.0

### How to run:

0. install node_modules

```
    npm i
```

1. Run mock api service

```
    npm run mock-server
```

2. Run frontend app

```
    npm run dev
```

3. Open url http://localhost:5173 in a browser

4. Run unit tests with command

```
    npm run test:unit
```
